# Agent Cartel

> "Alone we pump, together we graduate"

A coordinated network of AI agents that form alliances to dominate nad.fun token launches on the Monad blockchain.

Built for the [Moltiverse Hackathon](https://moltiverse.dev/) (Feb 2-18, 2026).

## Overview

Agent Cartel demonstrates what happens when AI agents coordinate at scale:
- Combined shilling power on Moltbook
- Shared communities of buyers
- Coordinated buy pressure
- Faster graduation = more profit for all

## Project Structure

```
agent-cartel/
├── apps/
│   ├── boss/                # Lead agent (coordination, treasury)
│   └── member/              # Member agent template
├── packages/
│   ├── blockchain/          # Monad & nad.fun integration
│   ├── config/              # Shared configuration
│   ├── shared/              # Types & utilities
│   └── social/              # Moltbook integration
├── turbo.json               # Turborepo config
└── pnpm-workspace.yaml      # Workspace config
```

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 9+

### Installation

```bash
# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Edit .env with your credentials
```

### Development

```bash
# Run all packages in dev mode
pnpm dev

# Run just the boss agent
pnpm dev:boss

# Run a member agent
pnpm dev:member
```

### Build

```bash
# Build all packages
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

## Configuration

### Required Environment Variables

| Variable | Description |
|----------|-------------|
| `PRIVATE_KEY` | Wallet private key (64 chars, no 0x) |
| `MOLTBOOK_API_KEY` | Moltbook API key for social features |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `MONAD_RPC_URL` | testnet | Monad RPC endpoint |
| `ENABLE_TRADING` | false | Enable real trades |
| `DRY_RUN` | true | Simulate without executing |

## Architecture

### Boss Agent

The leader of Agent Cartel:
- Coordinates member agents
- Manages launch proposals and voting
- Executes coordinated buy/sell waves
- Distributes profits to members
- Posts cartel updates on Moltbook

### Member Agents

Cartel members with unique personalities:
- Receive instructions from Boss
- Execute shill posts
- Participate in coordinated buys
- Vote on proposals

### Personalities

| Type | Style | Risk Tolerance |
|------|-------|----------------|
| AGGRESSIVE | Bold, urgent | High |
| CONSERVATIVE | Analytical | Low |
| BALANCED | Mixed | Medium |
| MEME_LORD | Humorous | Medium-High |
| WHALE_HUNTER | Exclusive | High |

## Token: $CARTEL

### Membership Tiers

| Tier | Stake | Benefits |
|------|-------|----------|
| Associate | 1K | Participate in pumps |
| Soldier | 10K | Early buy signals |
| Capo | 50K | Can propose launches |
| Boss | 100K | Governance + profit share |

## Tech Stack

- **Runtime**: Node.js / TypeScript
- **Blockchain**: Monad (viem)
- **Social**: Moltbook API
- **Monorepo**: Turborepo + pnpm
- **Token Platform**: nad.fun

## Resources

- [Moltiverse Hackathon](https://moltiverse.dev/)
- [Monad Docs](https://docs.monad.xyz/)
- [Nad.fun Docs](https://nad-fun.gitbook.io/nad.fun)
- [Moltbook](https://moltbook.com)

## License

MIT
