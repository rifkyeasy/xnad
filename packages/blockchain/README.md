# @xnad/blockchain

Core blockchain integration package for Monad and nad.fun.

## Exports

```typescript
import { ... } from "@xnad/blockchain";          // Main exports
import { ... } from "@xnad/blockchain/clients";   // Client classes
import { ... } from "@xnad/blockchain/services";   // Service classes
```

### Clients

- **MonadClient** (`clients/monad.ts`) - Generic Monad blockchain operations (RPC, wallet)
- **NadFunClient** (`clients/nadfun.ts`) - nad.fun API wrapper
  - Get token info, market data, holders, swaps, chart candles
  - Get buy/sell quotes
  - List tokens by market cap
  - Get wallet balances
  - Retry logic with exponential backoff

### Services

- **TraderService** (`services/trader.ts`) - High-level trading operations
  - Buy/sell on bonding curve
  - Graduated token swaps on Uniswap V3
  - Quote fetching with slippage handling
- **TokenCreatorService** (`services/token-creator.ts`) - Token creation on nad.fun

## Dependencies

- `@xnad/config` - Environment and constants
- `@xnad/shared` - Types and utilities
- `viem` - Ethereum library
