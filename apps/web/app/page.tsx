'use client';

import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Divider } from '@heroui/divider';
import { Button } from '@heroui/button';
import { useAccount, useBalance } from 'wagmi';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';

import { useAgentStore } from '@/stores/agent';
import { useVaultFactory, useVault } from '@/hooks/useVault';

const strategyLabels: Record<string, string> = {
  CONSERVATIVE: 'Conservative',
  BALANCED: 'Balanced',
  AGGRESSIVE: 'Aggressive',
};

const strategyColors: Record<string, 'success' | 'primary' | 'danger'> = {
  CONSERVATIVE: 'success',
  BALANCED: 'primary',
  AGGRESSIVE: 'danger',
};

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const { selectedStrategy, vaultAddress, positions, autoTrade } = useAgentStore();
  const { hasVault } = useVaultFactory(address);
  const { balance: vaultBalance } = useVault(vaultAddress);

  const totalPositionValue = positions.reduce(
    (sum, p) => sum + parseFloat(p.currentValue || '0'),
    0
  );
  const totalPnl = positions.reduce((sum, p) => sum + parseFloat(p.unrealizedPnl || '0'), 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Hero */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-default-500 mt-1">Social AI Trading Agent for nad.fun</p>
        </div>
        <div className="flex items-center gap-2">
          {selectedStrategy && (
            <Chip color={strategyColors[selectedStrategy]} size="lg" variant="flat">
              {strategyLabels[selectedStrategy]}
            </Chip>
          )}
          {autoTrade && (
            <Chip color="success" size="lg" variant="dot">
              Active
            </Chip>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border border-default-200">
          <CardBody className="py-5 px-4">
            <p className="text-default-500 text-xs uppercase tracking-wider mb-1">Wallet</p>
            <p className="text-2xl font-bold">
              {balance ? parseFloat(formatEther(balance.value)).toFixed(4) : '0'}
            </p>
            <p className="text-default-400 text-sm">MON</p>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="py-5 px-4">
            <p className="text-default-500 text-xs uppercase tracking-wider mb-1">Vault</p>
            <p className="text-2xl font-bold">
              {vaultBalance ? parseFloat(vaultBalance).toFixed(4) : '0'}
            </p>
            <p className="text-default-400 text-sm">MON</p>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="py-5 px-4">
            <p className="text-default-500 text-xs uppercase tracking-wider mb-1">Positions</p>
            <p className="text-2xl font-bold">{totalPositionValue.toFixed(4)}</p>
            <p className="text-default-400 text-sm">MON</p>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="py-5 px-4">
            <p className="text-default-500 text-xs uppercase tracking-wider mb-1">P&L</p>
            <p className={`text-2xl font-bold ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
              {totalPnl >= 0 ? '+' : ''}
              {totalPnl.toFixed(4)}
            </p>
            <p className="text-default-400 text-sm">MON</p>
          </CardBody>
        </Card>
      </div>

      {/* Agent Status */}
      <Card className="border border-default-200">
        <CardHeader className="flex flex-col sm:flex-row justify-between gap-2 pb-0">
          <div>
            <h2 className="text-lg font-bold">AI Agent</h2>
            <p className="text-default-500 text-sm">Your automated trading configuration</p>
          </div>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="gap-4 pt-0">
          {!isConnected ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🔗</div>
              <p className="text-lg font-medium mb-2">Connect Your Wallet</p>
              <p className="text-default-500 text-sm max-w-sm mx-auto">
                Connect your wallet to create a vault and start AI-powered trading on nad.fun
              </p>
            </div>
          ) : !hasVault ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">🤖</div>
              <p className="text-lg font-medium mb-2">Set Up Your AI Agent</p>
              <p className="text-default-500 text-sm max-w-sm mx-auto mb-6">
                Analyze your X profile, choose a strategy, and let the AI trade for you
              </p>
              <Button color="primary" size="lg" onPress={() => router.push('/agent')}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-default-100 rounded-xl">
                <p className="text-xs text-default-500 uppercase tracking-wider">Strategy</p>
                <p className="font-bold mt-1">
                  {selectedStrategy ? strategyLabels[selectedStrategy] : 'Not set'}
                </p>
              </div>
              <div className="p-4 bg-default-100 rounded-xl">
                <p className="text-xs text-default-500 uppercase tracking-wider">Auto-Trade</p>
                <p className="font-bold mt-1">{autoTrade ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div className="p-4 bg-default-100 rounded-xl">
                <p className="text-xs text-default-500 uppercase tracking-wider">Positions</p>
                <p className="font-bold mt-1">{positions.length}</p>
              </div>
              <div className="p-4 bg-default-100 rounded-xl">
                <p className="text-xs text-default-500 uppercase tracking-wider">Vault</p>
                <p className="font-mono text-sm mt-1 truncate">
                  {vaultAddress
                    ? `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}`
                    : 'None'}
                </p>
              </div>
            </div>
          )}
        </CardBody>
        {isConnected && (
          <CardFooter>
            <Button className="flex-1" color="primary" onPress={() => router.push('/agent')}>
              {hasVault ? 'Manage Agent' : 'Set Up Agent'}
            </Button>
          </CardFooter>
        )}
      </Card>

      {/* How It Works */}
      <div>
        <h2 className="text-lg font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-default-200">
            <CardBody className="text-center gap-3 py-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold mx-auto">
                1
              </div>
              <h3 className="font-bold">Monitor</h3>
              <p className="text-sm text-default-500">
                AI agent watches curated X accounts for token signals and trading opportunities
              </p>
            </CardBody>
          </Card>
          <Card className="border border-default-200">
            <CardBody className="text-center gap-3 py-6">
              <div className="w-10 h-10 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-lg font-bold mx-auto">
                2
              </div>
              <h3 className="font-bold">Analyze</h3>
              <p className="text-sm text-default-500">
                GPT-4.1 extracts token addresses, confidence scores, and risk levels from tweets
              </p>
            </CardBody>
          </Card>
          <Card className="border border-default-200">
            <CardBody className="text-center gap-3 py-6">
              <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center text-lg font-bold mx-auto">
                3
              </div>
              <h3 className="font-bold">Execute</h3>
              <p className="text-sm text-default-500">
                High-confidence signals trigger autonomous trades via your vault on nad.fun
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold">AI Agent Setup</h3>
              <p className="text-sm text-default-500">
                Analyze your X profile and get a personalized strategy
              </p>
            </div>
            <Button color="primary" size="sm" variant="flat" onPress={() => router.push('/agent')}>
              Open
            </Button>
          </CardBody>
        </Card>
        <Card className="border border-default-200">
          <CardBody className="flex flex-row items-center gap-4 py-5">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center text-2xl shrink-0">
              🔗
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold">nad.fun</h3>
              <p className="text-sm text-default-500">Explore tokens on the nad.fun platform</p>
            </div>
            <Button
              as="a"
              color="success"
              href="https://nad.fun"
              size="sm"
              target="_blank"
              variant="flat"
            >
              Explore
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
