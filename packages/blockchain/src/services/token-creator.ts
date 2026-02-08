import { BONDING_CURVE_ROUTER_ABI, getContracts, CARTEL_CONFIG } from '@cartel/config';
import {
  createLogger,
  type TokenMetadata,
  type TokenCreationResult,
  type CreateTokenParams,
} from '@cartel/shared';
import { getMonadClient } from '../clients/monad.js';
import { getNadFunClient } from '../clients/nadfun.js';

const logger = createLogger('token-creator');

export interface CreateCartelTokenParams {
  name?: string;
  symbol?: string;
  description?: string;
  imageBlob?: Blob;
  initialBuyMon?: bigint;
}

export class TokenCreatorService {
  /**
   * Create the $CARTEL token
   */
  async createCartelToken(
    params: CreateCartelTokenParams = {}
  ): Promise<TokenCreationResult> {
    const name = params.name || CARTEL_CONFIG.TOKEN_NAME;
    const symbol = params.symbol || CARTEL_CONFIG.TOKEN_SYMBOL;
    const description = params.description || CARTEL_CONFIG.TOKEN_DESCRIPTION;

    logger.info('Creating CARTEL token', { name, symbol });

    return this.createToken({
      name,
      symbol,
      description,
      imageBlob: params.imageBlob,
      initialBuyMon: params.initialBuyMon,
    });
  }

  /**
   * Create a new token on nad.fun
   */
  async createToken(params: {
    name: string;
    symbol: string;
    description: string;
    imageBlob?: Blob;
    twitter?: string;
    telegram?: string;
    website?: string;
    initialBuyMon?: bigint;
  }): Promise<TokenCreationResult> {
    const monad = getMonadClient();
    const nadfun = getNadFunClient();

    if (!monad.walletClient || !monad.account) {
      throw new Error('Wallet not initialized');
    }

    const creator = monad.account.address;
    logger.info('Starting token creation', {
      name: params.name,
      symbol: params.symbol,
      creator,
    });

    // Step 1: Upload image (if provided)
    let imageUri = '';
    if (params.imageBlob) {
      logger.debug('Uploading token image');
      const imageResult = await nadfun.uploadImage(params.imageBlob);
      imageUri = imageResult.image_uri;
      logger.info('Image uploaded', { imageUri });
    }

    // Step 2: Upload metadata
    logger.debug('Uploading token metadata');
    const metadata: TokenMetadata = {
      name: params.name,
      symbol: params.symbol,
      description: params.description,
      imageUri,
      twitter: params.twitter,
      telegram: params.telegram,
      website: params.website,
    };

    const { metadata_uri } = await nadfun.uploadMetadata({
      name: metadata.name,
      symbol: metadata.symbol,
      description: metadata.description,
      image_uri: imageUri,
      twitter: metadata.twitter,
      telegram: metadata.telegram,
      website: metadata.website,
    });
    logger.info('Metadata uploaded', { metadataUri: metadata_uri });

    // Step 3: Get salt and predicted address
    logger.debug('Getting salt for token creation');
    const { salt, predicted_token_address } = await nadfun.getSalt({
      creator,
      name: params.name,
      symbol: params.symbol,
      metadata_uri,
    });
    logger.info('Salt obtained', { salt, predictedAddress: predicted_token_address });

    // Step 4: Execute on-chain creation
    const contracts = getContracts(monad.chain.id);
    const deployFee = 10n * 10n ** 18n; // 10 MON
    const initialBuy = params.initialBuyMon || 0n;

    const createParams: CreateTokenParams = {
      name: params.name,
      symbol: params.symbol,
      tokenURI: metadata_uri,
      amountOut: 0n, // Accept any amount
      salt,
      actionId: 1,
    };

    logger.info('Executing on-chain token creation', {
      deployFee: deployFee.toString(),
      initialBuy: initialBuy.toString(),
    });

    const hash = await monad.walletClient.writeContract({
      address: contracts.bondingCurveRouter,
      abi: BONDING_CURVE_ROUTER_ABI,
      functionName: 'create',
      args: [createParams],
      value: deployFee + initialBuy,
      gas: 7_000_000n,
    });

    logger.info('Token creation transaction sent', { hash });

    // Wait for confirmation
    await monad.waitForTransaction(hash);

    const result: TokenCreationResult = {
      tokenAddress: predicted_token_address,
      poolAddress: predicted_token_address, // Simplified - actual would parse from logs
      txHash: hash,
      createdAt: new Date(),
    };

    logger.info('Token created successfully', {
      tokenAddress: result.tokenAddress,
      txHash: result.txHash,
    });

    return result;
  }
}

// Singleton
let _service: TokenCreatorService | null = null;

export function getTokenCreatorService(): TokenCreatorService {
  if (!_service) {
    _service = new TokenCreatorService();
  }
  return _service;
}
