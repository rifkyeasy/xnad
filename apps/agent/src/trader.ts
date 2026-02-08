import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
  type Address,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { ENV, CONTRACTS, TRADING_CONFIG } from "./config.js";
import type { TradeSignal } from "./ai-analyzer.js";

// Monad mainnet chain
const monadMainnet = {
  id: 41454,
  name: "Monad",
  nativeCurrency: { decimals: 18, name: "Monad", symbol: "MON" },
  rpcUrls: { default: { http: [ENV.RPC_URL] } },
};

// ABIs
const bondingCurveRouterAbi = [
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "buy",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "payable",
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
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export interface TradeResult {
  success: boolean;
  txHash?: string;
  error?: string;
  tokenAddress: string;
  action: "buy" | "sell";
  amountIn: string;
  amountOut?: string;
}

export class Trader {
  private publicClient;
  private walletClient;
  private account;

  constructor() {
    if (!ENV.PRIVATE_KEY) {
      throw new Error("PRIVATE_KEY not set in environment");
    }

    this.account = privateKeyToAccount(ENV.PRIVATE_KEY as `0x${string}`);

    this.publicClient = createPublicClient({
      chain: monadMainnet,
      transport: http(),
    });

    this.walletClient = createWalletClient({
      chain: monadMainnet,
      transport: http(),
      account: this.account,
    });
  }

  get address(): string {
    return this.account.address;
  }

  async getBalance(): Promise<string> {
    const balance = await this.publicClient.getBalance({
      address: this.account.address,
    });
    return formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string): Promise<string> {
    try {
      const balance = await this.publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "balanceOf",
        args: [this.account.address],
      });
      return formatEther(balance);
    } catch {
      return "0";
    }
  }

  async getTokenSymbol(tokenAddress: string): Promise<string | null> {
    try {
      const symbol = await this.publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "symbol",
      });
      return symbol;
    } catch {
      return null;
    }
  }

  async getBuyQuote(
    tokenAddress: string,
    monAmount: string
  ): Promise<{ amountOut: string; fee: string }> {
    try {
      const result = await this.publicClient.readContract({
        address: CONTRACTS.bondingCurveRouter as Address,
        abi: bondingCurveRouterAbi,
        functionName: "getAmountOutWithFee",
        args: [tokenAddress as Address, parseEther(monAmount), true],
      });

      return {
        amountOut: formatEther(result[0]),
        fee: formatEther(result[1]),
      };
    } catch (error) {
      console.error("Error getting buy quote:", error);
      return { amountOut: "0", fee: "0" };
    }
  }

  async executeBuy(signal: TradeSignal): Promise<TradeResult> {
    if (!signal.tokenAddress) {
      return {
        success: false,
        error: "No token address provided",
        tokenAddress: "",
        action: "buy",
        amountIn: "0",
      };
    }

    const tokenAddress = signal.tokenAddress;
    const amount = signal.suggestedAmount || TRADING_CONFIG.maxBuyAmount;

    // Cap at max buy amount
    const buyAmount = Math.min(
      parseFloat(amount),
      parseFloat(TRADING_CONFIG.maxBuyAmount)
    ).toString();

    console.log(`\n--- Executing Buy ---`);
    console.log(`Token: ${tokenAddress}`);
    console.log(`Amount: ${buyAmount} MON`);
    console.log(`Confidence: ${(signal.confidence * 100).toFixed(0)}%`);

    try {
      // Get quote first
      const quote = await this.getBuyQuote(tokenAddress, buyAmount);
      console.log(`Expected tokens: ${quote.amountOut}`);

      // Calculate min output with slippage
      const minOut =
        (parseFloat(quote.amountOut) *
          (100 - TRADING_CONFIG.slippagePercent)) /
        100;
      const deadline = BigInt(Math.floor(Date.now() / 1000) + 3600);

      // Execute buy
      const hash = await this.walletClient.writeContract({
        address: CONTRACTS.bondingCurveRouter as Address,
        abi: bondingCurveRouterAbi,
        functionName: "buy",
        args: [
          tokenAddress as Address,
          parseEther(minOut.toString()),
          this.account.address,
          deadline,
        ],
        value: parseEther(buyAmount),
      });

      console.log(`TX Hash: ${hash}`);

      return {
        success: true,
        txHash: hash,
        tokenAddress,
        action: "buy",
        amountIn: buyAmount,
        amountOut: quote.amountOut,
      };
    } catch (error) {
      console.error("Buy execution failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        tokenAddress,
        action: "buy",
        amountIn: buyAmount,
      };
    }
  }

  async executeTrade(signal: TradeSignal): Promise<TradeResult> {
    if (signal.action === "buy") {
      return this.executeBuy(signal);
    }

    // TODO: Implement sell
    return {
      success: false,
      error: "Sell not implemented yet",
      tokenAddress: signal.tokenAddress || "",
      action: "sell",
      amountIn: "0",
    };
  }
}
