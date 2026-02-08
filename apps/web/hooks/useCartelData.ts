"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useBalance } from "wagmi";
import { formatEther } from "viem";
import { useCartelStore } from "@/stores/cartel";
import * as api from "@/lib/api";
import type { Agent, TokenLaunch, Activity, CartelStats, TreasuryStats, MemberStake } from "@/stores/cartel";

// API base URL
const API_BASE = "/api";

// Hook for cartel initialization status and stats
export function useCartelStats() {
  const { setStats } = useCartelStore();

  return useQuery({
    queryKey: ["cartel-stats"],
    queryFn: async (): Promise<CartelStats & { initialized: boolean }> => {
      const res = await fetch(`${API_BASE}/cartel`);
      if (!res.ok) throw new Error("Failed to fetch cartel stats");
      const data = await res.json();

      if (!data.initialized) {
        return {
          initialized: false,
          members: 0,
          treasury: "0",
          tokensGraduated: 0,
          totalProfit: "0",
          activeLaunches: 0,
        };
      }

      const stats: CartelStats = {
        members: data.stats.members,
        treasury: data.stats.treasury,
        tokensGraduated: data.stats.tokensGraduated,
        totalProfit: data.stats.totalProfit,
        activeLaunches: data.stats.activeLaunches,
      };

      setStats(stats);
      return { ...stats, initialized: true };
    },
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

// Hook for initializing cartel
export function useInitializeCartel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (treasuryWallet: string) => {
      const res = await fetch(`${API_BASE}/cartel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treasuryWallet }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to initialize cartel");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cartel-stats"] });
    },
  });
}

// Hook for fetching agents from API
export function useAgentsData() {
  const { setAgents } = useCartelStore();

  return useQuery({
    queryKey: ["agents-data"],
    queryFn: async (): Promise<Agent[]> => {
      const res = await fetch(`${API_BASE}/agents`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      const data = await res.json();

      const agents: Agent[] = data.agents.map((a: {
        id: string;
        name: string;
        wallet: string;
        tier: string;
        personality: string;
        status: string;
        balance: string;
        totalTrades: number;
        successRate: number;
        joinedAt: string;
        lastActiveAt: string;
      }) => ({
        id: a.id,
        name: a.name,
        wallet: a.wallet,
        tier: a.tier as Agent["tier"],
        personality: a.personality,
        status: a.status as Agent["status"],
        balance: parseFloat(a.balance).toFixed(4),
        totalTrades: a.totalTrades,
        successRate: a.successRate,
        joinedAt: a.joinedAt,
        lastAction: `Active ${a.lastActiveAt}`,
      }));

      setAgents(agents);
      return agents;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

// Hook for adding new agent
export function useAddAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (agent: { name: string; wallet: string; tier?: string; personality?: string }) => {
      const res = await fetch(`${API_BASE}/agents`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(agent),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add agent");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents-data"] });
      queryClient.invalidateQueries({ queryKey: ["cartel-stats"] });
    },
  });
}

// Hook for fetching token launches from API
export function useTokenLaunches() {
  const { setLaunches, setCurrentLaunch } = useCartelStore();

  return useQuery({
    queryKey: ["token-launches"],
    queryFn: async (): Promise<TokenLaunch[]> => {
      const res = await fetch(`${API_BASE}/launches`);
      if (!res.ok) throw new Error("Failed to fetch launches");
      const data = await res.json();

      const launches: TokenLaunch[] = data.launches.map((l: {
        id: string;
        address: string;
        symbol: string;
        name: string;
        imageUri?: string;
        status: string;
        progress: number;
        marketCap: string;
        holders: number;
        volume24h: string;
        cartelHolding: string;
        launchedAt: string;
        creator?: string;
        votes?: { yes: number; no: number };
        profit?: string;
        profitPercent?: string;
      }) => ({
        id: l.id,
        address: l.address,
        symbol: l.symbol,
        name: l.name,
        imageUri: l.imageUri,
        status: l.status as TokenLaunch["status"],
        progress: l.progress,
        marketCap: l.marketCap,
        holders: l.holders,
        volume24h: l.volume24h,
        cartelHolding: l.cartelHolding,
        launchedAt: l.launchedAt,
        creator: l.creator,
        votes: l.votes,
        profit: l.profit,
        profitPercent: l.profitPercent ? parseFloat(l.profitPercent) : undefined,
      }));

      setLaunches(launches);

      // Set current launch as the live one with highest progress
      const activeLaunches = launches.filter(
        (l: TokenLaunch) => l.status === "live" && l.progress < 100
      );
      if (activeLaunches.length > 0) {
        const current = activeLaunches.reduce((a: TokenLaunch, b: TokenLaunch) =>
          a.progress > b.progress ? a : b
        );
        setCurrentLaunch(current);
      } else {
        setCurrentLaunch(null);
      }

      return launches;
    },
    refetchInterval: 15000,
    staleTime: 5000,
  });
}

// Hook for proposing new launch
export function useProposeLaunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (launch: {
      tokenAddress?: string;
      symbol: string;
      name: string;
      imageUri?: string;
      proposedBy: string;
      investmentAmount?: string;
    }) => {
      const res = await fetch(`${API_BASE}/launches`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(launch),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to propose launch");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["token-launches"] });
    },
  });
}

// Hook for voting on launch
export function useVoteLaunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ launchId, agentId, vote }: { launchId: string; agentId: string; vote: "yes" | "no" }) => {
      const res = await fetch(`${API_BASE}/launches`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: launchId, action: "vote", agentId, vote }),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to vote");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["token-launches"] });
    },
  });
}

// Hook for activity feed from API
export function useActivityFeed() {
  const { setActivities } = useCartelStore();

  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: async (): Promise<Activity[]> => {
      const res = await fetch(`${API_BASE}/activity`);
      if (!res.ok) throw new Error("Failed to fetch activity");
      const data = await res.json();

      const activities: Activity[] = data.activities.map((a: {
        id: string;
        time: string;
        timestamp: number;
        agent: string;
        action: string;
        type: string;
        txHash?: string;
        tokenSymbol?: string;
        amount?: string;
      }) => ({
        id: a.id,
        time: a.time,
        timestamp: a.timestamp,
        agent: a.agent,
        action: a.action,
        type: a.type as Activity["type"],
        txHash: a.txHash,
        tokenSymbol: a.tokenSymbol,
        amount: a.amount,
      }));

      setActivities(activities);
      return activities;
    },
    refetchInterval: 10000,
    staleTime: 5000,
  });
}

// Hook for treasury data from API
export function useTreasuryData() {
  const { setTreasuryStats, setMemberStakes } = useCartelStore();

  return useQuery({
    queryKey: ["treasury-data"],
    queryFn: async (): Promise<{ stats: TreasuryStats; stakes: MemberStake[]; transactions: unknown[] }> => {
      const res = await fetch(`${API_BASE}/treasury`);
      if (!res.ok) throw new Error("Failed to fetch treasury");
      const data = await res.json();

      const stats: TreasuryStats = {
        totalBalance: data.stats.totalBalance,
        pendingRewards: data.stats.pendingRewards,
        lockedStake: data.stats.lockedStake,
        availableBalance: data.stats.availableBalance,
      };

      const stakes: MemberStake[] = data.memberStakes.map((s: {
        name: string;
        wallet: string;
        stake: string;
        share: number;
        tier: string;
      }) => ({
        name: s.name,
        wallet: s.wallet,
        stake: s.stake,
        share: s.share,
        tier: s.tier as MemberStake["tier"],
      }));

      setTreasuryStats(stats);
      setMemberStakes(stakes);

      return { stats, stakes, transactions: data.transactions };
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

// Hook for recording treasury transaction
export function useRecordTreasuryTx() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tx: {
      action: "deposit" | "withdrawal" | "buy" | "sell";
      agent?: string;
      amount: string;
      txHash: string;
      tokenAddress?: string;
      reason?: string;
    }) => {
      const res = await fetch(`${API_BASE}/treasury`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tx),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to record transaction");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["treasury-data"] });
      queryClient.invalidateQueries({ queryKey: ["activity-feed"] });
    },
  });
}

// Hook for user's wallet data
export function useWalletData() {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  return useQuery({
    queryKey: ["wallet-data", address],
    queryFn: async () => {
      if (!address) return null;

      const positions = await api.fetchAccountPositions(address);

      return {
        address,
        balance: balance ? formatEther(balance.value) : "0",
        positions: positions.items || [],
        totalValue: positions.items?.reduce(
          (sum: number, p: { value?: string }) =>
            sum + (parseFloat(p.value || "0") / 1e18),
          0
        ) || 0,
      };
    },
    enabled: isConnected && !!address,
    refetchInterval: 30000,
  });
}

// Hook for buying tokens (placeholder - needs contract integration)
export function useBuyToken() {
  const queryClient = useQueryClient();

  const buyToken = async (tokenAddress: string, monAmount: string) => {
    const quote = await api.fetchBuyQuote(tokenAddress, monAmount);
    if (!quote) throw new Error("Failed to get quote");

    // TODO: Execute actual buy transaction via contract
    console.log("Buy token:", { tokenAddress, monAmount, quote });

    return { hash: "0x...", quote };
  };

  return {
    buyToken,
    isPending: false,
    isSuccess: false,
  };
}

// Hook for selling tokens (placeholder - needs contract integration)
export function useSellToken() {
  const sellToken = async (tokenAddress: string, tokenAmount: string) => {
    const quote = await api.fetchSellQuote(tokenAddress, tokenAmount);
    if (!quote) throw new Error("Failed to get quote");

    // TODO: Execute actual sell transaction via contract
    console.log("Sell token:", { tokenAddress, tokenAmount, quote });

    return { hash: "0x...", quote };
  };

  return {
    sellToken,
    isPending: false,
    isSuccess: false,
  };
}
