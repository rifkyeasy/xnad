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
    MAX_POSITION_PERCENT: 10, // Max 10% of portfolio per position
    MIN_POSITION_MON: 0.01, // Minimum 0.01 MON
    MAX_POSITION_MON: 0.1, // Maximum 0.1 MON per trade
  } as const,
} as const;

// Strategy Configuration
export const STRATEGY_CONFIG = {
  CONSERVATIVE: {
    minConfidence: 0.85,
    maxTradeAmount: '0.01',
    allowedRiskLevels: ['LOW'],
    stopLossPercent: 10,
    takeProfitPercent: 30,
    rebalanceInterval: 72, // hours
  },
  BALANCED: {
    minConfidence: 0.7,
    maxTradeAmount: '0.05',
    allowedRiskLevels: ['LOW', 'MEDIUM'],
    stopLossPercent: 20,
    takeProfitPercent: 50,
    rebalanceInterval: 24,
  },
  AGGRESSIVE: {
    minConfidence: 0.5,
    maxTradeAmount: '0.1',
    allowedRiskLevels: ['LOW', 'MEDIUM', 'HIGH'],
    stopLossPercent: 35,
    takeProfitPercent: 100,
    rebalanceInterval: 6,
  },
} as const;

export type StrategyType = keyof typeof STRATEGY_CONFIG;
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
