import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface Agent {
  id: string;
  name: string;
  tier: "Boss" | "Capo" | "Soldier" | "Associate";
  status: "active" | "idle" | "offline";
  personality: string;
  wallet: string;
  balance: string;
  totalTrades: number;
  successRate: number;
  joinedAt: string;
  lastAction?: string;
}

export interface TokenLaunch {
  id: string;
  address: string;
  symbol: string;
  name: string;
  imageUri?: string;
  status: "pending" | "live" | "graduated" | "failed";
  progress: number;
  marketCap: string;
  holders: number;
  volume24h: string;
  cartelHolding: string;
  launchedAt: string;
  creator?: string;
  votes?: { yes: number; no: number };
  profit?: string;
  profitPercent?: number;
}

export interface Activity {
  id: string;
  time: string;
  timestamp: number;
  agent: string;
  action: string;
  type: "trade" | "social" | "coordination" | "governance";
  txHash?: string;
  tokenSymbol?: string;
  amount?: string;
}

export interface TreasuryStats {
  totalBalance: string;
  pendingRewards: string;
  lockedStake: string;
  availableBalance: string;
}

export interface MemberStake {
  name: string;
  wallet: string;
  stake: string;
  share: number;
  tier: "Boss" | "Capo" | "Soldier" | "Associate";
}

export interface CartelStats {
  members: number;
  treasury: string;
  tokensGraduated: number;
  totalProfit: string;
  activeLaunches: number;
}

interface CartelStore {
  // Data
  stats: CartelStats;
  agents: Agent[];
  launches: TokenLaunch[];
  activities: Activity[];
  treasuryStats: TreasuryStats;
  memberStakes: MemberStake[];
  currentLaunch: TokenLaunch | null;

  // Loading states
  isLoading: boolean;
  error: string | null;

  // Actions
  setStats: (stats: CartelStats) => void;
  setAgents: (agents: Agent[]) => void;
  setLaunches: (launches: TokenLaunch[]) => void;
  addActivity: (activity: Activity) => void;
  setActivities: (activities: Activity[]) => void;
  setTreasuryStats: (stats: TreasuryStats) => void;
  setMemberStakes: (stakes: MemberStake[]) => void;
  setCurrentLaunch: (launch: TokenLaunch | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  updateLaunch: (id: string, updates: Partial<TokenLaunch>) => void;
}

export const useCartelStore = create<CartelStore>()(
  persist(
    (set) => ({
      // Initial data
      stats: {
        members: 0,
        treasury: "0",
        tokensGraduated: 0,
        totalProfit: "0",
        activeLaunches: 0,
      },
      agents: [],
      launches: [],
      activities: [],
      treasuryStats: {
        totalBalance: "0",
        pendingRewards: "0",
        lockedStake: "0",
        availableBalance: "0",
      },
      memberStakes: [],
      currentLaunch: null,
      isLoading: false,
      error: null,

      // Actions
      setStats: (stats) => set({ stats }),
      setAgents: (agents) => set({ agents }),
      setLaunches: (launches) => set({ launches }),
      addActivity: (activity) =>
        set((state) => ({
          activities: [activity, ...state.activities].slice(0, 100),
        })),
      setActivities: (activities) => set({ activities }),
      setTreasuryStats: (treasuryStats) => set({ treasuryStats }),
      setMemberStakes: (memberStakes) => set({ memberStakes }),
      setCurrentLaunch: (currentLaunch) => set({ currentLaunch }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      updateAgent: (id, updates) =>
        set((state) => ({
          agents: state.agents.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),
      updateLaunch: (id, updates) =>
        set((state) => ({
          launches: state.launches.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),
    }),
    {
      name: "cartel-storage",
      partialize: (state) => ({
        agents: state.agents,
        stats: state.stats,
      }),
    }
  )
);
