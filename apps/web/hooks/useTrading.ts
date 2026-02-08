"use client";

import { useState, useCallback } from "react";
import {
  useAccount,
  useChainId,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  usePublicClient,
} from "wagmi";
import { parseEther, formatEther, type Address } from "viem";
import {
  getContracts,
  bondingCurveRouterAbi,
  lensAbi,
  curveAbi,
  erc20Abi,
  dexRouterAbi,
} from "@/lib/contracts";

// Calculate minimum output with slippage
function calculateMinOutput(amount: bigint, slippagePercent: number): bigint {
  const slippageBps = BigInt(Math.floor(slippagePercent * 100));
  return amount - (amount * slippageBps) / 10000n;
}

// Get deadline (1 hour from now)
function getDeadline(): bigint {
  return BigInt(Math.floor(Date.now() / 1000) + 3600);
}

// Hook to get token price quote for buying
export function useBuyQuote(tokenAddress: string, monAmount: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const amountIn = monAmount ? parseEther(monAmount) : 0n;

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.bondingCurveRouter,
    abi: bondingCurveRouterAbi,
    functionName: "getAmountOutWithFee",
    args: [tokenAddress as Address, amountIn, true],
    query: {
      enabled: !!tokenAddress && amountIn > 0n,
    },
  });

  return {
    amountOut: data?.[0] ? formatEther(data[0]) : "0",
    fee: data?.[1] ? formatEther(data[1]) : "0",
    amountOutRaw: data?.[0] || 0n,
    isLoading,
    error,
    refetch,
  };
}

// Hook to get token price quote for selling
export function useSellQuote(tokenAddress: string, tokenAmount: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  // Token amounts typically use 18 decimals
  const amountIn = tokenAmount ? parseEther(tokenAmount) : 0n;

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.bondingCurveRouter,
    abi: bondingCurveRouterAbi,
    functionName: "getAmountOutWithFee",
    args: [tokenAddress as Address, amountIn, false],
    query: {
      enabled: !!tokenAddress && amountIn > 0n,
    },
  });

  return {
    amountOut: data?.[0] ? formatEther(data[0]) : "0",
    fee: data?.[1] ? formatEther(data[1]) : "0",
    amountOutRaw: data?.[0] || 0n,
    isLoading,
    error,
    refetch,
  };
}

// Hook to get token balance
export function useTokenBalance(tokenAddress: string) {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useReadContract({
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address!],
    query: {
      enabled: !!tokenAddress && !!address,
    },
  });

  return {
    balance: data ? formatEther(data) : "0",
    balanceRaw: data || 0n,
    isLoading,
    error,
    refetch,
  };
}

// Hook to check token allowance
export function useTokenAllowance(tokenAddress: string, spenderAddress: string) {
  const { address } = useAccount();

  const { data, isLoading, refetch } = useReadContract({
    address: tokenAddress as Address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address!, spenderAddress as Address],
    query: {
      enabled: !!tokenAddress && !!address && !!spenderAddress,
    },
  });

  return {
    allowance: data || 0n,
    isLoading,
    refetch,
  };
}

// Hook to get token progress (graduation status)
export function useTokenProgress(tokenAddress: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.lens,
    abi: lensAbi,
    functionName: "getProgress",
    args: [tokenAddress as Address],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    progress: data?.[0] ? Number(data[0]) / 100 : 0, // Convert basis points to percentage
    currentMarketCap: data?.[1] ? formatEther(data[1]) : "0",
    graduationMarketCap: data?.[2] ? formatEther(data[2]) : "0",
    isLoading,
    error,
    refetch,
  };
}

