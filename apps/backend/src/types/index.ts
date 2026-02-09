import { z } from 'zod';

// X Analysis result schema
export const XAnalysisSchema = z.object({
  followerCount: z.number(),
  followingCount: z.number(),
  tweetCount: z.number(),
  accountAge: z.number(), // days
  cryptoMentionRate: z.number(), // 0-1
  engagementRate: z.number(),
  riskTolerance: z.enum(['low', 'medium', 'high']),
  tradingExperience: z.enum(['beginner', 'intermediate', 'advanced']),
  interests: z.array(z.string()),
  reasoning: z.string().optional(),
});

export type XAnalysis = z.infer<typeof XAnalysisSchema>;

// Strategy config
export interface StrategyConfig {
  type: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';
  minConfidence: number;
  maxTradeAmount: string;
  allowedRiskLevels: ('LOW' | 'MEDIUM' | 'HIGH')[];
  tokenCriteria: {
    minMarketCap?: string;
    minHolders?: number;
    minAge?: number;
    graduationProgress?: number;
  };
  rebalanceInterval: number;
  stopLossPercent: number;
  takeProfitPercent: number;
}

export const STRATEGY_CONFIGS: Record<string, StrategyConfig> = {
  CONSERVATIVE: {
    type: 'CONSERVATIVE',
    minConfidence: 0.85,
    maxTradeAmount: '0.01',
    allowedRiskLevels: ['LOW'],
    tokenCriteria: {
      minMarketCap: '10',
      minHolders: 50,
      minAge: 48,
      graduationProgress: 30,
    },
    rebalanceInterval: 72,
    stopLossPercent: 10,
    takeProfitPercent: 30,
  },
  BALANCED: {
    type: 'BALANCED',
    minConfidence: 0.7,
    maxTradeAmount: '0.05',
    allowedRiskLevels: ['LOW', 'MEDIUM'],
    tokenCriteria: {
      minMarketCap: '5',
      minHolders: 20,
      minAge: 12,
      graduationProgress: 15,
    },
    rebalanceInterval: 24,
    stopLossPercent: 20,
    takeProfitPercent: 50,
  },
  AGGRESSIVE: {
    type: 'AGGRESSIVE',
    minConfidence: 0.5,
    maxTradeAmount: '0.1',
    allowedRiskLevels: ['LOW', 'MEDIUM', 'HIGH'],
    tokenCriteria: {
      minHolders: 5,
      minAge: 1,
    },
    rebalanceInterval: 6,
    stopLossPercent: 35,
    takeProfitPercent: 100,
  },
};

// API request/response schemas
export const CreateUserSchema = z.object({
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  vaultAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/)
    .optional(),
});

export const UpdateStrategySchema = z.object({
  strategyType: z.enum(['CONSERVATIVE', 'BALANCED', 'AGGRESSIVE']).optional(),
  autoTrade: z.boolean().optional(),
  autoRebalance: z.boolean().optional(),
  rebalanceInterval: z.number().min(1).max(168).optional(),
  stopLossPercent: z.number().min(1).max(50).optional(),
  takeProfitPercent: z.number().min(10).max(500).optional(),
});

export const AnalyzeXSchema = z.object({
  xHandle: z.string().min(1).max(50),
});

export const RecordTradeSchema = z.object({
  tokenAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
  tokenSymbol: z.string(),
  action: z.enum(['BUY', 'SELL']),
  amountIn: z.string(),
  amountOut: z.string(),
  priceAtTrade: z.string(),
  confidence: z.number().min(0).max(1),
  signalSource: z.string().optional(),
  reasoning: z.string().optional(),
  txHash: z.string().optional(),
});

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateStrategyInput = z.infer<typeof UpdateStrategySchema>;
export type AnalyzeXInput = z.infer<typeof AnalyzeXSchema>;
export type RecordTradeInput = z.infer<typeof RecordTradeSchema>;
