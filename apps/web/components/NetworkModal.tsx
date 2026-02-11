'use client';

import { Modal, ModalContent, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { useAccount } from 'wagmi';

import { useChainCheck } from '@/hooks/useChainCheck';

export function NetworkModal() {
  const { isConnected } = useAccount();
  const { isCorrectChain, expectedChainName, switchToMonad, isSwitching } = useChainCheck();

  const isOpen = isConnected && !isCorrectChain;

  return (
    <Modal hideCloseButton isDismissable={false} isOpen={isOpen} placement="center">
      <ModalContent>
        <ModalBody className="pt-8 pb-2 text-center">
          <p className="text-4xl mb-3">&#x26A0;&#xFE0F;</p>
          <h3 className="text-lg font-bold">Wrong Network</h3>
          <p className="text-default-500 text-sm">
            Please switch to <span className="font-semibold text-success">{expectedChainName}</span>{' '}
            to use XNAD.
          </p>
        </ModalBody>
        <ModalFooter className="justify-center pb-6">
          <Button color="success" isLoading={isSwitching} size="lg" onPress={switchToMonad}>
            Switch to {expectedChainName}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
