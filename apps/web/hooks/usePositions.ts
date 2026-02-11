'use client';

import type { Position } from '@/stores/agent';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAccount } from 'wagmi';
import { useMemo } from 'react';

const BACKEND_URL = 'https://api.xnad.fun';

interface IndexerPosition {
  id: string;
  vaultId: string;
  token: string;
  balance: string;
  totalBought: string;
  totalSold: string;
  totalCostBasis: string;
  totalProceeds: string;
  realizedPnl: string;
  buyCount: number;
  sellCount: number;
}

interface BackendPosition {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  costBasis: string;
  currentValue: string;
  unrealizedPnl: string;
  unrealizedPnlPct: number;
}

async function fetchPositions(address: string): Promise<Position[]> {
  // Try indexer first
  const indexerRes = await fetch(
    `${BACKEND_URL}/api/indexer/vaults/${address.toLowerCase()}/positions`
  );

  if (indexerRes.ok) {
    const indexerData = (await indexerRes.json()) as IndexerPosition[];

    return indexerData
      .filter((p) => BigInt(p.balance) > 0n)
      .map((p) => {
        const balance = (Number(p.balance) / 1e18).toString();
        const costBasis = (Number(p.totalCostBasis) / 1e18).toString();

        return {
          tokenAddress: p.token,
          tokenSymbol: p.token.slice(0, 6),
          balance,
          costBasis,
          currentValue: costBasis,
          unrealizedPnl: '0',
          unrealizedPnlPct: 0,
        };
      });
  }

  // Fallback to backend
  const backendRes = await fetch(`${BACKEND_URL}/api/positions/${address}`);

  if (!backendRes.ok) throw new Error('Failed to fetch positions');

  const data = (await backendRes.json()) as BackendPosition[];

  return data.map((p) => ({
    tokenAddress: p.tokenAddress,
    tokenSymbol: p.tokenSymbol,
    balance: p.balance,
    costBasis: p.costBasis,
    currentValue: p.currentValue,
    unrealizedPnl: p.unrealizedPnl,
    unrealizedPnlPct: p.unrealizedPnlPct,
  }));
}

export function usePositions() {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['positions', address],
    queryFn: () => fetchPositions(address!),
    enabled: !!address,
    refetchInterval: 30000,
  });

  return {
    positions: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

// --- User Settings ---

interface UserSettings {
  autoTrade: boolean;
  autoRebalance: boolean;
  stopLossPercent: number | null;
  takeProfitPercent: number | null;
}

const DEFAULT_SETTINGS: UserSettings = {
  autoTrade: false,
  autoRebalance: false,
  stopLossPercent: null,
  takeProfitPercent: null,
};

async function fetchSettings(address: string): Promise<UserSettings> {
  const res = await fetch(`${BACKEND_URL}/api/users/${address}`);

  if (!res.ok) return DEFAULT_SETTINGS;

  const user = (await res.json()) as {
    autoTrade?: boolean;
    autoRebalance?: boolean;
    stopLossPercent?: number;
    takeProfitPercent?: number;
  };

  return {
    autoTrade: user.autoTrade ?? false,
    autoRebalance: user.autoRebalance ?? false,
    stopLossPercent: user.stopLossPercent ?? null,
    takeProfitPercent: user.takeProfitPercent ?? null,
  };
}

export function useUserSettings() {
  const { address } = useAccount();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['userSettings', address],
    queryFn: () => fetchSettings(address!),
    enabled: !!address,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<UserSettings>) => {
      const res = await fetch(`${BACKEND_URL}/api/users/${address}/strategy`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!res.ok) throw new Error('Failed to update settings');
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: ['userSettings', address] });
      const previous = queryClient.getQueryData<UserSettings>(['userSettings', address]);

      queryClient.setQueryData<UserSettings>(['userSettings', address], (old) => ({
        ...(old ?? DEFAULT_SETTINGS),
        ...updates,
      }));

      return { previous };
    },
    onError: (_err, _updates, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['userSettings', address], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['userSettings', address] });
    },
  });

  return {
    settings: data ?? DEFAULT_SETTINGS,
    isLoading,
    updateSettings: mutation.mutateAsync,
  };
}

// --- Trade History ---

interface TradeHistory {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  action: 'BUY' | 'SELL';
  amountIn: string;
  amountOut: string;
  txHash: string;
  status: string;
  createdAt: string;
}

interface IndexerTrade {
  id: string;
  vaultId: string;
  token: string;
  isBuy: boolean;
  amountIn: string;
  amountOut: string;
  tradeId: string;
  blockNumber: string;
  blockTimestamp: string;
  txHash: string;
}

