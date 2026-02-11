import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from monorepo root
config({ path: path.resolve(__dirname, '../../../.env') });

// X accounts to monitor for trading signals
export const WATCHED_ACCOUNTS = [
  'MugiwaraOneup',
  'DraliensNFT',
];

// Keywords that indicate a potential trade signal
export const SIGNAL_KEYWORDS = [
  'launch',
  'launching',
  'buy',
  'bullish',
  'moon',
  'gem',
  'alpha',
  'airdrop',
  'mint',
  'pumping',
  'aping',
  'degen',
  '$', // Token mentions like $BTGO
  '0x', // Contract addresses
  'nad.fun',
  'nadfun',
];

// nad.fun testnet contract addresses
export const NADFUN_CONTRACTS = {
  bondingCurveRouter: '0x865054F0F6A288adaAc30261731361EA7E908003',
  dexRouter: '0x0B79d71AE99528D1dB24A4148b5f4F865cc2b137',
  lens: '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea',
  curve: '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE',
  wmon: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
};

// User vault contracts (deployed by us on Monad testnet)
export const VAULT_CONTRACTS = {
  vaultFactory: process.env.VAULT_FACTORY_ADDRESS || '0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A',
};

// Tradeable tokens on nad.fun testnet
export const TOKENS = {
  SHRAMP: '0x2F0292D4b34601D97ee7E52b2058f11928B87777',
  DRA: '0xFBD84ab1526BfbA7533b1EC2842894eE92777777',
  CHOG: '0x6946EE2E38e871B6cE0a70908F806036e9387777',
};

// Default token when no specific token is identified
export const DEFAULT_TOKEN = TOKENS.CHOG;

/**
 * Resolve a token symbol or address to a known token address.
 * Falls back to CHOG if unknown.
 */
export function resolveTokenAddress(symbolOrAddress?: string): string {
  if (!symbolOrAddress) return DEFAULT_TOKEN;

  const upper = symbolOrAddress.toUpperCase().replace('$', '');

  // Match by symbol
  if (upper.includes('SHRAMP') || upper.includes('SHRIMP')) return TOKENS.SHRAMP;
  if (upper.includes('DRA') || upper.includes('DRALIEN')) return TOKENS.DRA;
  if (upper.includes('CHOG')) return TOKENS.CHOG;

  // Match by address
  const addr = symbolOrAddress.toLowerCase();
  if (addr === TOKENS.SHRAMP.toLowerCase()) return TOKENS.SHRAMP;
  if (addr === TOKENS.DRA.toLowerCase()) return TOKENS.DRA;
  if (addr === TOKENS.CHOG.toLowerCase()) return TOKENS.CHOG;

  // Unknown token → default to CHOG
  return DEFAULT_TOKEN;
}

// Trading config
export const TRADING_CONFIG = {
  maxBuyAmount: '0.1',         // Max MON per trade
  slippagePercent: 5,          // 5% slippage tolerance
  minConfidence: 0.3,          // Minimum AI confidence to execute trade
  tradeIntervalMs: 30000,      // Auto-execute trades every 30 seconds
  xCheckIntervalMs: 3600000,   // Check X accounts every 1 hour
};

// Environment variables
export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_API_KEY || '',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  RPC_URL: process.env.RPC_URL || 'https://testnet-rpc.monad.xyz',
  DRY_RUN: process.env.DRY_RUN === 'true',
};
