import { createConfig } from "ponder";
import { http } from "viem";

import { VaultFactoryAbi } from "./abis/VaultFactory";
import { UserVaultAbi } from "./abis/UserVault";

// Monad Testnet
const RPC_URL = process.env.RPC_URL || "https://testnet-rpc.monad.xyz";

// Deployed contract addresses
const VAULT_FACTORY_ADDRESS = "0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A";

// Block where VaultFactory was deployed (set to recent block to avoid rate limits)
const START_BLOCK = Number(process.env.START_BLOCK || 10000000);

export default createConfig({
  database: {
    kind: "pglite",
  },
  chains: {
    monadTestnet: {
      id: 10143,
      rpc: http(RPC_URL, {
        retryCount: 5,
        retryDelay: 2000,
      }),
      maxRequestsPerSecond: 5,
    },
  },
  contracts: {
    VaultFactory: {
      chain: "monadTestnet",
      abi: VaultFactoryAbi,
      address: VAULT_FACTORY_ADDRESS as `0x${string}`,
      startBlock: START_BLOCK,
    },
    UserVault: {
      chain: "monadTestnet",
      abi: UserVaultAbi,
      // @ts-expect-error - Factory pattern is supported but types are outdated
      factory: {
        address: VAULT_FACTORY_ADDRESS as `0x${string}`,
        event: "VaultCreated",
        parameter: "vault",
      },
      startBlock: START_BLOCK,
    },
  },
});
