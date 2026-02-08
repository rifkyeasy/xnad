# Freezy - Moltiverse Hackathon Project

## Project Overview

**Freezy** is an AI agent that operates on the Monad blockchain via nad.fun, designed for the Moltiverse Hackathon (Feb 2-18, 2026).

---

## Hackathon Context

### Prize Tracks
1. **Agent+Token Track** ($140K) - Build agents AND launch tokens on nad.fun
2. **Agent Track** ($60K) - Pure agent development

### Key Dates
- Hackathon: Feb 2-18, 2026
- First winners: Feb 7-8
- Final deadline: Feb 15
- Winners announced: Feb 18

### Resources
- [Moltiverse Official](https://moltiverse.dev/)
- [Monad Docs](https://docs.monad.xyz/)
- [Nad.fun Docs](https://nad-fun.gitbook.io/nad.fun)
- [Nad.fun SDKs](https://github.com/naddotfun)
  - TypeScript: `nadfun-sdk-typescript`
  - Python: `nadfun-sdk-python`
  - Rust: `nadfun-sdk-rust`
- [AINad Framework](https://github.com/Techgethr/ainad)
- [Nad.fun API/RPC Guide](https://github.com/Naddotfun/api-rpc-guide)
- [Moltbook - AI Agent Social Network](https://moltbook.com)

---

## Project Ideas (Choose One)

### Idea 1: "Freezy" - Social Freezing Game Agent
**Concept**: A game-theory based social agent where participants stake tokens on "freezing" or "unfreezing" other agents/tokens. The agent analyzes sentiment, trading patterns, and social signals to make strategic decisions.

**Features**:
- Token launch on nad.fun with bonding curve mechanics
- Social game mechanics (freeze/unfreeze voting)
- AI-driven strategy based on market analysis
- Integration with Moltbook for social presence
- Autonomous trading decisions

**Track**: Agent+Token ($140K)

### Idea 2: "FreezyDAO" - Autonomous Treasury Agent
**Concept**: An AI agent that manages a community treasury, making investment decisions based on community proposals and market analysis.

**Features**:
- DAO-style governance with AI execution
- Portfolio management across Monad DeFi
- Risk assessment and rebalancing
- Transparent decision logging

**Track**: Agent+Token ($140K)

### Idea 3: "FreezyCopy" - Copy Trading Agent
**Concept**: An agent that identifies successful traders on Monad, analyzes their strategies, and mirrors profitable trades.

**Features**:
- Wallet tracking and analysis
- Pattern recognition
- Risk-adjusted position sizing
- Performance leaderboards

**Track**: Agent Track ($60K)

---

## Recommended Architecture

```
freezy/
├── packages/
│   ├── agent-core/          # AI agent logic (TypeScript)
│   │   ├── src/
│   │   │   ├── agent.ts     # Main agent class
│   │   │   ├── llm.ts       # LLM integration (OpenAI/Anthropic)
│   │   │   ├── memory.ts    # Conversation/state memory
│   │   │   └── tools/       # Agent tools
│   │   │       ├── trading.ts
│   │   │       ├── social.ts
│   │   │       └── analytics.ts
│   │   └── package.json
│   │
│   ├── blockchain/          # Monad integration
│   │   ├── src/
│   │   │   ├── client.ts    # Monad RPC client
│   │   │   ├── nadfun.ts    # nad.fun SDK wrapper
│   │   │   ├── contracts/   # Smart contract ABIs
│   │   │   └── wallet.ts    # Wallet management
│   │   └── package.json
│   │
│   ├── social/              # Social platform integration
│   │   ├── src/
│   │   │   ├── moltbook.ts  # Moltbook integration
│   │   │   ├── twitter.ts   # Twitter/X integration (optional)
│   │   │   └── discord.ts   # Discord bot (optional)
│   │   └── package.json
│   │
│   └── web/                 # Dashboard/UI (optional)
│       ├── src/
│       └── package.json
│
├── contracts/               # Solidity smart contracts (if needed)
│   └── src/
│
├── scripts/                 # Deployment & utility scripts
│
├── .env.example             # Environment template
├── package.json             # Monorepo root
├── turbo.json               # Turborepo config
└── README.md
```

---

## Tech Stack

### Core
- **Runtime**: Node.js 20+ / Bun
- **Language**: TypeScript
- **Monorepo**: Turborepo / pnpm workspaces

### AI/LLM
- **Primary**: OpenAI GPT-4o or Claude
- **Framework**: LangChain.js or Vercel AI SDK
- **Memory**: Vector DB (Pinecone/Chroma) for context

### Blockchain
- **Network**: Monad Testnet/Devnet
- **SDK**: nadfun-sdk-typescript
- **Wallet**: ethers.js v6 / viem

### Social
- **Moltbook**: API integration for AI social network
- **Optional**: Twitter API, Discord.js

### Infrastructure
- **Deployment**: Railway / Fly.io / Docker
- **Database**: SQLite (local) / PostgreSQL (prod)
- **Monitoring**: Prometheus + Grafana

---

## Implementation Phases

### Phase 1: Foundation (Day 1-2)
- [ ] Project setup (monorepo, TypeScript, linting)
- [ ] Monad testnet connection
- [ ] Wallet integration
- [ ] Basic nad.fun SDK integration

### Phase 2: Agent Core (Day 3-5)
- [ ] LLM integration (OpenAI/Claude)
- [ ] Agent state management
- [ ] Tool system (trading, analytics)
- [ ] Memory/context management

### Phase 3: Token Launch (Day 6-7)
- [ ] Token creation on nad.fun
- [ ] Bonding curve interaction
- [ ] Basic trading logic

### Phase 4: Social Integration (Day 8-10)
- [ ] Moltbook API integration
- [ ] Autonomous posting/commenting
- [ ] Social sentiment analysis

### Phase 5: Strategy & Intelligence (Day 11-12)
- [ ] Market analysis
- [ ] Trading strategy implementation
- [ ] Risk management

### Phase 6: Polish & Submit (Day 13-14)
- [ ] Testing & bug fixes
- [ ] Documentation
- [ ] Demo video
- [ ] Submission

---

## Key Success Criteria

1. **Working Agent**: Autonomous operation without human intervention
2. **Token Integration**: Successful token launch and interaction on nad.fun
3. **Unique Value**: Novel concept or execution
4. **Demo Quality**: Clear demonstration of capabilities
5. **Code Quality**: Clean, documented, well-structured code

---

## Quick Start Commands

```bash
# Initialize project
pnpm init
pnpm add -D typescript turbo @types/node

# Install Monad/nad.fun dependencies
pnpm add nadfun-sdk ethers viem

# Install AI dependencies
pnpm add openai langchain @langchain/openai

# Development
pnpm dev

# Build
pnpm build
```

---

## Environment Variables

```env
# Monad
MONAD_RPC_URL=https://testnet.monad.xyz/rpc
PRIVATE_KEY=your_wallet_private_key

# nad.fun
NADFUN_API_KEY=your_api_key

# AI
OPENAI_API_KEY=your_openai_key
# or
ANTHROPIC_API_KEY=your_anthropic_key

# Social
MOLTBOOK_API_KEY=your_moltbook_key
```
