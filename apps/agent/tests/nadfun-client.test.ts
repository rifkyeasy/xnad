/**
 * nad.fun Client Integration Tests
 * Tests the nad.fun SDK integration for token operations
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getNadFunClient, NadFunClient } from '../src/nadfun-client.js';
import { ENV } from '../src/config.js';

// Test token created on nad.fun testnet
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';

describe('NadFunClient', () => {
  let client: NadFunClient;

  beforeAll(() => {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY required for tests');
    }
    client = getNadFunClient();
  });

  describe('initialization', () => {
    it('should create client with wallet address', () => {
      expect(client.walletAddress).toBeDefined();
      expect(client.walletAddress).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });
  });

  describe('balance operations', () => {
    it('should get MON balance', async () => {
      const balance = await client.getMonBalance();
      expect(balance).toBeDefined();
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
      console.log(`MON Balance: ${balance}`);
    });

    it('should get token balance', async () => {
      const balance = await client.getBalance(TEST_TOKEN);
      expect(balance).toBeDefined();
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0);
      console.log(`Token Balance: ${balance}`);
    });
  });

  describe('token metadata', () => {
    it('should get token metadata', async () => {
      const metadata = await client.getTokenMetadata(TEST_TOKEN);
      expect(metadata).toBeDefined();
      expect(metadata.name).toBe('Test Agent Token');
      expect(metadata.symbol).toBe('TAGT');
      expect(metadata.decimals).toBe(18);
      console.log(`Token: ${metadata.symbol} (${metadata.name})`);
    });
  });

  describe('quotes', () => {
    it('should get buy quote', async () => {
      const quote = await client.getQuote(TEST_TOKEN, '0.01', true);
      expect(quote).toBeDefined();
      expect(quote.router).toBeDefined();
      expect(parseFloat(quote.amount)).toBeGreaterThan(0);
      console.log(`Buy 0.01 MON → ${quote.amount} tokens`);
    });

    it('should get sell quote', async () => {
      const quote = await client.getQuote(TEST_TOKEN, '100', false);
      expect(quote).toBeDefined();
      expect(quote.router).toBeDefined();
      expect(parseFloat(quote.amount)).toBeGreaterThan(0);
      console.log(`Sell 100 tokens → ${quote.amount} MON`);
    });
  });

  describe('fee config', () => {
    it('should get deploy fee', async () => {
      const fee = await client.getDeployFee();
      expect(fee).toBeDefined();
      expect(parseFloat(fee)).toBeGreaterThan(0);
      console.log(`Deploy Fee: ${fee} MON`);
    });
  });
});
