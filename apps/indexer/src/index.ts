import { ponder } from "ponder:registry";
import schema from "ponder:schema";

// ============================================
// VaultFactory Event Handlers
// ============================================

ponder.on("VaultFactory:VaultCreated", async ({ event, context }) => {
  const { user, vault: vaultAddress } = event.args;

  await context.db.insert(schema.vault).values({
    id: vaultAddress.toLowerCase(),
    owner: user,
    strategyType: 1, // Default: Balanced
    paused: false,
    balance: 0n,
    totalDeposited: 0n,
    totalWithdrawn: 0n,
    tradeCount: 0,
    createdAt: event.block.timestamp,
    createdTxHash: event.transaction.hash,
  }).onConflictDoUpdate({
    createdAt: event.block.timestamp,
    createdTxHash: event.transaction.hash,
  });
});

// ============================================
// UserVault Event Handlers
// ============================================

ponder.on("UserVault:Deposited", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { amount } = event.args;

  // Upsert to handle deposits before VaultCreated is indexed
  await context.db
    .insert(schema.vault)
    .values({
      id: vaultId,
      balance: amount,
      totalDeposited: amount,
    })
    .onConflictDoUpdate((row) => ({
      balance: row.balance + amount,
      totalDeposited: row.totalDeposited + amount,
    }));
});

ponder.on("UserVault:Withdrawn", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { amount } = event.args;

  await context.db
    .insert(schema.vault)
    .values({
      id: vaultId,
      balance: -amount,
      totalWithdrawn: amount,
    })
    .onConflictDoUpdate((row) => ({
      balance: row.balance - amount,
      totalWithdrawn: row.totalWithdrawn + amount,
    }));
});

ponder.on("UserVault:StrategyUpdated", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { strategyType, maxTradeAmount } = event.args;

  await context.db
    .insert(schema.vault)
    .values({
      id: vaultId,
      strategyType,
      maxTradeAmount,
    })
    .onConflictDoUpdate({
      strategyType,
      maxTradeAmount,
    });
});

ponder.on("UserVault:TradeExecuted", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { isBuy, amountIn, amountOut } = event.args;

  // Update vault trade count and balance
  if (isBuy) {
    // Buying: spend MON (amountIn), receive tokens (amountOut)
    await context.db
      .insert(schema.vault)
      .values({
        id: vaultId,
        tradeCount: 1,
        balance: -amountIn,
      })
      .onConflictDoUpdate((row) => ({
        tradeCount: row.tradeCount + 1,
        balance: row.balance - amountIn,
      }));
  } else {
    // Selling: spend tokens (amountIn), receive MON (amountOut)
    await context.db
      .insert(schema.vault)
      .values({
        id: vaultId,
        tradeCount: 1,
        balance: amountOut,
      })
      .onConflictDoUpdate((row) => ({
        tradeCount: row.tradeCount + 1,
        balance: row.balance + amountOut,
      }));
  }
});

ponder.on("UserVault:Paused", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { isPaused } = event.args;

  await context.db
    .insert(schema.vault)
    .values({
      id: vaultId,
      paused: isPaused,
    })
    .onConflictDoUpdate({ paused: isPaused });
});

ponder.on("UserVault:AgentUpdated", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { newAgent } = event.args;

  await context.db
    .insert(schema.vault)
    .values({
      id: vaultId,
      agent: newAgent,
    })
    .onConflictDoUpdate({ agent: newAgent });
});
