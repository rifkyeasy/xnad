import type { Address } from 'viem';

export interface Quote {
  tokenAddress: Address;
  amountIn: bigint;
  amountOut: bigint;
  priceImpact: number;
  fee: bigint;
  route: 'bonding_curve' | 'dex';
}

export interface TradeParams {
  tokenAddress: Address;
  action: 'buy' | 'sell';
  amountIn?: bigint;
  amountOut?: bigint;
  slippageBps: number;
  recipient: Address;
  deadline: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amountIn: bigint;
  amountOut: bigint;
  effectivePrice: bigint;
  error?: string;
}

export interface Position {
  tokenAddress: Address;
  tokenSymbol: string;
  balance: bigint;
  costBasis: bigint;
  currentValue: bigint;
  unrealizedPnl: bigint;
  unrealizedPnlPercent: number;
  entryPrice: bigint;
  currentPrice: bigint;
}

export interface PortfolioSummary {
  totalValueMon: bigint;
  totalCostBasis: bigint;
  totalUnrealizedPnl: bigint;
  totalRealizedPnl: bigint;
  positions: Position[];
  lastUpdated: Date;
}

export interface TradeSignal {
  id: string;
  tokenAddress: Address;
  action: 'buy' | 'sell' | 'hold';
  confidence: number; // 0-1
  reason: string;
  suggestedAmount?: bigint;
  createdAt: Date;
  expiresAt: Date;
}

export interface MarketAnalysis {
  tokenAddress: Address;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  volumeTrend: 'increasing' | 'decreasing' | 'stable';
  holderTrend: 'growing' | 'shrinking' | 'stable';
  graduationEta?: Date;
  riskScore: number; // 0-100
  signals: TradeSignal[];
}
