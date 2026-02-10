# @xnad/config

Centralized configuration package for the xnad monorepo.

## Exports

```typescript
import { env, constants, contracts, networks } from "@xnad/config";
```

- **env** - Environment variables validated with Zod
- **constants** - Application constants (API endpoints, token lists, agent config)
- **contracts** - Contract ABIs and deployed addresses
- **networks** - Network configurations (Monad testnet/mainnet RPC URLs)

Also exports shared tooling configs:

```typescript
import eslintConfig from "@xnad/config/eslint";
import tsconfig from "@xnad/config/typescript";
```
