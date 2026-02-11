'use client';

import { Card, CardBody, CardFooter } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { Button } from '@heroui/button';
import { Divider } from '@heroui/divider';
import { useAccount, useBalance } from 'wagmi';
import { useRouter } from 'next/navigation';
import { formatEther } from 'viem';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, Area, AreaChart } from 'recharts';

import { useAgentStore } from '@/stores/agent';
import { useVaultFactory, useVault } from '@/hooks/useVault';
import { usePortfolioChart } from '@/hooks/usePositions';

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

export default function Portfolio() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const { selectedStrategy, vaultAddress, positions, autoTrade } = useAgentStore();
  const { hasVault } = useVaultFactory(address);
  const { balance: vaultBalance } = useVault(vaultAddress);
  const { chartData, currentValue, totalDeposited } = usePortfolioChart(vaultAddress || undefined);

  const walletBalance = balance ? parseFloat(formatEther(balance.value)) : 0;
  const totalPnl = currentValue - totalDeposited;
  const totalPnlPct = totalDeposited > 0 ? (totalPnl / totalDeposited) * 100 : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
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

      {/* Main: Chart (left) + Details (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        {/* Chart */}
        <div className="lg:col-span-3 rounded-xl border border-success/30 p-4 flex flex-col">
          <div className="flex items-baseline justify-between mb-3">
            <p className="text-xs text-default-500 uppercase tracking-wider">Portfolio Value</p>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold">{currentValue.toFixed(2)} MON</span>
              {totalDeposited > 0 && (
                <span
                  className={`text-xs font-medium ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}
                >
                  {totalPnl >= 0 ? '+' : ''}
                  {totalPnl.toFixed(2)} ({totalPnlPct.toFixed(1)}%)
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 min-h-[14rem]">
            {chartData.length > 0 ? (
              <ResponsiveContainer height="100%" width="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="greenGradient" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    axisLine={false}
                    dataKey="date"
                    stroke="#71717a"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    domain={[0, 'auto']}
                    stroke="#71717a"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#18181b',
                      border: '1px solid rgba(34,197,94,0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${Number(value).toFixed(2)} MON`, 'Value']}
                    labelStyle={{ color: '#a1a1aa' }}
                  />
                  <Area
                    dataKey="value"
                    fill="url(#greenGradient)"
                    stroke="#22c55e"
                    strokeWidth={2}
                    type="monotone"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-default-500 text-sm">
                No portfolio data yet
              </div>
            )}
          </div>
        </div>

        {/* Details Card */}
        <Card className="lg:col-span-2 border border-success/40 shadow-none bg-transparent">
          <CardBody className="gap-4 p-4">
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-lg font-medium mb-1">Connect Your Wallet</p>
                <p className="text-default-500 text-sm">Connect to start AI trading on nad.fun</p>
              </div>
            ) : (
              <>
                {/* Balances */}
                <div>
                  <p className="text-xs text-default-500 uppercase tracking-wider mb-2">Balances</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Wallet</span>
                      <span className="text-sm font-bold">{walletBalance.toFixed(2)} MON</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Vault</span>
                      <span className="text-sm font-bold">
                        {vaultBalance ? parseFloat(vaultBalance).toFixed(2) : '0'} MON
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Positions</span>
                      <span className="text-sm font-bold">
                        {(currentValue - (vaultBalance ? parseFloat(vaultBalance) : 0)).toFixed(2)}{' '}
                        MON
                      </span>
                    </div>
                  </div>
                </div>

                <Divider className="bg-success/20" />

                {/* P&L */}
                <div>
                  <p className="text-xs text-default-500 uppercase tracking-wider mb-2">
                    Performance
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Deposited</span>
                      <span className="text-sm font-medium">{totalDeposited.toFixed(2)} MON</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Current Value</span>
                      <span className="text-sm font-bold">{currentValue.toFixed(2)} MON</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">P&L</span>
                      <span
                        className={`text-sm font-bold ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}
                      >
                        {totalPnl >= 0 ? '+' : ''}
                        {totalPnl.toFixed(2)} MON
                      </span>
                    </div>
                  </div>
                </div>

                <Divider className="bg-success/20" />

                {/* Agent Status */}
                <div>
                  <p className="text-xs text-default-500 uppercase tracking-wider mb-2">Agent</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Strategy</span>
                      <span className="text-sm font-medium">
                        {selectedStrategy ? strategyLabels[selectedStrategy] : 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Auto-Trade</span>
                      <Chip color={autoTrade ? 'success' : 'default'} size="sm" variant="flat">
                        {autoTrade ? 'Enabled' : 'Disabled'}
                      </Chip>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-default-500">Positions</span>
                      <span className="text-sm font-medium">{positions.length}</span>
                    </div>
                    {vaultAddress && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-default-500">Vault</span>
                        <span className="text-xs font-mono text-default-400">
                          {vaultAddress.slice(0, 6)}...{vaultAddress.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardBody>
          {isConnected && (
            <CardFooter className="pt-0">
              <Button className="w-full" color="primary" onPress={() => router.push('/agent')}>
                {hasVault ? 'Manage Agent' : 'Set Up Agent'}
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
}