async function fetchTrades(address: string, limit: number): Promise<TradeHistory[]> {
  // Try indexer first
  const indexerRes = await fetch(
    `${BACKEND_URL}/api/indexer/vaults/${address.toLowerCase()}/trades?limit=${limit}`
  );

  if (indexerRes.ok) {
    const indexerData = (await indexerRes.json()) as IndexerTrade[];

    return indexerData.map((t) => ({
      id: t.id,
      tokenAddress: t.token,
      tokenSymbol: t.token.slice(0, 6),
      action: t.isBuy ? ('BUY' as const) : ('SELL' as const),
      amountIn: (Number(t.amountIn) / 1e18).toFixed(6),
      amountOut: (Number(t.amountOut) / 1e18).toFixed(6),
      txHash: t.txHash,
      status: 'COMPLETED',
      createdAt: new Date(Number(t.blockTimestamp) * 1000).toISOString(),
    }));
  }

  // Fallback to backend
  const backendRes = await fetch(`${BACKEND_URL}/api/trades/${address}?limit=${limit}`);

  if (!backendRes.ok) throw new Error('Failed to fetch trades');

  return (await backendRes.json()) as TradeHistory[];
}

export function useTradeHistory(limit = 20) {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['tradeHistory', address, limit],
    queryFn: () => fetchTrades(address!, limit),
    enabled: !!address,
  });

  return {
    trades: data ?? [],
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

// --- Vault Info (from indexer) ---

interface VaultInfo {
  id: string;
  owner: string;
  strategyType: number;
  paused: boolean;
  balance: string;
  totalDeposited: string;
  totalWithdrawn: string;
  tradeCount: number;
}

async function fetchVaultInfo(address: string): Promise<VaultInfo | null> {
  const res = await fetch(`${BACKEND_URL}/api/indexer/vaults/${address.toLowerCase()}`);

  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch vault');

  const data = await res.json();

  return {
    id: data.id,
    owner: data.owner,
    strategyType: data.strategyType,
    paused: data.paused,
    balance: (Number(data.balance) / 1e18).toString(),
    totalDeposited: (Number(data.totalDeposited) / 1e18).toString(),
    totalWithdrawn: (Number(data.totalWithdrawn) / 1e18).toString(),
    tradeCount: data.tradeCount,
  };
}

export function useVaultInfo(vaultAddress?: string) {
  const { address } = useAccount();
  const targetAddress = vaultAddress || address;

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['vaultInfo', targetAddress],
    queryFn: () => fetchVaultInfo(targetAddress!),
    enabled: !!targetAddress,
    refetchInterval: 15000,
  });

  return {
    vault: data ?? null,
    isLoading,
    error: error?.message ?? null,
    refetch,
  };
}

// --- Portfolio Chart (real data) ---

export interface ChartPoint {
  date: string;
  value: number;
}

function formatChartDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function usePortfolioChart(vaultAddress?: string) {
  const { address } = useAccount();
  const targetAddress = vaultAddress || address;

  const { trades } = useTradeHistory(100);
  const { vault } = useVaultInfo(targetAddress || undefined);
  const { positions } = usePositions();

  const vaultBalance = vault ? parseFloat(vault.balance) : 0;
  const positionsValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue || '0'), 0);
  const currentValue = vaultBalance + positionsValue;
  const totalDeposited = vault ? parseFloat(vault.totalDeposited) : 0;

  const chartData = useMemo((): ChartPoint[] => {
    const now = Date.now();

    // No vault yet — empty
    if (totalDeposited <= 0 && currentValue <= 0) return [];

    const sorted = [...trades]
      .filter((t) => t.status === 'COMPLETED' || t.status === 'SUCCESS')
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const points: ChartPoint[] = [];

    // Always start from 0
    const depositTime = sorted.length > 0
      ? new Date(sorted[0].createdAt).getTime() - 86400000
      : now - 7 * 86400000;
    points.push({ date: formatChartDate(new Date(depositTime)), value: 0 });

    // Deposit point
    const afterDepositTime = sorted.length > 0
      ? new Date(sorted[0].createdAt).getTime() - 3600000
      : now - 6 * 86400000;
    points.push({ date: formatChartDate(new Date(afterDepositTime)), value: totalDeposited });

    // Each trade: time-proportional interpolation between deposit and current value
    if (sorted.length > 0) {
      const startTime = new Date(sorted[0].createdAt).getTime() - 86400000;
      const endTime = now;

      for (const trade of sorted) {
        const tradeTime = new Date(trade.createdAt).getTime();
        const progress = Math.min(1, (tradeTime - startTime) / (endTime - startTime));
        const value = totalDeposited + progress * (currentValue - totalDeposited);

        points.push({
          date: formatChartDate(new Date(trade.createdAt)),
          value: Math.max(0, parseFloat(value.toFixed(4))),
        });
      }
    }

    // Final point: real current value
    points.push({ date: formatChartDate(new Date(now)), value: currentValue });

    // Deduplicate same-date entries (keep last)
    const seen = new Map<string, ChartPoint>();

    for (const p of points) {
      seen.set(p.date, p);
    }

    return Array.from(seen.values());
  }, [trades, totalDeposited, currentValue]);

  return { chartData, currentValue, totalDeposited };
}
