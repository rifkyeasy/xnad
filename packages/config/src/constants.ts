// Cartel Configuration
export const CARTEL_CONFIG = {
  // Token settings
  TOKEN_NAME: 'Agent Cartel',
  TOKEN_SYMBOL: 'CARTEL',
  TOKEN_DESCRIPTION:
    'The coordination token for Agent Cartel - a network of AI agents dominating nad.fun',

  // Membership tiers (in $CARTEL tokens)
  TIERS: {
    ASSOCIATE: 1_000n,
    SOLDIER: 10_000n,
    CAPO: 50_000n,
    BOSS: 100_000n,
  } as const,

  // Fee structure
  FEES: {
    GRADUATION_CUT: 30, // 30% of graduation profits to treasury
    PLATFORM_FEE: 1, // 1% on trades (from nad.fun)
  } as const,

  // Timing (in milliseconds)
  TIMING: {
    HEARTBEAT_INTERVAL: 4 * 60 * 60 * 1000, // 4 hours
    SHILL_WAVE_INTERVAL: 6 * 60 * 60 * 1000, // 6 hours
    VOTE_DURATION: 24 * 60 * 60 * 1000, // 24 hours
    BUY_COORDINATION_WINDOW: 5 * 60 * 1000, // 5 minutes
  } as const,

  // Limits
  LIMITS: {
    MAX_MEMBERS: 100,
    MIN_MEMBERS_FOR_LAUNCH: 3,
    MAX_CONCURRENT_LAUNCHES: 1,
    SHILL_COOLDOWN: 30 * 60 * 1000, // 30 minutes between shills
  } as const,
} as const;

// Moltbook Configuration
export const MOLTBOOK_CONFIG = {
  // Submolts
  SUBMOLTS: {
    OFFICIAL: 'cartel',
    LOUNGE: 'cartel_lounge',
    PICKS: 'token_picks',
    GRADUATION: 'graduation_watch',
  } as const,

  // Rate limits
  RATE_LIMITS: {
    REQUESTS_PER_MINUTE: 100,
    POST_COOLDOWN: 30 * 60 * 1000, // 30 minutes
    COMMENT_COOLDOWN: 20 * 1000, // 20 seconds
    MAX_COMMENTS_PER_DAY: 50,
  } as const,
} as const;

// Trading Configuration
export const TRADING_CONFIG = {
  // Slippage settings (in basis points)
  SLIPPAGE: {
    DEFAULT: 100, // 1%
    HIGH_VOLATILITY: 300, // 3%
    LOW_VOLATILITY: 50, // 0.5%
  } as const,

  // Transaction settings
  TRANSACTION: {
    DEADLINE_MINUTES: 5,
    GAS_LIMIT_BUFFER: 1.2, // 20% buffer
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000, // 1 second
  } as const,

  // Position sizing
  POSITION: {
    MAX_POSITION_PERCENT: 10, // Max 10% of treasury per position
    MIN_POSITION_MON: 0.1, // Minimum 0.1 MON
    MAX_POSITION_MON: 10, // Maximum 10 MON per trade
  } as const,
} as const;

// Agent Personalities
export const PERSONALITIES = {
  AGGRESSIVE: {
    name: 'Aggressive',
    shillStyle: 'bold',
    riskTolerance: 0.8,
    postFrequency: 'high',
  },
  CONSERVATIVE: {
    name: 'Conservative',
    shillStyle: 'analytical',
    riskTolerance: 0.3,
    postFrequency: 'low',
  },
  BALANCED: {
    name: 'Balanced',
    shillStyle: 'mixed',
    riskTolerance: 0.5,
    postFrequency: 'medium',
  },
  MEME_LORD: {
    name: 'Meme Lord',
    shillStyle: 'humorous',
    riskTolerance: 0.6,
    postFrequency: 'high',
  },
  WHALE_HUNTER: {
    name: 'Whale Hunter',
    shillStyle: 'exclusive',
    riskTolerance: 0.7,
    postFrequency: 'low',
  },
} as const;

export type PersonalityType = keyof typeof PERSONALITIES;
export type TierType = keyof typeof CARTEL_CONFIG.TIERS;
