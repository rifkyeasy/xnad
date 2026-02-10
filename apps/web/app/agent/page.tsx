'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { Progress } from '@heroui/progress';

import { useVaultFactory, useVault } from '@/hooks/useVault';
import { useAgentStore, type StrategyType } from '@/stores/agent';
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

  // Check if user already has a vault
  useEffect(() => {
    if (hasVault && vaultAddress && selectedStrategy) {
      setVaultAddress(vaultAddress);
      setStep('dashboard');
    } else if (isConnected && !xAnalysis) {
      setStep('analyze');
    }
  }, [hasVault, vaultAddress, isConnected, xAnalysis, selectedStrategy, setVaultAddress, setStep]);

  // Analyze X account
  const handleAnalyze = async () => {
    if (!xInput || !address) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Create user first
      await fetch(`${BACKEND_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address }),
      });

      // Analyze X account
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

      // Set default stop-loss/take-profit based on strategy using central config
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
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Select strategy and create vault
  const handleSelectStrategy = async (strategy: StrategyType) => {
    if (!address) return;

    setSelectedStrategy(strategy);
    setIsCreatingVault(true);
    setError(null);

    try {
      // Create vault if needed
      let vault = vaultAddress;

      if (!hasVault) {
        const txHash = await createVault();

        console.log('Vault creation tx:', txHash);
        // Wait a bit for the vault to be created
        await new Promise((r) => setTimeout(r, 3000));
        // Refetch vault address
        vault = vaultAddress;
      }

      if (vault) {
        // Set strategy on-chain using central config
        const strategyEnumMap: Record<StrategyType, StrategyEnum> = {
          CONSERVATIVE: StrategyEnum.CONSERVATIVE,
          BALANCED: StrategyEnum.BALANCED,
          AGGRESSIVE: StrategyEnum.AGGRESSIVE,
        };
        const strategyIndex = strategyEnumMap[strategy];
        const strategyConfig = STRATEGY_CONFIG[strategyIndex];

        await setStrategy(strategyIndex, strategyConfig.maxTradeAmount);

        // Update backend
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
      console.error('Strategy selection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to set strategy');
    } finally {
      setIsCreatingVault(false);
    }
  };

  // Not connected
  if (!isConnected) {
    return (
      <div className="container mx-auto max-w-4xl py-12 px-4">
        <Card>
          <CardBody className="text-center py-12">
            <h1 className="text-2xl font-bold mb-4">AI Trading Agent</h1>
            <p className="text-default-500 mb-6">
              Connect your wallet to get started with AI-powered trading
            </p>
            <p className="text-sm text-default-400">Use the Connect Wallet button in the navbar</p>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Dashboard (has vault and strategy selected)
  if (step === 'dashboard' && vaultAddress) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">AI Trading Agent</h1>
        <AgentDashboard vaultAddress={vaultAddress} />
      </div>
    );
  }

  // Strategy selection
  if (step === 'select' && xAnalysis) {
    return (
      <div className="container mx-auto max-w-6xl py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Choose Your Strategy</h1>
          <p className="text-default-500">
            Based on your X profile @{xHandle}, we recommend the{' '}
            <span className="font-bold text-primary">{recommendedStrategy}</span> strategy
          </p>
          {xAnalysis.reasoning && (
            <p className="text-sm text-default-400 mt-2 max-w-2xl mx-auto">{xAnalysis.reasoning}</p>
          )}
        </div>

        {error && (
          <Card className="mb-6 bg-danger-50">
            <CardBody>
              <p className="text-danger">{error}</p>
            </CardBody>
          </Card>
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
    <div className="container mx-auto max-w-xl py-12 px-4">
      <Card>
        <CardBody className="gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Start AI Trading</h1>
            <p className="text-default-500">
              Enter your X/Twitter handle to analyze your profile and get a personalized trading
              strategy
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

          {isAnalyzing ? (
            <div className="text-center py-4">
              <Spinner size="lg" />
              <p className="text-default-500 mt-4">Analyzing your profile...</p>
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

          <p className="text-xs text-default-400 text-center">
            We analyze your tweets to understand your risk tolerance and trading experience, then
            recommend a suitable strategy.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
