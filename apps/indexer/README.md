# @xnad/indexer

Real-time blockchain event indexer for xnad vault activities on Monad, built with Ponder.

## What It Indexes

| Event | Source | Description |
|-------|--------|-------------|
| `VaultCreated` | VaultFactory | New vault creation |
| `Deposited` | UserVault | MON deposits |
| `Withdrawn` | UserVault | MON withdrawals |
| `TradeExecuted` | UserVault | Buy/sell trades with amounts |
| `StrategyUpdated` | UserVault | Strategy configuration changes |
| `Paused` | UserVault | Vault pause/unpause |
| `AgentUpdated` | UserVault | Agent address changes |

## Schema

**vault** table: id, owner, agent, strategyType, paused, balance, totalDeposited, totalWithdrawn, tradeCount, maxTradeAmount, createdAt, createdTxHash

## API

- `GET /` - GraphQL endpoint
- `GET /graphql` - GraphQL endpoint
- `GET /sql/*` - SQL client endpoint

## Scripts

```bash
pnpm dev      # Run indexer in development mode
pnpm start    # Run indexer in production mode
pnpm codegen  # Generate Ponder types
pnpm serve    # Serve API only
```

## Configuration

- **Chain**: Monad Testnet (10143)
- **VaultFactory**: `0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A`
- **Database**: pglite (embedded PostgreSQL)
- **RPC fallback**: 4 endpoints for reliability
  - `https://testnet-rpc.monad.xyz` (primary)
  - `https://monad-testnet.drpc.org`
  - `https://rpc.ankr.com/monad_testnet`
  - `https://monad-testnet.api.onfinality.io/public`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RPC_URL` | No | Primary RPC endpoint (default: Monad testnet) |
| `START_BLOCK` | No | Block to start indexing from (default: 10000000) |
