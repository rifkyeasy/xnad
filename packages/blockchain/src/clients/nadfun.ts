import type { Address } from 'viem';
import {
  env,
  API_ENDPOINTS,
  isProduction,
  BONDING_CURVE_ROUTER_ABI,
  getContracts,
} from '@cartel/config';
import {
  createLogger,
  retry,
  type TokenInfo,
  type TokenMarket,
  type TokenHolder,
  type TokenSwap,
  type TokenChartCandle,
  type ChartInterval,
  type Quote,
} from '@cartel/shared';
import { getMonadClient } from './monad.js';

const logger = createLogger('nadfun');

export interface NadFunConfig {
  apiUrl?: string;
  botApiUrl?: string;
  apiKey?: string;
}

export class NadFunClient {
  private apiUrl: string;
  private botApiUrl: string;
  private apiKey?: string;

  constructor(config: NadFunConfig = {}) {
    const endpoints = isProduction() ? API_ENDPOINTS.mainnet : API_ENDPOINTS.testnet;
    this.apiUrl = config.apiUrl || endpoints.nadfun;
    this.botApiUrl = config.botApiUrl || endpoints.nadfunBot;
    this.apiKey = config.apiKey || env.NADFUN_API_KEY;

    logger.info('NadFun client initialized', {
      apiUrl: this.apiUrl,
      botApiUrl: this.botApiUrl,
      hasApiKey: !!this.apiKey,
    });
  }

