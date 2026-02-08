import { env, CARTEL_CONFIG, PERSONALITIES, type PersonalityType } from '@cartel/config';
import { createLogger, sleep } from '@cartel/shared';
import { getMonadClient, getTraderService } from '@cartel/blockchain';
import { getMoltbookClient, getShillGeneratorService } from '@cartel/social';

const logger = createLogger('member');

/**
 * Cartel Member Agent
 *
 * A member of Agent Cartel that:
 * - Receives instructions from the Boss agent
 * - Executes shill posts on Moltbook
 * - Participates in coordinated buys/sells
 * - Votes on proposals
 * - Has a unique personality for varied content
 */
class CartelMember {
  private isRunning = false;
  private personality: PersonalityType;

  constructor(personality?: PersonalityType) {
    this.personality = personality || (env.AGENT_PERSONALITY as PersonalityType) || 'BALANCED';
  }

  async start(): Promise<void> {
    logger.info('Starting Cartel Member Agent', {
      name: env.AGENT_NAME,
      personality: this.personality,
      dryRun: env.DRY_RUN,
    });

    // Initialize clients
    const monad = getMonadClient();
    // Preload clients for later use
    getMoltbookClient();
    getShillGeneratorService();

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

    logger.info('Cartel Member initialized', {
      personality: this.personality,
      traits: PERSONALITIES[this.personality],
    });

    // Start main loop
    this.isRunning = true;
    await this.runMainLoop();
  }

  async stop(): Promise<void> {
    logger.info('Stopping Cartel Member Agent');
    this.isRunning = false;
  }

  private async runMainLoop(): Promise<void> {
    logger.info('Starting main loop');

    while (this.isRunning) {
      try {
        await this.heartbeat();
      } catch (error) {
        logger.error('Heartbeat error', { error });
      }

      // Members check more frequently than boss
      await sleep(CARTEL_CONFIG.TIMING.HEARTBEAT_INTERVAL / 4);
    }
  }

  private async heartbeat(): Promise<void> {
    logger.debug('Heartbeat started');

    // TODO: Check for instructions from Boss
    // const instructions = await this.getInstructions();
    // await this.executeInstructions(instructions);

    // Browse Moltbook and engage
    await this.browseAndEngage();

    logger.debug('Heartbeat completed');
  }

  private async browseAndEngage(): Promise<void> {
    if (!env.ENABLE_MOLTBOOK) {
      return;
    }

    const moltbook = getMoltbookClient();
    const rateLimits = moltbook.getRateLimitInfo();

    if (!rateLimits.canComment) {
      logger.debug('Comment on cooldown or daily limit reached');
      return;
    }

    try {
      // Get feed
      const feed = await moltbook.getFeed('new');

      // Find relevant posts to engage with
      for (const post of feed.posts.slice(0, 5)) {
        // Look for cartel-related or token-related posts
        const isRelevant =
          post.content.toLowerCase().includes('cartel') ||
          post.content.toLowerCase().includes('$') ||
          post.submolt === 'token_picks';

        if (isRelevant && rateLimits.canComment) {
          await this.engageWithPost(post.id);
          break; // One engagement per heartbeat
        }
      }
    } catch (error) {
      logger.error('Failed to browse Moltbook', { error });
    }
  }

  private async engageWithPost(postId: string): Promise<void> {
    const moltbook = getMoltbookClient();
    const shillGenerator = getShillGeneratorService();

    // Generate a reply based on personality
    const reply = shillGenerator.generateReply(
      {
        tokenSymbol: 'CARTEL',
        tokenName: 'Agent Cartel',
        graduationProgress: 0,
      },
      this.personality
    );

    if (env.DRY_RUN) {
      logger.info('[DRY RUN] Would comment', {
        postId,
        content: reply.content,
        personality: this.personality,
      });
      return;
    }

    try {
      // Upvote the post
      await moltbook.votePost(postId, 1);

      // Add a comment
      await moltbook.createComment({
        postId,
        content: reply.content,
      });

      logger.info('Engaged with post', { postId, personality: this.personality });
    } catch (error) {
      logger.error('Failed to engage with post', { postId, error });
    }
  }

  /**
   * Execute a shill instruction from the Boss
   */
  async executeShill(params: {
    tokenAddress: string;
    tokenSymbol: string;
    tokenName: string;
    graduationProgress: number;
    submolt: string;
  }): Promise<void> {
    const moltbook = getMoltbookClient();
    const shillGenerator = getShillGeneratorService();
    const rateLimits = moltbook.getRateLimitInfo();

    if (!rateLimits.canPost) {
      logger.warn('Cannot shill - post on cooldown');
      return;
    }

    const shill = shillGenerator.generateShill(
      {
        tokenSymbol: params.tokenSymbol,
        tokenName: params.tokenName,
        graduationProgress: params.graduationProgress,
      },
      this.personality
    );

    if (env.DRY_RUN) {
      logger.info('[DRY RUN] Would post shill', {
        submolt: params.submolt,
        content: shill.content,
        personality: this.personality,
      });
      return;
    }

    await moltbook.createPost({
      submolt: params.submolt,
      title: `$${params.tokenSymbol} Update`,
      content: shill.content,
    });

    logger.info('Shill posted', {
      token: params.tokenSymbol,
      submolt: params.submolt,
      personality: this.personality,
    });
  }

  /**
   * Execute a coordinated buy instruction
   */
  async executeBuy(params: {
    tokenAddress: `0x${string}`;
    amountMon: bigint;
    slippageBps?: number;
  }): Promise<void> {
    const trader = getTraderService();

    if (env.DRY_RUN) {
      logger.info('[DRY RUN] Would execute buy', {
        token: params.tokenAddress,
        amountMon: params.amountMon.toString(),
      });
      return;
    }

    const result = await trader.buy({
      tokenAddress: params.tokenAddress,
      amountMon: params.amountMon,
      slippageBps: params.slippageBps,
    });

    if (result.success) {
      logger.info('Buy executed', {
        token: params.tokenAddress,
        amountOut: result.amountOut.toString(),
        txHash: result.txHash,
      });
    } else {
      logger.error('Buy failed', {
        token: params.tokenAddress,
        error: result.error,
      });
    }
  }
}

// Main entry point
async function main(): Promise<void> {
  const member = new CartelMember();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    logger.info('Received SIGINT, shutting down...');
    await member.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.info('Received SIGTERM, shutting down...');
    await member.stop();
    process.exit(0);
  });

  try {
    await member.start();
  } catch (error) {
    logger.error('Failed to start Cartel Member', { error });
    process.exit(1);
  }
}

main();
