import { onchainTable, index } from "ponder";

// Vault Table - Stores all user vaults
export const vault = onchainTable("vault", (t) => ({
  id: t.text().primaryKey(), // vault address
  owner: t.hex(),
  agent: t.hex(),
  strategyType: t.integer().default(1), // 0=Conservative, 1=Balanced, 2=Aggressive
  maxTradeAmount: t.bigint(),
  paused: t.boolean().default(false),
  balance: t.bigint().default(0n),
  totalDeposited: t.bigint().default(0n),
  totalWithdrawn: t.bigint().default(0n),
  tradeCount: t.integer().default(0),
  createdAt: t.bigint(),
  createdTxHash: t.hex(),
}), (table) => ({
  ownerIdx: index().on(table.owner),
}));
