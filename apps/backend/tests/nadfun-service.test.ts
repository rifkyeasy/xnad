/**
 * nad.fun Service Tests
 * Tests the backend nad.fun integration
 */

import { describe, it, expect } from 'vitest';
import {
  getNadFunTokenInfo,
  getQuote,
  getWalletBalances,
  getTokenBalance,
} from '../src/services/nadfun-service.js';

// Test token and wallet
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';
const TEST_WALLET = '0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5';

describe('NadFunService', () => {
  describe('getNadFunTokenInfo', () => {
    it('should fetch token info', async () => {
      const info = await getNadFunTokenInfo(TEST_TOKEN);

      expect(info).not.toBeNull();
      expect(info?.name).toBe('Test Agent Token');
      expect(info?.symbol).toBe('TAGT');
      expect(info?.decimals).toBe(18);
      expect(info?.address).toBe(TEST_TOKEN);

      console.log(`Token: ${info?.symbol} - ${info?.name}`);
      console.log(`Total Supply: ${info?.totalSupply}`);
    });

    it('should return null for invalid token', async () => {
      const info = await getNadFunTokenInfo('0x0000000000000000000000000000000000000001');
      expect(info).toBeNull();
    });
  });

  describe('getQuote', () => {
    it('should get buy quote with correct structure', async () => {
      const quote = await getQuote(TEST_TOKEN, '0.01', true);

      expect(quote.amountIn).toBe('0.01');
      expect(typeof quote.amountOut).toBe('string');
      expect(quote.isBuy).toBe(true);
      expect(quote.router).toMatch(/^0x[a-fA-F0-9]{40}$/);

      console.log(`Buy quote: ${quote.amountIn} MON → ${quote.amountOut} tokens`);
    });

    it('should get sell quote with correct structure', async () => {
      const quote = await getQuote(TEST_TOKEN, '1000', false);

      expect(quote.amountIn).toBe('1000');
      expect(typeof quote.amountOut).toBe('string');
      expect(quote.isBuy).toBe(false);
      expect(quote.router).toMatch(/^0x[a-fA-F0-9]{40}$/);

      console.log(`Sell quote: ${quote.amountIn} tokens → ${quote.amountOut} MON`);
    });
  });

  describe('getWalletBalances', () => {
    it('should get wallet MON balance', async () => {
      const balances = await getWalletBalances(TEST_WALLET);

      expect(balances.mon).toBeDefined();
      expect(parseFloat(balances.mon)).toBeGreaterThanOrEqual(0);

      console.log(`Wallet MON: ${balances.mon}`);
    });
  });

  describe('getTokenBalance', () => {
    it('should get token balance for wallet', async () => {
      const balance = await getTokenBalance(TEST_TOKEN, TEST_WALLET);

      expect(balance).toBeDefined();
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);

      console.log(`Token Balance: ${balance}`);
    });
  });
});