  private async fetch<T>(
    endpoint: string,
    options: RequestInit = {},
    useBot = false
  ): Promise<T> {
    const baseUrl = useBot ? this.botApiUrl : this.apiUrl;
    const url = `${baseUrl}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.apiKey) {
      headers['X-API-Key'] = this.apiKey;
    }

    const response = await retry(
      async () => {
        const res = await fetch(url, { ...options, headers });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(`NadFun API error: ${res.status} - ${error}`);
        }
        return res.json() as Promise<T>;
      },
      {
        maxAttempts: 3,
        delayMs: 1000,
        onRetry: (error, attempt) => {
          logger.warn(`Retrying NadFun request (attempt ${attempt})`, { error: error.message });
        },
      }
    );

    return response;
  }

  // ============ Token Info ============

  /**
   * Get token metadata
   */
  async getToken(tokenAddress: Address): Promise<TokenInfo> {
    return this.fetch<TokenInfo>(`/token/${tokenAddress}`, {}, true);
  }

  /**
   * Get token market data
   */
  async getTokenMarket(tokenAddress: Address): Promise<TokenMarket> {
    return this.fetch<TokenMarket>(`/token/market/${tokenAddress}`, {}, true);
  }

  /**
   * Get token holders
   */
  async getTokenHolders(
    tokenAddress: Address,
    page = 1,
    limit = 10
  ): Promise<{ holders: TokenHolder[] }> {
    return this.fetch(`/token/holder/${tokenAddress}?page=${page}&limit=${limit}`, {}, true);
  }

  /**
   * Get token swap history
   */
  async getTokenSwaps(
    tokenAddress: Address,
    page = 1,
    limit = 10
  ): Promise<{ swaps: TokenSwap[] }> {
    return this.fetch(`/token/swap/${tokenAddress}?page=${page}&limit=${limit}`, {}, true);
  }

  /**
   * Get token chart data
   */
  async getTokenChart(
    tokenAddress: Address,
    interval: ChartInterval,
    baseTimestamp: number
  ): Promise<{ candles: TokenChartCandle[] }> {
    return this.fetch(
      `/token/chart/${tokenAddress}?interval=${interval}&base_timestamp=${baseTimestamp}`,
      {},
      true
    );
  }

  // ============ Discovery ============

  /**
   * Get tokens by creation time
   */
  async getTokensByCreationTime(
    page = 1,
    limit = 10
  ): Promise<{ tokens: TokenInfo[] }> {
    return this.fetch(`/order/creation_time?page=${page}&limit=${limit}`, {}, true);
  }

  /**
   * Get tokens by market cap
   */
  async getTokensByMarketCap(
    page = 1,
    limit = 10
  ): Promise<{ tokens: TokenInfo[] }> {
    return this.fetch(`/order/market_cap?page=${page}&limit=${limit}`, {}, true);
  }

  /**
   * Get tokens by latest trade
   */
  async getTokensByLatestTrade(
    page = 1,
    limit = 10
  ): Promise<{ tokens: TokenInfo[] }> {
    return this.fetch(`/order/latest_trade?page=${page}&limit=${limit}`, {}, true);
  }

  // ============ Account ============

  /**
   * Get account positions
   */
  async getAccountPositions(
    address: Address,
    positionType: 'all' | 'open' | 'close' = 'all',
    page = 1,
    limit = 10
  ) {
    return this.fetch(
      `/account/position/${address}?position_type=${positionType}&page=${page}&limit=${limit}`,
      {},
      true
    );
  }

  /**
   * Get tokens created by account
   */
  async getAccountCreatedTokens(address: Address, page = 1, limit = 10) {
    return this.fetch(
      `/account/create_token/${address}?page=${page}&limit=${limit}`,
      {},
      true
    );
  }

  // ============ Token Creation ============

  /**
   * Upload token image
   */
  async uploadImage(imageFile: Blob): Promise<{ image_uri: string; nsfw: boolean }> {
    const formData = new FormData();
    formData.append('file', imageFile);

    const response = await fetch(`${this.apiUrl}/agent/token/image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.status}`);
    }

    return response.json() as Promise<{ image_uri: string; nsfw: boolean }>;
  }

  /**
   * Upload token metadata
   */
  async uploadMetadata(metadata: {
    name: string;
    symbol: string;
    description: string;
    image_uri: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  }): Promise<{ metadata_uri: string }> {
    return this.fetch('/agent/token/metadata', {
      method: 'POST',
      body: JSON.stringify(metadata),
    });
  }

  /**
   * Get salt for token creation
   */
  async getSalt(params: {
    creator: Address;
    name: string;
    symbol: string;
    metadata_uri: string;
  }): Promise<{ salt: `0x${string}`; predicted_token_address: Address }> {
    return this.fetch('/agent/salt', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // ============ Trading ============

  /**
   * Get quote for buying tokens
   */
  async getBuyQuote(tokenAddress: Address, amountIn: bigint): Promise<Quote> {
    const market = await this.getTokenMarket(tokenAddress);

    // Simple quote calculation (actual implementation would be more complex)
    const fee = (amountIn * 100n) / 10000n; // 1% fee
    const amountAfterFee = amountIn - fee;

    // Simplified constant product calculation
    const amountOut =
      (amountAfterFee * BigInt(market.reserveToken)) /
      (BigInt(market.virtualNative) + amountAfterFee);

    return {
      tokenAddress,
      amountIn,
      amountOut,
      priceImpact: 0, // TODO: Calculate actual price impact
      fee,
      route: market.isGraduated ? 'dex' : 'bonding_curve',
    };
  }

  /**
   * Get quote for selling tokens
   */
  async getSellQuote(tokenAddress: Address, amountIn: bigint): Promise<Quote> {
    const market = await this.getTokenMarket(tokenAddress);

    // Simplified constant product calculation
    const amountOut =
      (amountIn * BigInt(market.virtualNative)) /
      (BigInt(market.virtualToken) + amountIn);

    const fee = (amountOut * 100n) / 10000n; // 1% fee
    const amountAfterFee = amountOut - fee;

    return {
      tokenAddress,
      amountIn,
      amountOut: amountAfterFee,
      priceImpact: 0, // TODO: Calculate actual price impact
      fee,
      route: market.isGraduated ? 'dex' : 'bonding_curve',
    };
  }

  /**
   * Execute a buy transaction
   */
  async buy(params: {
    tokenAddress: Address;
    amountIn: bigint;
    minAmountOut: bigint;
    recipient: Address;
    deadline: number;
  }): Promise<`0x${string}`> {
    const monad = getMonadClient();
    if (!monad.walletClient || !monad.account) {
      throw new Error('Wallet not initialized');
    }

    const contracts = getContracts(monad.chain.id);
    const fee = (params.amountIn * 100n) / 10000n; // 1% fee

    logger.info('Executing buy', {
      token: params.tokenAddress,
      amountIn: params.amountIn.toString(),
      minOut: params.minAmountOut.toString(),
    });

    const hash = await monad.walletClient.writeContract({
      address: contracts.bondingCurveRouter,
      abi: BONDING_CURVE_ROUTER_ABI,
      functionName: 'buy',
      args: [
        params.tokenAddress,
        params.minAmountOut,
        params.recipient,
        BigInt(params.deadline),
      ],
      value: params.amountIn + fee,
    });

    logger.info('Buy transaction sent', { hash });
    return hash;
  }

  /**
   * Execute a sell transaction
   */
  async sell(params: {
    tokenAddress: Address;
    amountIn: bigint;
    minAmountOut: bigint;
    recipient: Address;
    deadline: number;
  }): Promise<`0x${string}`> {
    const monad = getMonadClient();
    if (!monad.walletClient || !monad.account) {
      throw new Error('Wallet not initialized');
    }

    const contracts = getContracts(monad.chain.id);

    logger.info('Executing sell', {
      token: params.tokenAddress,
      amountIn: params.amountIn.toString(),
      minOut: params.minAmountOut.toString(),
    });

    const hash = await monad.walletClient.writeContract({
      address: contracts.bondingCurveRouter,
      abi: BONDING_CURVE_ROUTER_ABI,
      functionName: 'sell',
      args: [
        params.tokenAddress,
        params.amountIn,
        params.minAmountOut,
        params.recipient,
        BigInt(params.deadline),
      ],
    });

    logger.info('Sell transaction sent', { hash });
    return hash;
  }
}

// Singleton instance
let _client: NadFunClient | null = null;

export function getNadFunClient(config?: NadFunConfig): NadFunClient {
  if (!_client) {
    _client = new NadFunClient(config);
  }
  return _client;
}
