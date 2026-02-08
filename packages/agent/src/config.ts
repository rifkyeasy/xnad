import { config } from "dotenv";
config();

// Popular crypto/Monad X accounts to monitor
export const WATCHED_ACCOUNTS = [
  "moaborz",        // Monad co-founder
  "notthreadguy",   // Monad co-founder
  "0xsmac",         // Monad
  "moaborz",        // Monad
  "nikitosk",       // Monad community
  "nad_fun",        // nad.fun official
  "molooch",        // Monad community
  "MonadChad",      // Monad community
];

// Keywords that indicate a potential trade signal
export const SIGNAL_KEYWORDS = [
  "launch",
  "launching",
  "buy",
  "bullish",
  "moon",
  "gem",
  "alpha",
  "airdrop",
  "mint",
  "pumping",
  "aping",
  "degen",
  "$",               // Token mentions like $BTGO
  "0x",              // Contract addresses
  "nad.fun",
  "nadfun",
];

// Contract addresses
export const CONTRACTS = {
  bondingCurveRouter: "0x6F6B8F1a20703309951a5127c45B49b1CD981A22",
  dexRouter: "0x0B79d71AE99528D1dB24A4148b5f4F865cc2b137",
  lens: "0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea",
  curve: "0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE",
  wmon: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A",
};

// Trading config
export const TRADING_CONFIG = {
  maxBuyAmount: "0.1",      // Max MON per trade
  slippagePercent: 2,       // 2% slippage tolerance
  minConfidence: 0.7,       // Minimum AI confidence to execute trade
  pollIntervalMs: 60000,    // Check every 60 seconds
};

// Environment variables
export const ENV = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_API_KEY || "",
  PRIVATE_KEY: process.env.PRIVATE_KEY || "",
  RPC_URL: process.env.RPC_URL || "https://monad-mainnet.drpc.org",
};
