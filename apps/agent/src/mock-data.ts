/**
 * Mock data for testnet development
 * These addresses are fictional and used for testing the flow
 */

import type { TradeSignal } from "./ai-analyzer.js";

// Mock token addresses - DEPLOYED ON MONAD TESTNET
export const MOCK_TOKENS = [
  {
    address: "0x700d18196d14244FcD7e9D87d5bBF5DE3c33B0e8" as const,
    symbol: "MONAD",
    name: "Monad Token",
    description: "The native Monad community token",
    imageUri: "https://picsum.photos/seed/monad/200",
    twitter: "monad_xyz",
    price: "0.0015",
    change24h: 12.5,
    marketCap: "250000",
    volume24h: "45000",
    riskLevel: "low" as const,
  },
  {
    address: "0xCaBFa324576c655D0276647A7f0aF5e779123e0B" as const,
    symbol: "NADS",
    name: "Nads Token",
    description: "Community token for nad.fun degens",
    imageUri: "https://picsum.photos/seed/nads/200",
    twitter: "nad_fun",
    price: "0.00085",
    change24h: 45.2,
    marketCap: "120000",
    volume24h: "78000",
    riskLevel: "medium" as const,
  },
  {
    address: "0x8E304Ae201FF805eeEaa629b069289b94376F52F" as const,
    symbol: "DEGEN",
    name: "Degen Mode",
    description: "For the true degens only",
    imageUri: "https://picsum.photos/seed/degen/200",
    twitter: "degenmode_xyz",
    price: "0.00023",
    change24h: 156.8,
    marketCap: "45000",
    volume24h: "120000",
    riskLevel: "high" as const,
  },
  {
    address: "0x9dAf66b75d348D4f90B125a282bBFA608Ecec13C" as const,
    symbol: "PURP",
    name: "Purple Pill",
    description: "Take the purple pill and enter Monad",
    imageUri: "https://picsum.photos/seed/purp/200",
    twitter: "purplepill_mon",
    price: "0.0042",
    change24h: 8.3,
    marketCap: "380000",
    volume24h: "25000",
    riskLevel: "low" as const,
  },
  {
    address: "0xA8adEFE2C8f0F71a585a73c1259997f593F9e463" as const,
    symbol: "CHAD",
    name: "Monad Chad",
    description: "The ultimate chad token",
    imageUri: "https://picsum.photos/seed/chad/200",
    twitter: "MonadChad",
    price: "0.00067",
    change24h: -5.2,
    marketCap: "95000",
    volume24h: "32000",
    riskLevel: "medium" as const,
  },
] as const;

export type MockToken = (typeof MOCK_TOKENS)[number];

// Mock trade signals based on strategy
export function getMockSignals(strategyType: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE"): TradeSignal[] {
  const signals: TradeSignal[] = [];

  switch (strategyType) {
    case "CONSERVATIVE":
      // Only low risk tokens with high confidence
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[0].address,
        tokenSymbol: MOCK_TOKENS[0].symbol,
        confidence: 0.92,
        reasoning: "MONAD is a well-established community token with strong backing and low volatility.",
        riskLevel: "low",
        suggestedAmount: "0.01",
      });
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[3].address,
        tokenSymbol: MOCK_TOKENS[3].symbol,
        confidence: 0.88,
        reasoning: "PURP shows consistent growth with low risk profile, suitable for conservative portfolio.",
        riskLevel: "low",
        suggestedAmount: "0.01",
      });
      break;

    case "BALANCED":
      // Mix of low and medium risk
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[0].address,
        tokenSymbol: MOCK_TOKENS[0].symbol,
        confidence: 0.85,
        reasoning: "MONAD is a stable foundation for a balanced portfolio.",
        riskLevel: "low",
        suggestedAmount: "0.03",
      });
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[1].address,
        tokenSymbol: MOCK_TOKENS[1].symbol,
        confidence: 0.78,
        reasoning: "NADS shows strong momentum with moderate risk, good for balanced growth.",
        riskLevel: "medium",
        suggestedAmount: "0.02",
      });
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[4].address,
        tokenSymbol: MOCK_TOKENS[4].symbol,
        confidence: 0.72,
        reasoning: "CHAD has community support and moderate risk profile.",
        riskLevel: "medium",
        suggestedAmount: "0.02",
      });
      break;

    case "AGGRESSIVE":
      // All risk levels including high
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[2].address,
        tokenSymbol: MOCK_TOKENS[2].symbol,
        confidence: 0.65,
        reasoning: "DEGEN is pumping hard with 156% gains. High risk, high reward play.",
        riskLevel: "high",
        suggestedAmount: "0.05",
      });
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[1].address,
        tokenSymbol: MOCK_TOKENS[1].symbol,
        confidence: 0.58,
        reasoning: "NADS is gaining momentum. Early entry potential.",
        riskLevel: "medium",
        suggestedAmount: "0.03",
      });
      signals.push({
        action: "buy",
        tokenAddress: MOCK_TOKENS[4].address,
        tokenSymbol: MOCK_TOKENS[4].symbol,
        confidence: 0.52,
        reasoning: "CHAD is dipping but could bounce. Speculative play.",
        riskLevel: "medium",
        suggestedAmount: "0.02",
      });
      break;
  }

  return signals;
}

