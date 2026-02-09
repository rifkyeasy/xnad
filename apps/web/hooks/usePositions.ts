"use client";

import { useState, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import type { Position } from "@/stores/agent";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

interface PositionData {
  positions: Position[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

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

export function usePositions(): PositionData {
  const { address } = useAccount();
  const [positions, setPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try indexer first (via backend proxy)
      const indexerRes = await fetch(`${BACKEND_URL}/api/indexer/vaults/${address.toLowerCase()}/positions`);

      if (indexerRes.ok) {
        const indexerData = (await indexerRes.json()) as IndexerPosition[];

        // Transform indexer positions to frontend format
        const transformedPositions: Position[] = indexerData
          .filter((p) => BigInt(p.balance) > 0n)
          .map((p) => {
            const balance = (Number(p.balance) / 1e18).toString();
            const costBasis = (Number(p.totalCostBasis) / 1e18).toString();
            // Estimate current value as cost basis (real price requires nad.fun API)
            const currentValue = costBasis;
            const unrealizedPnl = "0";
            const unrealizedPnlPct = 0;

            return {
              tokenAddress: p.token,
              tokenSymbol: p.token.slice(0, 6), // Will be enriched by backend
              balance,
              costBasis,
              currentValue,
              unrealizedPnl,
              unrealizedPnlPct,
            };
          });

        setPositions(transformedPositions);
        return;
      }

      // Fallback to backend positions API
      const backendRes = await fetch(`${BACKEND_URL}/api/positions/${address}`);
      if (!backendRes.ok) {
        throw new Error("Failed to fetch positions");
      }

      const data = (await backendRes.json()) as BackendPosition[];
      const transformedPositions: Position[] = data.map((p) => ({
        tokenAddress: p.tokenAddress,
        tokenSymbol: p.tokenSymbol,
        balance: p.balance,
        costBasis: p.costBasis,
        currentValue: p.currentValue,
        unrealizedPnl: p.unrealizedPnl,
        unrealizedPnlPct: p.unrealizedPnlPct,
      }));

      setPositions(transformedPositions);
    } catch (err) {
      console.error("Error fetching positions:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch on mount and when address changes
  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  // Refetch every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchPositions, 30000);
    return () => clearInterval(interval);
  }, [fetchPositions]);

  return {
    positions,
    isLoading,
    error,
    refetch: fetchPositions,
  };
}

interface UserSettings {
  autoTrade: boolean;
  autoRebalance: boolean;
  stopLossPercent: number | null;
  takeProfitPercent: number | null;
}

interface SettingsData {
  settings: UserSettings;
  isLoading: boolean;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
}

export function useUserSettings(): SettingsData {
  const { address } = useAccount();
  const [settings, setSettings] = useState<UserSettings>({
    autoTrade: false,
    autoRebalance: false,
    stopLossPercent: null,
    takeProfitPercent: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch settings on mount
  useEffect(() => {
    if (!address) return;

    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/users/${address}`);
        if (!res.ok) return;

        const user = (await res.json()) as {
          autoTrade?: boolean;
          autoRebalance?: boolean;
          stopLossPercent?: number;
          takeProfitPercent?: number;
        };

        setSettings({
          autoTrade: user.autoTrade ?? false,
          autoRebalance: user.autoRebalance ?? false,
          stopLossPercent: user.stopLossPercent ?? null,
          takeProfitPercent: user.takeProfitPercent ?? null,
        });
      } catch (err) {
        console.error("Error fetching user settings:", err);
      }
    };

    fetchSettings();
  }, [address]);

  const updateSettings = useCallback(
    async (updates: Partial<UserSettings>) => {
      if (!address) return;

      setIsLoading(true);

      try {
        const res = await fetch(`${BACKEND_URL}/api/users/${address}/strategy`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        });

        if (!res.ok) {
          throw new Error("Failed to update settings");
        }

        // Update local state
        setSettings((prev) => ({ ...prev, ...updates }));
      } catch (err) {
        console.error("Error updating settings:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [address]
  );

  return {
    settings,
    isLoading,
    updateSettings,
  };
}

interface TradeHistory {
  id: string;
  tokenAddress: string;
  tokenSymbol: string;
  action: "BUY" | "SELL";
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

interface TradesData {
  trades: TradeHistory[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useTradeHistory(limit = 20): TradesData {
  const { address } = useAccount();
  const [trades, setTrades] = useState<TradeHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      // Try indexer first (via backend proxy)
      const indexerRes = await fetch(
        `${BACKEND_URL}/api/indexer/vaults/${address.toLowerCase()}/trades?limit=${limit}`
      );

      if (indexerRes.ok) {
        const indexerData = (await indexerRes.json()) as IndexerTrade[];

        const transformedTrades: TradeHistory[] = indexerData.map((t) => ({
          id: t.id,
          tokenAddress: t.token,
          tokenSymbol: t.token.slice(0, 6),
          action: t.isBuy ? "BUY" : "SELL",
          amountIn: (Number(t.amountIn) / 1e18).toFixed(6),
          amountOut: (Number(t.amountOut) / 1e18).toFixed(6),
          txHash: t.txHash,
          status: "COMPLETED",
          createdAt: new Date(Number(t.blockTimestamp) * 1000).toISOString(),
        }));

        setTrades(transformedTrades);
        return;
      }

      // Fallback to backend trades API
      const backendRes = await fetch(`${BACKEND_URL}/api/trades/${address}?limit=${limit}`);
      if (!backendRes.ok) {
        throw new Error("Failed to fetch trades");
      }

      const data = (await backendRes.json()) as TradeHistory[];
      setTrades(data);
    } catch (err) {
      console.error("Error fetching trades:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [address, limit]);

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  return {
    trades,
    isLoading,
    error,
    refetch: fetchTrades,
  };
}

// Hook to get vault info from indexer
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

interface VaultData {
  vault: VaultInfo | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useVaultInfo(vaultAddress?: string): VaultData {
  const { address } = useAccount();
  const targetAddress = vaultAddress || address;
  const [vault, setVault] = useState<VaultInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchVault = useCallback(async () => {
    if (!targetAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BACKEND_URL}/api/indexer/vaults/${targetAddress.toLowerCase()}`);

      if (res.ok) {
        const data = await res.json();
        setVault({
          id: data.id,
          owner: data.owner,
          strategyType: data.strategyType,
          paused: data.paused,
          balance: (Number(data.balance) / 1e18).toString(),
          totalDeposited: (Number(data.totalDeposited) / 1e18).toString(),
          totalWithdrawn: (Number(data.totalWithdrawn) / 1e18).toString(),
          tradeCount: data.tradeCount,
        });
      } else if (res.status === 404) {
        setVault(null);
      } else {
        throw new Error("Failed to fetch vault");
      }
    } catch (err) {
      console.error("Error fetching vault:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, [targetAddress]);

  useEffect(() => {
    fetchVault();
  }, [fetchVault]);

  // Refetch every 15 seconds
  useEffect(() => {
    const interval = setInterval(fetchVault, 15000);
    return () => clearInterval(interval);
  }, [fetchVault]);

  return {
    vault,
    isLoading,
    error,
    refetch: fetchVault,
  };
}
