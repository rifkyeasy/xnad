import type { Address } from 'viem';

export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  imageUri: string;
  twitter?: string;
  telegram?: string;
  website?: string;
}

export interface TokenInfo {
  address: Address;
  name: string;
  symbol: string;
  creator: Address;
  totalSupply: bigint;
  metadata: TokenMetadata;
  createdAt: Date;
}

export interface TokenMarket {
  tokenAddress: Address;
  reserveNative: bigint;
  reserveToken: bigint;
  virtualNative: bigint;
  virtualToken: bigint;
  currentPrice: bigint;
  marketCap: bigint;
  volume24h: bigint;
  priceChange24h: number;
  isGraduated: boolean;
  graduationProgress: number; // 0-100
}

export interface TokenHolder {
  address: Address;
  balance: bigint;
  percentage: number;
  isCreator: boolean;
  isCartelMember: boolean;
}

export interface TokenSwap {
  txHash: string;
  tokenAddress: Address;
  type: 'buy' | 'sell';
  amountIn: bigint;
  amountOut: bigint;
  trader: Address;
  timestamp: Date;
  priceImpact: number;
}

export interface TokenChartCandle {
  timestamp: number;
  open: bigint;
  high: bigint;
  low: bigint;
  close: bigint;
  volume: bigint;
}

export type ChartInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w';

export interface CreateTokenParams {
  name: string;
  symbol: string;
  tokenURI: string;
  amountOut: bigint;
  salt: `0x${string}`;
  actionId: number;
}

export interface TokenCreationResult {
  tokenAddress: Address;
  poolAddress: Address;
  txHash: string;
  createdAt: Date;
}
