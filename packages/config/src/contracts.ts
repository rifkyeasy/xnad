import type { Address } from 'viem';

export interface ContractAddresses {
  bondingCurveRouter: Address;
  curve: Address;
  lens: Address;
  dexRouter: Address;
  wrappedMon: Address;
}

// Mainnet Contract Addresses (Chain ID: 143)
export const MAINNET_CONTRACTS: ContractAddresses = {
  bondingCurveRouter: '0x6F6B8F1a20703309951a5127c45B49b1CD981A22',
  curve: '0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE',
  lens: '0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea',
  dexRouter: '0x0000000000000000000000000000000000000000', // TODO: Add actual address
  wrappedMon: '0x0000000000000000000000000000000000000000', // TODO: Add actual address
};

// Testnet Contract Addresses (Chain ID: 10143)
export const TESTNET_CONTRACTS: ContractAddresses = {
  bondingCurveRouter: '0x0000000000000000000000000000000000000000', // TODO: Add testnet address
  curve: '0x0000000000000000000000000000000000000000',
  lens: '0x0000000000000000000000000000000000000000',
  dexRouter: '0x0000000000000000000000000000000000000000',
  wrappedMon: '0x0000000000000000000000000000000000000000',
};

export function getContracts(chainId: number): ContractAddresses {
  switch (chainId) {
    case 143:
      return MAINNET_CONTRACTS;
    case 10143:
      return TESTNET_CONTRACTS;
    default:
      throw new Error(`Unsupported chain ID: ${chainId}`);
  }
}

// ABIs (minimal for now, expand as needed)
export const BONDING_CURVE_ROUTER_ABI = [
  {
    name: 'create',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      {
        name: 'params',
        type: 'tuple',
        components: [
          { name: 'name', type: 'string' },
          { name: 'symbol', type: 'string' },
          { name: 'tokenURI', type: 'string' },
          { name: 'amountOut', type: 'uint256' },
          { name: 'salt', type: 'bytes32' },
          { name: 'actionId', type: 'uint8' },
        ],
      },
    ],
    outputs: [{ name: 'token', type: 'address' }],
  },
  {
    name: 'buy',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
  {
    name: 'sell',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'token', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'recipient', type: 'address' },
      { name: 'deadline', type: 'uint256' },
    ],
    outputs: [{ name: 'amountOut', type: 'uint256' }],
  },
] as const;

export const ERC20_ABI = [
  {
    name: 'balanceOf',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'approve',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
  {
    name: 'allowance',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'transfer',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'to', type: 'address' },
      { name: 'amount', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
  },
] as const;
