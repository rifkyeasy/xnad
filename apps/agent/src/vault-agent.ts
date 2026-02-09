/**
 * Vault Agent
 * Manages user vaults with auto-sell (stop-loss/take-profit) and auto-rebalancing
 */

import { ENV } from './config.js';
import { getVaultClient, type VaultClient } from './vault-client.js';
import { SellManager, type Position, type SellTrigger } from './sell-manager.js';
import { Rebalancer, type TargetAllocation, type RebalanceResult } from './rebalancer.js';
import { getPositionManager, type VaultWithPositions } from './position-manager.js';
import { getStrategyConfig, type StrategyConfig, type StrategyType } from './strategy-classifier.js';

// Backend API URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Vault check interval (30 seconds)
const VAULT_CHECK_INTERVAL = 30000;

// Agent state
interface AgentState {
  processedVaults: number;
  sellsExecuted: number;
  rebalancesExecuted: number;
  errors: number;
  lastRunAt: Date | null;
}

const state: AgentState = {
  processedVaults: 0,
  sellsExecuted: 0,
  rebalancesExecuted: 0,
  errors: 0,
  lastRunAt: null,
};

/**
 * Map strategy type number to StrategyType string
 */
function getStrategyFromType(strategyType: number): StrategyType {
  switch (strategyType) {
    case 0:
      return 'CONSERVATIVE';
    case 2:
      return 'AGGRESSIVE';
    default:
      return 'BALANCED';
  }
}

/**
 * Get target allocations for a vault based on current positions
 * For now, we use equal weight allocation among held tokens
 */
function getTargetAllocations(positions: Position[]): TargetAllocation[] {
  if (positions.length === 0) return [];

  // Equal weight allocation
  const targetPercent = 80 / positions.length; // Keep 20% in MON

  return positions.map((p) => ({
    tokenAddress: p.tokenAddress,
    tokenSymbol: p.tokenSymbol,
    targetPercent,
  }));
}

/**
 * Record trade to backend
 */
async function recordTrade(
  walletAddress: string,
  tokenAddress: string,
  tokenSymbol: string,
  action: 'buy' | 'sell',
  amountIn: string,
  amountOut: string,
  txHash: string,
  signalSource: string,
  reasoning: string
): Promise<void> {
  try {
    await fetch(`${BACKEND_URL}/api/trades/${walletAddress}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tokenAddress,
        tokenSymbol,
        action: action.toUpperCase(),
        amountIn,
        amountOut,
        confidence: 1.0,
        signalSource,
        reasoning,
        txHash,
      }),
    });
  } catch (error) {
    console.error('Failed to record trade to backend:', error);
  }
}

/**
 * Process a single vault
 */
async function processVault(
  vaultData: VaultWithPositions,
  vaultClient: VaultClient,
  sellManager: SellManager,
  rebalancer: Rebalancer
): Promise<void> {
  const { vault, positions, vaultBalance } = vaultData;
  const strategyType = getStrategyFromType(vault.strategyType);
  const config = getStrategyConfig(strategyType);

  console.log(`\n--- Processing Vault ${vault.id.slice(0, 10)}... ---`);
  console.log(`  Owner: ${vault.owner.slice(0, 10)}...`);
  console.log(`  Strategy: ${strategyType}`);
  console.log(`  Balance: ${vaultBalance} MON`);
  console.log(`  Positions: ${positions.length}`);

  if (positions.length === 0) {
    console.log('  No positions to manage');
    return;
  }

  // Log position details
  for (const pos of positions) {
    const pnlPct = sellManager.calculatePnlPercent(pos);
    console.log(
      `    ${pos.tokenSymbol}: ${pos.balance} tokens, ` +
        `value: ${parseFloat(pos.currentValue).toFixed(4)} MON, ` +
        `P&L: ${pnlPct.toFixed(2)}%`
    );
  }

  // 1. Check for stop-loss / take-profit
  console.log(`\n  Checking stop-loss/take-profit...`);
  const { triggers, results: sellResults } = await sellManager.checkAndExecuteSells(
    vault.id,
    positions,
    config
  );

  if (triggers.length > 0) {
    console.log(`  Triggered ${triggers.length} sells:`);
    for (const trigger of triggers) {
      console.log(`    ${trigger.type}: ${trigger.reason}`);
    }

    // Record trades to backend
    for (let i = 0; i < triggers.length; i++) {
      const trigger = triggers[i];
      const result = sellResults[i];
      if (result?.success) {
        state.sellsExecuted++;
        const pos = positions.find((p) => p.tokenAddress === trigger.tokenAddress);
        await recordTrade(
          vault.owner,
          trigger.tokenAddress,
          pos?.tokenSymbol || 'UNKNOWN',
          'sell',
          pos?.balance || '0',
          result.amountOut || '0',
          result.txHash || '',
          trigger.type,
          trigger.reason
        );
      }
    }
  } else {
    console.log('  No stop-loss/take-profit triggers');
  }

  // 2. Check for rebalancing (only if user has auto-rebalance enabled)
  // For now, check via backend user settings
  const shouldRebalance = await checkUserAutoRebalance(vault.owner);

  if (shouldRebalance) {
    console.log(`\n  Checking rebalancing...`);
    const targets = getTargetAllocations(positions);

    const rebalanceResult = await rebalancer.checkAndRebalance(
      vault.id,
      positions,
      targets,
      vaultBalance,
      config
    );

    if (rebalanceResult && rebalanceResult.executed) {
      state.rebalancesExecuted++;
      console.log(`  Executed ${rebalanceResult.trades.length} rebalance trades`);

      // Record rebalance trades to backend
      for (let i = 0; i < rebalanceResult.trades.length; i++) {
        const trade = rebalanceResult.trades[i];
        const result = rebalanceResult.results[i];
        if (result?.success) {
          await recordTrade(
            vault.owner,
            trade.tokenAddress,
            trade.tokenSymbol,
            trade.action,
            trade.amount,
            result.amountOut || '0',
            result.txHash || '',
            'rebalance',
            trade.reason
          );
        }
      }
    } else if (rebalanceResult && !rebalanceResult.executed) {
      console.log('  Rebalance not needed');
    } else {
      console.log('  Rebalance not due yet');
    }
  } else {
    console.log('  Auto-rebalance disabled for this user');
  }

  state.processedVaults++;
}

/**
 * Check if user has auto-rebalance enabled
 */
async function checkUserAutoRebalance(walletAddress: string): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/users/${walletAddress}`);
    if (!res.ok) return false;
    const user = (await res.json()) as { autoRebalance?: boolean };
    return user.autoRebalance === true;
  } catch {
    return false;
  }
}

