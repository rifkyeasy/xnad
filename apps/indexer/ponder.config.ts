import { createConfig } from "@ponder/core";
import { http } from "viem";

import { VaultFactoryAbi } from "./abis/VaultFactory";
import { UserVaultAbi } from "./abis/UserVault";

// Monad Testnet
const MONAD_TESTNET_CHAIN_ID = 10143;
const RPC_URL = process.env.RPC_URL || "https://testnet-rpc.monad.xyz";

// Deployed contract addresses
const VAULT_FACTORY_ADDRESS = process.env.VAULT_FACTORY_ADDRESS || "0x164B4eF50c0C8C75Dc6F571e62731C4Fa0C6283A";

// Block where VaultFactory was deployed (adjust based on deployment)
const START_BLOCK = Number(process.env.START_BLOCK || 0);

export default createConfig({
  networks: {
    monadTestnet: {
      chainId: MONAD_TESTNET_CHAIN_ID,
      transport: http(RPC_URL, {
        // Rate limiting settings
        retryCount: 5,
        retryDelay: 1000,
        timeout: 30000,
      }),
    },
  },
  contracts: {
    VaultFactory: {
      network: "monadTestnet",
      abi: VaultFactoryAbi,
      address: VAULT_FACTORY_ADDRESS as `0x${string}`,
      startBlock: START_BLOCK,
    },
    // UserVault events are indexed via factory pattern
    // We'll use the factory to discover vault addresses
    UserVault: {
      network: "monadTestnet",
      abi: UserVaultAbi,
      factory: {
        address: VAULT_FACTORY_ADDRESS as `0x${string}`,
        event: VaultFactoryAbi[0], // VaultCreated event
        parameter: "vault",
      },
      startBlock: START_BLOCK,
    },
  },
});
