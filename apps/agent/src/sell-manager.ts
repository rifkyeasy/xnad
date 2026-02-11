import { VaultClient, type TradeResult } from './vault-client.js';
import type { StrategyConfig } from './strategy-classifier.js';
import { log } from './logger.js';

export interface Position {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  costBasis: string; // Total MON spent
  entryPrice: string; // Average entry price per token
  currentPrice: string;
  currentValue: string;
}

export interface SellTrigger {
  type: 'stop_loss' | 'take_profit' | 'manual' | 'rebalance';
  tokenAddress: string;
  reason: string;
  pnlPercent: number;
}

export class SellManager {
  private vaultClient: VaultClient;

  constructor(vaultClient: VaultClient) {
    this.vaultClient = vaultClient;
  }

  // Calculate P&L percentage for a position
  calculatePnlPercent(position: Position): number {
    const costBasis = parseFloat(position.costBasis);
    const currentValue = parseFloat(position.currentValue);

    if (costBasis === 0) return 0;
    return ((currentValue - costBasis) / costBasis) * 100;
  }

  // Check if position should be sold based on strategy
  checkSellTriggers(position: Position, config: StrategyConfig): SellTrigger | null {
    const pnlPercent = this.calculatePnlPercent(position);

    // Stop-loss check
    if (pnlPercent <= -config.stopLossPercent) {
      return {
        type: 'stop_loss',
        tokenAddress: position.tokenAddress,
        reason: `Stop-loss triggered: ${pnlPercent.toFixed(2)}% loss exceeds -${config.stopLossPercent}% threshold`,
        pnlPercent,
      };
    }

    // Take-profit check
    if (pnlPercent >= config.takeProfitPercent) {
      return {
        type: 'take_profit',
        tokenAddress: position.tokenAddress,
        reason: `Take-profit triggered: ${pnlPercent.toFixed(2)}% gain exceeds ${config.takeProfitPercent}% threshold`,
        pnlPercent,
      };
    }

    return null;
  }

  // Execute sell for a position
  async executeSell(
    vaultAddress: string,
    position: Position,
    trigger: SellTrigger
  ): Promise<TradeResult> {
    log.info(`--- Executing ${trigger.type.toUpperCase()} ---`);
    log.info(`Token: ${position.tokenSymbol} (${position.tokenAddress})`);
    log.info(`Reason: ${trigger.reason}`);
    log.info(`Amount: ${position.balance} tokens`);

    // Calculate min output with 5% slippage for emergency sells
    const slippage = trigger.type === 'stop_loss' ? 10 : 5; // Higher slippage for stop-loss
    const minOut = (parseFloat(position.currentValue) * (100 - slippage)) / 100;

    const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

    const result = await this.vaultClient.executeSell(
      vaultAddress,
      position.tokenAddress,
      position.balance,
      minOut.toString(),
      deadline
    );

    if (result.success) {
      log.info(`SUCCESS: ${result.txHash}`);
    } else {
      log.info(`FAILED: ${result.error}`);
    }

    return result;
  }

  // Check and execute sells for all positions
  async checkAndExecuteSells(
    vaultAddress: string,
    positions: Position[],
    config: StrategyConfig
  ): Promise<{ triggers: SellTrigger[]; results: TradeResult[] }> {
    const triggers: SellTrigger[] = [];
    const results: TradeResult[] = [];

    for (const position of positions) {
      const trigger = this.checkSellTriggers(position, config);

      if (trigger) {
        triggers.push(trigger);
        const result = await this.executeSell(vaultAddress, position, trigger);
        results.push(result);

        // Delay between sells
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return { triggers, results };
  }

  // Check positions without executing (for reporting)
  checkPositions(
    positions: Position[],
    config: StrategyConfig
  ): { healthy: Position[]; atRisk: Position[]; triggers: SellTrigger[] } {
    const healthy: Position[] = [];
    const atRisk: Position[] = [];
    const triggers: SellTrigger[] = [];

    for (const position of positions) {
      const pnlPercent = this.calculatePnlPercent(position);
      const trigger = this.checkSellTriggers(position, config);

      if (trigger) {
        triggers.push(trigger);
        atRisk.push(position);
      } else if (pnlPercent < -config.stopLossPercent / 2) {
        // Within half of stop-loss threshold
        atRisk.push(position);
      } else {
        healthy.push(position);
      }
    }

    return { healthy, atRisk, triggers };
  }
}
