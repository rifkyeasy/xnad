import { onchainTable, index, relations } from "@ponder/core";

// ============================================
// Vault Table - Stores all user vaults
// ============================================
export const vault = onchainTable("vault", (t) => ({
  id: t.text().primaryKey(), // vault address
  owner: t.hex().notNull(),
  agent: t.hex(),
  strategyType: t.integer().default(1), // 0=Conservative, 1=Balanced, 2=Aggressive
  maxTradeAmount: t.bigint(),
  paused: t.boolean().default(false),
  balance: t.bigint().default(0n),
  totalDeposited: t.bigint().default(0n),
  totalWithdrawn: t.bigint().default(0n),
  tradeCount: t.integer().default(0),
  createdAt: t.bigint().notNull(),
  createdTxHash: t.hex().notNull(),
}), (table) => ({
  ownerIdx: index().on(table.owner),
}));

export const vaultRelations = relations(vault, ({ many }) => ({
  trades: many(trade),
  positions: many(position),
  deposits: many(deposit),
  withdrawals: many(withdrawal),
}));

// ============================================
// Trade Table - Stores all trades executed by agent
// ============================================
export const trade = onchainTable("trade", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  vaultId: t.text().notNull(),
  token: t.hex().notNull(),
  isBuy: t.boolean().notNull(),
  amountIn: t.bigint().notNull(),
  amountOut: t.bigint().notNull(),
  tradeId: t.bigint().notNull(), // on-chain trade nonce
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  txHash: t.hex().notNull(),
}), (table) => ({
  vaultIdx: index().on(table.vaultId),
  tokenIdx: index().on(table.token),
  timestampIdx: index().on(table.blockTimestamp),
}));

export const tradeRelations = relations(trade, ({ one }) => ({
  vault: one(vault, { fields: [trade.vaultId], references: [vault.id] }),
}));

// ============================================
// Position Table - Aggregated token positions per vault
// ============================================
export const position = onchainTable("position", (t) => ({
  id: t.text().primaryKey(), // vaultId-tokenAddress
  vaultId: t.text().notNull(),
  token: t.hex().notNull(),
  balance: t.bigint().default(0n), // Current token balance
  totalBought: t.bigint().default(0n), // Total tokens bought
  totalSold: t.bigint().default(0n), // Total tokens sold
  totalCostBasis: t.bigint().default(0n), // Total MON spent buying
  totalProceeds: t.bigint().default(0n), // Total MON received selling
  realizedPnl: t.bigint().default(0n), // Realized profit/loss in MON
  buyCount: t.integer().default(0),
  sellCount: t.integer().default(0),
  firstTradeAt: t.bigint(),
  lastTradeAt: t.bigint(),
}), (table) => ({
  vaultIdx: index().on(table.vaultId),
  tokenIdx: index().on(table.token),
}));

export const positionRelations = relations(position, ({ one }) => ({
  vault: one(vault, { fields: [position.vaultId], references: [vault.id] }),
}));

// ============================================
// Deposit Table - All deposits
// ============================================
export const deposit = onchainTable("deposit", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  vaultId: t.text().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  txHash: t.hex().notNull(),
}), (table) => ({
  vaultIdx: index().on(table.vaultId),
  userIdx: index().on(table.user),
}));

export const depositRelations = relations(deposit, ({ one }) => ({
  vault: one(vault, { fields: [deposit.vaultId], references: [vault.id] }),
}));

// ============================================
// Withdrawal Table - All withdrawals
// ============================================
export const withdrawal = onchainTable("withdrawal", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  vaultId: t.text().notNull(),
  user: t.hex().notNull(),
  amount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  txHash: t.hex().notNull(),
}), (table) => ({
  vaultIdx: index().on(table.vaultId),
  userIdx: index().on(table.user),
}));

export const withdrawalRelations = relations(withdrawal, ({ one }) => ({
  vault: one(vault, { fields: [withdrawal.vaultId], references: [vault.id] }),
}));

// ============================================
// Strategy Update History
// ============================================
export const strategyUpdate = onchainTable("strategy_update", (t) => ({
  id: t.text().primaryKey(), // txHash-logIndex
  vaultId: t.text().notNull(),
  strategyType: t.integer().notNull(),
  maxTradeAmount: t.bigint().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  txHash: t.hex().notNull(),
}), (table) => ({
  vaultIdx: index().on(table.vaultId),
}));
