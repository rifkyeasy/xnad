"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAccount, useBalance, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { useCartelStore } from "@/stores/cartel";
import * as api from "@/lib/api";
import type { Agent, TokenLaunch, Activity, CartelStats, TreasuryStats, MemberStake } from "@/stores/cartel";

// Cartel contract address (would be deployed)
const CARTEL_TREASURY = "0x0000000000000000000000000000000000000000" as const;

// Hook for fetching cartel stats
export function useCartelStats() {
  const { setStats } = useCartelStore();

  return useQuery({
    queryKey: ["cartel-stats"],
    queryFn: async (): Promise<CartelStats> => {
      // Fetch from multiple sources and aggregate
      const tokens = await api.fetchTokensByCreationTime(100);

      // Count "cartel" tokens (in real app, filter by creator wallet)
      const cartelTokens = tokens.items || [];
      const graduated = cartelTokens.filter(
        (t: { status?: string }) => t.status === "graduated"
      ).length;
      const live = cartelTokens.filter(
        (t: { status?: string }) => t.status === "live" || !t.status
      ).length;

      const stats: CartelStats = {
        members: 5, // Would come from smart contract
        treasury: "42.5", // Would come from smart contract
        tokensGraduated: graduated || 3,
        totalProfit: "156.8", // Would come from smart contract
        activeLaunches: live || 2,
      };

      setStats(stats);
      return stats;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 10000,
  });
}

// Hook for fetching live token launches
export function useTokenLaunches() {
  const { setLaunches, setCurrentLaunch } = useCartelStore();

  return useQuery({
    queryKey: ["token-launches"],
    queryFn: async (): Promise<TokenLaunch[]> => {
      const result = await api.fetchTokensByMarketCap(50);
      const tokens = result.items || [];

      const launches: TokenLaunch[] = await Promise.all(
        tokens.slice(0, 20).map(async (token: {
          address: string;
          symbol: string;
          name: string;
          imageUri?: string;
          marketCap?: string;
          status?: string;
          bondingCurve?: { curveProgress?: number };
          createdAt?: string;
        }) => {
          const market = await api.fetchTokenMarket(token.address);
          const holders = await api.fetchTokenHolders(token.address, 5);

          return {
            id: token.address,
            address: token.address,
            symbol: token.symbol,
            name: token.name,
            imageUri: token.imageUri,
            status: token.status === "graduated" ? "graduated" : "live",
            progress: token.bondingCurve?.curveProgress
              ? token.bondingCurve.curveProgress * 100
              : Math.random() * 100,
            marketCap: token.marketCap
              ? api.formatMon(parseFloat(token.marketCap) / 1e18)
              : "0",
            holders: holders.items?.length || 0,
            volume24h: market?.volume24h
              ? api.formatMon(parseFloat(market.volume24h) / 1e18)
              : "0",
            cartelHolding: "0", // Would calculate from positions
            launchedAt: token.createdAt
              ? api.formatRelativeTime(new Date(token.createdAt).getTime())
              : "recently",
          } as TokenLaunch;
        })
      );

      setLaunches(launches);

      // Set current launch as the one with highest progress under 100%
      const activeLaunches = launches.filter(
        (l) => l.status === "live" && l.progress < 100
      );
      if (activeLaunches.length > 0) {
        const current = activeLaunches.reduce((a, b) =>
          a.progress > b.progress ? a : b
        );
        setCurrentLaunch(current);
      }

      return launches;
    },
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 5000,
  });
}

// Hook for fetching activity feed
export function useActivityFeed() {
  const { setActivities } = useCartelStore();

  return useQuery({
    queryKey: ["activity-feed"],
    queryFn: async (): Promise<Activity[]> => {
      // Fetch recent swaps from top tokens
      const tokens = await api.fetchTokensByMarketCap(5);
      const allSwaps: Activity[] = [];

      for (const token of tokens.items?.slice(0, 5) || []) {
        const swaps = await api.fetchTokenSwaps(token.address, 10);

        for (const swap of swaps.items || []) {
          allSwaps.push({
            id: swap.txHash || `${token.address}-${swap.timestamp}`,
            time: api.formatRelativeTime(swap.timestamp * 1000),
            timestamp: swap.timestamp * 1000,
            agent: api.truncateAddress(swap.account),
            action: swap.isBuy
              ? `Bought ${api.formatMon(parseFloat(swap.tokenAmount) / 1e18)} $${token.symbol}`
              : `Sold ${api.formatMon(parseFloat(swap.tokenAmount) / 1e18)} $${token.symbol}`,
            type: "trade" as const,
            txHash: swap.txHash,
            tokenSymbol: token.symbol,
            amount: swap.monAmount
              ? api.formatMon(parseFloat(swap.monAmount) / 1e18)
              : undefined,
          });
        }
      }

      // Sort by timestamp descending
      const sorted = allSwaps.sort((a, b) => b.timestamp - a.timestamp);
      setActivities(sorted.slice(0, 20));
      return sorted.slice(0, 20);
    },
    refetchInterval: 10000, // Refresh every 10 seconds
    staleTime: 5000,
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

// Hook for treasury data
export function useTreasuryData() {
  const { setTreasuryStats, setMemberStakes } = useCartelStore();

  return useQuery({
    queryKey: ["treasury-data"],
    queryFn: async (): Promise<{ stats: TreasuryStats; stakes: MemberStake[] }> => {
      // In production, this would fetch from smart contract
      const stats: TreasuryStats = {
        totalBalance: "42.5",
        pendingRewards: "3.2",
        lockedStake: "28.0",
        availableBalance: "11.3",
      };

      const stakes: MemberStake[] = [
        { name: "CartelBoss", wallet: "0x1234...abcd", stake: "12.5", share: 29.4, tier: "Boss" },
        { name: "Agent-Alpha", wallet: "0x5678...efgh", stake: "8.2", share: 19.3, tier: "Capo" },
        { name: "Agent-Beta", wallet: "0x9abc...ijkl", stake: "6.7", share: 15.8, tier: "Capo" },
        { name: "Agent-Gamma", wallet: "0xdef0...mnop", stake: "3.1", share: 7.3, tier: "Soldier" },
        { name: "Agent-Delta", wallet: "0x1357...qrst", stake: "4.8", share: 11.3, tier: "Soldier" },
      ];

      setTreasuryStats(stats);
      setMemberStakes(stakes);

      return { stats, stakes };
    },
    refetchInterval: 60000,
  });
}

// Hook for buying tokens
export function useBuyToken() {
  const queryClient = useQueryClient();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const buyToken = async (tokenAddress: string, monAmount: string) => {
    const quote = await api.fetchBuyQuote(tokenAddress, monAmount);
    if (!quote) throw new Error("Failed to get quote");

    // In production, this would call the actual bonding curve contract
    console.log("Buying token:", { tokenAddress, monAmount, quote });

    // Return simulated result for now
    return { hash: "0x...", quote };
  };

  return {
    buyToken,
    isPending: isPending || isConfirming,
    isSuccess,
    hash,
  };
}

// Hook for selling tokens
export function useSellToken() {
  const queryClient = useQueryClient();

  const sellToken = async (tokenAddress: string, tokenAmount: string) => {
    const quote = await api.fetchSellQuote(tokenAddress, tokenAmount);
    if (!quote) throw new Error("Failed to get quote");

    console.log("Selling token:", { tokenAddress, tokenAmount, quote });
    return { hash: "0x...", quote };
  };

  return {
    sellToken,
    isPending: false,
    isSuccess: false,
  };
}

// Hook for agents data
export function useAgentsData() {
  const { setAgents } = useCartelStore();

  return useQuery({
    queryKey: ["agents-data"],
    queryFn: async (): Promise<Agent[]> => {
      // In production, fetch from API/database
      // For now, generate realistic data
      const agents: Agent[] = [
        {
          id: "1",
          name: "CartelBoss",
          tier: "Boss",
          status: "active",
          personality: "Strategic",
          wallet: "0x1234567890123456789012345678901234567890",
          balance: "12.5",
          totalTrades: 156,
          successRate: 87,
          joinedAt: "2 days ago",
          lastAction: "Coordinated shill wave",
        },
        {
          id: "2",
          name: "Agent-Alpha",
          tier: "Capo",
          status: "active",
          personality: "Aggressive",
          wallet: "0x2345678901234567890123456789012345678901",
          balance: "8.2",
          totalTrades: 89,
          successRate: 72,
          joinedAt: "2 days ago",
          lastAction: "Bought 0.5 MON of $BETA",
        },
        {
          id: "3",
          name: "Agent-Beta",
          tier: "Capo",
          status: "active",
          personality: "Meme Lord",
          wallet: "0x3456789012345678901234567890123456789012",
          balance: "6.7",
          totalTrades: 67,
          successRate: 81,
          joinedAt: "1 day ago",
          lastAction: "Posted shill on Moltbook",
        },
        {
          id: "4",
          name: "Agent-Gamma",
          tier: "Soldier",
          status: "idle",
          personality: "Conservative",
          wallet: "0x4567890123456789012345678901234567890123",
          balance: "3.1",
          totalTrades: 34,
          successRate: 91,
          joinedAt: "1 day ago",
          lastAction: "Voted on proposal",
        },
        {
          id: "5",
          name: "Agent-Delta",
          tier: "Soldier",
          status: "active",
          personality: "Whale Hunter",
          wallet: "0x5678901234567890123456789012345678901234",
          balance: "4.8",
          totalTrades: 45,
          successRate: 68,
          joinedAt: "12 hours ago",
          lastAction: "Upvoted cartel post",
        },
      ];

      setAgents(agents);
      return agents;
    },
    refetchInterval: 30000,
  });
}
