/**
 * Trading Client Tests
 * Tests the trading flow with dry run mode
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';
import { getTradingClient, TradingClient } from '../src/trading-client.js';
import { ENV } from '../src/config.js';
import type { TradeSignal } from '../src/ai-analyzer.js';

// Test token
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';

describe('TradingClient', () => {
  let client: TradingClient;

  beforeAll(() => {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY required for tests');
    }
    client = getTradingClient();
  });

  describe('initialization', () => {
    it('should create trading client', () => {
      expect(client).toBeDefined();
      expect(client.address).toBeDefined();
      expect(client.address).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('balance', () => {
    it('should get MON balance', async () => {
      const balance = await client.getBalance();
      expect(balance).toBeDefined();
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
      console.log(`Balance: ${balance} MON`);
    });

    it('should get token balance', async () => {
      const balance = await client.getTokenBalance(TEST_TOKEN);
      expect(balance).toBeDefined();
      console.log(`Token Balance: ${balance}`);
    });
  });

  describe('quotes', () => {
    it('should get quote for buy', async () => {
      const quote = await client.getQuote(TEST_TOKEN, '0.01', true);
      expect(quote).toBeDefined();
      expect(parseFloat(quote.amount)).toBeGreaterThan(0);
    });

    it('should get quote for sell', async () => {
      const quote = await client.getQuote(TEST_TOKEN, '100', false);
      expect(quote).toBeDefined();
      expect(parseFloat(quote.amount)).toBeGreaterThan(0);
    });
  });

  describe('trade execution (dry run)', () => {
    // Enable dry run for tests
    beforeAll(() => {
      vi.stubEnv('DRY_RUN', 'true');
    });

    it('should handle buy with missing token address', async () => {
      const signal: TradeSignal = {
        action: 'buy',
        confidence: 0.8,
        reasoning: 'Test signal',
        riskLevel: 'low',
        suggestedAmount: '0.01',
      };

      const result = await client.executeBuy(signal);
      expect(result.success).toBe(false);
      expect(result.error).toBe('No token address provided');
    });

    it('should execute buy in dry run mode', async () => {
      // Force dry run
      const originalDryRun = ENV.DRY_RUN;
      (ENV as { DRY_RUN: boolean }).DRY_RUN = true;

      const signal: TradeSignal = {
        action: 'buy',
        tokenAddress: TEST_TOKEN,
        tokenSymbol: 'TAGT',
        confidence: 0.85,
        reasoning: 'Test buy signal',
        riskLevel: 'medium',
        suggestedAmount: '0.01',
      };

      const result = await client.executeBuy(signal);

      // Restore
      (ENV as { DRY_RUN: boolean }).DRY_RUN = originalDryRun;

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xDRY_RUN');
      expect(result.action).toBe('buy');
      expect(result.tokenAddress).toBe(TEST_TOKEN);
    });

    it('should execute sell in dry run mode', async () => {
      // Force dry run
      const originalDryRun = ENV.DRY_RUN;
      (ENV as { DRY_RUN: boolean }).DRY_RUN = true;

      const result = await client.executeSell(TEST_TOKEN, '100');

      // Restore
      (ENV as { DRY_RUN: boolean }).DRY_RUN = originalDryRun;

      expect(result.success).toBe(true);
      expect(result.txHash).toBe('0xDRY_RUN');
      expect(result.action).toBe('sell');
    });
  });
});
