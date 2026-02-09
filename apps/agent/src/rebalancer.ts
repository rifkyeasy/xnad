import { VaultClient, type TradeResult } from './vault-client.js';
import type { Position } from './sell-manager.js';
import type { StrategyConfig } from './strategy-classifier.js';

export interface TargetAllocation {
  tokenAddress: string;
  tokenSymbol: string;
  targetPercent: number; // 0-100
}

export interface RebalanceTrade {
  tokenAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amount: string; // MON for buy, tokens for sell
  reason: string;
}

export interface RebalanceResult {
  trades: RebalanceTrade[];
  executed: boolean;
  results: TradeResult[];
}

export class Rebalancer {
  private vaultClient: VaultClient;
  private lastRebalanceTime: Map<string, number> = new Map(); // vaultAddress -> timestamp

  constructor(vaultClient: VaultClient) {
    this.vaultClient = vaultClient;
  }

  // Check if rebalance is due based on interval
  isRebalanceDue(vaultAddress: string, intervalHours: number): boolean {
    const lastTime = this.lastRebalanceTime.get(vaultAddress) || 0;
    const now = Date.now();
    const intervalMs = intervalHours * 60 * 60 * 1000;

    return now - lastTime >= intervalMs;
  }

  // Calculate required trades to reach target allocation
  calculateRebalanceTrades(
    positions: Position[],
    targets: TargetAllocation[],
    vaultBalance: string, // Available MON in vault
    deviationThreshold: number = 5 // Min % deviation to trigger
  ): RebalanceTrade[] {
    const trades: RebalanceTrade[] = [];

    // Calculate total portfolio value (positions + vault balance)
    const positionsValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
    const availableMon = parseFloat(vaultBalance);
    const totalValue = positionsValue + availableMon;

    if (totalValue === 0) return trades;

    // Check each target allocation
    for (const target of targets) {
      const position = positions.find((p) => p.tokenAddress === target.tokenAddress);
      const currentValue = position ? parseFloat(position.currentValue) : 0;
      const currentPercent = (currentValue / totalValue) * 100;
      const deviation = Math.abs(currentPercent - target.targetPercent);

      // Only rebalance if deviation exceeds threshold
      if (deviation < deviationThreshold) continue;

      if (currentPercent < target.targetPercent) {
        // Need to buy more
        const targetValue = (target.targetPercent / 100) * totalValue;
        const amountToBuy = Math.min(
          targetValue - currentValue,
          availableMon * 0.9 // Keep 10% buffer
        );

        if (amountToBuy > 0.001) {
          // Min 0.001 MON
          trades.push({
            tokenAddress: target.tokenAddress,
            tokenSymbol: target.tokenSymbol,
            action: 'buy',
            amount: amountToBuy.toFixed(6),
            reason: `Rebalance: ${currentPercent.toFixed(1)}% -> ${target.targetPercent}%`,
          });
        }
      } else {
        // Need to sell some
        if (!position) continue;

        const targetValue = (target.targetPercent / 100) * totalValue;
        const excessValue = currentValue - targetValue;
        const percentToSell = excessValue / currentValue;
        const tokensToSell = parseFloat(position.balance) * percentToSell;

        if (tokensToSell > 0) {
          trades.push({
            tokenAddress: target.tokenAddress,
            tokenSymbol: target.tokenSymbol,
            action: 'sell',
            amount: tokensToSell.toFixed(6),
            reason: `Rebalance: ${currentPercent.toFixed(1)}% -> ${target.targetPercent}%`,
          });
        }
      }
    }

    return trades;
  }

  // Execute rebalance trades
  async executeRebalance(
    vaultAddress: string,
    trades: RebalanceTrade[],
    config: StrategyConfig
  ): Promise<RebalanceResult> {
    const results: TradeResult[] = [];

    console.log(`\n=== Executing Rebalance (${trades.length} trades) ===`);

    // Execute sells first to free up MON
    const sellTrades = trades.filter((t) => t.action === 'sell');
    const buyTrades = trades.filter((t) => t.action === 'buy');

    for (const trade of sellTrades) {
      console.log(`Selling ${trade.amount} ${trade.tokenSymbol}: ${trade.reason}`);

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

      // Calculate min output with slippage
      // For rebalancing, use moderate slippage (3%)
      const result = await this.vaultClient.executeSell(
        vaultAddress,
        trade.tokenAddress,
        trade.amount,
        '0', // Accept any output for rebalance
        deadline
      );

      results.push(result);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Then execute buys
    for (const trade of buyTrades) {
      console.log(`Buying ${trade.amount} MON of ${trade.tokenSymbol}: ${trade.reason}`);

      // Check if amount exceeds max trade
      const amount = Math.min(parseFloat(trade.amount), parseFloat(config.maxTradeAmount));

      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

      const result = await this.vaultClient.executeBuy(
        vaultAddress,
        trade.tokenAddress,
        amount.toString(),
        '0', // Accept any output for rebalance
        deadline
      );

      results.push(result);
      await new Promise((r) => setTimeout(r, 2000));
    }

    // Update last rebalance time
    this.lastRebalanceTime.set(vaultAddress, Date.now());

    console.log(
      `Rebalance complete: ${results.filter((r) => r.success).length}/${results.length} successful`
    );

    return {
      trades,
      executed: true,
      results,
    };
  }

  // Full rebalance check and execution
  async checkAndRebalance(
    vaultAddress: string,
    positions: Position[],
    targets: TargetAllocation[],
    vaultBalance: string,
    config: StrategyConfig
  ): Promise<RebalanceResult | null> {
    // Check if rebalance is due
    if (!this.isRebalanceDue(vaultAddress, config.rebalanceInterval)) {
      return null;
    }

    // Calculate trades
    const trades = this.calculateRebalanceTrades(positions, targets, vaultBalance);

    if (trades.length === 0) {
      console.log('No rebalancing needed - allocations within threshold');
      this.lastRebalanceTime.set(vaultAddress, Date.now());
      return { trades: [], executed: false, results: [] };
    }

    // Execute rebalance
    return this.executeRebalance(vaultAddress, trades, config);
  }

  // Get rebalance status for a vault
  getRebalanceStatus(
    vaultAddress: string,
    intervalHours: number
  ): {
    isDue: boolean;
    lastRebalance: Date | null;
    nextRebalance: Date;
  } {
    const lastTime = this.lastRebalanceTime.get(vaultAddress);
    const intervalMs = intervalHours * 60 * 60 * 1000;

    return {
      isDue: this.isRebalanceDue(vaultAddress, intervalHours),
      lastRebalance: lastTime ? new Date(lastTime) : null,
      nextRebalance: new Date((lastTime || Date.now()) + intervalMs),
    };
  }
}
