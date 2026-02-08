import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as tradeService from "../services/trade-service.js";
import * as userService from "../services/user-service.js";
import { RecordTradeSchema } from "../types/index.js";

const trades = new Hono();

// Get trades for a wallet
trades.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");
  const limit = parseInt(c.req.query("limit") || "50");
  const offset = parseInt(c.req.query("offset") || "0");

  const tradeList = await tradeService.getTradesByWallet(walletAddress, limit, offset);
  return c.json(tradeList);
});

// Record a new trade
trades.post(
  "/:walletAddress",
  zValidator("json", RecordTradeSchema),
  async (c) => {
    const walletAddress = c.req.param("walletAddress");
    const input = c.req.valid("json");

    const user = await userService.getUser(walletAddress);
    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const trade = await tradeService.recordTrade(user.id, input);
    return c.json(trade, 201);
  }
);

// Get trade stats for a wallet
trades.get("/:walletAddress/stats", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  const user = await userService.getUser(walletAddress);
  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const stats = await tradeService.getTradeStats(user.id);
  return c.json(stats);
});

export default trades;