// Hook to check if token is graduated
export function useIsGraduated(tokenAddress: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { data, isLoading, refetch } = useReadContract({
    address: contracts.curve,
    abi: curveAbi,
    functionName: "isGraduated",
    args: [tokenAddress as Address],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    isGraduated: data || false,
    isLoading,
    refetch,
  };
}

// Hook to get curve state
export function useCurveState(tokenAddress: string) {
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const { data, isLoading, error, refetch } = useReadContract({
    address: contracts.curve,
    abi: curveAbi,
    functionName: "curves",
    args: [tokenAddress as Address],
    query: {
      enabled: !!tokenAddress,
    },
  });

  return {
    realReserve: data?.[0] ? formatEther(data[0]) : "0",
    virtualReserve: data?.[1] ? formatEther(data[1]) : "0",
    k: data?.[2] || 0n,
    realTokenSupply: data?.[3] ? formatEther(data[3]) : "0",
    virtualTokenSupply: data?.[4] ? formatEther(data[4]) : "0",
    graduated: data?.[5] || false,
    isLoading,
    error,
    refetch,
  };
}

// Hook to buy tokens on bonding curve
export function useBuyToken() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const publicClient = usePublicClient();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { writeContractAsync } = useWriteContract();

  const buyToken = useCallback(async (
    tokenAddress: string,
    monAmount: string,
    slippagePercent: number = 1
  ) => {
    if (!address || !publicClient) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setError(null);

    try {
      const amountIn = parseEther(monAmount);

      // Get quote first
      const quote = await publicClient.readContract({
        address: contracts.bondingCurveRouter,
        abi: bondingCurveRouterAbi,
        functionName: "getAmountOutWithFee",
        args: [tokenAddress as Address, amountIn, true],
      });

      const amountOutMin = calculateMinOutput(quote[0], slippagePercent);
      const deadline = getDeadline();

      // Execute buy
      const hash = await writeContractAsync({
        address: contracts.bondingCurveRouter,
        abi: bondingCurveRouterAbi,
        functionName: "buy",
        args: [tokenAddress as Address, amountOutMin, address, deadline],
        value: amountIn,
      });

      setIsPending(false);
      return { hash, amountOut: formatEther(quote[0]) };
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
      throw err;
    }
  }, [address, contracts, publicClient, writeContractAsync]);

  return {
    buyToken,
    isPending,
    error,
  };
}

// Hook to sell tokens on bonding curve
export function useSellToken() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const publicClient = usePublicClient();

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { writeContractAsync } = useWriteContract();

  const approveToken = useCallback(async (tokenAddress: string, amount: bigint) => {
    const hash = await writeContractAsync({
      address: tokenAddress as Address,
      abi: erc20Abi,
      functionName: "approve",
      args: [contracts.bondingCurveRouter, amount],
    });
    return hash;
  }, [contracts, writeContractAsync]);

  const sellToken = useCallback(async (
    tokenAddress: string,
    tokenAmount: string,
    slippagePercent: number = 1
  ) => {
    if (!address || !publicClient) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setError(null);

    try {
      const amountIn = parseEther(tokenAmount);

      // Check allowance
      const allowance = await publicClient.readContract({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "allowance",
        args: [address, contracts.bondingCurveRouter],
      });

      // Approve if needed
      if (allowance < amountIn) {
        await approveToken(tokenAddress, amountIn);
        // Wait a bit for approval to be confirmed
        await new Promise(resolve => setTimeout(resolve, 2000));
      }

      // Get quote
      const quote = await publicClient.readContract({
        address: contracts.bondingCurveRouter,
        abi: bondingCurveRouterAbi,
        functionName: "getAmountOutWithFee",
        args: [tokenAddress as Address, amountIn, false],
      });

      const amountOutMin = calculateMinOutput(quote[0], slippagePercent);
      const deadline = getDeadline();

      // Execute sell
      const hash = await writeContractAsync({
        address: contracts.bondingCurveRouter,
        abi: bondingCurveRouterAbi,
        functionName: "sell",
        args: [tokenAddress as Address, amountIn, amountOutMin, address, deadline],
      });

      setIsPending(false);
      return { hash, amountOut: formatEther(quote[0]) };
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
      throw err;
    }
  }, [address, contracts, publicClient, writeContractAsync, approveToken]);

  return {
    sellToken,
    approveToken,
    isPending,
    error,
  };
}

