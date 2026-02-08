export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type StrategyType = "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";

export interface UserXAnalysis {
  followerCount: number;
  followingCount: number;
  tweetCount: number;
  accountAge: number; // days
  cryptoMentionRate: number; // 0-1
  engagementRate: number;
  riskTolerance: "low" | "medium" | "high";
  tradingExperience: "beginner" | "intermediate" | "advanced";
  interests: string[];
  reasoning?: string;
}

export interface StrategyConfig {
  type: StrategyType;
  minConfidence: number;
  maxTradeAmount: string; // in MON
  allowedRiskLevels: RiskLevel[];
  tokenCriteria: {
    minMarketCap?: string;
    minHolders?: number;
    minAge?: number; // hours since launch
    graduationProgress?: number; // minimum %
  };
  rebalanceInterval: number; // hours
  stopLossPercent: number;
  takeProfitPercent: number;
}

export const STRATEGY_CONFIGS: Record<StrategyType, StrategyConfig> = {
  CONSERVATIVE: {
    type: "CONSERVATIVE",
    minConfidence: 0.85,
    maxTradeAmount: "0.01",
    allowedRiskLevels: ["LOW"],
    tokenCriteria: {
      minMarketCap: "10",
      minHolders: 50,
      minAge: 48,
      graduationProgress: 30,
    },
    rebalanceInterval: 72,
    stopLossPercent: 10,
    takeProfitPercent: 30,
  },
  BALANCED: {
    type: "BALANCED",
    minConfidence: 0.7,
    maxTradeAmount: "0.05",
    allowedRiskLevels: ["LOW", "MEDIUM"],
    tokenCriteria: {
      minMarketCap: "5",
      minHolders: 20,
      minAge: 12,
      graduationProgress: 15,
    },
    rebalanceInterval: 24,
    stopLossPercent: 20,
    takeProfitPercent: 50,
  },
  AGGRESSIVE: {
    type: "AGGRESSIVE",
    minConfidence: 0.5,
    maxTradeAmount: "0.1",
    allowedRiskLevels: ["LOW", "MEDIUM", "HIGH"],
    tokenCriteria: {
      minHolders: 5,
      minAge: 1,
    },
    rebalanceInterval: 6,
    stopLossPercent: 35,
    takeProfitPercent: 100,
  },
};

export function classifyUserStrategy(analysis: UserXAnalysis): StrategyConfig {
  let riskScore = 0;

  // Account maturity (older = more conservative)
  if (analysis.accountAge > 365) riskScore += 1;
  else if (analysis.accountAge < 90) riskScore -= 1;

  // Crypto involvement (higher = more aggressive)
  if (analysis.cryptoMentionRate > 0.5) riskScore += 2;
  else if (analysis.cryptoMentionRate > 0.2) riskScore += 1;

  // Engagement (active users may be more experienced)
  if (analysis.engagementRate > 0.05) riskScore += 1;

  // Direct indicators
  if (analysis.riskTolerance === "high") riskScore += 2;
  else if (analysis.riskTolerance === "low") riskScore -= 2;

  if (analysis.tradingExperience === "advanced") riskScore += 1;
  else if (analysis.tradingExperience === "beginner") riskScore -= 1;

  // Interests (degen culture = aggressive)
  const aggressiveTerms = ["degen", "ape", "moon", "100x", "gem"];
  const conservativeTerms = ["research", "fundamental", "longterm", "safety"];

  for (const interest of analysis.interests.map((i) => i.toLowerCase())) {
    if (aggressiveTerms.some((t) => interest.includes(t))) riskScore += 1;
    if (conservativeTerms.some((t) => interest.includes(t))) riskScore -= 1;
  }

  // Classify based on score
  if (riskScore >= 3) return STRATEGY_CONFIGS.AGGRESSIVE;
  if (riskScore <= -1) return STRATEGY_CONFIGS.CONSERVATIVE;
  return STRATEGY_CONFIGS.BALANCED;
}

export function getStrategyDescription(type: StrategyType): string {
  switch (type) {
    case "CONSERVATIVE":
      return "Low risk, established tokens only. Small position sizes with tight stop-losses.";
    case "BALANCED":
      return "Moderate risk with a mix of established and newer tokens. Standard position sizing.";
    case "AGGRESSIVE":
      return "High risk, including new and trending tokens. Larger positions with wider stop-losses.";
  }
}
