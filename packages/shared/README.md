# @xnad/shared

Shared types and utilities for the xnad monorepo.

## Exports

```typescript
import { ... } from "@xnad/shared";         // Main exports
import { ... } from "@xnad/shared/types";    // TypeScript interfaces
import { ... } from "@xnad/shared/utils";    // Helper functions
```

### Types

- `TokenInfo` - Token metadata
- `TokenMarket` - Market data
- `TokenHolder` - Holder information
- `TokenSwap` - Swap records
- `TokenChartCandle` - OHLC candle data
- `Quote` - Price quotes
- `TradeSignal` - AI trading signals
- `Position` - Portfolio position
- `Strategy` - Strategy type definitions

### Utils

- `Logger` - Centralized logging
- `retry()` - Retry logic with exponential backoff
- `sleep()` - Async delay
- `formatNumber()` - Number formatting
- `calculateSlippage()` - Slippage calculation