/**
 * Run the vault agent loop
 */
async function runVaultAgentLoop(): Promise<void> {
  const vaultClient = getVaultClient();
  const sellManager = new SellManager(vaultClient);
  const rebalancer = new Rebalancer(vaultClient);
  const positionManager = getPositionManager();

  console.log('\n========================================');
  console.log('  Vault Management Agent');
  console.log('  Auto Sell & Rebalancing');
  console.log('========================================');
  console.log(`Agent Wallet: ${vaultClient.address}`);
  console.log(`Check interval: ${VAULT_CHECK_INTERVAL / 1000}s`);
  console.log('========================================\n');

  while (true) {
    try {
      console.log(`\n=== Vault Agent Check (${new Date().toISOString()}) ===`);
      state.lastRunAt = new Date();

      // Get all active vaults with positions
      const vaultsWithPositions = await positionManager.getAllVaultsWithPositions();

      if (vaultsWithPositions.length === 0) {
        console.log('No active vaults found');
      } else {
        console.log(`Found ${vaultsWithPositions.length} active vaults`);

        // Process each vault
        for (const vaultData of vaultsWithPositions) {
          try {
            await processVault(vaultData, vaultClient, sellManager, rebalancer);
          } catch (error) {
            state.errors++;
            console.error(`Error processing vault ${vaultData.vault.id}:`, error);
          }

          // Delay between vaults
          await new Promise((r) => setTimeout(r, 1000));
        }
      }

      // Log status
      console.log('\n--- Agent Status ---');
      console.log(`Processed vaults: ${state.processedVaults}`);
      console.log(`Sells executed: ${state.sellsExecuted}`);
      console.log(`Rebalances executed: ${state.rebalancesExecuted}`);
      console.log(`Errors: ${state.errors}`);
      console.log(`Next check in ${VAULT_CHECK_INTERVAL / 1000}s...\n`);

      // Wait for next check
      await new Promise((r) => setTimeout(r, VAULT_CHECK_INTERVAL));
    } catch (error) {
      state.errors++;
      console.error('Vault agent loop error:', error);
      // Continue running after errors
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

/**
 * Validate environment
 */
function validateEnv(): boolean {
  if (!ENV.PRIVATE_KEY) {
    console.error('Missing PRIVATE_KEY environment variable');
    return false;
  }
  return true;
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  console.log('Starting Vault Management Agent...\n');

  if (!validateEnv()) {
    process.exit(1);
  }

  try {
    await runVaultAgentLoop();
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Export for testing
export { processVault, getTargetAllocations, getStrategyFromType };

main();
