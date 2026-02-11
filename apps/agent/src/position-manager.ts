/**
 * Position Manager
 * Fetches and manages positions from indexer, calculates P&L with current prices
 */

import type { Position } from './sell-manager.js';
import { getNadFunClient } from './nadfun-client.js';
import { formatEther, parseEther } from 'viem';

// Indexer API URL
const INDEXER_URL = process.env.INDEXER_URL || 'https://indexer.xnad.fun';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'https://api.xnad.fun';

// Position data from indexer
interface IndexerPosition {
  id: string;
  vaultId: string;
  token: string;
  balance: string; // bigint as string
  totalBought: string;
  totalSold: string;
  totalCostBasis: string;
  totalProceeds: string;
  realizedPnl: string;
  buyCount: number;
  sellCount: number;
  firstTradeAt: string;
  lastTradeAt: string;
}

// Vault data from indexer
interface IndexerVault {
  id: string;
  owner: string;
  agent: string | null;
  strategyType: number;
  maxTradeAmount: string;
  paused: boolean;
  balance: string;
  totalDeposited: string;
  totalWithdrawn: string;
  tradeCount: number;
  createdAt: string;
}

export interface VaultWithPositions {
  vault: IndexerVault;
  positions: Position[];
  vaultBalance: string;
}

export class PositionManager {
  private nadFunClient = getNadFunClient();
  private priceCache: Map<string, { price: string; timestamp: number }> = new Map();
  private priceCacheTtl = 30000; // 30 seconds

  /**
   * Fetch all active vaults from indexer
   */
  async getActiveVaults(): Promise<IndexerVault[]> {
    try {
      const res = await fetch(`${INDEXER_URL}/vaults/active`);
      if (!res.ok) {
        console.error('Failed to fetch vaults from indexer:', res.status);
        return this.getVaultsFromBackend();
      }
      return (await res.json()) as IndexerVault[];
    } catch (error) {
      console.error('Indexer not available, falling back to backend:', error);
      return this.getVaultsFromBackend();
    }
  }

  /**
   * Fallback: Get vaults from backend
   */
  private async getVaultsFromBackend(): Promise<IndexerVault[]> {
    try {
      const res = await fetch(`${BACKEND_URL}/api/agent/users`);
      if (!res.ok) return [];

      const users = (await res.json()) as Array<{
        vaultAddress?: string;
        walletAddress: string;
        strategyType?: string;
      }>;

      // Convert backend users to vault format
      return users
        .filter((u) => u.vaultAddress)
        .map((u) => ({
          id: u.vaultAddress!.toLowerCase(),
          owner: u.walletAddress.toLowerCase(),
          agent: null,
          strategyType: u.strategyType === 'CONSERVATIVE' ? 0 : u.strategyType === 'AGGRESSIVE' ? 2 : 1,
          maxTradeAmount: '50000000000000000', // 0.05 MON default
          paused: false,
          balance: '0',
          totalDeposited: '0',
          totalWithdrawn: '0',
          tradeCount: 0,
          createdAt: '0',
        }));
    } catch {
      return [];
    }
  }

  /**
   * Fetch positions for a vault from indexer
   */
  async getVaultPositions(vaultAddress: string): Promise<IndexerPosition[]> {
    try {
      const res = await fetch(`${INDEXER_URL}/vaults/${vaultAddress}/positions`);
      if (!res.ok) {
        console.error('Failed to fetch positions from indexer:', res.status);
        return this.getPositionsFromBackend(vaultAddress);
      }
      return (await res.json()) as IndexerPosition[];
    } catch (error) {
      console.error('Indexer not available, falling back to backend:', error);
      return this.getPositionsFromBackend(vaultAddress);
    }
  }

  /**
   * Fallback: Get positions from backend
   */
  private async getPositionsFromBackend(vaultAddress: string): Promise<IndexerPosition[]> {
    try {
      // Find user by vault address
      const res = await fetch(`${BACKEND_URL}/api/positions/${vaultAddress}`);
      if (!res.ok) return [];

      const positions = (await res.json()) as Array<{
        tokenAddress: string;
        tokenSymbol?: string;
        balance?: string;
        costBasis?: string;
      }>;

      // Convert backend positions to indexer format
      return positions.map((p) => ({
        id: `${vaultAddress}-${p.tokenAddress}`.toLowerCase(),
        vaultId: vaultAddress.toLowerCase(),
        token: p.tokenAddress.toLowerCase(),
        balance: parseEther(p.balance || '0').toString(),
        totalBought: parseEther(p.balance || '0').toString(),
        totalSold: '0',
        totalCostBasis: parseEther(p.costBasis || '0').toString(),
        totalProceeds: '0',
        realizedPnl: '0',
        buyCount: 1,
        sellCount: 0,
        firstTradeAt: '0',
        lastTradeAt: '0',
      }));
    } catch {
      return [];
    }
  }

  /**
   * Get current price for a token (with caching)
   */
  async getCurrentPrice(tokenAddress: string): Promise<string> {
    const cached = this.priceCache.get(tokenAddress);
    if (cached && Date.now() - cached.timestamp < this.priceCacheTtl) {
      return cached.price;
    }

    try {
      // Get quote for 1 MON worth of tokens
      const quote = await this.nadFunClient.getQuote(tokenAddress, '0.01', true);
      const tokensPerMon = parseFloat(quote.amount);

      if (tokensPerMon > 0) {
        // Price per token in MON
        const pricePerToken = (0.01 / tokensPerMon).toFixed(18);
        this.priceCache.set(tokenAddress, { price: pricePerToken, timestamp: Date.now() });
        return pricePerToken;
      }
    } catch (error) {
      console.error(`Failed to get price for ${tokenAddress}:`, error);
    }

    return '0';
  }

