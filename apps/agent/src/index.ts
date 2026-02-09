import { WATCHED_ACCOUNTS, TRADING_CONFIG, ENV } from "./config.js";
import { getTweets, filterSignalTweets, extractTokenAddresses } from "./x-service.js";
import { analyzeTweet, getActionableSignals, type TweetAnalysis } from "./ai-analyzer.js";
import { getTradingClient, type TradingClient, type TradeResult } from "./trading-client.js";

// Track processed tweet IDs to avoid duplicates
const processedTweets = new Set<string>();

// Trade history for logging
const tradeHistory: TradeResult[] = [];

async function fetchAndAnalyzeTweets(): Promise<TweetAnalysis[]> {
  const allAnalyses: TweetAnalysis[] = [];

  console.log(`\n=== Fetching tweets from ${WATCHED_ACCOUNTS.length} accounts ===`);

  for (const account of WATCHED_ACCOUNTS) {
    try {
      console.log(`\nChecking @${account}...`);
      const tweets = await getTweets(account);

      // Filter out already processed tweets
      const newTweets = tweets.filter((t) => !processedTweets.has(t.id));
      if (newTweets.length === 0) {
        console.log(`  No new tweets from @${account}`);
        continue;
      }

      console.log(`  Found ${newTweets.length} new tweets`);

      // Filter for signal keywords
      const signalTweets = filterSignalTweets(newTweets);
      console.log(`  ${signalTweets.length} contain signal keywords`);

      // Analyze each signal tweet
      for (const tweet of signalTweets) {
        // Mark as processed
        processedTweets.add(tweet.id);

        // Extract any token addresses from the tweet
        const addresses = extractTokenAddresses(tweet);
        if (addresses.length > 0) {
          console.log(`  Found token addresses: ${addresses.join(", ")}`);
        }

        // Analyze with AI
        const analysis = await analyzeTweet(tweet);
        allAnalyses.push(analysis);

        if (analysis.signal) {
          console.log(`  Signal: ${analysis.signal.action.toUpperCase()}`);
          console.log(`  Confidence: ${(analysis.signal.confidence * 100).toFixed(0)}%`);
          console.log(`  Risk: ${analysis.signal.riskLevel}`);
        }
      }

      // Rate limit between accounts
      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      console.error(`Error processing @${account}:`, error);
    }
  }

  return allAnalyses;
}

async function executeSignals(
  client: TradingClient,
  analyses: TweetAnalysis[]
): Promise<TradeResult[]> {
  const results: TradeResult[] = [];

  // Get actionable signals (high confidence, has token address)
  const actionable = getActionableSignals(analyses, TRADING_CONFIG.minConfidence);

  if (actionable.length === 0) {
    console.log("\nNo actionable signals found");
    return results;
  }

  console.log(`\n=== Executing ${actionable.length} trades ===`);

  for (const analysis of actionable) {
    if (!analysis.signal) continue;

    console.log(`\nTrade: ${analysis.signal.action.toUpperCase()}`);
    console.log(`Token: ${analysis.signal.tokenAddress || analysis.signal.tokenSymbol}`);
    console.log(`Reason: ${analysis.signal.reasoning}`);

    // Execute the trade
    let result: TradeResult;
    if (analysis.signal.action === "buy") {
      result = await client.executeBuy(analysis.signal);
    } else if (analysis.signal.action === "sell" && analysis.signal.tokenAddress) {
      const amount = analysis.signal.suggestedAmount || "0";
      result = await client.executeSell(analysis.signal.tokenAddress, amount);
    } else {
      console.log("SKIPPED: Hold signal or missing token address");
      continue;
    }

    results.push(result);
    tradeHistory.push(result);

    if (result.success) {
      console.log(`SUCCESS: ${result.txHash}`);
    } else {
      console.log(`FAILED: ${result.error}`);
    }

    // Delay between trades
    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}

async function runAgentLoop(client: TradingClient): Promise<void> {
  console.log("\n========================================");
  console.log("  Social-Execution Trading Agent");
  console.log("  Powered by nad.fun");
  console.log("========================================");
  console.log(`Wallet: ${client.address}`);
  console.log(`Balance: ${await client.getBalance()} MON`);
  console.log(`Watching: ${WATCHED_ACCOUNTS.join(", ")}`);
  console.log(`Poll interval: ${TRADING_CONFIG.pollIntervalMs / 1000}s`);
  console.log(`Min confidence: ${TRADING_CONFIG.minConfidence * 100}%`);
  console.log(`Max buy: ${TRADING_CONFIG.maxBuyAmount} MON`);
  console.log("========================================\n");

  while (true) {
    try {
      // Fetch and analyze tweets
      const analyses = await fetchAndAnalyzeTweets();

      // Execute trades for actionable signals
      if (analyses.length > 0) {
        await executeSignals(client, analyses);
      }

      // Log status
      console.log(`\n--- Status ---`);
      console.log(`Processed tweets: ${processedTweets.size}`);
      console.log(`Total trades: ${tradeHistory.length}`);
      console.log(`Successful: ${tradeHistory.filter((t) => t.success).length}`);
      console.log(`Next check in ${TRADING_CONFIG.pollIntervalMs / 1000}s...\n`);

      // Wait for next poll
      await new Promise((r) => setTimeout(r, TRADING_CONFIG.pollIntervalMs));
    } catch (error) {
      console.error("Agent loop error:", error);
      // Continue running after errors
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

// Validate environment
function validateEnv(): boolean {
  const missing: string[] = [];

  if (!ENV.OPENAI_API_KEY) missing.push("OPENAI_API_KEY");
  if (!ENV.X_RAPIDAPI_KEY) missing.push("X_RAPIDAPI_API_KEY");
  if (!ENV.PRIVATE_KEY) missing.push("PRIVATE_KEY");

  if (missing.length > 0) {
    console.error("Missing required environment variables:");
    missing.forEach((v) => console.error(`  - ${v}`));
    return false;
  }

  return true;
}

// Main entry point
async function main(): Promise<void> {
  console.log("Starting Social-Execution Trading Agent...\n");

  if (!validateEnv()) {
    process.exit(1);
  }

  try {
    const client = getTradingClient();
    await runAgentLoop(client);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
}

main();
