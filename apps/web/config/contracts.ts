// Contract addresses deployed on Monad Testnet

// nad.fun contracts (testnet)
export const NADFUN_CONTRACTS = {
  bondingCurveRouter: '0x865054F0F6A288adaAc30261731361EA7E908003',
  dexRouter: '0x0B79d71AE99528D1dB24A4148b5f4F865cc2b137',
  lens: '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea',
  curve: '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE',
  wmon: '0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A',
} as const;

// User vault contracts (deployed by us on Monad testnet)
export const VAULT_CONTRACTS = {
  vaultFactory: process.env.NEXT_PUBLIC_VAULT_FACTORY_ADDRESS || '0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A',
} as const;

// Testnet tokens (mirrored from mainnet)
export const TESTNET_TOKENS = {
  chog: '0x6946EE2E38e871B6cE0a70908F806036e9387777', // Chog - mirrored from mainnet
  tagt: '0xfDB4DC8BFd39515762Dca9C671701E68F5297777', // Test Agent Token - original test token
} as const;

// Real tokens from nad.fun mainnet categorized by market cap (for reference)
export const MARKET_TOKENS = {
  // High cap (>=$100K) - Conservative strategy targets
  high: [
    '0x350035555E10d9AfAF1566AaebfCeD5BA6C27777', // CHOG - $746K
    '0x91ce820dD39A2B5639251E8c7837998530Fe7777', // Motion - $340K
    '0x81A224F8A62f52BdE942dBF23A56df77A10b7777', // emo - $160K
    '0x405b6330e213DED490240CbcDD64790806827777', // moncock - $149K
  ],
  // Medium cap ($10K-$100K) - Balanced strategy targets
  medium: [
    '0xB1C0d1a1CC0199D78649EFc40FDe85A080Cd7777', // sbgood - $62K
    '0x42a4aA89864A794dE135B23C6a8D2E05513d7777', // shramp - $58K
    '0xB744F5CDb792d8187640214C4A1c9aCE29af7777', // MONSHI - $29K
    '0x29E8a68e6F5275c36767ae531B9f6b5953Ba7777', // GROOL - $22K
    '0x39B9E06f226FF6D7500c870B82333AACbD2F7777', // NADS - $19K
  ],
  // Low cap (<$10K) - Aggressive strategy targets
  low: [
    '0x8361a59d340466211ad4aB41C09a32e4530a7777', // MonWolf - $8.2K
    '0x5dF178C7E58046BC9074782fef0009C6Be167777', // Anago - $7.6K
    '0x148a3a811979e5BF8366FC279B2d67742Fe17777', // PHUCKMC - $7.5K
    '0x93A7006bD345a7dFfF35910Da2DB97bA4Cb67777', // TABBY - $7.1K
    '0x48223050FE5d96E55e56283de15504490d557777', // Mongo - $6.7K
  ],
} as const;

// Strategy type enum matching smart contract
export enum StrategyType {
  CONSERVATIVE = 0,
  BALANCED = 1,
  AGGRESSIVE = 2,
}

// Strategy configs matching agent config
export const STRATEGY_CONFIG = {
  [StrategyType.CONSERVATIVE]: {
    name: 'Conservative',
    minConfidence: 0.85,
    maxTradeAmount: '0.01',
    riskLevels: ['low'],
    stopLoss: 0.1, // 10%
    takeProfit: 0.3, // 30%
    description: 'Low risk, stable returns. Trades only high-confidence signals on established tokens.',
  },
  [StrategyType.BALANCED]: {
    name: 'Balanced',
    minConfidence: 0.7,
    maxTradeAmount: '0.05',
    riskLevels: ['low', 'medium'],
    stopLoss: 0.2, // 20%
    takeProfit: 0.5, // 50%
    description: 'Moderate risk with balanced approach. Diversified across token types.',
  },
  [StrategyType.AGGRESSIVE]: {
    name: 'Aggressive',
    minConfidence: 0.5,
    maxTradeAmount: '0.1',
    riskLevels: ['low', 'medium', 'high'],
    stopLoss: 0.35, // 35%
    takeProfit: 1.0, // 100%
    description: 'High risk, high reward. Early entry on emerging tokens with potential for large gains.',
  },
} as const;

// Monad testnet chain config
export const MONAD_TESTNET = {
  id: 10143,
  name: 'Monad Testnet',
  rpcUrl: 'https://testnet-rpc.monad.xyz',
  explorerUrl: 'https://testnet.monadexplorer.com',
  faucetUrl: 'https://faucet.monad.xyz/',
} as const;
