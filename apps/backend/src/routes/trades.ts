import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import * as tradeService from '../services/trade-service.js';
import * as userService from '../services/user-service.js';
import { RecordTradeSchema } from '../types/index.js';

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// Mock token addresses (deployed on Monad Testnet)
const MOCK_TOKENS = {
  MONAD: '0x700d18196d14244FcD7e9D87d5bBF5DE3c33B0e8',
  NADS: '0xCaBFa324576c655D0276647A7f0aF5e779123e0B',
  DEGEN: '0x8E304Ae201FF805eeEaa629b069289b94376F52F',
  PURP: '0x9dAf66b75d348D4f90B125a282bBFA608Ecec13C',
  CHAD: '0xA8adEFE2C8f0F71a585a73c1259997f593F9e463',
};

// Generate mock trades
function getMockTrades() {
  const now = new Date();
  return [
    {
      id: 'mock-trade-1',
      tokenAddress: MOCK_TOKENS.MONAD,
      tokenSymbol: 'MONAD',
      action: 'BUY',
      amountIn: '0.01',
      amountOut: '6666.67',
      pricePerToken: '0.0000015',
      txHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      status: 'CONFIRMED',
      gasUsed: '150000',
      gasCost: '0.00015',
      confidence: 0.92,
      riskLevel: 'LOW',
      reasoning: 'MONAD is a well-established community token with strong backing',
      createdAt: new Date(now.getTime() - 86400000 * 2),
    },
    {
      id: 'mock-trade-2',
      tokenAddress: MOCK_TOKENS.NADS,
      tokenSymbol: 'NADS',
      action: 'BUY',
      amountIn: '0.005',
      amountOut: '5882.35',
      pricePerToken: '0.00000085',
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      status: 'CONFIRMED',
      gasUsed: '145000',
      gasCost: '0.000145',
      confidence: 0.78,
      riskLevel: 'MEDIUM',
      reasoning: 'NADS shows strong momentum with moderate risk',
      createdAt: new Date(now.getTime() - 86400000),
    },
    {
      id: 'mock-trade-3',
      tokenAddress: MOCK_TOKENS.PURP,
      tokenSymbol: 'PURP',
      action: 'BUY',
      amountIn: '0.01',
      amountOut: '2380.95',
      pricePerToken: '0.0000042',
      txHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
      status: 'CONFIRMED',
      gasUsed: '148000',
      gasCost: '0.000148',
      confidence: 0.88,
      riskLevel: 'LOW',
      reasoning: 'PURP shows consistent growth with low risk profile',
      createdAt: new Date(now.getTime() - 3600000 * 5),
    },
  ];
}

const trades = new Hono();

// Get trades for a wallet
trades.get('/:walletAddress', async (c) => {
  const walletAddress = c.req.param('walletAddress');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  // Return mock trades in mock mode
  if (USE_MOCK_DATA) {
    const mockTrades = getMockTrades();
    return c.json(mockTrades.slice(offset, offset + limit));
  }

  const tradeList = await tradeService.getTradesByWallet(walletAddress, limit, offset);
  return c.json(tradeList);
});

// Record a new trade
trades.post('/:walletAddress', zValidator('json', RecordTradeSchema), async (c) => {
  const walletAddress = c.req.param('walletAddress');
  const input = c.req.valid('json');

  const user = await userService.getUser(walletAddress);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const trade = await tradeService.recordTrade(user.id, input);
  return c.json(trade, 201);
});

// Get trade stats for a wallet
trades.get('/:walletAddress/stats', async (c) => {
  const walletAddress = c.req.param('walletAddress');

  // Return mock stats in mock mode
  if (USE_MOCK_DATA) {
    return c.json({
      totalTrades: 3,
      successfulTrades: 3,
      failedTrades: 0,
      totalVolume: '0.025',
      totalGasCost: '0.000443',
      avgConfidence: 0.86,
      winRate: 100,
    });
  }

  const user = await userService.getUser(walletAddress);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const stats = await tradeService.getTradeStats(user.id);
  return c.json(stats);
});

export default trades;
