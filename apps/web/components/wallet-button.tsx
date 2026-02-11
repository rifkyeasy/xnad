'use client';

import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { Button } from '@heroui/button';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/dropdown';
import { Chip } from '@heroui/chip';
import { formatEther } from 'viem';

export function WalletButton() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  const truncatedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  const formattedBalance = balance
    ? `${parseFloat(formatEther(balance.value)).toFixed(2)} MON`
    : '0 MON';

  if (isConnected && address) {
    return (
      <Dropdown>
        <DropdownTrigger>
          <Button color="success" variant="flat">
            <span className="hidden sm:inline mr-2">{formattedBalance}</span>
            <Chip color="success" size="sm" variant="dot">
              {truncatedAddress}
            </Chip>
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Wallet actions">
          <DropdownItem key="balance" className="cursor-default" textValue="Balance">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Balance</span>
              <span className="text-xs text-default-500">{formattedBalance}</span>
            </div>
          </DropdownItem>
          <DropdownItem key="address" className="cursor-default" textValue="Address">
            <div className="flex flex-col">
              <span className="text-sm font-medium">Address</span>
              <span className="text-xs text-default-500 font-mono">{truncatedAddress}</span>
            </div>
          </DropdownItem>
          <DropdownItem key="disconnect" color="danger" onPress={() => disconnect()}>
            Disconnect
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button color="primary" isLoading={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Connect wallet options">
        {connectors.map((connector) => (
          <DropdownItem key={connector.uid} onPress={() => connect({ connector })}>
            {connector.name}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
