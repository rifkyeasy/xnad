# @xnad/backend

REST API server for xnad, providing user management, trade tracking, and integration between the web frontend, agent, and blockchain.

**Live**: https://api.xnad.fun

## Tech

- [Hono](https://hono.dev) - HTTP framework
- [Prisma](https://prisma.io) - ORM with PostgreSQL
- [Zod](https://zod.dev) - Request validation

## Scripts

```bash
pnpm dev          # Run server with hot reload
pnpm build        # Compile TypeScript
pnpm start        # Run compiled server
pnpm db:push      # Sync Prisma schema to database
pnpm db:migrate   # Run database migrations
pnpm db:studio    # Open Prisma Studio GUI
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/health` | Health check |
| GET | `/api/users` | List all active users |
| GET | `/api/users/:address` | Get user profile by wallet |
| POST | `/api/users` | Create or update user |
| GET | `/api/trades` | Get trade history |
| GET | `/api/positions` | Get current positions |
| GET | `/api/tokens/:address` | Get token info from nad.fun |
| GET | `/api/tokens/:address/quote` | Get price quote |
| GET | `/api/wallet/:address/balances` | Get wallet balances |
| GET | `/api/indexer/vaults` | Proxy to Ponder indexer |
| GET | `/api/agent/users` | Get active users for agent |

## Database Schema

- **User** - Wallet address, X handle, strategy settings, automation config
- **Trade** - Trade records with status, signal info, outcomes
- **Position** - Current token holdings
- **StrategyPerformance** - Performance metrics per strategy

Strategies: `CONSERVATIVE`, `BALANCED`, `AGGRESSIVE`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `PORT` | No | Server port (default: 3001) |
| `INDEXER_URL` | No | Ponder indexer URL (default: http://localhost:42069, prod: https://indexer.xnad.fun) |
