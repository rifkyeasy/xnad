'use client';

import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Card, CardBody } from '@heroui/card';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { Spinner } from '@heroui/spinner';
import { Progress } from '@heroui/progress';
import { Divider } from '@heroui/divider';

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
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <Card className="border border-default-200">
          <CardBody className="py-12 px-6">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">🤖</div>
              <h1 className="text-3xl font-bold mb-3">AI Trading Agent</h1>
              <p className="text-default-500 max-w-md mx-auto">
                Connect your wallet to set up AI-powered automated trading on nad.fun
              </p>
            </div>

            <Divider className="my-6" />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  1
                </div>
                <p className="font-medium text-sm">Analyze X Profile</p>
                <p className="text-xs text-default-400 mt-1">
                  AI reads your tweets to understand your risk tolerance
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  2
                </div>
                <p className="font-medium text-sm">Choose Strategy</p>
                <p className="text-xs text-default-400 mt-1">
                  Pick from Conservative, Balanced, or Aggressive
                </p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center text-lg font-bold mx-auto mb-3">
                  3
                </div>
                <p className="font-medium text-sm">Auto-Trade</p>
                <p className="text-xs text-default-400 mt-1">
                  AI executes trades based on social signals
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-sm text-default-400">
                Use the Connect Wallet button in the navbar to get started
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }

  // Dashboard
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
    <div className="container mx-auto max-w-xl py-8 px-4">
      <Card className="border border-default-200">
        <CardBody className="gap-6 p-6">
          <div className="text-center">
            <div className="text-4xl mb-3">🔍</div>
            <h1 className="text-2xl font-bold mb-2">Start AI Trading</h1>
            <p className="text-default-500 text-sm">
              Enter your X handle to analyze your profile and get a personalized trading strategy
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
              <p className="text-default-500 mt-4 text-sm">Analyzing your profile...</p>
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

          <Divider />

          <div className="space-y-3">
            <p className="text-xs text-default-500 font-medium uppercase tracking-wider">
              What happens next
            </p>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-default-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <p className="text-sm text-default-500">
                AI analyzes your tweets to understand your risk tolerance and trading style
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-default-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <p className="text-sm text-default-500">
                You get a recommended strategy with customized stop-loss and take-profit levels
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-default-100 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                3
              </div>
              <p className="text-sm text-default-500">
                A vault is created on-chain and the AI agent starts monitoring signals for you
              </p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
