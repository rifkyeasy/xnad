import { create } from "zustand";
import { persist } from "zustand/middleware";

export type StrategyType = "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";

export interface XAnalysis {
  followerCount: number;
  cryptoMentionRate: number;
  riskTolerance: "low" | "medium" | "high";
  tradingExperience: "beginner" | "intermediate" | "advanced";
  interests: string[];
  reasoning?: string;
}

export interface Position {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  costBasis: string;
  currentValue: string;
  unrealizedPnl: string;
  unrealizedPnlPct: number;
}

export interface AgentState {
  // User state
  xHandle: string | null;
  xAnalysis: XAnalysis | null;
  recommendedStrategy: StrategyType | null;
  selectedStrategy: StrategyType | null;
  vaultAddress: string | null;

  // Settings
  autoTrade: boolean;
  autoRebalance: boolean;
  stopLossPercent: number | null;
  takeProfitPercent: number | null;

  // Positions
  positions: Position[];

  // UI state
  step: "connect" | "analyze" | "select" | "dashboard";
  isAnalyzing: boolean;
  error: string | null;

  // Actions
  setXHandle: (handle: string) => void;
  setXAnalysis: (analysis: XAnalysis, recommended: StrategyType) => void;
  setSelectedStrategy: (strategy: StrategyType) => void;
  setVaultAddress: (address: string) => void;
  setAutoTrade: (enabled: boolean) => void;
  setAutoRebalance: (enabled: boolean) => void;
  setStopLoss: (percent: number | null) => void;
  setTakeProfit: (percent: number | null) => void;
  setPositions: (positions: Position[]) => void;
  setStep: (step: AgentState["step"]) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  xHandle: null,
  xAnalysis: null,
  recommendedStrategy: null,
  selectedStrategy: null,
  vaultAddress: null,
  autoTrade: false,
  autoRebalance: false,
  stopLossPercent: null,
  takeProfitPercent: null,
  positions: [],
  step: "connect" as const,
  isAnalyzing: false,
  error: null,
};

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      ...initialState,

      setXHandle: (handle) => set({ xHandle: handle }),

      setXAnalysis: (analysis, recommended) =>
        set({
          xAnalysis: analysis,
          recommendedStrategy: recommended,
          step: "select",
        }),

      setSelectedStrategy: (strategy) =>
        set({ selectedStrategy: strategy }),

      setVaultAddress: (address) =>
        set({ vaultAddress: address, step: "dashboard" }),

      setAutoTrade: (enabled) => set({ autoTrade: enabled }),

      setAutoRebalance: (enabled) => set({ autoRebalance: enabled }),

      setStopLoss: (percent) => set({ stopLossPercent: percent }),

      setTakeProfit: (percent) => set({ takeProfitPercent: percent }),

      setPositions: (positions) => set({ positions }),

      setStep: (step) => set({ step }),

      setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),

      setError: (error) => set({ error }),

      reset: () => set(initialState),
    }),
    {
      name: "agent-storage",
      partialize: (state) => ({
        xHandle: state.xHandle,
        selectedStrategy: state.selectedStrategy,
        vaultAddress: state.vaultAddress,
        autoTrade: state.autoTrade,
        autoRebalance: state.autoRebalance,
        stopLossPercent: state.stopLossPercent,
        takeProfitPercent: state.takeProfitPercent,
      }),
    }
  )
);
