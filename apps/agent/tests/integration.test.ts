/**
 * Integration Tests
 * Tests the complete trading flow from signal to execution
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getNadFunClient } from '../src/nadfun-client.js';
import { getTradingClient } from '../src/trading-client.js';
import { ENV, NADFUN_CONTRACTS, TRADING_CONFIG } from '../src/config.js';
import type { TradeSignal } from '../src/ai-analyzer.js';

// Test token created on nad.fun testnet
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';

describe('Integration Tests', () => {
  beforeAll(() => {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY required for integration tests');
    }
  });

  describe('Full Trading Flow', () => {
    it('should complete a full trading cycle (dry run)', async () => {
      // Force dry run
      const originalDryRun = ENV.DRY_RUN;
      (ENV as { DRY_RUN: boolean }).DRY_RUN = true;

      const client = getTradingClient();

      // Step 1: Check initial balance
      const initialBalance = await client.getBalance();
      console.log(`Initial MON Balance: ${initialBalance}`);
      expect(parseFloat(initialBalance)).toBeGreaterThan(0);

      // Step 2: Get token info
      const nadFunClient = getNadFunClient();
      const metadata = await nadFunClient.getTokenMetadata(TEST_TOKEN);
      console.log(`Token: ${metadata.symbol} (${metadata.name})`);
      expect(metadata.symbol).toBe('TAGT');

      // Step 3: Get buy quote
      const buyQuote = await client.getQuote(TEST_TOKEN, '0.01', true);
      console.log(`Buy Quote: 0.01 MON → ${buyQuote.amount} tokens`);
      expect(parseFloat(buyQuote.amount)).toBeGreaterThan(0);

      // Step 4: Execute buy (dry run)
      const buySignal: TradeSignal = {
        action: 'buy',
        tokenAddress: TEST_TOKEN,
        tokenSymbol: 'TAGT',
        confidence: 0.9,
        reasoning: 'Integration test buy',
        riskLevel: 'low',
        suggestedAmount: '0.01',
      };

      const buyResult = await client.executeBuy(buySignal);
      console.log(`Buy Result: ${buyResult.success ? 'SUCCESS' : 'FAILED'}`);
      expect(buyResult.success).toBe(true);
      expect(buyResult.txHash).toBe('0xDRY_RUN');

      // Step 5: Get sell quote
      const sellQuote = await client.getQuote(TEST_TOKEN, '100', false);
      console.log(`Sell Quote: 100 tokens → ${sellQuote.amount} MON`);
      expect(parseFloat(sellQuote.amount)).toBeGreaterThan(0);

      // Step 6: Execute sell (dry run)
      const sellResult = await client.executeSell(TEST_TOKEN, '100');
      console.log(`Sell Result: ${sellResult.success ? 'SUCCESS' : 'FAILED'}`);
      expect(sellResult.success).toBe(true);
      expect(sellResult.txHash).toBe('0xDRY_RUN');

      // Restore
      (ENV as { DRY_RUN: boolean }).DRY_RUN = originalDryRun;
    });
  });

  describe('Config Validation', () => {
    it('should have valid nad.fun contracts', () => {
      expect(NADFUN_CONTRACTS.bondingCurveRouter).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(NADFUN_CONTRACTS.dexRouter).toMatch(/^0x[a-fA-F0-9]{40}$/);
      expect(NADFUN_CONTRACTS.lens).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should have valid trading config', () => {
      expect(parseFloat(TRADING_CONFIG.maxBuyAmount)).toBeGreaterThan(0);
      expect(TRADING_CONFIG.slippagePercent).toBeGreaterThan(0);
      expect(TRADING_CONFIG.minConfidence).toBeGreaterThan(0);
      expect(TRADING_CONFIG.minConfidence).toBeLessThanOrEqual(1);
    });

    it('should have required env vars', () => {
      expect(ENV.RPC_URL).toBeDefined();
      expect(ENV.RPC_URL).toContain('monad');
    });
  });

  describe('Bonding Curve Integration', () => {
    it('should fetch curve state from nad.fun', async () => {
      const nadFunClient = getNadFunClient();

      // Test buy quote at different amounts
      const amounts = ['0.001', '0.01', '0.1'];

      for (const amount of amounts) {
        const quote = await nadFunClient.getQuote(TEST_TOKEN, amount, true);
        console.log(`${amount} MON → ${quote.amount} tokens (router: ${quote.router})`);
        expect(parseFloat(quote.amount)).toBeGreaterThan(0);
      }
    });

    it('should show price impact on larger trades', async () => {
      const nadFunClient = getNadFunClient();

      const smallQuote = await nadFunClient.getQuote(TEST_TOKEN, '0.01', true);
      const largeQuote = await nadFunClient.getQuote(TEST_TOKEN, '1', true);

      const smallPrice = 0.01 / parseFloat(smallQuote.amount);
      const largePrice = 1 / parseFloat(largeQuote.amount);

      console.log(`Small trade price: ${smallPrice.toFixed(10)} MON/token`);
      console.log(`Large trade price: ${largePrice.toFixed(10)} MON/token`);

      // Larger trades should have worse prices (higher price per token)
      expect(largePrice).toBeGreaterThan(smallPrice);
    });
  });
});
