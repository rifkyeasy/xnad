import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  formatEther,
  type Address,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { ENV, NADFUN_CONTRACTS, VAULT_CONTRACTS } from './config.js';
import { log } from './logger.js';

// Monad testnet chain
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: { decimals: 18, name: 'Monad', symbol: 'MON' },
  rpcUrls: { default: { http: [ENV.RPC_URL] } },
};

// UserVault ABI
const userVaultAbi = [
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'agent',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'paused',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'strategyType',
    outputs: [{ name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'maxTradeAmount',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'token', type: 'address' }],
    name: 'getTokenBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { name: 'router', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'amountIn', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    name: 'executeBuy',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { name: 'router', type: 'address' },
      { name: 'token', type: 'address' },
      { name: 'tokenAmount', type: 'uint256' },
      { name: 'minAmountOut', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ],
    name: 'executeSell',
    outputs: [{ name: 'amountOut', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// VaultFactory ABI
const vaultFactoryAbi = [
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'getVault',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'user', type: 'address' }],
    name: 'hasVault',
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalVaults',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ name: 'index', type: 'uint256' }],
    name: 'getVaultAt',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export interface VaultInfo {
  address: string;
  owner: string;
  agent: string;
  balance: string;
  paused: boolean;
  strategyType: number;
  maxTradeAmount: string;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amountOut?: string;
  error?: string;
}

export class VaultClient {
  private publicClient;
  private walletClient;
  private account;
  private factoryAddress: string;

  constructor(factoryAddress: string) {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY not set in environment');
    }

    this.account = privateKeyToAccount(ENV.PRIVATE_KEY as `0x${string}`);
    this.factoryAddress = factoryAddress;

    this.publicClient = createPublicClient({
      chain: monadTestnet,
      transport: http(),
    });

    this.walletClient = createWalletClient({
      chain: monadTestnet,
      transport: http(),
      account: this.account,
    });
  }

  get agentAddress(): string {
    return this.account.address;
  }

  get address(): string {
    return this.account.address;
  }

  // Get vault address for a user
  async getVaultAddress(userAddress: string): Promise<string | null> {
    try {
      const vault = await this.publicClient.readContract({
        address: this.factoryAddress as Address,
        abi: vaultFactoryAbi,
        functionName: 'getVault',
        args: [userAddress as Address],
      });
      return vault === '0x0000000000000000000000000000000000000000' ? null : vault;
    } catch {
      return null;
    }
  }

  // Get vault info
  async getVaultInfo(vaultAddress: string): Promise<VaultInfo | null> {
    try {
      const [owner, agent, balance, paused, strategyType, maxTradeAmount] = await Promise.all([
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'owner',
        }),
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'agent',
        }),
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'getBalance',
        }),
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'paused',
        }),
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'strategyType',
        }),
        this.publicClient.readContract({
          address: vaultAddress as Address,
          abi: userVaultAbi,
          functionName: 'maxTradeAmount',
        }),
      ]);

      return {
        address: vaultAddress,
        owner,
        agent,
        balance: formatEther(balance),
        paused,
        strategyType,
        maxTradeAmount: formatEther(maxTradeAmount),
      };
    } catch (error) {
      log.error('Error getting vault info', error);
      return null;
    }
  }

  // Get token balance in vault
  async getVaultTokenBalance(vaultAddress: string, tokenAddress: string): Promise<string> {
    try {
      const balance = await this.publicClient.readContract({
        address: vaultAddress as Address,
        abi: userVaultAbi,
        functionName: 'getTokenBalance',
        args: [tokenAddress as Address],
      });
      return formatEther(balance);
    } catch {
      return '0';
    }
  }

  // Execute buy through vault
  async executeBuy(
    vaultAddress: string,
    tokenAddress: string,
    amountIn: string,
    minAmountOut: string,
    deadline: bigint
  ): Promise<TradeResult> {
    try {
      const hash = await this.walletClient.writeContract({
        address: vaultAddress as Address,
        abi: userVaultAbi,
        functionName: 'executeBuy',
        args: [
          NADFUN_CONTRACTS.bondingCurveRouter as Address,
          tokenAddress as Address,
          parseEther(amountIn),
          parseEther(minAmountOut),
          deadline,
        ],
      });

      log.info(`Buy TX submitted: ${hash}`);

      // Wait for confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        return {
          success: true,
          txHash: hash,
        };
      } else {
        return {
          success: false,
          txHash: hash,
          error: 'Transaction reverted',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Execute sell through vault
  async executeSell(
    vaultAddress: string,
    tokenAddress: string,
    tokenAmount: string,
    minAmountOut: string,
    deadline: bigint
  ): Promise<TradeResult> {
    try {
      const hash = await this.walletClient.writeContract({
        address: vaultAddress as Address,
        abi: userVaultAbi,
        functionName: 'executeSell',
        args: [
          NADFUN_CONTRACTS.bondingCurveRouter as Address,
          tokenAddress as Address,
          parseEther(tokenAmount),
          parseEther(minAmountOut),
          deadline,
        ],
      });

      log.info(`Sell TX submitted: ${hash}`);

      // Wait for confirmation
      const receipt = await this.publicClient.waitForTransactionReceipt({ hash });

      if (receipt.status === 'success') {
        return {
          success: true,
          txHash: hash,
        };
      } else {
        return {
          success: false,
          txHash: hash,
          error: 'Transaction reverted',
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Get all vaults (for agent loop)
  async getAllVaults(): Promise<string[]> {
    try {
      const totalVaults = await this.publicClient.readContract({
        address: this.factoryAddress as Address,
        abi: vaultFactoryAbi,
        functionName: 'totalVaults',
      });

      const vaults: string[] = [];
      for (let i = 0n; i < totalVaults; i++) {
        const vault = await this.publicClient.readContract({
          address: this.factoryAddress as Address,
          abi: vaultFactoryAbi,
          functionName: 'getVaultAt',
          args: [i],
        });
        vaults.push(vault);
      }

      return vaults;
    } catch {
      return [];
    }
  }
}

// Singleton instance
let vaultClient: VaultClient | null = null;

export function getVaultClient(): VaultClient {
  if (!vaultClient) {
    vaultClient = new VaultClient(VAULT_CONTRACTS.vaultFactory);
  }
  return vaultClient;
}