// Hook to buy on DEX (for graduated tokens)
export function useDexBuy() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { writeContractAsync } = useWriteContract();

  const buyOnDex = useCallback(async (
    tokenAddress: string,
    monAmount: string,
    amountOutMin: bigint = 0n
  ) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setError(null);

    try {
      const amountIn = parseEther(monAmount);
      const deadline = getDeadline();

      const hash = await writeContractAsync({
        address: contracts.dexRouter,
        abi: dexRouterAbi,
        functionName: "buy",
        args: [tokenAddress as Address, amountOutMin, address, deadline],
        value: amountIn,
      });

      setIsPending(false);
      return { hash };
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
      throw err;
    }
  }, [address, contracts, writeContractAsync]);

  return {
    buyOnDex,
    isPending,
    error,
  };
}

// Hook to sell on DEX (for graduated tokens)
export function useDexSell() {
  const { address } = useAccount();
  const chainId = useChainId();
  const contracts = getContracts(chainId);

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { writeContractAsync } = useWriteContract();

  const sellOnDex = useCallback(async (
    tokenAddress: string,
    tokenAmount: string,
    amountOutMin: bigint = 0n
  ) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    setIsPending(true);
    setError(null);

    try {
      const amountIn = parseEther(tokenAmount);
      const deadline = getDeadline();

      // First approve the DEX router
      await writeContractAsync({
        address: tokenAddress as Address,
        abi: erc20Abi,
        functionName: "approve",
        args: [contracts.dexRouter, amountIn],
      });

      // Wait for approval
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Execute sell
      const hash = await writeContractAsync({
        address: contracts.dexRouter,
        abi: dexRouterAbi,
        functionName: "sell",
        args: [tokenAddress as Address, amountIn, amountOutMin, address, deadline],
      });

      setIsPending(false);
      return { hash };
    } catch (err) {
      setError(err as Error);
      setIsPending(false);
      throw err;
    }
  }, [address, contracts, writeContractAsync]);

  return {
    sellOnDex,
    isPending,
    error,
  };
}

// Combined hook for smart trading (auto-selects bonding curve or DEX)
export function useSmartTrade() {
  const { buyToken, isPending: isBuying, error: buyError } = useBuyToken();
  const { sellToken, isPending: isSelling, error: sellError } = useSellToken();
  const { buyOnDex, isPending: isDexBuying, error: dexBuyError } = useDexBuy();
  const { sellOnDex, isPending: isDexSelling, error: dexSellError } = useDexSell();

  const chainId = useChainId();
  const contracts = getContracts(chainId);
  const publicClient = usePublicClient();

  const smartBuy = useCallback(async (
    tokenAddress: string,
    monAmount: string,
    slippagePercent: number = 1
  ) => {
    if (!publicClient) throw new Error("Client not available");

    // Check if graduated
    const isGraduated = await publicClient.readContract({
      address: contracts.curve,
      abi: curveAbi,
      functionName: "isGraduated",
      args: [tokenAddress as Address],
    });

    if (isGraduated) {
      return buyOnDex(tokenAddress, monAmount);
    } else {
      return buyToken(tokenAddress, monAmount, slippagePercent);
    }
  }, [publicClient, contracts, buyToken, buyOnDex]);

  const smartSell = useCallback(async (
    tokenAddress: string,
    tokenAmount: string,
    slippagePercent: number = 1
  ) => {
    if (!publicClient) throw new Error("Client not available");

    // Check if graduated
    const isGraduated = await publicClient.readContract({
      address: contracts.curve,
      abi: curveAbi,
      functionName: "isGraduated",
      args: [tokenAddress as Address],
    });

    if (isGraduated) {
      return sellOnDex(tokenAddress, tokenAmount);
    } else {
      return sellToken(tokenAddress, tokenAmount, slippagePercent);
    }
  }, [publicClient, contracts, sellToken, sellOnDex]);

  return {
    smartBuy,
    smartSell,
    isPending: isBuying || isSelling || isDexBuying || isDexSelling,
    error: buyError || sellError || dexBuyError || dexSellError,
  };
}
