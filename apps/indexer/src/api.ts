import { ponder } from "@ponder/core";
import * as schema from "../ponder.schema";
import { eq, desc, and } from "@ponder/core";

// ============================================
// Custom API Endpoints
// ============================================

// Get all vaults (for agent loop)
ponder.get("/api/vaults", async (c) => {
  const vaults = await c.db.select().from(schema.vault).orderBy(desc(schema.vault.createdAt));
  return c.json(vaults);
});

// Get vault by address
ponder.get("/api/vaults/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const vault = await c.db.select().from(schema.vault).where(eq(schema.vault.id, address)).limit(1);
  if (vault.length === 0) {
    return c.json({ error: "Vault not found" }, 404);
  }
  return c.json(vault[0]);
});

// Get vault by owner
ponder.get("/api/vaults/owner/:owner", async (c) => {
  const owner = c.req.param("owner").toLowerCase() as `0x${string}`;
  const vault = await c.db.select().from(schema.vault).where(eq(schema.vault.owner, owner)).limit(1);
  if (vault.length === 0) {
    return c.json({ error: "Vault not found" }, 404);
  }
  return c.json(vault[0]);
});

// Get all positions for a vault
ponder.get("/api/vaults/:address/positions", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const positions = await c.db
    .select()
    .from(schema.position)
    .where(eq(schema.position.vaultId, address))
    .orderBy(desc(schema.position.lastTradeAt));
  return c.json(positions);
});

// Get all trades for a vault
ponder.get("/api/vaults/:address/trades", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const limit = Number(c.req.query("limit") || 50);
  const offset = Number(c.req.query("offset") || 0);

  const trades = await c.db
    .select()
    .from(schema.trade)
    .where(eq(schema.trade.vaultId, address))
    .orderBy(desc(schema.trade.blockTimestamp))
    .limit(limit)
    .offset(offset);
  return c.json(trades);
});

// Get position for specific token in vault
ponder.get("/api/vaults/:address/positions/:token", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const token = c.req.param("token").toLowerCase();
  const positionId = `${address}-${token}`;

  const position = await c.db
    .select()
    .from(schema.position)
    .where(eq(schema.position.id, positionId))
    .limit(1);

  if (position.length === 0) {
    return c.json({ error: "Position not found" }, 404);
  }
  return c.json(position[0]);
});

// Get all positions across all vaults (for agent monitoring)
ponder.get("/api/positions", async (c) => {
  const minBalance = BigInt(c.req.query("minBalance") || "0");

  const positions = await c.db
    .select()
    .from(schema.position)
    .orderBy(desc(schema.position.lastTradeAt));

  // Filter by minimum balance in memory (Ponder doesn't support bigint comparisons in where)
  const filtered = positions.filter(p => p.balance && p.balance >= minBalance);
  return c.json(filtered);
});

// Get active vaults (not paused, with positions)
ponder.get("/api/vaults/active", async (c) => {
  const vaults = await c.db
    .select()
    .from(schema.vault)
    .where(eq(schema.vault.paused, false))
    .orderBy(desc(schema.vault.createdAt));

  return c.json(vaults);
});

// Get vault stats summary
ponder.get("/api/stats", async (c) => {
  const vaults = await c.db.select().from(schema.vault);
  const trades = await c.db.select().from(schema.trade);
  const positions = await c.db.select().from(schema.position);

  const totalDeposited = vaults.reduce((sum, v) => sum + (v.totalDeposited || 0n), 0n);
  const totalWithdrawn = vaults.reduce((sum, v) => sum + (v.totalWithdrawn || 0n), 0n);
  const totalBalance = vaults.reduce((sum, v) => sum + (v.balance || 0n), 0n);
  const totalRealizedPnl = positions.reduce((sum, p) => sum + (p.realizedPnl || 0n), 0n);

  return c.json({
    totalVaults: vaults.length,
    activeVaults: vaults.filter(v => !v.paused).length,
    totalTrades: trades.length,
    totalPositions: positions.length,
    totalDeposited: totalDeposited.toString(),
    totalWithdrawn: totalWithdrawn.toString(),
    totalBalance: totalBalance.toString(),
    totalRealizedPnl: totalRealizedPnl.toString(),
    strategyDistribution: {
      conservative: vaults.filter(v => v.strategyType === 0).length,
      balanced: vaults.filter(v => v.strategyType === 1).length,
      aggressive: vaults.filter(v => v.strategyType === 2).length,
    },
  });
});

// Get deposits for a vault
ponder.get("/api/vaults/:address/deposits", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const deposits = await c.db
    .select()
    .from(schema.deposit)
    .where(eq(schema.deposit.vaultId, address))
    .orderBy(desc(schema.deposit.blockTimestamp));
  return c.json(deposits);
});

// Get withdrawals for a vault
ponder.get("/api/vaults/:address/withdrawals", async (c) => {
  const address = c.req.param("address").toLowerCase();
  const withdrawals = await c.db
    .select()
    .from(schema.withdrawal)
    .where(eq(schema.withdrawal.vaultId, address))
    .orderBy(desc(schema.withdrawal.blockTimestamp));
  return c.json(withdrawals);
});

// Health check
ponder.get("/api/health", async (c) => {
  return c.json({ status: "ok", timestamp: Date.now() });
});
