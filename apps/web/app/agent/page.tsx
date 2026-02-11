'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { Progress } from '@heroui/progress';
import { Avatar } from '@heroui/avatar';
import { Skeleton } from '@heroui/skeleton';

import { useVaultFactory, useVault } from '@/hooks/useVault';
import { useAgentStore, type StrategyType } from '@/stores/agent';
import { useWatchedXProfiles } from '@/hooks/useXProfiles';
import { StrategyCards } from '@/components/agent/StrategyCards';
import { AgentDashboard } from '@/components/agent/AgentDashboard';
import { STRATEGY_CONFIG, StrategyType as StrategyEnum } from '@/config/contracts';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export default function AgentPage() {
  const { isConnected, address } = useAccount();
  const { hasVault, vaultAddress, createVault } = useVaultFactory(address);
  const { setStrategy } = useVault(vaultAddress);

  const {
    step,
    xHandle,
    xAnalysis,
    recommendedStrategy,
    selectedStrategy,
    isAnalyzing,
    error,
    setXHandle,
    setXAnalysis,
    setSelectedStrategy,
    setVaultAddress,
    setStep,
    setIsAnalyzing,
    setError,
    setStopLoss,
    setTakeProfit,
  } = useAgentStore();

  const [xInput, setXInput] = useState('');
  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const { profiles: watchedProfiles, isLoading: profilesLoading } = useWatchedXProfiles();

  useEffect(() => {
    if (hasVault && vaultAddress && selectedStrategy) {
      setVaultAddress(vaultAddress);
      setStep('dashboard');
    } else if (isConnected && !xAnalysis) {
      setStep('analyze');
    }
  }, [hasVault, vaultAddress, isConnected, xAnalysis, selectedStrategy, setVaultAddress, setStep]);

  const handleAnalyze = async () => {
    if (!xInput || !address) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      const res = await fetch(`${BACKEND_URL}/api/users/${address}/analyze-x`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ xHandle: xInput }),
      });

      if (!res.ok) {
        throw new Error('Failed to analyze X account');
      }

      const data = await res.json();

      setXHandle(xInput);
      setXAnalysis(data.analysis, data.recommendedStrategy);

      const strategyEnumMap: Record<StrategyType, StrategyEnum> = {
        CONSERVATIVE: StrategyEnum.CONSERVATIVE,
        BALANCED: StrategyEnum.BALANCED,
        AGGRESSIVE: StrategyEnum.AGGRESSIVE,
      };
      const strategyConfig =
        STRATEGY_CONFIG[strategyEnumMap[data.recommendedStrategy as StrategyType]];

      setStopLoss(strategyConfig.stopLoss * 100);
      setTakeProfit(strategyConfig.takeProfit * 100);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectStrategy = async (strategy: StrategyType) => {
    if (!address) return;

    setSelectedStrategy(strategy);
    setIsCreatingVault(true);
    setError(null);

    try {
      let vault = vaultAddress;

      if (!hasVault) {
        const txHash = await createVault();

        // eslint-disable-next-line no-console
        console.log('Vault creation tx:', txHash);
        await new Promise((r) => setTimeout(r, 3000));
        vault = vaultAddress;
      }

      if (vault) {
        const strategyEnumMap: Record<StrategyType, StrategyEnum> = {
          CONSERVATIVE: StrategyEnum.CONSERVATIVE,
          BALANCED: StrategyEnum.BALANCED,
          AGGRESSIVE: StrategyEnum.AGGRESSIVE,
        };
        const strategyIndex = strategyEnumMap[strategy];
        const strategyConfig = STRATEGY_CONFIG[strategyIndex];

        await setStrategy(strategyIndex, strategyConfig.maxTradeAmount);

        await fetch(`${BACKEND_URL}/api/users/${address}/strategy`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            strategyType: strategy,
            autoTrade: true,
          }),
        });

        setVaultAddress(vault);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Strategy selection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to set strategy');
    } finally {
      setIsCreatingVault(false);
    }
  };

  // Not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto max-w-xl py-12 px-4 text-center">
        <p className="text-4xl mb-4">🤖</p>
        <h1 className="text-2xl font-bold mb-2">AI Trading Agent</h1>
        <p className="text-default-500">
          Connect your wallet to set up AI-powered trading on nad.fun
        </p>
      </div>
    );
  }

  // Dashboard
  if (step === 'dashboard' && vaultAddress) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">AI Trading Agent</h1>
        <AgentDashboard vaultAddress={vaultAddress} />
      </div>
    );
  }

  // Strategy selection
  if (step === 'select' && xAnalysis) {
    return (
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Choose Your Strategy</h1>
          <p className="text-default-500 text-sm">
            Based on @{xHandle}, we recommend{' '}
            <span className="font-bold text-primary">{recommendedStrategy}</span>
          </p>
          {xAnalysis.reasoning && (
            <p className="text-sm text-default-400 mt-2 max-w-lg mx-auto">{xAnalysis.reasoning}</p>
          )}
        </div>

        {error && (
          <div className="bg-danger-50 p-3 rounded-lg mb-6">
            <p className="text-danger text-sm">{error}</p>
          </div>
        )}

        <StrategyCards
          isLoading={isCreatingVault}
          recommendedStrategy={recommendedStrategy}
          onSelect={handleSelectStrategy}
        />
      </div>
    );
  }

  // X Analysis step
  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <Card className="border border-success/40 shadow-none bg-transparent">
        <CardBody className="gap-5 p-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-1">Start AI Trading</h1>
            <p className="text-default-500 text-sm">
              Enter your X handle to get a personalized trading strategy
            </p>
          </div>

          {error && (
            <div className="bg-danger-50 p-3 rounded-lg">
              <p className="text-danger text-sm">{error}</p>
            </div>
          )}

          <Input
            isDisabled={isAnalyzing}
            label="X/Twitter Handle"
            placeholder="username (without @)"
            startContent={<span className="text-default-400">@</span>}
            value={xInput}
            onValueChange={setXInput}
          />

          {/* Quick Select */}
          <div>
            <p className="text-xs text-default-500 uppercase tracking-wider mb-2">Quick select</p>
            <div className="flex flex-wrap gap-2">
              {profilesLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-success/20"
                    >
                      <Skeleton className="w-5 h-5 rounded-full" />
                      <Skeleton className="w-14 h-3 rounded" />
                    </div>
                  ))
                : watchedProfiles.map((profile) => (
                    <button
                      key={profile.username}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                        xInput.toLowerCase() === profile.username.toLowerCase()
                          ? 'border-success bg-success/10 text-success'
                          : 'border-success/20 hover:border-success/50 hover:bg-success/5'
                      }`}
                      disabled={isAnalyzing}
                      type="button"
                      onClick={() => setXInput(profile.username)}
                    >
                      <Avatar
                        showFallback
                        className="w-5 h-5"
                        name={profile.name}
                        src={profile.avatar}
                      />
                      <span className="text-sm">@{profile.username}</span>
                    </button>
                  ))}
            </div>
          </div>

          {isAnalyzing ? (
            <div className="text-center py-4">
              <Spinner size="lg" />
              <p className="text-default-500 mt-3 text-sm">Analyzing profile...</p>
              <Progress isIndeterminate className="mt-2" color="primary" size="sm" />
            </div>
          ) : (
            <Button
              className="w-full"
              color="primary"
              isDisabled={!xInput}
              size="lg"
              onPress={handleAnalyze}
            >
              Analyze & Get Strategy
            </Button>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
