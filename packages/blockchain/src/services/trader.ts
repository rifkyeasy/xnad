import type { Address } from 'viem';
import { TRADING_CONFIG } from '@cartel/config';
import {
  createLogger,
  applySlippage,
  type TradeResult,
  type Position,
  type PortfolioSummary,
} from '@cartel/shared';
import { getMonadClient } from '../clients/monad.js';
import { getNadFunClient } from '../clients/nadfun.js';

const logger = createLogger('trader');

export class TraderService {
  private positions: Map<Address, Position> = new Map();

  /**
   * Execute a buy order
   */
  async buy(params: {
    tokenAddress: Address;
    amountMon: bigint;
    slippageBps?: number;
  }): Promise<TradeResult> {
    const monad = getMonadClient();
    const nadfun = getNadFunClient();

    if (!monad.account) {
      throw new Error('Wallet not initialized');
    }

    const slippageBps = params.slippageBps || TRADING_CONFIG.SLIPPAGE.DEFAULT;

    try {
      logger.info('Executing buy order', {
        token: params.tokenAddress,
        amountMon: params.amountMon.toString(),
        slippageBps,
      });

      // Get quote
      const quote = await nadfun.getBuyQuote(params.tokenAddress, params.amountMon);

      // Apply slippage
      const minAmountOut = applySlippage(quote.amountOut, slippageBps);

      // Set deadline (5 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + TRADING_CONFIG.TRANSACTION.DEADLINE_MINUTES * 60;

      // Execute trade
      const txHash = await nadfun.buy({
        tokenAddress: params.tokenAddress,
        amountIn: params.amountMon,
        minAmountOut,
        recipient: monad.account.address,
        deadline,
      });

      // Wait for confirmation
      const receipt = await monad.waitForTransaction(txHash);

      if (receipt.status === 'reverted') {
        return {
          success: false,
          amountIn: params.amountMon,
          amountOut: 0n,
          effectivePrice: 0n,
          error: 'Transaction reverted',
        };
      }

      // Update position tracking
      this.updatePosition(params.tokenAddress, quote.amountOut, params.amountMon);

      return {
        success: true,
        txHash,
        amountIn: params.amountMon,
        amountOut: quote.amountOut,
        effectivePrice: (params.amountMon * 10n ** 18n) / quote.amountOut,
      };
    } catch (error) {
      logger.error('Buy order failed', { error });
      return {
        success: false,
        amountIn: params.amountMon,
        amountOut: 0n,
        effectivePrice: 0n,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a sell order
   */
  async sell(params: {
    tokenAddress: Address;
    amountTokens: bigint;
    slippageBps?: number;
  }): Promise<TradeResult> {
    const monad = getMonadClient();
    const nadfun = getNadFunClient();

    if (!monad.account) {
      throw new Error('Wallet not initialized');
    }

    const slippageBps = params.slippageBps || TRADING_CONFIG.SLIPPAGE.DEFAULT;

    try {
      logger.info('Executing sell order', {
        token: params.tokenAddress,
        amountTokens: params.amountTokens.toString(),
        slippageBps,
      });

      // Get quote
      const quote = await nadfun.getSellQuote(params.tokenAddress, params.amountTokens);

      // Apply slippage
      const minAmountOut = applySlippage(quote.amountOut, slippageBps);

      // Set deadline
      const deadline = Math.floor(Date.now() / 1000) + TRADING_CONFIG.TRANSACTION.DEADLINE_MINUTES * 60;

      // Execute trade
      const txHash = await nadfun.sell({
        tokenAddress: params.tokenAddress,
        amountIn: params.amountTokens,
        minAmountOut,
        recipient: monad.account.address,
        deadline,
      });

      // Wait for confirmation
      const receipt = await monad.waitForTransaction(txHash);

      if (receipt.status === 'reverted') {
        return {
          success: false,
          amountIn: params.amountTokens,
          amountOut: 0n,
          effectivePrice: 0n,
          error: 'Transaction reverted',
        };
      }

      return {
        success: true,
        txHash,
        amountIn: params.amountTokens,
        amountOut: quote.amountOut,
        effectivePrice: (quote.amountOut * 10n ** 18n) / params.amountTokens,
      };
    } catch (error) {
      logger.error('Sell order failed', { error });
      return {
        success: false,
        amountIn: params.amountTokens,
        amountOut: 0n,
        effectivePrice: 0n,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Execute a coordinated buy with multiple participants
   */
  async coordinatedBuy(params: {
    tokenAddress: Address;
    totalAmountMon: bigint;
    participants: Address[];
    slippageBps?: number;
  }): Promise<TradeResult[]> {
    const results: TradeResult[] = [];
    const amountPerParticipant = params.totalAmountMon / BigInt(params.participants.length);

    logger.info('Executing coordinated buy', {
      token: params.tokenAddress,
      totalAmount: params.totalAmountMon.toString(),
      participants: params.participants.length,
    });

    // Execute buys in parallel (simplified - actual would use different wallets)
    const buyPromises = params.participants.map(() =>
      this.buy({
        tokenAddress: params.tokenAddress,
        amountMon: amountPerParticipant,
        slippageBps: params.slippageBps,
      })
    );

    const buyResults = await Promise.allSettled(buyPromises);

    for (const result of buyResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        results.push({
          success: false,
          amountIn: amountPerParticipant,
          amountOut: 0n,
          effectivePrice: 0n,
          error: result.reason?.message || 'Unknown error',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    logger.info('Coordinated buy completed', {
      successful: successCount,
      total: params.participants.length,
    });

    return results;
  }

  /**
   * Update position tracking
   */
  private updatePosition(
    tokenAddress: Address,
    tokenAmount: bigint,
    costBasis: bigint
  ): void {
    const existing = this.positions.get(tokenAddress);

    if (existing) {
      existing.balance += tokenAmount;
      existing.costBasis += costBasis;
    } else {
      this.positions.set(tokenAddress, {
        tokenAddress,
        tokenSymbol: 'UNKNOWN', // Would be fetched from token info
        balance: tokenAmount,
        costBasis,
        currentValue: 0n,
        unrealizedPnl: 0n,
        unrealizedPnlPercent: 0,
        entryPrice: costBasis / tokenAmount,
        currentPrice: 0n,
      });
    }
  }

  /**
   * Get portfolio summary
   */
  async getPortfolio(): Promise<PortfolioSummary> {
    let totalValue = 0n;
    let totalCostBasis = 0n;
    const positions: Position[] = [];

    for (const position of this.positions.values()) {
      // TODO: Update current prices
      positions.push(position);
      totalValue += position.currentValue;
      totalCostBasis += position.costBasis;
    }

    return {
      totalValueMon: totalValue,
      totalCostBasis,
      totalUnrealizedPnl: totalValue - totalCostBasis,
      totalRealizedPnl: 0n, // TODO: Track realized PnL
      positions,
      lastUpdated: new Date(),
    };
  }
}

// Singleton
let _service: TraderService | null = null;

export function getTraderService(): TraderService {
  if (!_service) {
    _service = new TraderService();
  }
  return _service;
}
