# XNAD

> Social AI Trading Agent for nad.fun on Monad

An AI-powered trading system that monitors social signals from X/Twitter, analyzes them with GPT-4.1, and autonomously executes trades on [nad.fun](https://nad.fun) bonding curves via smart contract vaults.

Built for the [Moltiverse Hackathon](https://moltiverse.dev/) (Feb 2-18, 2026).

## How It Works

1. **Monitor** - Agent watches curated X/Twitter accounts for trading signals
2. **Analyze** - GPT-4.1 extracts token addresses, confidence scores, and risk levels from tweets
3. **Execute** - High-confidence signals trigger autonomous trades on nad.fun bonding curves
4. **Track** - On-chain vault events are indexed in real-time and displayed on the web dashboard

## Architecture

```
X/Twitter ──> Agent (AI Analysis) ──> Smart Contract Vaults ──> nad.fun
                                            │
                                       Ponder Indexer
                                            │
                              Backend API ──> Web Dashboard
```

## Project Structure

```
xnad/
├── apps/
│   ├── agent/          # AI trading agent (tweet monitoring + execution)
│   ├── backend/        # REST API (Hono + Prisma + PostgreSQL)
│   ├── contracts/      # Solidity vaults (Foundry)
│   ├── indexer/        # Blockchain event indexer (Ponder)
│   └── web/            # Dashboard frontend (Next.js 15)
│
├── packages/
│   ├── blockchain/     # Monad & nad.fun SDK integration
│   ├── config/         # Environment, constants, ABIs
│   ├── shared/         # Types & utilities
│   └── social/         # Moltbook integration
│
├── turbo.json
└── pnpm-workspace.yaml
```

## Apps

### Agent (`apps/agent`)

Standalone Node.js process that runs continuously:

- Watches 7 configured X accounts for signal keywords (launch, buy, bullish, moon, gem, etc.)
- Filters and analyzes tweets using OpenAI GPT-4.1-mini
- Extracts token addresses, buy/sell signals, confidence scores (0-1), and risk levels
- Executes trades on nad.fun when confidence exceeds 70%
- Tracks processed tweets to avoid duplicates
- Supports dry-run mode for testing

### Backend (`apps/backend`)

REST API built with Hono:

- User profile management (wallets, strategies, automation settings)
- Trade history and position tracking
- Token info and price quotes from nad.fun
- Wallet balance queries
- Proxy to Ponder indexer for vault data
- Prisma ORM with PostgreSQL (NeonDB)

### Contracts (`apps/contracts`)

Solidity smart contracts deployed on Monad Testnet:

- **VaultFactory** - Creates per-user vaults, manages registry
- **UserVault** - Holds user MON, agent executes trades on their behalf
  - Three strategies: Conservative, Balanced, Aggressive
  - Pause/unpause trading, withdraw funds
  - All actions emit events for indexing

Deployed at: `0x164B4eF50c0C8C75Dc6F571e62731C4Fa0F6283A`

### Indexer (`apps/indexer`)

Ponder-based blockchain event indexer:

- Tracks VaultCreated, Deposited, Withdrawn, TradeExecuted, StrategyUpdated events
- Maintains vault state (balance, trade count, strategy)
- Multiple RPC fallback endpoints for reliability
- Serves data via REST API

### Web (`apps/web`)

Next.js 15 dashboard:

- **Dashboard** - Vault balance, positions, P&L, strategy overview
- **Agent Setup** - Create vault, configure AI agent, select strategy
- **Trade** - Manual buy/sell interface with token search and quotes
- **Positions** - Current holdings and trade history

Wallet connection via Wagmi, styled with HeroUI + TailwindCSS.

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+
- PostgreSQL (or NeonDB)

### Installation

```bash
pnpm install
cp .env.example .env
# Edit .env with your credentials
```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | Yes | Wallet private key for trading |
| `OPENAI_API_KEY` | Yes | OpenAI API key for tweet analysis |
| `X_RAPIDAPI_API_KEY` | Yes | RapidAPI key for Twitter API |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `RPC_URL` | No | Monad RPC (default: testnet) |
| `NADFUN_API_KEY` | No | nad.fun API key (higher rate limits) |
| `MOLTBOOK_API_KEY` | No | Moltbook API key |
| `DRY_RUN` | No | Simulate trades without executing (default: false) |
| `PORT` | No | Backend port (default: 3001) |

### Development

```bash
# Run all apps
pnpm dev

# Run individual apps
pnpm dev:web        # Web dashboard
pnpm dev:backend    # Backend API
pnpm dev:agent      # Trading agent
```

### Build

```bash
pnpm build
pnpm typecheck
pnpm lint
```

### Database

```bash
pnpm db:push        # Sync Prisma schema to DB
pnpm db:migrate     # Run migrations
pnpm db:studio      # Open Prisma Studio
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| AI | OpenAI GPT-4.1-mini |
| Blockchain | Monad Testnet, Viem, nad.fun SDK |
| Contracts | Solidity 0.8.20, Foundry |
| Backend | Hono, Prisma, PostgreSQL |
| Indexer | Ponder 0.16.3 |
| Frontend | Next.js 15, React, HeroUI, Wagmi, TailwindCSS |
| Monorepo | Turborepo, pnpm |

## Live URLs

| Service | URL |
|---------|-----|
| Web App | https://xnad.fun |
| API | https://api.xnad.fun |
| Indexer | https://indexer.xnad.fun |

## Resources

- [Moltiverse Hackathon](https://moltiverse.dev/)
- [Monad Docs](https://docs.monad.xyz/)
- [nad.fun Docs](https://nad-fun.gitbook.io/nad.fun)

## License

MIT
