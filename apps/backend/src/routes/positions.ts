import { Hono } from "hono";
import * as positionService from "../services/position-service.js";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

// Mock token addresses (deployed on Monad Testnet)
const MOCK_TOKENS = {
  MONAD: "0x700d18196d14244FcD7e9D87d5bBF5DE3c33B0e8",
  NADS: "0xCaBFa324576c655D0276647A7f0aF5e779123e0B",
  DEGEN: "0x8E304Ae201FF805eeEaa629b069289b94376F52F",
  PURP: "0x9dAf66b75d348D4f90B125a282bBFA608Ecec13C",
  CHAD: "0xA8adEFE2C8f0F71a585a73c1259997f593F9e463",
};

// Generate mock positions
function getMockPositions() {
  return [
    {
      id: "mock-1",
      tokenAddress: MOCK_TOKENS.MONAD,
      tokenSymbol: "MONAD",
      balance: "6666.67",
      costBasis: "0.01",
      entryPrice: "0.0000015",
      currentPrice: "0.0000017",
      currentValue: "0.01133",
      unrealizedPnl: "0.00133",
      unrealizedPnlPct: 13.3,
      targetAllocation: 40,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-2",
      tokenAddress: MOCK_TOKENS.NADS,
      tokenSymbol: "NADS",
      balance: "5882.35",
      costBasis: "0.005",
      entryPrice: "0.00000085",
      currentPrice: "0.00000123",
      currentValue: "0.00724",
      unrealizedPnl: "0.00224",
      unrealizedPnlPct: 44.8,
      targetAllocation: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "mock-3",
      tokenAddress: MOCK_TOKENS.PURP,
      tokenSymbol: "PURP",
      balance: "2380.95",
      costBasis: "0.01",
      entryPrice: "0.0000042",
      currentPrice: "0.0000045",
      currentValue: "0.01071",
      unrealizedPnl: "0.00071",
      unrealizedPnlPct: 7.1,
      targetAllocation: 30,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
}

const positions = new Hono();

// Get positions for a wallet
positions.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  // Return mock positions in mock mode
  if (USE_MOCK_DATA) {
    return c.json(getMockPositions());
  }

  const positionList = await positionService.getPositionsByWallet(walletAddress);
  return c.json(positionList);
});

// Get portfolio summary for a wallet
positions.get("/:walletAddress/summary", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  // Return mock summary in mock mode
  if (USE_MOCK_DATA) {
    const mockPositions = getMockPositions();
    const totalValue = mockPositions.reduce(
      (sum, p) => sum + parseFloat(p.currentValue),
      0
    );
    const totalCostBasis = mockPositions.reduce(
      (sum, p) => sum + parseFloat(p.costBasis),
      0
    );
    const totalPnl = totalValue - totalCostBasis;
    const totalPnlPct = totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;

    return c.json({
      totalValue: totalValue.toFixed(5),
      totalCostBasis: totalCostBasis.toFixed(5),
      totalPnl: totalPnl.toFixed(5),
      totalPnlPct: Math.round(totalPnlPct * 10) / 10,
      positionCount: mockPositions.length,
    });
  }

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
