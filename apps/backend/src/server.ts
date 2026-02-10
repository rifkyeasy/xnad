import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import users from './routes/users.js';
import trades from './routes/trades.js';
import positions from './routes/positions.js';

const app = new Hono();

// Indexer URL
const INDEXER_URL = process.env.INDEXER_URL || 'http://localhost:42069';

// Middleware
app.use('*', logger());
app.use(
  '*',
  cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'https://xnad.fun'],
    credentials: true,
  })
);

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.route('/api/users', users);
app.route('/api/trades', trades);
app.route('/api/positions', positions);

// Agent endpoints
app.get('/api/agent/users', async (c) => {
  const { getAllActiveUsers } = await import('./services/user-service.js');
  const users = await getAllActiveUsers();
  return c.json(users);
});

// Get token info from nad.fun
app.get('/api/tokens/:address', async (c) => {
  const address = c.req.param('address');

  try {
    const { getNadFunTokenInfo } = await import('./services/nadfun-service.js');
    const tokenInfo = await getNadFunTokenInfo(address);

    if (!tokenInfo) {
      return c.json({ error: 'Token not found' }, 404);
    }

    return c.json(tokenInfo);
  } catch (error) {
    console.error('Error fetching token:', error);
    return c.json({ error: 'Failed to fetch token info' }, 500);
  }
});

// Get quote for buying/selling
app.get('/api/tokens/:address/quote', async (c) => {
  const address = c.req.param('address');
  const amount = c.req.query('amount') || '0.01';
  const isBuy = c.req.query('isBuy') !== 'false';

  try {
    const { getQuote } = await import('./services/nadfun-service.js');
    const quote = await getQuote(address, amount, isBuy);
    return c.json(quote);
  } catch (error) {
    console.error('Error getting quote:', error);
    return c.json({ error: 'Failed to get quote' }, 500);
  }
});

// Get wallet balances
app.get('/api/wallet/:address/balances', async (c) => {
  const walletAddress = c.req.param('address');

  try {
    const { getWalletBalances } = await import('./services/nadfun-service.js');
    const balances = await getWalletBalances(walletAddress);
    return c.json(balances);
  } catch (error) {
    console.error('Error fetching balances:', error);
    return c.json({ error: 'Failed to fetch balances' }, 500);
  }
});

// ============================================
// Indexer Proxy Routes
// ============================================

// Get all vaults from indexer
app.get('/api/indexer/vaults', async (c) => {
  try {
    const res = await fetch(`${INDEXER_URL}/vaults`);
    if (!res.ok) return c.json({ error: 'Indexer unavailable' }, 503);
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Get active vaults from indexer
app.get('/api/indexer/vaults/active', async (c) => {
  try {
    const res = await fetch(`${INDEXER_URL}/vaults/active`);
    if (!res.ok) return c.json({ error: 'Indexer unavailable' }, 503);
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Get vault by address from indexer
app.get('/api/indexer/vaults/:address', async (c) => {
  const address = c.req.param('address');
  try {
    const res = await fetch(`${INDEXER_URL}/vaults/${address}`);
    if (!res.ok) {
      if (res.status === 404) return c.json({ error: 'Vault not found' }, 404);
      return c.json({ error: 'Indexer unavailable' }, 503);
    }
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Get vault positions from indexer
app.get('/api/indexer/vaults/:address/positions', async (c) => {
  const address = c.req.param('address');
  try {
    const res = await fetch(`${INDEXER_URL}/vaults/${address}/positions`);
    if (!res.ok) return c.json({ error: 'Indexer unavailable' }, 503);
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Get vault trades from indexer
app.get('/api/indexer/vaults/:address/trades', async (c) => {
  const address = c.req.param('address');
  const limit = c.req.query('limit') || '50';
  try {
    const res = await fetch(`${INDEXER_URL}/vaults/${address}/trades?limit=${limit}`);
    if (!res.ok) return c.json({ error: 'Indexer unavailable' }, 503);
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Get indexer stats
app.get('/api/indexer/stats', async (c) => {
  try {
    const res = await fetch(`${INDEXER_URL}/stats`);
    if (!res.ok) return c.json({ error: 'Indexer unavailable' }, 503);
    return c.json(await res.json());
  } catch (error) {
    console.error('Indexer error:', error);
    return c.json({ error: 'Indexer unavailable' }, 503);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

export default app;
