'use client';

import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2">
          {selectedStrategy && (
            <Chip color={strategyColors[selectedStrategy]} size="sm" variant="flat">
              {strategyLabels[selectedStrategy]}
            </Chip>
          )}
          {autoTrade && (
            <Chip color="success" size="sm" variant="dot">
              Active
            </Chip>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-success/30">
          <p className="text-xs text-default-500 uppercase tracking-wider">Wallet</p>
          <p className="text-xl font-bold mt-1">
            {balance ? parseFloat(formatEther(balance.value)).toFixed(2) : '0'}
          </p>
          <p className="text-xs text-default-400">MON</p>
        </div>
        <div className="p-4 rounded-xl border border-success/30">
          <p className="text-xs text-default-500 uppercase tracking-wider">Vault</p>
          <p className="text-xl font-bold mt-1">
            {vaultBalance ? parseFloat(vaultBalance).toFixed(2) : '0'}
          </p>
          <p className="text-xs text-default-400">MON</p>
        </div>
        <div className="p-4 rounded-xl border border-success/30">
          <p className="text-xs text-default-500 uppercase tracking-wider">Positions</p>
          <p className="text-xl font-bold mt-1">{totalPositionValue.toFixed(2)}</p>
          <p className="text-xs text-default-400">MON</p>
        </div>
        <div className="p-4 rounded-xl border border-success/30">
          <p className="text-xs text-default-500 uppercase tracking-wider">P&L</p>
          <p className={`text-xl font-bold mt-1 ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}>
            {totalPnl >= 0 ? '+' : ''}
            {totalPnl.toFixed(2)}
          </p>
          <p className="text-xs text-default-400">MON</p>
        </div>
      </div>

      {/* Agent Card */}
      <Card className="border border-success/40 shadow-none bg-transparent">
        <CardBody className="gap-4">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-lg font-medium mb-1">Connect Your Wallet</p>
              <p className="text-default-500 text-sm">
                Connect to create a vault and start AI trading on nad.fun
              </p>
            </div>
          ) : !hasVault ? (
            <div className="text-center py-8">
              <p className="text-lg font-medium mb-1">Set Up Your AI Agent</p>
              <p className="text-default-500 text-sm mb-4">
                Analyze your X profile, choose a strategy, and let the AI trade for you
              </p>
              <Button color="primary" onPress={() => router.push('/agent')}>
                Get Started
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-xs text-default-500">Strategy</p>
                <p className="font-bold mt-0.5">
                  {selectedStrategy ? strategyLabels[selectedStrategy] : 'Not set'}
                </p>
              </div>
              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-xs text-default-500">Auto-Trade</p>
                <p className="font-bold mt-0.5">{autoTrade ? 'Enabled' : 'Disabled'}</p>
              </div>
              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-xs text-default-500">Positions</p>
                <p className="font-bold mt-0.5">{positions.length}</p>
              </div>
              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-xs text-default-500">Vault</p>
                <p className="font-mono text-sm mt-0.5 truncate">
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
    </div>
  );
}