// Mock user X analysis results
export interface MockXAnalysis {
  xHandle: string;
  followerCount: number;
  followingCount: number;
  tweetCount: number;
  profileAnalysis: {
    cryptoExperience: "beginner" | "intermediate" | "advanced";
    riskTolerance: "low" | "medium" | "high";
    tradingStyle: "holder" | "swing" | "degen";
    interests: string[];
  };
  recommendedStrategy: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
  confidence: number;
  reasoning: string;
}

export function getMockXAnalysis(xHandle: string): MockXAnalysis {
  // Generate deterministic mock data based on handle
  const hash = xHandle.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const variant = hash % 3;

  const analyses: MockXAnalysis[] = [
    {
      xHandle,
      followerCount: 1250,
      followingCount: 420,
      tweetCount: 3500,
      profileAnalysis: {
        cryptoExperience: "beginner",
        riskTolerance: "low",
        tradingStyle: "holder",
        interests: ["DeFi", "NFTs", "Community"],
      },
      recommendedStrategy: "CONSERVATIVE",
      confidence: 0.88,
      reasoning: "Your profile shows cautious engagement with crypto. You prefer established projects and long-term holds. Conservative strategy recommended for steady growth.",
    },
    {
      xHandle,
      followerCount: 5420,
      followingCount: 890,
      tweetCount: 12500,
      profileAnalysis: {
        cryptoExperience: "intermediate",
        riskTolerance: "medium",
        tradingStyle: "swing",
        interests: ["Trading", "Memecoins", "Monad"],
      },
      recommendedStrategy: "BALANCED",
      confidence: 0.82,
      reasoning: "Your profile shows active crypto engagement with balanced approach. You follow trends but maintain some caution. Balanced strategy recommended for growth with managed risk.",
    },
    {
      xHandle,
      followerCount: 15200,
      followingCount: 2100,
      tweetCount: 45000,
      profileAnalysis: {
        cryptoExperience: "advanced",
        riskTolerance: "high",
        tradingStyle: "degen",
        interests: ["Degen Plays", "New Launches", "High Risk"],
      },
      recommendedStrategy: "AGGRESSIVE",
      confidence: 0.75,
      reasoning: "Your profile shows degen energy with high activity in new launches. You're comfortable with volatility and chase high returns. Aggressive strategy recommended for maximum upside.",
    },
  ];

  return analyses[variant];
}

// Mock positions for dashboard
export interface MockPosition {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  costBasis: string;
  currentValue: string;
  pnl: string;
  pnlPercent: number;
}

export function getMockPositions(): MockPosition[] {
  return [
    {
      tokenAddress: MOCK_TOKENS[0].address,
      tokenSymbol: MOCK_TOKENS[0].symbol,
      balance: "6666.67",
      costBasis: "0.01",
      currentValue: "0.01125",
      pnl: "0.00125",
      pnlPercent: 12.5,
    },
    {
      tokenAddress: MOCK_TOKENS[1].address,
      tokenSymbol: MOCK_TOKENS[1].symbol,
      balance: "5882.35",
      costBasis: "0.005",
      currentValue: "0.00725",
      pnl: "0.00225",
      pnlPercent: 45.2,
    },
    {
      tokenAddress: MOCK_TOKENS[3].address,
      tokenSymbol: MOCK_TOKENS[3].symbol,
      balance: "2380.95",
      costBasis: "0.01",
      currentValue: "0.01083",
      pnl: "0.00083",
      pnlPercent: 8.3,
    },
  ];
}

// Simulated trade execution result
export interface MockTradeResult {
  success: boolean;
  txHash: string;
  tokenAddress: string;
  action: "buy" | "sell";
  amountIn: string;
  amountOut: string;
  executedAt: Date;
}

export function simulateTrade(
  tokenAddress: string,
  action: "buy" | "sell",
  amount: string
): MockTradeResult {
  const token = MOCK_TOKENS.find(t => t.address === tokenAddress) || MOCK_TOKENS[0];
  const amountOut = action === "buy"
    ? (parseFloat(amount) / parseFloat(token.price)).toFixed(2)
    : (parseFloat(amount) * parseFloat(token.price)).toFixed(6);

  // Generate a fake tx hash
  const fakeHash = `0x${Array.from({ length: 64 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('')}`;

  return {
    success: true,
    txHash: fakeHash,
    tokenAddress,
    action,
    amountIn: amount,
    amountOut,
    executedAt: new Date(),
  };
}
