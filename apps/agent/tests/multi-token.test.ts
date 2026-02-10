/**
 * Multi-Token Trading Tests
 * Tests trading across multiple tokens on testnet
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { getTradingClient, type TradingClient } from '../src/trading-client.js';
import { getNadFunClient, type NadFunClient } from '../src/nadfun-client.js';
import { TESTNET_TOKENS } from '../src/config.js';

describe('Multi-Token Trading', () => {
  let tradingClient: TradingClient;
  let nadFunClient: NadFunClient;

  const tokens = [
    { symbol: 'CHOG', address: TESTNET_TOKENS.chog },
    { symbol: 'TAGT', address: TESTNET_TOKENS.tagt },
  ];

  beforeAll(() => {
    tradingClient = getTradingClient();
    nadFunClient = getNadFunClient();
  });

  describe('Token Discovery', () => {
    it('should fetch metadata for all tokens', async () => {
      console.log('\n--- Token Metadata ---');

      for (const token of tokens) {
        const metadata = await nadFunClient.getTokenMetadata(token.address);
        expect(metadata).toBeDefined();
        expect(metadata.symbol).toBe(token.symbol);
        console.log(`${token.symbol}: ${metadata.name} (${metadata.totalSupply} supply)`);
      }
    });

    it('should get quotes for all tokens', async () => {
      console.log('\n--- Buy Quotes (0.01 MON) ---');

      for (const token of tokens) {
        const quote = await nadFunClient.getQuote(token.address, '0.01', true);
        expect(quote).toBeDefined();
        expect(parseFloat(quote.amount)).toBeGreaterThan(0);
        console.log(`${token.symbol}: 0.01 MON → ${parseFloat(quote.amount).toFixed(2)} tokens`);
      }
    });
  });

  describe('Portfolio Balances', () => {
    it('should check balances across all tokens', async () => {
      console.log('\n--- Portfolio ---');

      const monBalance = await nadFunClient.getMonBalance();
      console.log(`MON: ${monBalance}`);

      for (const token of tokens) {
        const balance = await nadFunClient.getBalance(token.address);
        console.log(`${token.symbol}: ${balance}`);
      }
    });
  });

  describe('Multi-Token Trading (Dry Run)', () => {
    it('should execute buy across multiple tokens', async () => {
      console.log('\n--- Multi-Token Buy (Dry Run) ---');

      const results = [];

      for (const token of tokens) {
        const result = await tradingClient.executeBuy({
          action: 'buy',
          tokenAddress: token.address,
          tokenSymbol: token.symbol,
          confidence: 0.85,
          reasoning: 'Test buy signal',
          riskLevel: 'low',
          suggestedAmount: '0.005',
        });

        expect(result.success).toBe(true);
        results.push({ symbol: token.symbol, ...result });
        console.log(`${token.symbol}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      }

      expect(results.length).toBe(tokens.length);
      expect(results.every((r) => r.success)).toBe(true);
    });

    it('should execute sell across multiple tokens', async () => {
      console.log('\n--- Multi-Token Sell (Dry Run) ---');

      const results = [];

      for (const token of tokens) {
        const result = await tradingClient.executeSell(token.address, '100');

        expect(result.success).toBe(true);
        results.push({ symbol: token.symbol, ...result });
        console.log(`${token.symbol}: ${result.success ? 'SUCCESS' : 'FAILED'}`);
      }

      expect(results.length).toBe(tokens.length);
      expect(results.every((r) => r.success)).toBe(true);
    });
  });

  describe('Price Comparison', () => {
    it('should compare prices across tokens', async () => {
      console.log('\n--- Price Comparison ---');

      const prices = [];

      for (const token of tokens) {
        const buyQuote = await nadFunClient.getQuote(token.address, '0.01', true);
        const tokensPerMon = parseFloat(buyQuote.amount);
        const pricePerToken = 0.01 / tokensPerMon;

        prices.push({
          symbol: token.symbol,
          tokensPerMon,
          pricePerToken,
        });

        console.log(
          `${token.symbol}: ${tokensPerMon.toFixed(2)} tokens/MON, ${pricePerToken.toFixed(10)} MON/token`
        );
      }

      // Verify we got prices for all tokens
      expect(prices.length).toBe(tokens.length);
      expect(prices.every((p) => p.tokensPerMon > 0)).toBe(true);
    });
  });

  describe('Sell Quote Comparison', () => {
    it('should compare sell quotes across tokens', async () => {
      console.log('\n--- Sell Quotes (1000 tokens) ---');

      for (const token of tokens) {
        const sellQuote = await nadFunClient.getQuote(token.address, '1000', false);
        console.log(`${token.symbol}: 1000 tokens → ${sellQuote.amount} MON`);
        expect(parseFloat(sellQuote.amount)).toBeGreaterThan(0);
      }
    });
  });
});
