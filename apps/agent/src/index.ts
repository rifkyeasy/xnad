import { WATCHED_ACCOUNTS, TRADING_CONFIG, ENV } from './config.js';
import { getTweets, filterSignalTweets, extractTokenAddresses } from './x-service.js';
import { analyzeTweet, getActionableSignals, type TweetAnalysis } from './ai-analyzer.js';
import { getTradingClient, type TradingClient, type TradeResult } from './trading-client.js';
import { log } from './logger.js';

// Track processed tweet IDs to avoid duplicates
const processedTweets = new Set<string>();

// Pending signals waiting to be executed
let pendingSignals: TweetAnalysis[] = [];

// Trade history
const tradeHistory: TradeResult[] = [];

// Last X check timestamp
let lastXCheckAt = 0;

async function fetchAndAnalyzeTweets(): Promise<TweetAnalysis[]> {
  const allAnalyses: TweetAnalysis[] = [];

  log.section(`Checking ${WATCHED_ACCOUNTS.length} X accounts`);

  for (const account of WATCHED_ACCOUNTS) {
    try {
      log.x('Scanning', `@${account}`);
      const tweets = await getTweets(account);

      const newTweets = tweets.filter((t) => !processedTweets.has(t.id));
      if (newTweets.length === 0) {
        log.skip(`No new tweets from @${account}`);
        continue;
      }

      log.info(`Found ${newTweets.length} new tweets from @${account}`);

      const signalTweets = filterSignalTweets(newTweets);
      if (signalTweets.length === 0) {
        log.skip(`No signal keywords in tweets from @${account}`);
        continue;
      }

      log.info(`${signalTweets.length} tweets contain signal keywords`);

      for (const tweet of signalTweets) {
        processedTweets.add(tweet.id);

        const addresses = extractTokenAddresses(tweet);
        if (addresses.length > 0) {
          log.info(`Token addresses: ${addresses.join(', ')}`);
        }

        const analysis = await analyzeTweet(tweet);
        allAnalyses.push(analysis);

        if (analysis.signal) {
          log.tweet(
            account,
            `${analysis.signal.action.toUpperCase()} ${analysis.signal.tokenSymbol || ''}`,
            analysis.signal.confidence
          );
          log.kv('Risk', analysis.signal.riskLevel);
        }
      }

      await new Promise((r) => setTimeout(r, 1000));
    } catch (error) {
      log.error(`Failed to process @${account}`, error);
    }
  }

  return allAnalyses;
}

async function executeSignals(
  client: TradingClient,
  analyses: TweetAnalysis[]
): Promise<TradeResult[]> {
  const results: TradeResult[] = [];

  const actionable = getActionableSignals(analyses, TRADING_CONFIG.minConfidence);

  if (actionable.length === 0) {
    log.skip('No actionable signals to execute');
    return results;
  }

  log.section(`Executing ${actionable.length} trades`);

  for (const analysis of actionable) {
    if (!analysis.signal) continue;

    const symbol = analysis.signal.tokenSymbol || analysis.signal.tokenAddress || 'UNKNOWN';
    const amount = analysis.signal.suggestedAmount || TRADING_CONFIG.maxBuyAmount;

    log.trade(
      analysis.signal.action === 'buy' ? 'BUY' : 'SELL',
      symbol,
      amount,
      analysis.signal.reasoning
    );

    let result: TradeResult;
    if (analysis.signal.action === 'buy') {
      result = await client.executeBuy(analysis.signal);
    } else if (analysis.signal.action === 'sell' && analysis.signal.tokenAddress) {
      const sellAmount = analysis.signal.suggestedAmount || '0';
      result = await client.executeSell(analysis.signal.tokenAddress, sellAmount);
    } else {
      log.skip('Hold signal or missing token address');
      continue;
    }

    results.push(result);
    tradeHistory.push(result);

    log.tradeResult(result.success, result.success ? `tx ${result.txHash}` : `${result.error}`);

    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}

async function runAgentLoop(client: TradingClient): Promise<void> {
  log.banner('Trading Agent', {
    Wallet: log.addr(client.address),
    Balance: `${await client.getBalance()} MON`,
    Watching: WATCHED_ACCOUNTS.join(', '),
    'X Check': `${TRADING_CONFIG.xCheckIntervalMs / 60000} min`,
    'Trade Loop': `${TRADING_CONFIG.tradeIntervalMs / 1000}s`,
    'Min Confidence': `${TRADING_CONFIG.minConfidence * 100}%`,
    'Max Buy': `${TRADING_CONFIG.maxBuyAmount} MON`,
    'Dry Run': ENV.DRY_RUN ? 'Yes' : 'No',
  });

  while (true) {
    try {
      const now = Date.now();

      // Check X accounts every hour
      if (now - lastXCheckAt >= TRADING_CONFIG.xCheckIntervalMs) {
        lastXCheckAt = now;
        const analyses = await fetchAndAnalyzeTweets();
        if (analyses.length > 0) {
          pendingSignals.push(...analyses);
          log.info(`Queued ${analyses.length} new signals (${pendingSignals.length} pending)`);
        }
      }

      // Execute pending signals every 30 seconds
      if (pendingSignals.length > 0) {
        const toExecute = pendingSignals.splice(0, pendingSignals.length);
        await executeSignals(client, toExecute);
      }

      // Status
      const nextXCheck = Math.max(0, TRADING_CONFIG.xCheckIntervalMs - (Date.now() - lastXCheckAt));
      log.status({
        Tweets: processedTweets.size,
        Trades: tradeHistory.length,
        Won: tradeHistory.filter((t) => t.success).length,
        Pending: pendingSignals.length,
        'Next X': `${Math.ceil(nextXCheck / 60000)}m`,
      });

      await new Promise((r) => setTimeout(r, TRADING_CONFIG.tradeIntervalMs));
    } catch (error) {
      log.error('Agent loop error', error);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

function validateEnv(): boolean {
  const missing: string[] = [];

  if (!ENV.OPENAI_API_KEY) missing.push('OPENAI_API_KEY');
  if (!ENV.X_RAPIDAPI_KEY) missing.push('X_RAPIDAPI_API_KEY');
  if (!ENV.PRIVATE_KEY) missing.push('PRIVATE_KEY');

  if (missing.length > 0) {
    log.fatal('Missing required environment variables');
    for (const v of missing) {
      log.kv('Missing', v);
    }
    return false;
  }

  return true;
}

async function main(): Promise<void> {
  log.info('Starting XNAD Trading Agent...');

  if (!validateEnv()) {
    process.exit(1);
  }

  try {
    const client = getTradingClient();
    await runAgentLoop(client);
  } catch (error) {
    log.fatal('Fatal error', error);
    process.exit(1);
  }
}

main();
