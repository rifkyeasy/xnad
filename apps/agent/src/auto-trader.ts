/**
 * Auto-Trader
 * Automatically discovers and trades nad.fun tokens based on user strategy
 */

import { type TradeResult } from './nadfun-client.js';
import { type VaultClient } from './vault-client.js';
import { getPositionManager } from './position-manager.js';
import {
  getStrategyConfig,
  type StrategyType,
  type StrategyConfig,
} from './strategy-classifier.js';
import { ENV } from './config.js';
import { log } from './logger.js';

const BACKEND_URL = process.env.BACKEND_URL || 'https://api.xnad.fun';

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  marketCap: number;
  priceChange24h: number;
  volume24h: number;
  createdAt: number;
  isNew: boolean;
}

export interface AutoTradeSignal {
  token: TokenInfo;
  action: 'buy' | 'sell';
  amount: string;
  reason: string;
  confidence: number;
}

// Known valid testnet tokens (verified to exist on nad.fun testnet)
const VALID_TESTNET_TOKENS: TokenInfo[] = [
  {
    address: '0x2F0292D4b34601D97ee7E52b2058f11928B87777',
    name: 'Shramp',
    symbol: 'SHRAMP',
    marketCap: 10000,
    priceChange24h: 25.5,
    volume24h: 5000,
    createdAt: Date.now() - 1 * 60 * 60 * 1000,
    isNew: true,
  },
  {
    address: '0xFBD84ab1526BfbA7533b1EC2842894eE92777777',
    name: 'Draliens',
    symbol: 'DRA',
    marketCap: 10000,
    priceChange24h: 50.0,
    volume24h: 8000,
    createdAt: Date.now() - 30 * 60 * 1000,
    isNew: true,
  },
  {
    address: '0x6946EE2E38e871B6cE0a70908F806036e9387777',
    name: 'Chog',
    symbol: 'CHOG',
    marketCap: 50000,
    priceChange24h: 12.5,
    volume24h: 15000,
    createdAt: Date.now() - 7 * 24 * 60 * 60 * 1000,
    isNew: false,
  },
];

/**
 * Fetch trending/new tokens from nad.fun API
 */
async function fetchNadFunTokens(): Promise<TokenInfo[]> {
  try {
    const response = await fetch('https://testnet-api.nad.fun/tokens?sort=trending&limit=20');
    if (response.ok) {
      const data = (await response.json()) as { tokens?: Record<string, unknown>[] };
      if (data.tokens && data.tokens.length > 0) {
        return data.tokens.map((t: Record<string, unknown>) => ({
          address: t.address as string,
          name: t.name as string,
          symbol: t.symbol as string,
          marketCap: Number(t.marketCap) || 0,
          priceChange24h: Number(t.priceChange24h) || 0,
          volume24h: Number(t.volume24h) || 0,
          createdAt: Number(t.createdAt) || Date.now(),
          isNew: Date.now() - (Number(t.createdAt) || 0) < 24 * 60 * 60 * 1000,
        }));
      }
    }
  } catch {
    log.debug('nad.fun API unavailable, using fallback tokens');
  }

  log.info('Using verified testnet tokens (SHRAMP, DRA, CHOG)');
  return VALID_TESTNET_TOKENS;
}

/**
 * Filter tokens based on strategy
 */
function filterTokensForStrategy(
  tokens: TokenInfo[],
  strategy: StrategyType,
  config: StrategyConfig
): TokenInfo[] {
  return tokens.filter((token) => {
    switch (strategy) {
      case 'CONSERVATIVE':
        return token.marketCap >= 50000;
      case 'BALANCED':
        return token.marketCap >= 10000 && token.marketCap <= 200000;
      case 'AGGRESSIVE':
        return true;
    }
  });
}

/**
 * Score a token for trading potential
 */
function scoreToken(token: TokenInfo, strategy: StrategyType): number {
  let score = 0.5;

  if (token.priceChange24h > 0) {
    score += Math.min(token.priceChange24h / 100, 0.2);
  }

  if (token.volume24h > 1000) {
    score += 0.1;
  }

  switch (strategy) {
    case 'CONSERVATIVE':
      if (token.marketCap > 100000) score += 0.15;
      if (!token.isNew) score += 0.1;
      break;
    case 'BALANCED':
      if (token.priceChange24h > 10) score += 0.1;
      if (token.marketCap > 20000) score += 0.1;
      break;
    case 'AGGRESSIVE':
      if (token.isNew) score += 0.15;
      if (token.priceChange24h > 20) score += 0.15;
      break;
  }

  return Math.min(score, 1);
}

