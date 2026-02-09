/**
 * nad.fun Service
 * Fetches token data from nad.fun testnet using viem
 */

import {
  createPublicClient,
  http,
  formatEther,
  type Address,
} from "viem";

// Monad testnet chain config
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { decimals: 18, name: "Monad", symbol: "MON" },
  rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
};

// nad.fun contract addresses (testnet)
const NADFUN_CONTRACTS = {
  bondingCurveRouter: "0x865054F0F6A288adaAc30261731361EA7E908003" as Address,
  lens: "0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea" as Address,
  curve: "0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE" as Address,
};

// ERC20 ABI for token info
const erc20Abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Bonding curve router ABI for quotes
const bondingCurveRouterAbi = [
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "isBuy", type: "bool" },
    ],
    name: "getAmountOut",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Create public client
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export interface QuoteResult {
  amountIn: string;
  amountOut: string;
  isBuy: boolean;
  router: string;
}

export interface WalletBalances {
  mon: string;
  tokens: Array<{
    address: string;
    symbol: string;
    balance: string;
  }>;
}

/**
 * Get token info from nad.fun
 */
export async function getNadFunTokenInfo(tokenAddress: string): Promise<TokenInfo | null> {
  try {
    const [name, symbol, decimals, totalSupply] = await Promise.all([
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "name",
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "symbol",
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "decimals",
      }),
      publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "totalSupply",
      }),
    ]);

    return {
      address: tokenAddress,
      name,
      symbol,
      decimals,
      totalSupply: formatEther(totalSupply),
    };
  } catch (error) {
    console.error("Error fetching token info:", error);
    return null;
  }
}

/**
 * Get quote for buy/sell from nad.fun bonding curve
 */
export async function getQuote(
  tokenAddress: string,
  amountIn: string,
  isBuy: boolean
): Promise<QuoteResult> {
  try {
    const amountInWei = BigInt(Math.floor(parseFloat(amountIn) * 1e18));

    const amountOut = await publicClient.readContract({
      address: NADFUN_CONTRACTS.bondingCurveRouter,
      abi: bondingCurveRouterAbi,
      functionName: "getAmountOut",
      args: [tokenAddress as Address, amountInWei, isBuy],
    });

    return {
      amountIn,
      amountOut: formatEther(amountOut),
      isBuy,
      router: NADFUN_CONTRACTS.bondingCurveRouter,
    };
  } catch (error) {
    console.error("Error getting quote:", error);
    return {
      amountIn,
      amountOut: "0",
      isBuy,
      router: NADFUN_CONTRACTS.bondingCurveRouter,
    };
  }
}

/**
 * Get wallet balances (MON + tracked tokens)
 */
export async function getWalletBalances(walletAddress: string): Promise<WalletBalances> {
  try {
    // Get MON balance
    const monBalance = await publicClient.getBalance({
      address: walletAddress as Address,
    });

    return {
      mon: formatEther(monBalance),
      tokens: [], // Tokens are fetched individually as needed
    };
  } catch (error) {
    console.error("Error fetching wallet balances:", error);
    return {
      mon: "0",
      tokens: [],
    };
  }
}

/**
 * Get token balance for a specific token
 */
export async function getTokenBalance(
  tokenAddress: string,
  walletAddress: string
): Promise<string> {
  try {
    const balance = await publicClient.readContract({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [walletAddress as Address],
    });

    return formatEther(balance);
  } catch (error) {
    console.error("Error fetching token balance:", error);
    return "0";
  }
}
