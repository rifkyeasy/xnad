// nad.fun Contract Addresses and ABIs for Monad

export const MONAD_TESTNET_CHAIN_ID = 10143;
export const MONAD_MAINNET_CHAIN_ID = 41454;

// Contract Addresses
export const CONTRACTS = {
  testnet: {
    dexRouter: "0x5D4a4f430cA3B1b2dB86B9cFE48a5316800F5fb2" as const,
    bondingCurveRouter: "0x865054F0F6A288adaAc30261731361EA7E908003" as const,
    lens: "0xB056d79CA5257589692699a46623F901a3BB76f1" as const,
    curve: "0x1228b0dc9481C11D3071E7A924B794CfB038994e" as const,
    wmon: "0x5a4E0bFDeF88C9032CB4d24338C5EB3d3870BfDd" as const,
    v3Factory: "0xd0a37cf728CE2902eB8d4F6f2afc76854048253b" as const,
  },
  mainnet: {
    dexRouter: "0x0B79d71AE99528D1dB24A4148b5f4F865cc2b137" as const,
    bondingCurveRouter: "0x6F6B8F1a20703309951a5127c45B49b1CD981A22" as const,
    lens: "0x7e78A8DE94f21804F7a17F4E8BF9EC2c872187ea" as const,
    curve: "0xA7283d07812a02AFB7C09B60f8896bCEA3F90aCE" as const,
    wmon: "0x3bd359C1119dA7Da1D913D1C4D2B7c461115433A" as const,
    v3Factory: "0x6B5F564339DbAD6b780249827f2198a841FEB7F3" as const,
  },
} as const;

// Get contracts for current network (default testnet)
export function getContracts(chainId?: number) {
  if (chainId === MONAD_MAINNET_CHAIN_ID) {
    return CONTRACTS.mainnet;
  }
  return CONTRACTS.testnet;
}

// Bonding Curve Router ABI (for buying/selling on bonding curve)
export const bondingCurveRouterAbi = [
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
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "sell",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "sellPermit",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "availableBuyTokens",
    outputs: [
      { name: "tokens", type: "uint256" },
      { name: "monRequired", type: "uint256" },
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
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountOut", type: "uint256" },
      { name: "isBuy", type: "bool" },
    ],
    name: "getAmountInWithFee",
    outputs: [
      { name: "amountIn", type: "uint256" },
      { name: "fee", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "curve",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "wMon",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Lens Contract ABI (for price queries)
export const lensAbi = [
  {
    inputs: [{ name: "token", type: "address" }],
    name: "availableBuyTokens",
    outputs: [
      { name: "tokens", type: "uint256" },
      { name: "monRequired", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountOut", type: "uint256" },
    ],
    name: "getAmountIn",
    outputs: [{ name: "amountIn", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountIn", type: "uint256" },
    ],
    name: "getAmountOut",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "amountIn", type: "uint256" }],
    name: "getInitialBuyAmountOut",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "getProgress",
    outputs: [
      { name: "progress", type: "uint256" },
      { name: "currentMarketCap", type: "uint256" },
      { name: "graduationMarketCap", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "isGraduated",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "isLocked",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// Curve Contract ABI (for token state)
export const curveAbi = [
  {
    inputs: [{ name: "token", type: "address" }],
    name: "curves",
    outputs: [
      { name: "realReserve", type: "uint256" },
      { name: "virtualReserve", type: "uint256" },
      { name: "k", type: "uint256" },
      { name: "realTokenSupply", type: "uint256" },
      { name: "virtualTokenSupply", type: "uint256" },
      { name: "graduated", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "isGraduated",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "token", type: "address" }],
    name: "isLocked",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// ERC20 Token ABI (for approvals and balances)
export const erc20Abi = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
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
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
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
  // EIP-2612 Permit
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "nonces",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// DEX Router ABI (for graduated tokens on DEX)
export const dexRouterAbi = [
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
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "sell",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "token", type: "address" },
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    name: "sellPermit",
    outputs: [{ name: "amountOut", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
