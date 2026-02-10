'use client';

import { useChainId, useSwitchChain } from 'wagmi';
import { useCallback } from 'react';

import { monadTestnet } from '@/config/wagmi';

export function useChainCheck() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();

  const isCorrectChain = chainId === monadTestnet.id;

  const ensureCorrectChain = useCallback(async (): Promise<boolean> => {
    if (isCorrectChain) return true;

    try {
      await switchChain({ chainId: monadTestnet.id });

      return true;
    } catch {
      return false;
    }
  }, [isCorrectChain, switchChain]);

  return {
    isCorrectChain,
    chainId,
    expectedChainId: monadTestnet.id,
    expectedChainName: monadTestnet.name,
    ensureCorrectChain,
    switchToMonad: () => switchChain({ chainId: monadTestnet.id }),
    isSwitching: isPending,
  };
}
