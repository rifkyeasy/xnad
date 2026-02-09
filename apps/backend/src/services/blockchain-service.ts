import { createPublicClient, http, formatEther, type Address } from "viem";

const RPC_URL = process.env.RPC_URL || "https://testnet-rpc.monad.xyz";
const MOCK_ROUTER = process.env.MOCK_ROUTER_ADDRESS || "0xE3965709c657748501bB33a55AEFdE7F9622FD5E";

// Monad chain config
const monad = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { decimals: 18, name: "Monad", symbol: "MON" },
  rpcUrls: { default: { http: [RPC_URL] } },
};

const publicClient = createPublicClient({
  chain: monad,
  transport: http(),
});

// Mock Router ABI
const mockRouterAbi = [
  {
    inputs: [{ name: "token", type: "address" }],
    name: "getPrice",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "getPoolInfo",
    outputs: [
      { name: "reserveMon", type: "uint256" },
      { name: "reserveToken", type: "uint256" },
      { name: "price", type: "uint256" },
      { name: "totalVolume", type: "uint256" },
      { name: "momentum", type: "int256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "isBuy", type: "bool" },
    ],
    name: "getAmountOutWithFee",
    outputs: [
      { name: "amountOut", type: "uint256" },
      { name: "fee", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 ABI
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
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface PoolInfo {
  reserveMon: string;
  reserveToken: string;
  price: string;
  priceFormatted: string;
  totalVolume: string;
  momentum: number;
  momentumLabel: "bullish" | "bearish" | "neutral";
}

export interface TokenMarketData {
  address: string;
  price: string;
  priceUsd: string;
  change24h: number;
  volume24h: string;
  marketCap: string;
  momentum: number;
  liquidity: string;
}

export async function getTokenPrice(tokenAddress: string): Promise<string> {
  try {
    const price = await publicClient.readContract({
      address: MOCK_ROUTER as Address,
      abi: mockRouterAbi,
      functionName: "getPrice",
      args: [tokenAddress as Address],
    });
    return formatEther(price);
  } catch {
    return "0";
  }
}

export async function getPoolInfo(tokenAddress: string): Promise<PoolInfo | null> {
  try {
    const result = await publicClient.readContract({
      address: MOCK_ROUTER as Address,
      abi: mockRouterAbi,
      functionName: "getPoolInfo",
      args: [tokenAddress as Address],
    });

    const momentum = Number(result[4]);
    let momentumLabel: "bullish" | "bearish" | "neutral" = "neutral";
    if (momentum > 20) momentumLabel = "bullish";
    else if (momentum < -20) momentumLabel = "bearish";

    const priceWei = result[2];
    const priceEth = formatEther(priceWei);

    // Format price nicely
    const priceNum = parseFloat(priceEth);
    let priceFormatted: string;
    if (priceNum < 0.000001) {
      priceFormatted = priceNum.toExponential(4);
    } else if (priceNum < 0.01) {
      priceFormatted = priceNum.toFixed(8);
    } else {
      priceFormatted = priceNum.toFixed(6);
    }

    return {
      reserveMon: formatEther(result[0]),
      reserveToken: formatEther(result[1]),
      price: priceEth,
      priceFormatted,
      totalVolume: formatEther(result[3]),
      momentum,
      momentumLabel,
    };
  } catch {
    return null;
  }
}

export async function getTokenMarketData(
  tokenAddress: string,
  symbol: string
): Promise<TokenMarketData | null> {
  try {
    const poolInfo = await getPoolInfo(tokenAddress);

    if (!poolInfo) {
      // Return default data for uninitialized pool
      return {
        address: tokenAddress,
        price: "0.000001",
        priceUsd: "0.000001",
        change24h: 0,
        volume24h: "0",
        marketCap: "0",
        momentum: 0,
        liquidity: "0",
      };
    }

    // Get total supply for market cap calculation
    let totalSupply = "1000000000"; // Default 1B
    try {
      const supply = await publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "totalSupply",
      });
      totalSupply = formatEther(supply);
    } catch {
      // Use default
    }

    const priceNum = parseFloat(poolInfo.price);
    const supplyNum = parseFloat(totalSupply);
    const marketCap = priceNum * supplyNum;

    // Simulate 24h change based on momentum
    const change24h = poolInfo.momentum * 0.5; // -50% to +50% based on momentum

    return {
      address: tokenAddress,
      price: poolInfo.price,
      priceUsd: poolInfo.priceFormatted, // In testnet, 1 MON ≈ 1 USD for simplicity
      change24h,
      volume24h: poolInfo.totalVolume,
      marketCap: marketCap.toFixed(2),
      momentum: poolInfo.momentum,
      liquidity: poolInfo.reserveMon,
    };
  } catch {
    return null;
  }
}

export async function getWalletBalance(walletAddress: string): Promise<string> {
  try {
    const balance = await publicClient.getBalance({
      address: walletAddress as Address,
    });
    return formatEther(balance);
  } catch {
    return "0";
  }
}

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
  } catch {
    return "0";
  }
}
