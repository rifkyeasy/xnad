export const UserVaultAbi = [
  {
    type: "event",
    name: "Deposited",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Withdrawn",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "AgentUpdated",
    inputs: [
      { name: "oldAgent", type: "address", indexed: true },
      { name: "newAgent", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "StrategyUpdated",
    inputs: [
      { name: "strategyType", type: "uint8", indexed: false },
      { name: "maxTradeAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "TradeExecuted",
    inputs: [
      { name: "token", type: "address", indexed: true },
      { name: "isBuy", type: "bool", indexed: false },
      { name: "amountIn", type: "uint256", indexed: false },
      { name: "amountOut", type: "uint256", indexed: false },
      { name: "tradeId", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "Paused",
    inputs: [{ name: "isPaused", type: "bool", indexed: false }],
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "agent",
    inputs: [],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "strategyType",
    inputs: [],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "maxTradeAmount",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
] as const;
