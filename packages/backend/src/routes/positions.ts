import { Hono } from "hono";
import * as positionService from "../services/position-service.js";

const positions = new Hono();

// Get positions for a wallet
positions.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");
  const positionList = await positionService.getPositionsByWallet(walletAddress);
  return c.json(positionList);
});

// Get portfolio summary for a wallet
positions.get("/:walletAddress/summary", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  // Get user first
  const { prisma } = await import("../db/client.js");
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const summary = await positionService.getPortfolioValue(user.id);
  return c.json(summary);
});

export default positions;
