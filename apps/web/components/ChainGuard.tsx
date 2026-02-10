'use client';

import { Button } from '@heroui/button';

import { useChainCheck } from '@/hooks/useChainCheck';

interface ChainGuardProps {
  children: React.ReactNode;
}

export function ChainGuard({ children }: ChainGuardProps) {
  const { isCorrectChain, switchToMonad } = useChainCheck();

  if (!isCorrectChain) {
    return (
      <div className="p-6 rounded-xl border border-warning-200 bg-warning-50/50 text-center">
        <p className="text-warning-700 font-medium mb-2">Wrong Network</p>
        <p className="text-warning-600 text-sm mb-4">Please switch to Monad Testnet to continue</p>
        <Button color="warning" variant="flat" onPress={switchToMonad}>
          Switch to Monad Testnet
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}

// Inline version for showing warning without blocking
export function ChainWarning() {
  const { isCorrectChain, switchToMonad } = useChainCheck();

  if (isCorrectChain) return null;

  return (
    <div className="p-4 rounded-xl border border-warning-200 bg-warning-50/50 flex justify-between items-center">
      <p className="text-warning-600 text-sm">Switch to Monad Testnet to make transactions</p>
      <Button color="warning" size="sm" variant="flat" onPress={switchToMonad}>
        Switch Network
      </Button>
    </div>
  );
}
