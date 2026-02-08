import {
  createPublicClient,
  createWalletClient,
  http,
  type PublicClient,
  type WalletClient,
  type Chain,
  type Transport,
  type Account,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { env, monadMainnet, monadTestnet, isProduction } from '@cartel/config';
import { createLogger } from '@cartel/shared';

const logger = createLogger('monad-client');

export interface MonadClientConfig {
  rpcUrl?: string;
  privateKey?: string;
  isMainnet?: boolean;
}

export class MonadClient {
  public readonly chain: Chain;
  public readonly publicClient: PublicClient<Transport, Chain>;
  public readonly walletClient: WalletClient<Transport, Chain, Account> | null;
  public readonly account: Account | null;

  constructor(config: MonadClientConfig = {}) {
    const isMainnet = config.isMainnet ?? isProduction();
    this.chain = isMainnet ? monadMainnet : monadTestnet;

    const rpcUrl = config.rpcUrl || env.MONAD_RPC_URL;

    logger.info(`Initializing Monad client`, {
      network: this.chain.name,
      chainId: this.chain.id,
      rpcUrl,
    });

    // Create public client for read operations
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(rpcUrl),
    });

    // Create wallet client if private key is provided
    const privateKey = config.privateKey || env.PRIVATE_KEY;
    if (privateKey) {
      this.account = privateKeyToAccount(`0x${privateKey.replace('0x', '')}`);
      this.walletClient = createWalletClient({
        account: this.account,
        chain: this.chain,
        transport: http(rpcUrl),
      });
      logger.info(`Wallet initialized`, { address: this.account.address });
    } else {
      this.account = null;
      this.walletClient = null;
      logger.warn('No private key provided - wallet operations disabled');
    }
  }

  /**
   * Get the current block number
   */
  async getBlockNumber(): Promise<bigint> {
    return this.publicClient.getBlockNumber();
  }

  /**
   * Get the balance of an address in MON
   */
  async getBalance(address: `0x${string}`): Promise<bigint> {
    return this.publicClient.getBalance({ address });
  }

  /**
   * Get the balance of the connected wallet
   */
  async getWalletBalance(): Promise<bigint> {
    if (!this.account) {
      throw new Error('Wallet not initialized');
    }
    return this.getBalance(this.account.address);
  }

  /**
   * Estimate gas for a transaction
   */
  async estimateGas(params: {
    to: `0x${string}`;
    value?: bigint;
    data?: `0x${string}`;
  }): Promise<bigint> {
    if (!this.account) {
      throw new Error('Wallet not initialized');
    }
    return this.publicClient.estimateGas({
      account: this.account,
      ...params,
    });
  }

  /**
   * Send a transaction
   */
  async sendTransaction(params: {
    to: `0x${string}`;
    value?: bigint;
    data?: `0x${string}`;
    gas?: bigint;
  }): Promise<`0x${string}`> {
    if (!this.walletClient || !this.account) {
      throw new Error('Wallet not initialized');
    }

    logger.debug('Sending transaction', params);

    const hash = await this.walletClient.sendTransaction({
      account: this.account,
      chain: this.chain,
      ...params,
    });

    logger.info('Transaction sent', { hash });
    return hash;
  }

  /**
   * Wait for a transaction to be confirmed
   */
  async waitForTransaction(hash: `0x${string}`) {
    logger.debug('Waiting for transaction confirmation', { hash });

    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    logger.info('Transaction confirmed', {
      hash,
      blockNumber: receipt.blockNumber,
      status: receipt.status,
    });

    return receipt;
  }

  /**
   * Check if the client is connected
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.getBlockNumber();
      return true;
    } catch {
      return false;
    }
  }
}

// Singleton instance
let _client: MonadClient | null = null;

export function getMonadClient(config?: MonadClientConfig): MonadClient {
  if (!_client) {
    _client = new MonadClient(config);
  }
  return _client;
}
