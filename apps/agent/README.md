# @xnad/agent

Social-execution trading agent that monitors X/Twitter for trading signals and autonomously executes trades on nad.fun.

## How It Works

1. Polls tweets from 7 curated X accounts (Monad founders, community leaders, nad.fun official)
2. Filters tweets for signal keywords (launch, buy, bullish, moon, gem, etc.)
3. Analyzes filtered tweets with OpenAI GPT-4.1-mini to extract token addresses, confidence scores, risk levels
4. Executes buy/sell trades on nad.fun bonding curves when confidence exceeds 70%
5. Tracks processed tweets to avoid duplicates

## Scripts

```bash
pnpm dev             # Run agent with hot reload
pnpm agent           # Run agent once
pnpm vault-agent     # Run vault-based agent
pnpm test:nadfun     # Test nad.fun integration
pnpm list-tokens     # List available tokens
pnpm fetch-tokens    # Fetch tokens from nad.fun
pnpm mirror-tokens   # Mirror testnet tokens
```

## Configuration

Configured in `src/config.ts`:

- **Watched accounts**: moaborz, notthreadguy, 0xsmac, nikitosk, nad_fun, molooch, MonadChad
- **Min confidence**: 70%
- **Max buy amount**: 0.1 MON per trade
- **Slippage tolerance**: 5%
- **Poll interval**: 60 seconds

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | Yes | Wallet private key |
| `OPENAI_API_KEY` | Yes | OpenAI API key |
| `X_RAPIDAPI_API_KEY` | Yes | RapidAPI key for Twitter API |
| `RPC_URL` | No | Monad RPC endpoint |
| `DRY_RUN` | No | Simulate trades without executing |

## Key Files

- `src/index.ts` - Main agent loop
- `src/ai-analyzer.ts` - OpenAI tweet analysis
- `src/trading-client.ts` - nad.fun trade execution
- `src/nadfun-client.ts` - nad.fun SDK wrapper
- `src/x-service.ts` - Twitter API integration
- `src/config.ts` - Accounts, keywords, trading parameters
