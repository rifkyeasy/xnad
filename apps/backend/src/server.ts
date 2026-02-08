import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import users from "./routes/users.js";
import trades from "./routes/trades.js";
import positions from "./routes/positions.js";

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
