import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import users from "./routes/users.js";
import trades from "./routes/trades.js";
import positions from "./routes/positions.js";

const USE_MOCK_DATA = process.env.USE_MOCK_DATA === "true";

// Mock tokens deployed on Monad Testnet
const MOCK_TOKENS = [
  {
    address: "0x700d18196d14244FcD7e9D87d5bBF5DE3c33B0e8",
    symbol: "MONAD",
    name: "Monad Token",
    description: "The native Monad community token",
    imageUri: "https://picsum.photos/seed/monad/200",
    price: "0.0015",
    change24h: 12.5,
    marketCap: "250000",
    volume24h: "45000",
    riskLevel: "low",
  },
  {
    address: "0xCaBFa324576c655D0276647A7f0aF5e779123e0B",
    symbol: "NADS",
    name: "Nads Token",
    description: "Community token for nad.fun degens",
    imageUri: "https://picsum.photos/seed/nads/200",
    price: "0.00085",
    change24h: 45.2,
    marketCap: "120000",
    volume24h: "78000",
    riskLevel: "medium",
  },
  {
    address: "0x8E304Ae201FF805eeEaa629b069289b94376F52F",
    symbol: "DEGEN",
    name: "Degen Mode",
    description: "For the true degens only",
    imageUri: "https://picsum.photos/seed/degen/200",
    price: "0.00023",
    change24h: 156.8,
    marketCap: "45000",
    volume24h: "120000",
    riskLevel: "high",
  },
  {
    address: "0x9dAf66b75d348D4f90B125a282bBFA608Ecec13C",
    symbol: "PURP",
    name: "Purple Pill",
    description: "Take the purple pill and enter Monad",
    imageUri: "https://picsum.photos/seed/purp/200",
    price: "0.0042",
    change24h: 8.3,
    marketCap: "380000",
    volume24h: "25000",
    riskLevel: "low",
  },
  {
    address: "0xA8adEFE2C8f0F71a585a73c1259997f593F9e463",
    symbol: "CHAD",
    name: "Monad Chad",
    description: "The ultimate chad token",
    imageUri: "https://picsum.photos/seed/chad/200",
    price: "0.00067",
    change24h: -5.2,
    marketCap: "95000",
    volume24h: "32000",
    riskLevel: "medium",
  },
];

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
  })
);

// Health check
app.get("/health", (c) => c.json({ status: "ok", timestamp: new Date().toISOString() }));

// Routes
app.route("/api/users", users);
app.route("/api/trades", trades);
app.route("/api/positions", positions);

// Agent endpoints
app.get("/api/agent/users", async (c) => {
  const { getAllActiveUsers } = await import("./services/user-service.js");
  const users = await getAllActiveUsers();
  return c.json(users);
});

// Tokens endpoint
app.get("/api/tokens", (c) => {
  // In mock mode, return mock tokens
  if (USE_MOCK_DATA) {
    return c.json(MOCK_TOKENS);
  }
  // In real mode, this would fetch from nad.fun API
  return c.json([]);
});

// Get single token with live market data
app.get("/api/tokens/:address", async (c) => {
  const address = c.req.param("address");

  const baseToken = MOCK_TOKENS.find(
    (t) => t.address.toLowerCase() === address.toLowerCase()
  );

  if (!baseToken) {
    return c.json({ error: "Token not found" }, 404);
  }

  // Get live market data from blockchain
  const { getTokenMarketData } = await import("./services/blockchain-service.js");
  const marketData = await getTokenMarketData(address, baseToken.symbol);

  if (marketData) {
    return c.json({
      ...baseToken,
      price: marketData.price,
      priceUsd: marketData.priceUsd,
      change24h: marketData.change24h,
      volume24h: marketData.volume24h,
      marketCap: marketData.marketCap,
      momentum: marketData.momentum,
      liquidity: marketData.liquidity,
    });
  }

  return c.json(baseToken);
});

// Get pool info for a token
app.get("/api/tokens/:address/pool", async (c) => {
  const address = c.req.param("address");

  const { getPoolInfo } = await import("./services/blockchain-service.js");
  const poolInfo = await getPoolInfo(address);

  if (!poolInfo) {
    return c.json({
      initialized: false,
      message: "Pool not initialized. First trade will create it.",
    });
  }

  return c.json({
    initialized: true,
    ...poolInfo,
  });
});

// Get all tokens with live prices
app.get("/api/tokens/live", async (c) => {
  const { getTokenMarketData } = await import("./services/blockchain-service.js");

  const tokensWithPrices = await Promise.all(
    MOCK_TOKENS.map(async (token) => {
      const marketData = await getTokenMarketData(token.address, token.symbol);
      return {
        ...token,
        ...(marketData || {}),
      };
    })
  );

  return c.json(tokensWithPrices);
});

// Get wallet balances
app.get("/api/wallet/:address/balances", async (c) => {
  const walletAddress = c.req.param("address");

  const { getWalletBalance, getTokenBalance } = await import(
    "./services/blockchain-service.js"
  );

  const monBalance = await getWalletBalance(walletAddress);

  const tokenBalances = await Promise.all(
    MOCK_TOKENS.map(async (token) => {
      const balance = await getTokenBalance(token.address, walletAddress);
      return {
        address: token.address,
        symbol: token.symbol,
        name: token.name,
        balance,
      };
    })
  );

  return c.json({
    mon: monBalance,
    tokens: tokenBalances.filter((t) => parseFloat(t.balance) > 0),
  });
});

// Error handler
app.onError((err, c) => {
  console.error("Server error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
