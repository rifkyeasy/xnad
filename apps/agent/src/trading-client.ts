/**
 * Trading Client for nad.fun
 * Uses nad.fun SDK for all trading operations
 */

import { getNadFunClient } from './nadfun-client.js';
import { ENV, TRADING_CONFIG } from './config.js';
import { log } from './logger.js';
import type { TradeSignal } from './ai-analyzer.js';

export interface TradeResult {
  success: boolean;
  txHash?: string;
  error?: string;
  tokenAddress: string;
  action: 'buy' | 'sell';
  amountIn: string;
  amountOut?: string;
}

export interface TradingClient {
  readonly address: string;
  getBalance(): Promise<string>;
  getTokenBalance(token: string): Promise<string>;
  executeBuy(signal: TradeSignal): Promise<TradeResult>;
  executeSell(tokenAddress: string, amount: string): Promise<TradeResult>;
  getQuote(token: string, amountIn: string, isBuy: boolean): Promise<{ amount: string }>;
}

/**
 * nad.fun Trading Client - uses real nad.fun bonding curves
 */
class NadFunTradingClient implements TradingClient {
  private client = getNadFunClient();

  get address(): string {
    return this.client.walletAddress;
  }

  async getBalance(): Promise<string> {
    return this.client.getMonBalance();
  }

  async getTokenBalance(token: string): Promise<string> {
    return this.client.getBalance(token);
  }

  async executeBuy(signal: TradeSignal): Promise<TradeResult> {
    if (!signal.tokenAddress) {
      return {
        success: false,
        error: 'No token address provided',
        tokenAddress: '',
        action: 'buy',
        amountIn: '0',
      };
    }

    // Cap at max buy amount
    const requestedAmount = parseFloat(signal.suggestedAmount || '0.01');
    const maxAmount = parseFloat(TRADING_CONFIG.maxBuyAmount);
    const amount = Math.min(requestedAmount, maxAmount).toString();

    log.info(`--- Buying via nad.fun ---`);
    log.info(`Token: ${signal.tokenAddress}`);
    log.info(`Amount: ${amount} MON`);
    log.info(`Confidence: ${(signal.confidence * 100).toFixed(0)}%`);

    if (ENV.DRY_RUN) {
      log.info(`[DRY RUN] Would buy ${amount} MON worth of ${signal.tokenAddress}`);
      return {
        success: true,
        txHash: '0xDRY_RUN',
        tokenAddress: signal.tokenAddress,
        action: 'buy',
        amountIn: amount,
      };
    }

    try {
      // Get quote first
      const quote = await this.client.getQuote(signal.tokenAddress, amount, true);
      log.info(`Expected tokens: ${quote.amount}`);

      const result = await this.client.buy({
        token: signal.tokenAddress,
        amountIn: amount,
        slippagePercent: TRADING_CONFIG.slippagePercent,
      });

      return {
        success: result.success,
        txHash: result.txHash,
        error: result.error,
        tokenAddress: signal.tokenAddress,
        action: 'buy',
        amountIn: amount,
        amountOut: quote.amount,
      };
    } catch (error) {
      log.error('Buy failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tokenAddress: signal.tokenAddress,
        action: 'buy',
        amountIn: amount,
      };
    }
  }

  async executeSell(tokenAddress: string, amount: string): Promise<TradeResult> {
    log.info(`--- Selling via nad.fun ---`);
    log.info(`Token: ${tokenAddress}`);
    log.info(`Amount: ${amount} tokens`);

    if (ENV.DRY_RUN) {
      log.info(`[DRY RUN] Would sell ${amount} tokens`);
      return {
        success: true,
        txHash: '0xDRY_RUN',
        tokenAddress,
        action: 'sell',
        amountIn: amount,
      };
    }

    try {
      // Get quote first
      const quote = await this.client.getQuote(tokenAddress, amount, false);
      log.info(`Expected MON: ${quote.amount}`);

      const result = await this.client.sell({
        token: tokenAddress,
        amountIn: amount,
        slippagePercent: TRADING_CONFIG.slippagePercent,
      });

      return {
        success: result.success,
        txHash: result.txHash,
        error: result.error,
        tokenAddress,
        action: 'sell',
        amountIn: amount,
        amountOut: quote.amount,
      };
    } catch (error) {
      log.error('Sell failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        tokenAddress,
        action: 'sell',
        amountIn: amount,
      };
    }
  }

  async getQuote(token: string, amountIn: string, isBuy: boolean): Promise<{ amount: string }> {
    const quote = await this.client.getQuote(token, amountIn, isBuy);
    return { amount: quote.amount };
  }
}

// Singleton instance
let tradingClient: TradingClient | null = null;

/**
 * Get the trading client (singleton)
 */
export function getTradingClient(): TradingClient {
  if (!tradingClient) {
    log.info('Initializing nad.fun trading client...');
    tradingClient = new NadFunTradingClient();
  }
  return tradingClient;
}
