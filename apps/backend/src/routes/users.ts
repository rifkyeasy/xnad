import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import * as userService from "../services/user-service.js";
import { CreateUserSchema, UpdateStrategySchema, AnalyzeXSchema } from "../types/index.js";
import { analyzeXAccount } from "../services/x-analyzer.js";

const users = new Hono();

// Create or update user
users.post(
  "/",
  zValidator("json", CreateUserSchema),
  async (c) => {
    const input = c.req.valid("json");
    const user = await userService.createUser(input);
    return c.json(user, 201);
  }
);

// Get user by wallet address
users.get("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");
  const user = await userService.getUser(walletAddress);

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

// Update user strategy
users.put(
  "/:walletAddress/strategy",
  zValidator("json", UpdateStrategySchema),
  async (c) => {
    const walletAddress = c.req.param("walletAddress");
    const input = c.req.valid("json");

    try {
      const user = await userService.updateUserStrategy(walletAddress, input);
      return c.json(user);
    } catch {
      return c.json({ error: "User not found" }, 404);
    }
  }
);

// Analyze X account and classify strategy
users.post(
  "/:walletAddress/analyze-x",
  zValidator("json", AnalyzeXSchema),
  async (c) => {
    const walletAddress = c.req.param("walletAddress");
    const { xHandle } = c.req.valid("json");

    try {
      // Analyze X account
      const { analysis, recommendedStrategy } = await analyzeXAccount(xHandle);

      // Update user with analysis results
      const user = await userService.updateUserXAnalysis(
        walletAddress,
        xHandle,
        analysis,
        recommendedStrategy
      );

      return c.json({
        user,
        analysis,
        recommendedStrategy,
      });
    } catch (error) {
      console.error("X analysis error:", error);
      return c.json({ error: "Failed to analyze X account" }, 500);
    }
  }
);

// Delete user
users.delete("/:walletAddress", async (c) => {
  const walletAddress = c.req.param("walletAddress");

  try {
    await userService.deleteUser(walletAddress);
    return c.json({ success: true });
  } catch {
    return c.json({ error: "User not found" }, 404);
  }
});

export default users;
