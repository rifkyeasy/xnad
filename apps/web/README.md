# @xnad/web

Dashboard frontend for xnad, built with Next.js 15 and HeroUI.

**Live**: https://xnad.fun

## Pages

- **Dashboard** (`/`) - Vault balance, positions, P&L, strategy overview, agent status
- **Agent Setup** (`/agent`) - Create vault, configure AI agent, select strategy
- **Trade** (`/trade`) - Manual buy/sell interface with token search and quotes
- **Positions** (`/trade/positions`) - Current holdings and trade history

## Tech

- [Next.js 15](https://nextjs.org) with Turbopack
- [HeroUI](https://heroui.com) component library
- [Wagmi](https://wagmi.sh) for wallet connection
- [Zustand](https://zustand.docs.pmnd.rs) for state management
- [TailwindCSS](https://tailwindcss.com) for styling
- [React Query](https://tanstack.com/query) for data fetching

## Scripts

```bash
pnpm dev      # Run dev server with Turbopack
pnpm build    # Production build
pnpm start    # Start production server
pnpm lint     # Lint and auto-fix
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_BACKEND_URL` | No | Backend API URL (default: http://localhost:3001, prod: https://api.xnad.fun) |
