'use client';

import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { useState } from 'react';

import { VAULT_CONTRACTS } from '@/config/contracts';

const USER_VAULT_ABI = [
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'agent',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strategyType',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxTradeAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{ name: 'amount', type: 'uint256' }],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdrawAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: '_type', type: 'uint8' },
      { name: '_maxAmount', type: 'uint256' },
    ],
    name: 'setStrategy',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_paused', type: 'bool' }],
    name: 'setPaused',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const VAULT_FACTORY_ABI = [
  {
    inputs: [],
    name: 'createVault',
    outputs: [{ name: 'vault', type: 'address' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getVault',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'hasVault',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// Use deployed vault factory address
const VAULT_FACTORY_ADDRESS = VAULT_CONTRACTS.vaultFactory as `0x${string}`;

export function useVaultFactory(userAddress?: string) {
  const { data: hasVault } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: 'hasVault',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: { enabled: !!userAddress && !!VAULT_FACTORY_ADDRESS },
  });

  const { data: vaultAddress } = useReadContract({
    address: VAULT_FACTORY_ADDRESS,
    abi: VAULT_FACTORY_ABI,
    functionName: 'getVault',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: { enabled: !!userAddress && !!VAULT_FACTORY_ADDRESS },
  });

  const { writeContractAsync } = useWriteContract();

  const createVault = async () => {
    const hash = await writeContractAsync({
      address: VAULT_FACTORY_ADDRESS,
      abi: VAULT_FACTORY_ABI,
      functionName: 'createVault',
    });

    return hash;
  };

  return {
    hasVault: hasVault ?? false,
    vaultAddress:
      vaultAddress === '0x0000000000000000000000000000000000000000' ? null : vaultAddress,
    createVault,
  };
}

export function useVault(vaultAddress?: string | null) {
  const [pendingTx, setPendingTx] = useState<string | null>(null);

  const { data: balance, refetch: refetchBalance } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: USER_VAULT_ABI,
    functionName: 'getBalance',
    query: { enabled: !!vaultAddress },
  });

  const { data: strategyType } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: USER_VAULT_ABI,
    functionName: 'strategyType',
    query: { enabled: !!vaultAddress },
  });

  const { data: maxTradeAmount } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: USER_VAULT_ABI,
    functionName: 'maxTradeAmount',
    query: { enabled: !!vaultAddress },
  });

  const { data: paused } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: USER_VAULT_ABI,
    functionName: 'paused',
    query: { enabled: !!vaultAddress },
  });

  const { data: agent } = useReadContract({
    address: vaultAddress as `0x${string}`,
    abi: USER_VAULT_ABI,
    functionName: 'agent',
    query: { enabled: !!vaultAddress },
  });

  const { writeContractAsync } = useWriteContract();

  const { isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: pendingTx as `0x${string}`,
  });

  const deposit = async (amount: string) => {
    const hash = await writeContractAsync({
      address: vaultAddress as `0x${string}`,
      abi: USER_VAULT_ABI,
      functionName: 'deposit',
      value: parseEther(amount),
    });

    setPendingTx(hash);

    return hash;
  };

  const withdraw = async (amount: string) => {
    const hash = await writeContractAsync({
      address: vaultAddress as `0x${string}`,
      abi: USER_VAULT_ABI,
      functionName: 'withdraw',
      args: [parseEther(amount)],
    });

    setPendingTx(hash);

    return hash;
  };

  const withdrawAll = async () => {
    const hash = await writeContractAsync({
      address: vaultAddress as `0x${string}`,
      abi: USER_VAULT_ABI,
      functionName: 'withdrawAll',
    });

    setPendingTx(hash);

    return hash;
  };

  const setStrategy = async (type: number, maxAmount: string) => {
    const hash = await writeContractAsync({
      address: vaultAddress as `0x${string}`,
      abi: USER_VAULT_ABI,
      functionName: 'setStrategy',
      args: [type, parseEther(maxAmount)],
    });

    setPendingTx(hash);

    return hash;
  };

  const setPaused = async (isPaused: boolean) => {
    const hash = await writeContractAsync({
      address: vaultAddress as `0x${string}`,
      abi: USER_VAULT_ABI,
      functionName: 'setPaused',
      args: [isPaused],
    });

    setPendingTx(hash);

    return hash;
  };

  return {
    balance: balance ? formatEther(balance) : '0',
    strategyType: strategyType ?? 1,
    maxTradeAmount: maxTradeAmount ? formatEther(maxTradeAmount) : '0.05',
    paused: paused ?? false,
    agent,
    isConfirming,
    deposit,
    withdraw,
    withdrawAll,
    setStrategy,
    setPaused,
    refetchBalance,
  };
}
