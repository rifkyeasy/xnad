import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load .env from monorepo root
config({ path: path.resolve(__dirname, '../../../.env') });

// Popular crypto/Monad X accounts to monitor
export const WATCHED_ACCOUNTS = [
  'moaborz', // Monad co-founder
  'notthreadguy', // Monad co-founder
  '0xsmac', // Monad
  'nikitosk', // Monad community
  'nad_fun', // nad.fun official
  'molooch', // Monad community
  'MonadChad', // Monad community
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

// User vault contracts (deployed by us)
export const VAULT_CONTRACTS = {
  vaultFactory: process.env.VAULT_FACTORY_ADDRESS || '',
};

// Trading config
export const TRADING_CONFIG = {
  maxBuyAmount: '0.1', // Max MON per trade
  slippagePercent: 5, // 5% slippage tolerance
  minConfidence: 0.7, // Minimum AI confidence to execute trade
  pollIntervalMs: 60000, // Check every 60 seconds
};

// Environment variables
export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_API_KEY || '',
  PRIVATE_KEY: process.env.PRIVATE_KEY || '',
  RPC_URL: process.env.RPC_URL || 'https://testnet-rpc.monad.xyz',
  DRY_RUN: process.env.DRY_RUN === 'true',
};
