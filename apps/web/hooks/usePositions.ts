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
      const res = await fetch(`${BACKEND_URL}/api/positions/${address}`);
      if (!res.ok) {
        throw new Error("Failed to fetch positions");
      }

      const data = (await res.json()) as BackendPosition[];

      // Transform backend positions to frontend format
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
      const res = await fetch(`${BACKEND_URL}/api/trades/${address}?limit=${limit}`);
      if (!res.ok) {
        throw new Error("Failed to fetch trades");
      }

      const data = (await res.json()) as TradeHistory[];
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
