/**
 * Calculate output amount for a bonding curve buy
 * Using constant product formula: k = x * y
 */
export function calculateBuyOutput(
  amountIn: bigint,
  virtualNative: bigint,
  virtualToken: bigint
): bigint {
  const k = virtualNative * virtualToken;
  const newNative = virtualNative + amountIn;
  const newToken = k / newNative;
  return virtualToken - newToken;
}

/**
 * Calculate input amount needed for a specific output
 */
export function calculateBuyInput(
  amountOut: bigint,
  virtualNative: bigint,
  virtualToken: bigint
): bigint {
  const k = virtualNative * virtualToken;
  const newToken = virtualToken - amountOut;
  const newNative = k / newToken;
  return newNative - virtualNative;
}

/**
 * Calculate output amount for a bonding curve sell
 */
export function calculateSellOutput(
  amountIn: bigint,
  virtualNative: bigint,
  virtualToken: bigint
): bigint {
  const k = virtualNative * virtualToken;
  const newToken = virtualToken + amountIn;
  const newNative = k / newToken;
  return virtualNative - newNative;
}

/**
 * Calculate the 1% fee for nad.fun trades
 */
export function calculateFee(amount: bigint, feeBps = 100n): bigint {
  return (amount * feeBps) / 10000n;
}

/**
 * Apply slippage to an amount (reduce by slippage %)
 */
export function applySlippage(amount: bigint, slippageBps: number): bigint {
  return (amount * BigInt(10000 - slippageBps)) / 10000n;
}

/**
 * Calculate price impact percentage
 */
export function calculatePriceImpact(
  amountIn: bigint,
  amountOut: bigint,
  spotPrice: bigint,
  decimals = 18
): number {
  if (amountIn === 0n || spotPrice === 0n) return 0;

  const expectedOut = (amountIn * 10n ** BigInt(decimals)) / spotPrice;
  if (expectedOut === 0n) return 0;

  const impact = Number(((expectedOut - amountOut) * 10000n) / expectedOut);
  return impact / 100; // Convert to percentage
}

/**
 * Calculate graduation progress (0-100)
 */
export function calculateGraduationProgress(
  currentReserve: bigint,
  targetReserve: bigint
): number {
  if (targetReserve === 0n) return 0;
  const progress = Number((currentReserve * 100n) / targetReserve);
  return Math.min(progress, 100);
}

/**
 * Calculate unrealized PnL percentage
 */
export function calculatePnlPercent(currentValue: bigint, costBasis: bigint): number {
  if (costBasis === 0n) return 0;
  return Number(((currentValue - costBasis) * 10000n) / costBasis) / 100;
}

/**
 * Safe division that returns 0 if divisor is 0
 */
export function safeDivide(numerator: bigint, denominator: bigint): bigint {
  if (denominator === 0n) return 0n;
  return numerator / denominator;
}

/**
 * Calculate weighted average
 */
export function weightedAverage(values: bigint[], weights: bigint[]): bigint {
  if (values.length !== weights.length || values.length === 0) return 0n;

  let totalWeight = 0n;
  let weightedSum = 0n;

  for (let i = 0; i < values.length; i++) {
    weightedSum += values[i] * weights[i];
    totalWeight += weights[i];
  }

  return safeDivide(weightedSum, totalWeight);
}
