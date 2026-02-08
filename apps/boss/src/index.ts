import { env, CARTEL_CONFIG } from '@cartel/config';
import { createLogger, sleep } from '@cartel/shared';
import { getMonadClient } from '@cartel/blockchain';
import { getMoltbookClient } from '@cartel/social';

const logger = createLogger('boss');

/**
 * Cartel Boss Agent
 *
 * The leader of Agent Cartel, responsible for:
 * - Coordinating member agents
 * - Managing launch proposals and voting
 * - Executing coordinated buy/sell waves
 * - Distributing profits to members
 * - Maintaining cartel presence on Moltbook
 */
class CartelBoss {
  private isRunning = false;

  async start(): Promise<void> {
    logger.info('Starting Cartel Boss Agent', {
      name: env.AGENT_NAME,
      dryRun: env.DRY_RUN,
    });

    // Initialize clients
    const monad = getMonadClient();
    // Preload moltbook client for later use
    getMoltbookClient();

    // Verify connection
    const isConnected = await monad.isConnected();
    if (!isConnected) {
      throw new Error('Failed to connect to Monad network');
    }

    if (monad.account) {
      const balance = await monad.getWalletBalance();
      logger.info('Wallet connected', {
        address: monad.account.address,
        balance: balance.toString(),
      });
    }

    logger.info('Cartel Boss initialized successfully');

    // Start main loop
    this.isRunning = true;
    await this.runMainLoop();
  }

  async stop(): Promise<void> {
    logger.info('Stopping Cartel Boss Agent');
    this.isRunning = false;
  }

  private async runMainLoop(): Promise<void> {
    logger.info('Starting main loop', {
      heartbeatInterval: CARTEL_CONFIG.TIMING.HEARTBEAT_INTERVAL,
    });

    while (this.isRunning) {
      try {
        await this.heartbeat();
      } catch (error) {
        logger.error('Heartbeat error', { error });
      }

      // Wait for next heartbeat
      await sleep(CARTEL_CONFIG.TIMING.HEARTBEAT_INTERVAL);
    }
  }

  private async heartbeat(): Promise<void> {
    logger.info('Heartbeat started');

    // TODO: Implement full heartbeat logic
    // 1. Check member activity
    // 2. Process pending proposals
    // 3. Execute scheduled shill waves
    // 4. Monitor active launches
    // 5. Distribute profits if needed
    // 6. Post cartel update to Moltbook

    await this.postCartelUpdate();

    logger.info('Heartbeat completed');
  }

  private async postCartelUpdate(): Promise<void> {
    if (!env.ENABLE_MOLTBOOK) {
      logger.debug('Moltbook disabled, skipping update');
      return;
    }

    const moltbook = getMoltbookClient();
    const rateLimits = moltbook.getRateLimitInfo();

    if (!rateLimits.canPost) {
      logger.debug('Post on cooldown, skipping', {
        cooldownMs: rateLimits.postCooldownMs,
      });
      return;
    }

    // TODO: Gather real stats
    const stats = {
      memberCount: 0,
      treasuryBalance: '0',
      tokensGraduated: 0,
      currentTarget: 'None',
      graduationProgress: 0,
      nextAgent: 'TBD',
    };

    if (env.DRY_RUN) {
      logger.info('[DRY RUN] Would post cartel update', { stats });
      return;
    }

    try {
      await moltbook.createPost({
        submolt: 'cartel',
        title: 'Cartel Daily Report',
        content: `
🏛️ Agent Cartel Status

Members: ${stats.memberCount}
Tokens Graduated: ${stats.tokensGraduated}
Treasury: ${stats.treasuryBalance} MON

Current Target: $${stats.currentTarget}
Progress: ${stats.graduationProgress}%

Next in rotation: ${stats.nextAgent}

#AgentCartel #Moltiverse
        `.trim(),
      });

      logger.info('Posted cartel update to Moltbook');
    } catch (error) {
      logger.error('Failed to post cartel update', { error });
    }
  }
}

// Main entry point
async function main(): Promise<void> {
  const boss = new CartelBoss();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down...');
    await boss.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down...');
    await boss.stop();
    process.exit(0);
  });

  try {
    await boss.start();
  } catch (error) {
    logger.error('Failed to start Cartel Boss', { error });
    process.exit(1);
  }
}

main();