/**
 * Generate auto-trade signals
 */
export async function generateAutoTradeSignals(
  strategy: StrategyType,
  existingPositions: string[],
  vaultMaxTradeAmount?: string
): Promise<AutoTradeSignal[]> {
  const config = getStrategyConfig(strategy);
  const signals: AutoTradeSignal[] = [];

  const strategyMax = parseFloat(config.maxTradeAmount);
  const vaultMax = vaultMaxTradeAmount ? parseFloat(vaultMaxTradeAmount) : strategyMax;
  const effectiveMaxTrade = Math.min(strategyMax, vaultMax);

  log.kv('Max trade', `${effectiveMaxTrade} MON (strategy: ${strategyMax}, vault: ${vaultMax})`);

  const allTokens = await fetchNadFunTokens();
  log.kv('Tokens fetched', allTokens.length);

  const eligibleTokens = filterTokensForStrategy(allTokens, strategy, config);
  log.kv('Eligible', `${eligibleTokens.length} for ${strategy}`);

  const scoredTokens = eligibleTokens
    .map((token) => ({
      token,
      score: scoreToken(token, strategy),
    }))
    .sort((a, b) => b.score - a.score);

  const maxNewPositions = strategy === 'AGGRESSIVE' ? 3 : strategy === 'BALANCED' ? 2 : 1;
  let newPositions = 0;

  for (const { token, score } of scoredTokens) {
    if (newPositions >= maxNewPositions) break;
    if (existingPositions.includes(token.address.toLowerCase())) continue;
    if (score < config.minConfidence) continue;

    signals.push({
      token,
      action: 'buy',
      amount: effectiveMaxTrade.toString(),
      reason: `${token.symbol} scores ${(score * 100).toFixed(0)}% for ${strategy}`,
      confidence: score,
    });

    newPositions++;
  }

  return signals;
}

/**
 * Execute auto-trade signals via vault
 */
export async function executeAutoTradeSignals(
  vaultAddress: string,
  ownerAddress: string,
  signals: AutoTradeSignal[],
  vaultClient: VaultClient
): Promise<TradeResult[]> {
  const results: TradeResult[] = [];

  for (const signal of signals) {
    log.trade(
      signal.action.toUpperCase() as 'BUY' | 'SELL',
      signal.token.symbol,
      signal.amount,
      signal.reason
    );

    if (ENV.DRY_RUN) {
      log.dry('Trade skipped (dry run)');
      results.push({ success: true, txHash: 'dry-run' });
      continue;
    }

    try {
      if (signal.action === 'buy') {
        const deadline = BigInt(Math.floor(Date.now() / 1000) + 300);
        const minAmountOut = '0';

        const result = await vaultClient.executeBuy(
          vaultAddress,
          signal.token.address,
          signal.amount,
          minAmountOut,
          deadline
        );
        results.push(result);

        if (result.success) {
          log.tradeResult(true, `tx: ${result.txHash}`);

          await recordAutoTrade(
            vaultAddress,
            signal.token.address,
            signal.token.symbol,
            signal.action,
            signal.amount,
            result.amountOut || '0',
            result.txHash || '',
            signal.reason
          );

          await syncPositionToBackend(
            ownerAddress,
            signal.token.address,
            signal.token.symbol,
            result.amountOut || '0',
            signal.amount
          );
        } else {
          log.tradeResult(false, result.error || 'Unknown error');
        }
      }
    } catch (error) {
      log.error('Trade execution failed', error);
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}

/**
 * Record auto-trade to backend
 */
async function recordAutoTrade(
  vaultAddress: string,
  tokenAddress: string,
  tokenSymbol: string,
  action: 'buy' | 'sell',
  amountIn: string,
  amountOut: string,
  txHash: string,
  reasoning: string
): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/trades/${vaultAddress}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenAddress,
        tokenSymbol,
        action: action.toUpperCase(),
        amountIn,
        amountOut,
        confidence: 1.0,
        signalSource: 'auto-trade',
        reasoning,
        txHash,
      }),
    });
  } catch {
    // Ignore backend errors
  }
}