  /**
   * Get token symbol (with caching)
   */
  private symbolCache: Map<string, string> = new Map();

  async getTokenSymbol(tokenAddress: string): Promise<string> {
    const cached = this.symbolCache.get(tokenAddress);
    if (cached) return cached;

    try {
      const metadata = await this.nadFunClient.getTokenMetadata(tokenAddress);
      this.symbolCache.set(tokenAddress, metadata.symbol);
      return metadata.symbol;
    } catch {
      return tokenAddress.slice(0, 6);
    }
  }

  /**
   * Convert indexer position to Position with current prices
   */
  async enrichPosition(indexerPos: IndexerPosition): Promise<Position> {
    const balance = formatEther(BigInt(indexerPos.balance));
    const costBasis = formatEther(BigInt(indexerPos.totalCostBasis));
    const totalBought = BigInt(indexerPos.totalBought);

    // Calculate average entry price
    const entryPrice =
      totalBought > 0n
        ? formatEther((BigInt(indexerPos.totalCostBasis) * parseEther('1')) / totalBought)
        : '0';

    // Get current price
    const currentPrice = await this.getCurrentPrice(indexerPos.token);
    const currentValue = (parseFloat(balance) * parseFloat(currentPrice)).toFixed(18);

    // Get symbol
    const tokenSymbol = await this.getTokenSymbol(indexerPos.token);

    return {
      tokenAddress: indexerPos.token,
      tokenSymbol,
      balance,
      costBasis,
      entryPrice,
      currentPrice,
      currentValue,
    };
  }

  /**
   * Get vault with enriched positions
   */
  async getVaultWithPositions(vaultAddress: string): Promise<VaultWithPositions | null> {
    try {
      // Fetch vault from indexer
      const vaultRes = await fetch(`${INDEXER_URL}/vaults/${vaultAddress}`);
      if (!vaultRes.ok) {
        console.error('Vault not found:', vaultAddress);
        return null;
      }
      const vault = (await vaultRes.json()) as IndexerVault;

      // Fetch positions
      const indexerPositions = await this.getVaultPositions(vaultAddress);

      // Enrich positions with current prices
      const positions: Position[] = [];
      for (const pos of indexerPositions) {
        if (BigInt(pos.balance) > 0n) {
          const enriched = await this.enrichPosition(pos);
          positions.push(enriched);
        }
      }

      return {
        vault,
        positions,
        vaultBalance: formatEther(BigInt(vault.balance)),
      };
    } catch (error) {
      console.error('Error fetching vault with positions:', error);
      return null;
    }
  }

  /**
   * Get all vaults with their positions (for agent loop)
   */
  async getAllVaultsWithPositions(): Promise<VaultWithPositions[]> {
    const vaults = await this.getActiveVaults();
    const results: VaultWithPositions[] = [];

    for (const vault of vaults) {
      if (vault.paused) continue;

      try {
        const indexerPositions = await this.getVaultPositions(vault.id);

        // Enrich positions with current prices
        const positions: Position[] = [];
        for (const pos of indexerPositions) {
          if (BigInt(pos.balance) > 0n) {
            const enriched = await this.enrichPosition(pos);
            positions.push(enriched);
          }
        }

        results.push({
          vault,
          positions,
          vaultBalance: formatEther(BigInt(vault.balance)),
        });
      } catch (error) {
        console.error(`Error processing vault ${vault.id}:`, error);
      }
    }

    return results;
  }

  /**
   * Sync position to backend database
   */
  async syncPositionToBackend(
    walletAddress: string,
    position: Position,
    unrealizedPnl: string,
    unrealizedPnlPct: number
  ): Promise<void> {
    try {
      await fetch(`${BACKEND_URL}/api/positions/${walletAddress}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenAddress: position.tokenAddress,
          tokenSymbol: position.tokenSymbol,
          balance: position.balance,
          costBasis: position.costBasis,
          currentValue: position.currentValue,
          unrealizedPnl,
          unrealizedPnlPct,
        }),
      });
    } catch (error) {
      console.error('Failed to sync position to backend:', error);
    }
  }

  /**
   * Calculate unrealized P&L for a position
   */
  calculateUnrealizedPnl(position: Position): { pnl: string; pnlPct: number } {
    const costBasis = parseFloat(position.costBasis);
    const currentValue = parseFloat(position.currentValue);

    const pnl = currentValue - costBasis;
    const pnlPct = costBasis > 0 ? (pnl / costBasis) * 100 : 0;

    return {
      pnl: pnl.toFixed(18),
      pnlPct,
    };
  }

  /**
   * Get position summary for a vault
   */
  getPositionSummary(positions: Position[]): {
    totalValue: number;
    totalCostBasis: number;
    totalUnrealizedPnl: number;
    totalUnrealizedPnlPct: number;
    positionCount: number;
  } {
    const totalValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
    const totalCostBasis = positions.reduce((sum, p) => sum + parseFloat(p.costBasis), 0);
    const totalUnrealizedPnl = totalValue - totalCostBasis;
    const totalUnrealizedPnlPct = totalCostBasis > 0 ? (totalUnrealizedPnl / totalCostBasis) * 100 : 0;

    return {
      totalValue,
      totalCostBasis,
      totalUnrealizedPnl,
      totalUnrealizedPnlPct,
      positionCount: positions.length,
    };
  }
}

// Singleton instance
let positionManager: PositionManager | null = null;

export function getPositionManager(): PositionManager {
  if (!positionManager) {
    positionManager = new PositionManager();
  }
  return positionManager;
}
