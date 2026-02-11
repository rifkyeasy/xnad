'use client';

import { useAccount, useSwitchChain } from 'wagmi';
import { useCallback } from 'react';

import { monadTestnet } from '@/config/wagmi';

export function useChainCheck() {
  // useAccount().chainId returns the wallet's ACTUAL chain, not wagmi config
  const { chainId } = useAccount();
  const { switchChainAsync, isPending } = useSwitchChain();

  const isCorrectChain = chainId === monadTestnet.id;

  const ensureCorrectChain = useCallback(async (): Promise<boolean> => {
    if (isCorrectChain) return true;

    try {
      await switchChainAsync({ chainId: monadTestnet.id });

      return true;
    } catch {
      return false;
    }
  }, [isCorrectChain, switchChainAsync]);

  return {
    isCorrectChain,
    chainId,
    expectedChainId: monadTestnet.id,
    expectedChainName: monadTestnet.name,
    ensureCorrectChain,
    switchToMonad: () => switchChainAsync({ chainId: monadTestnet.id }),
    isSwitching: isPending,
  };
}