/**
 * Sync position to backend after trade
 */
async function syncPositionToBackend(
  ownerAddress: string,
  tokenAddress: string,
  tokenSymbol: string,
  balance: string,
  costBasis: string
): Promise<void> {
  try {
    const entryPrice = parseFloat(balance) > 0
      ? (parseFloat(costBasis) / parseFloat(balance)).toString()
      : '0';

    await fetch(`${BACKEND_URL}/api/positions/${ownerAddress}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenAddress,
        tokenSymbol,
        balance,
        costBasis,
        entryPrice,
        currentPrice: entryPrice,
        currentValue: costBasis,
        unrealizedPnl: '0',
        unrealizedPnlPct: 0,
      }),
    });
    log.success(`Position synced: ${tokenSymbol}`);
  } catch (error) {
    log.error('Failed to sync position', error);
  }
}

/**
 * Auto-trader class for managing auto-trading
 */
export class AutoTrader {
  private vaultClient: VaultClient;
  private positionManager: ReturnType<typeof getPositionManager>;
  private lastTradeTime: Map<string, number> = new Map();
  private processedVaults: Set<string> = new Set();
  private minTradeCooldown = 5 * 60 * 1000;

  constructor(vaultClient: VaultClient) {
    this.vaultClient = vaultClient;
    this.positionManager = getPositionManager();
  }

  canTrade(vaultAddress: string, hasPositions: boolean): boolean {
    const vaultKey = vaultAddress.toLowerCase();

    if (!this.processedVaults.has(vaultKey) && !hasPositions) {
      return true;
    }

    const lastTrade = this.lastTradeTime.get(vaultKey);
    if (!lastTrade) return true;
    return Date.now() - lastTrade >= this.minTradeCooldown;
  }

  async processVault(
    vaultAddress: string,
    ownerAddress: string,
    strategy: StrategyType,
    vaultBalance: string,
    vaultMaxTradeAmount?: string
  ): Promise<TradeResult[]> {
    const vaultKey = vaultAddress.toLowerCase();

    const balance = parseFloat(vaultBalance);

    if (balance <= 0) {
      log.skip(`${log.addr(vaultAddress)} balance 0, skipping`);
      return [];
    }

    const config = getStrategyConfig(strategy);

    const strategyMax = parseFloat(config.maxTradeAmount);
    const vaultMax = vaultMaxTradeAmount ? parseFloat(vaultMaxTradeAmount) : strategyMax;
    const effectiveMaxTrade = Math.min(strategyMax, vaultMax);

    if (balance < effectiveMaxTrade) {
      log.warn(`Insufficient balance: ${balance.toFixed(4)} < ${effectiveMaxTrade} MON`);
      return [];
    }

    const positions = await this.positionManager.getVaultPositions(vaultAddress);
    const existingTokens = positions.map((p) => p.token.toLowerCase());
    const hasPositions = positions.length > 0;

    const isNewDeposit = !this.processedVaults.has(vaultKey) && !hasPositions && balance > 0;
    if (isNewDeposit) {
      log.success('New deposit detected! Executing first trade...');
    }

    if (!this.canTrade(vaultAddress, hasPositions)) {
      const remaining = Math.ceil(
        (this.minTradeCooldown - (Date.now() - (this.lastTradeTime.get(vaultKey) || 0))) / 1000
      );
      log.skip(`Cooldown (${remaining}s remaining)`);
      return [];
    }

    const signals = await generateAutoTradeSignals(strategy, existingTokens, vaultMaxTradeAmount);

    if (signals.length === 0) {
      log.skip('No trade signals generated');
      this.processedVaults.add(vaultKey);
      return [];
    }

    log.info(`Generated ${signals.length} trade signals`);

    const results = await executeAutoTradeSignals(vaultAddress, ownerAddress, signals, this.vaultClient);

    if (results.some((r) => r.success)) {
      this.lastTradeTime.set(vaultKey, Date.now());
      this.processedVaults.add(vaultKey);
      log.success('Trade cycle complete');
    }

    return results;
  }

  resetCooldown(vaultAddress: string): void {
    const vaultKey = vaultAddress.toLowerCase();
    this.lastTradeTime.delete(vaultKey);
    this.processedVaults.delete(vaultKey);
  }
}
