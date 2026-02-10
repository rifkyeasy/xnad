/**
 * API Endpoint Tests
 * Tests the Hono API endpoints
 */

import { describe, it, expect } from 'vitest';
import app from '../src/server.js';

// Test data
const TEST_TOKEN = '0xfDB4DC8BFd39515762Dca9C671701E68F5297777';
const TEST_WALLET = '0x3B4f0135465d444a5bD06Ab90fC59B73916C85F5';

describe('API Endpoints', () => {
  describe('GET /health', () => {
    it('should return health status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.status).toBe('ok');
      expect(data.timestamp).toBeDefined();
    });
  });

  describe('GET /api/tokens/:address', () => {
    it('should return token info', async () => {
      const res = await app.request(`/api/tokens/${TEST_TOKEN}`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.name).toBe('Test Agent Token');
      expect(data.symbol).toBe('TAGT');
      expect(data.decimals).toBe(18);
    });

    it('should return 404 for invalid token', async () => {
      const res = await app.request('/api/tokens/0x0000000000000000000000000000000000000001');
      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe('Token not found');
    });
  });

  describe('GET /api/tokens/:address/quote', () => {
    it('should return buy quote with correct structure', async () => {
      const res = await app.request(`/api/tokens/${TEST_TOKEN}/quote?amount=0.01&isBuy=true`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.amountIn).toBe('0.01');
      expect(typeof data.amountOut).toBe('string');
      expect(data.isBuy).toBe(true);
      expect(data.router).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should return sell quote with correct structure', async () => {
      const res = await app.request(`/api/tokens/${TEST_TOKEN}/quote?amount=100&isBuy=false`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.amountIn).toBe('100');
      expect(typeof data.amountOut).toBe('string');
      expect(data.isBuy).toBe(false);
      expect(data.router).toMatch(/^0x[a-fA-F0-9]{40}$/);
    });

    it('should use default amount if not provided', async () => {
      const res = await app.request(`/api/tokens/${TEST_TOKEN}/quote`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.amountIn).toBe('0.01');
    });
  });

  describe('GET /api/wallet/:address/balances', () => {
    it('should return wallet balances', async () => {
      const res = await app.request(`/api/wallet/${TEST_WALLET}/balances`);
      expect(res.status).toBe(200);

      const data = await res.json();
      expect(data.mon).toBeDefined();
      expect(parseFloat(data.mon)).toBeGreaterThanOrEqual(0);
      expect(Array.isArray(data.tokens)).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const res = await app.request('/api/unknown');
      expect(res.status).toBe(404);

      const data = await res.json();
      expect(data.error).toBe('Not found');
    });
  });
});
