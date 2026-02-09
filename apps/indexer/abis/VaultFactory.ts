export const VaultFactoryAbi = [
  {
    type: "event",
    name: "VaultCreated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "vault", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "DefaultAgentUpdated",
    inputs: [
      { name: "oldAgent", type: "address", indexed: true },
      { name: "newAgent", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "OwnerUpdated",
    inputs: [
      { name: "oldOwner", type: "address", indexed: true },
      { name: "newOwner", type: "address", indexed: true },
    ],
  },
  {
    type: "function",
    name: "getVault",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasVault",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "totalVaults",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getVaultAt",
    inputs: [{ name: "index", type: "uint256" }],
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
  },
] as const;
