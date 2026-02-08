import { formatUnits, parseUnits, type Address } from 'viem';

/**
 * Format a bigint value to a human-readable string with decimals
 */
export function formatTokenAmount(amount: bigint, decimals = 18, precision = 4): string {
  const formatted = formatUnits(amount, decimals);
  const num = parseFloat(formatted);

  if (num === 0) return '0';
  if (num < 0.0001) return '<0.0001';
  if (num < 1) return num.toFixed(precision);
  if (num < 1000) return num.toFixed(2);
  if (num < 1_000_000) return `${(num / 1000).toFixed(2)}K`;
  if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
  return `${(num / 1_000_000_000).toFixed(2)}B`;
}

/**
 * Parse a string amount to bigint
 */
export function parseTokenAmount(amount: string, decimals = 18): bigint {
  return parseUnits(amount, decimals);
}

/**
 * Format MON amount (18 decimals)
 */
export function formatMon(amount: bigint, precision = 4): string {
  return formatTokenAmount(amount, 18, precision);
}

/**
 * Parse MON amount
 */
export function parseMon(amount: string): bigint {
  return parseTokenAmount(amount, 18);
}

/**
 * Truncate an address for display
 */
export function truncateAddress(address: Address, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a percentage
 */
export function formatPercent(value: number, decimals = 2): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Format a timestamp as relative time
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

/**
 * Format basis points to percentage string
 */
export function bpsToPercent(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Convert percentage to basis points
 */
export function percentToBps(percent: number): number {
  return Math.round(percent * 100);
}
