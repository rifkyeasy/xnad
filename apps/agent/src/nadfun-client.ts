/**
 * nad.fun SDK Client
 * Integrates with nad.fun for token creation and trading on Monad testnet
 */

import { initSDK, parseEther, formatEther } from '@nadfun/sdk';
import { ENV } from './config.js';
import { log } from './logger.js';
import * as fs from 'fs';
import * as path from 'path';

export interface TokenCreateParams {
  name: string;
  symbol: string;
  description: string;
  imagePath?: string;
  imageBuffer?: Buffer;
  imageContentType?: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml';
  website?: string;
  twitter?: string;
  telegram?: string;
  initialBuyAmount?: string; // MON amount for initial buy
}

export interface TokenCreateResult {
  tokenAddress: string;
  poolAddress: string;
  txHash: string;
  initialTokens?: string;
}

export interface TradeParams {
  token: string;
  amountIn: string;
  slippagePercent?: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amountOut?: string;
  error?: string;
}

export interface TokenMetadata {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
}

export class NadFunClient {
  private sdk: ReturnType<typeof initSDK>;

  constructor() {
    if (!ENV.PRIVATE_KEY) {
      throw new Error('PRIVATE_KEY not set');
    }

    this.sdk = initSDK({
      rpcUrl: ENV.RPC_URL,
      privateKey: ENV.PRIVATE_KEY as `0x${string}`,
      network: 'testnet',
    });
  }

  get walletAddress(): string {
    return this.sdk.account.address;
  }

  /**
   * Get the deploy fee for creating a token
   */
  async getDeployFee(): Promise<string> {
    const feeConfig = await this.sdk.getFeeConfig();
    return formatEther(feeConfig.deployFeeAmount);
  }

  /**
   * Calculate expected tokens for initial buy amount
   */
  async getInitialBuyTokens(monAmount: string): Promise<string> {
    const tokens = await this.sdk.getInitialBuyAmountOut(parseEther(monAmount));
    return formatEther(tokens);
  }

  /**
   * Create a new token on nad.fun
   */
  async createToken(params: TokenCreateParams): Promise<TokenCreateResult> {
    log.info(`--- Creating Token on nad.fun ---`);
    log.info(`Name: ${params.name}`);
    log.info(`Symbol: ${params.symbol}`);

    let imageBuffer: Buffer;
    let imageContentType: 'image/png' | 'image/jpeg' | 'image/webp' | 'image/svg+xml' = 'image/png';

    if (params.imageBuffer) {
      imageBuffer = params.imageBuffer;
      imageContentType = params.imageContentType || 'image/png';
    } else if (params.imagePath) {
      imageBuffer = fs.readFileSync(params.imagePath);
      const ext = path.extname(params.imagePath).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') imageContentType = 'image/jpeg';
      else if (ext === '.svg') imageContentType = 'image/svg+xml';
      else if (ext === '.webp') imageContentType = 'image/webp';
    } else {
      // Generate a simple placeholder image (8x8 purple pixel PNG)
      // Valid PNG with purple color #7C3AED
      imageBuffer = Buffer.from(
        '89504E470D0A1A0A0000000D4948445200000008000000080802000000' +
          '4B6D1DE2000000017352474200AECE1CE90000000467414D410000B18F' +
          '0BFC61050000000970485973000012740000127401DE661F7800000051' +
          '4944415408D76360A01040408C90F8FFF3E79F7C3AED007FFEFCF98F90' +
          'F8FF3F0310FC87E43F40F01F20F80F10FC0788FE0344FF01A2FF00D17F' +
          '80E83F40F41F20FA0F10FD07087E03447F01A23F00F14F00E14F000000' +
          '00000049454E44AE426082',
        'hex'
      );
    }

    const initialBuyAmount = params.initialBuyAmount
      ? parseEther(params.initialBuyAmount)
      : parseEther('0');

    // Get deploy fee
    const fee = await this.getDeployFee();
    log.info(`Deploy Fee: ${fee} MON`);

    if (initialBuyAmount > 0n) {
      const expectedTokens = await this.getInitialBuyTokens(params.initialBuyAmount || '0');
      log.info(`Initial Buy: ${params.initialBuyAmount} MON`);
      log.info(`Expected Tokens: ${expectedTokens}`);
    }

    try {
      const result = await this.sdk.createToken({
        name: params.name,
        symbol: params.symbol,
        description: params.description,
        image: imageBuffer,
        imageContentType,
        website: params.website,
        twitter: params.twitter,
        telegram: params.telegram,
        initialBuyAmount,
      });

      log.info(`Token Created!`);
      log.info(`Token Address: ${result.tokenAddress}`);
      log.info(`Pool Address: ${result.poolAddress}`);
      log.info(`TX Hash: ${result.transactionHash}`);

      return {
        tokenAddress: result.tokenAddress,
        poolAddress: result.poolAddress,
        txHash: result.transactionHash,
      };
    } catch (error) {
      log.error('Token creation failed', error);
      throw error;
    }
  }

  /**
   * Buy tokens on nad.fun
   */
  async buy(params: TradeParams): Promise<TradeResult> {
    log.info(`--- Buying on nad.fun ---`);
    log.info(`Token: ${params.token}`);
    log.info(`Amount: ${params.amountIn} MON`);

    try {
      const txHash = await this.sdk.simpleBuy({
        token: params.token as `0x${string}`,
        amountIn: parseEther(params.amountIn),
        slippagePercent: params.slippagePercent || 2,
      });

      log.info(`TX Hash: ${txHash}`);

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      log.error('Buy failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Sell tokens on nad.fun
   */
  async sell(params: TradeParams): Promise<TradeResult> {
    log.info(`--- Selling on nad.fun ---`);
    log.info(`Token: ${params.token}`);
    log.info(`Amount: ${params.amountIn} tokens`);

    try {
      const txHash = await this.sdk.simpleSell({
        token: params.token as `0x${string}`,
        amountIn: parseEther(params.amountIn),
        slippagePercent: params.slippagePercent || 2,
      });

      log.info(`TX Hash: ${txHash}`);

      return {
        success: true,
        txHash,
      };
    } catch (error) {
      log.error('Sell failed', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get quote for buy/sell
   */
  async getQuote(
    token: string,
    amountIn: string,
    isBuy: boolean
  ): Promise<{ router: string; amount: string }> {
    const quote = await this.sdk.getAmountOut(token as `0x${string}`, parseEther(amountIn), isBuy);
    return {
      router: quote.router,
      amount: formatEther(quote.amount),
    };
  }

  /**
   * Get token balance
   */
  async getBalance(token: string): Promise<string> {
    const balance = await this.sdk.getBalance(token as `0x${string}`);
    return formatEther(balance);
  }

  /**
   * Get token metadata
   */
  async getTokenMetadata(token: string): Promise<TokenMetadata> {
    const metadata = await this.sdk.getMetadata(token as `0x${string}`);
    return {
      name: metadata.name,
      symbol: metadata.symbol,
      decimals: metadata.decimals,
      totalSupply: formatEther(metadata.totalSupply),
    };
  }

  /**
   * Get MON balance
   */
  async getMonBalance(): Promise<string> {
    const balance = await this.sdk.publicClient.getBalance({
      address: this.sdk.account.address,
    });
    return formatEther(balance);
  }
}

// Singleton instance
let nadFunClient: NadFunClient | null = null;

export function getNadFunClient(): NadFunClient {
  if (!nadFunClient) {
    nadFunClient = new NadFunClient();
  }
  return nadFunClient;
}
