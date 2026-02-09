import { ponder } from "@ponder/core";
import * as schema from "../ponder.schema";

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
  });
});

// ============================================
// UserVault Event Handlers
// ============================================

ponder.on("UserVault:Deposited", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { user, amount } = event.args;

  // Insert deposit record
  await context.db.insert(schema.deposit).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    vaultId,
    user,
    amount,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  });

  // Update vault balance
  await context.db
    .update(schema.vault, { id: vaultId })
    .set((row) => ({
      balance: row.balance + amount,
      totalDeposited: row.totalDeposited + amount,
    }));
});

ponder.on("UserVault:Withdrawn", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { user, amount } = event.args;

  // Insert withdrawal record
  await context.db.insert(schema.withdrawal).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    vaultId,
    user,
    amount,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  });

  // Update vault balance
  await context.db
    .update(schema.vault, { id: vaultId })
    .set((row) => ({
      balance: row.balance - amount,
      totalWithdrawn: row.totalWithdrawn + amount,
    }));
});

ponder.on("UserVault:StrategyUpdated", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { strategyType, maxTradeAmount } = event.args;

  // Insert strategy update record
  await context.db.insert(schema.strategyUpdate).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    vaultId,
    strategyType,
    maxTradeAmount,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  });

  // Update vault strategy
  await context.db
    .update(schema.vault, { id: vaultId })
    .set({
      strategyType,
      maxTradeAmount,
    });
});

ponder.on("UserVault:TradeExecuted", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { token, isBuy, amountIn, amountOut, tradeId } = event.args;
  const positionId = `${vaultId}-${token.toLowerCase()}`;

  // Insert trade record
  await context.db.insert(schema.trade).values({
    id: `${event.transaction.hash}-${event.log.logIndex}`,
    vaultId,
    token,
    isBuy,
    amountIn,
    amountOut,
    tradeId,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    txHash: event.transaction.hash,
  });

  // Update vault trade count
  await context.db
    .update(schema.vault, { id: vaultId })
    .set((row) => ({
      tradeCount: row.tradeCount + 1,
    }));

  // Update position
  const existingPosition = await context.db.find(schema.position, { id: positionId });

  if (existingPosition) {
    if (isBuy) {
      // Buying tokens: spend MON, receive tokens
      await context.db
        .update(schema.position, { id: positionId })
        .set((row) => ({
          balance: row.balance + amountOut,
          totalBought: row.totalBought + amountOut,
          totalCostBasis: row.totalCostBasis + amountIn,
          buyCount: row.buyCount + 1,
          lastTradeAt: event.block.timestamp,
        }));

      // Also decrease vault MON balance
      await context.db
        .update(schema.vault, { id: vaultId })
        .set((row) => ({
          balance: row.balance - amountIn,
        }));
    } else {
      // Selling tokens: spend tokens, receive MON
      const avgCostPerToken = existingPosition.totalBought > 0n
        ? (existingPosition.totalCostBasis * amountIn) / existingPosition.totalBought
        : 0n;
      const realizedPnlDelta = amountOut - avgCostPerToken;

      await context.db
        .update(schema.position, { id: positionId })
        .set((row) => ({
          balance: row.balance - amountIn,
          totalSold: row.totalSold + amountIn,
          totalProceeds: row.totalProceeds + amountOut,
          realizedPnl: row.realizedPnl + realizedPnlDelta,
          sellCount: row.sellCount + 1,
          lastTradeAt: event.block.timestamp,
        }));

      // Also increase vault MON balance
      await context.db
        .update(schema.vault, { id: vaultId })
        .set((row) => ({
          balance: row.balance + amountOut,
        }));
    }
  } else {
    // Create new position (only on buy)
    if (isBuy) {
      await context.db.insert(schema.position).values({
        id: positionId,
        vaultId,
        token,
        balance: amountOut,
        totalBought: amountOut,
        totalSold: 0n,
        totalCostBasis: amountIn,
        totalProceeds: 0n,
        realizedPnl: 0n,
        buyCount: 1,
        sellCount: 0,
        firstTradeAt: event.block.timestamp,
        lastTradeAt: event.block.timestamp,
      });

      // Decrease vault MON balance
      await context.db
        .update(schema.vault, { id: vaultId })
        .set((row) => ({
          balance: row.balance - amountIn,
        }));
    }
  }
});

ponder.on("UserVault:Paused", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { isPaused } = event.args;

  await context.db
    .update(schema.vault, { id: vaultId })
    .set({ paused: isPaused });
});

ponder.on("UserVault:AgentUpdated", async ({ event, context }) => {
  const vaultId = event.log.address.toLowerCase();
  const { newAgent } = event.args;

  await context.db
    .update(schema.vault, { id: vaultId })
    .set({ agent: newAgent });
});
