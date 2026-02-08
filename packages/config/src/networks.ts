import { defineChain } from 'viem';

// Monad Mainnet
export const monadMainnet = defineChain({
  id: 143,
  name: 'Monad',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Explorer',
      url: 'https://explorer.monad.xyz',
    },
  },
});

// Monad Testnet
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MON',
    symbol: 'MON',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.monad.xyz'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monad Testnet Explorer',
      url: 'https://testnet-explorer.monad.xyz',
    },
  },
  testnet: true,
});

export type SupportedChain = typeof monadMainnet | typeof monadTestnet;

export function getChain(isMainnet: boolean): SupportedChain {
  return isMainnet ? monadMainnet : monadTestnet;
}

// API Endpoints
export const API_ENDPOINTS = {
  mainnet: {
    nadfun: 'https://api.nadapp.net',
    nadfunBot: 'https://bot-api-server.nad.fun',
    monadRpc: 'https://rpc.monad.xyz',
  },
  testnet: {
    nadfun: 'https://dev-api.nad.fun',
    nadfunBot: 'https://testnet-bot-api-server.nad.fun',
    monadRpc: 'https://testnet-rpc.monad.xyz',
  },
  moltbook: 'https://www.moltbook.com/api/v1',
  agentServices: {
    faucet: 'https://agents.devnads.com/v1/faucet',
    verify: 'https://agents.devnads.com/v1/verify',
  },
} as const;
