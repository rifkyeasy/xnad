import type { StrategyConfig } from "./strategy-classifier.js";
import type { Position } from "./sell-manager.js";
import type { TargetAllocation } from "./rebalancer.js";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001";

export interface User {
  id: string;
  walletAddress: string;
  vaultAddress: string | null;
  xHandle: string | null;
  strategyType: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
  confidenceThreshold: number;
  maxTradeAmount: number;
  autoTrade: boolean;
  autoRebalance: boolean;
  rebalanceInterval: number;
  stopLossPercent: number | null;
  takeProfitPercent: number | null;
  positions: Position[];
}

export interface TradeRecord {
  tokenAddress: string;
  tokenSymbol: string;
  action: "BUY" | "SELL";
  amountIn: string;
  amountOut: string;
  priceAtTrade: string;
  confidence: number;
  signalSource?: string;
  reasoning?: string;
  txHash?: string;
}

export class BackendClient {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || BACKEND_URL;
  }

  private async request<T>(
    path: string,
    options?: RequestInit
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Backend error (${response.status}): ${error}`);
    }

    return response.json() as Promise<T>;
  }

  // Get all active users for agent loop
  async getActiveUsers(): Promise<User[]> {
    return this.request<User[]>("/api/agent/users");
  }

  // Get user by wallet address
  async getUser(walletAddress: string): Promise<User | null> {
    try {
      return await this.request<User>(`/api/users/${walletAddress}`);
    } catch {
      return null;
    }
  }

  // Create or update user
  async createUser(walletAddress: string, vaultAddress?: string): Promise<User> {
    return this.request<User>("/api/users", {
      method: "POST",
      body: JSON.stringify({ walletAddress, vaultAddress }),
    });
  }

  // Update user strategy
  async updateStrategy(
    walletAddress: string,
    updates: Partial<{
      strategyType: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
      autoTrade: boolean;
      autoRebalance: boolean;
      rebalanceInterval: number;
      stopLossPercent: number;
      takeProfitPercent: number;
    }>
  ): Promise<User> {
    return this.request<User>(`/api/users/${walletAddress}/strategy`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
  }

  // Record a trade
  async recordTrade(walletAddress: string, trade: TradeRecord): Promise<void> {
    await this.request(`/api/trades/${walletAddress}`, {
      method: "POST",
      body: JSON.stringify(trade),
    });
  }

  // Get user positions
  async getPositions(walletAddress: string): Promise<Position[]> {
    return this.request<Position[]>(`/api/positions/${walletAddress}`);
  }

  // Get portfolio summary
  async getPortfolioSummary(walletAddress: string): Promise<{
    totalValue: string;
    totalCostBasis: string;
    totalPnl: string;
    totalPnlPct: number;
    positionCount: number;
  }> {
    return this.request(`/api/positions/${walletAddress}/summary`);
  }

  // Get trade history
  async getTrades(
    walletAddress: string,
    limit = 50
  ): Promise<TradeRecord[]> {
    return this.request(`/api/trades/${walletAddress}?limit=${limit}`);
  }

  // Get trade stats
  async getTradeStats(walletAddress: string): Promise<{
    totalTrades: number;
    buyCount: number;
    sellCount: number;
    avgConfidence: number;
  }> {
    return this.request(`/api/trades/${walletAddress}/stats`);
  }

  // Analyze X account
  async analyzeXAccount(
    walletAddress: string,
    xHandle: string
  ): Promise<{
    user: User;
    analysis: Record<string, unknown>;
    recommendedStrategy: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
  }> {
    return this.request(`/api/users/${walletAddress}/analyze-x`, {
      method: "POST",
      body: JSON.stringify({ xHandle }),
    });
  }
}

// Singleton instance
let backendClient: BackendClient | null = null;

export function getBackendClient(): BackendClient {
  if (!backendClient) {
    backendClient = new BackendClient();
  }
  return backendClient;
}
