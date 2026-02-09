/**
 * Mirror Tokens from Mainnet to Testnet
 * Fetches real token data from nad.fun mainnet and creates them on testnet
 */

import { getNadFunClient } from './nadfun-client.js';

// nad.fun API base URL (mainnet)
const API_BASE = 'https://api.nad.fun';

interface MainnetToken {
  token_info: {
    token_id: string;
    name: string;
    symbol: string;
    image_uri: string;
    description: string;
    twitter?: string;
    telegram?: string;
    website?: string;
  };
  market_info: {
    price_usd: string;
    total_supply: string;
    holder_count: number;
  };
}

interface TokenResponse {
  tokens: MainnetToken[];
}

async function fetchMainnetTokens(limit = 20): Promise<MainnetToken[]> {
  console.log(`Fetching top ${limit} tokens from mainnet...`);
  const res = await fetch(`${API_BASE}/order/market_cap?page=1&limit=${limit}`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = (await res.json()) as TokenResponse;
  return data.tokens;
}

async function downloadImage(imageUri: string): Promise<Buffer | null> {
  try {
    // nad.fun stores images on their CDN
    const res = await fetch(imageUri);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch {
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('Mirror Tokens: Mainnet → Testnet');
  console.log('='.repeat(60));

  const client = getNadFunClient();

  // Check balance
  const balance = await client.getMonBalance();
  const deployFee = await client.getDeployFee();

  console.log(`\nWallet: ${client.walletAddress}`);
  console.log(`MON Balance: ${balance}`);
  console.log(`Deploy Fee: ${deployFee} MON per token`);

  // Fetch mainnet tokens
  const mainnetTokens = await fetchMainnetTokens(15);
  console.log(`\nFetched ${mainnetTokens.length} tokens from mainnet\n`);

  // Select tokens to mirror (pick variety: high, medium, low cap)
  const tokensToMirror = [
    // Top by market cap
    mainnetTokens[0],
    mainnetTokens[1],
    mainnetTokens[2],
    // Mid range
    mainnetTokens[5],
    mainnetTokens[6],
    // Lower range
    mainnetTokens[10],
    mainnetTokens[12],
  ].filter(Boolean);

  console.log('Tokens to mirror:');
  for (const t of tokensToMirror) {
    const mc =
      parseFloat(t.market_info.price_usd) * (parseFloat(t.market_info.total_supply) / 1e18);
    const mcStr = mc >= 1000000 ? `$${(mc / 1000000).toFixed(2)}M` : `$${(mc / 1000).toFixed(0)}K`;
    console.log(`  ${t.token_info.symbol.padEnd(10)} ${t.token_info.name.padEnd(20)} ${mcStr}`);
  }

  const totalNeeded = tokensToMirror.length * parseFloat(deployFee);
  console.log(`\nTotal MON needed: ${totalNeeded} MON`);

  if (parseFloat(balance) < parseFloat(deployFee)) {
    console.log(`\n❌ Insufficient balance. Need at least ${deployFee} MON to create 1 token.`);
    console.log(`\nGet testnet MON from: https://faucet.monad.xyz/`);
    console.log(`Wallet: ${client.walletAddress}`);
    return;
  }

  const createdTokens: Array<{
    symbol: string;
    name: string;
    address: string;
    originalAddress: string;
  }> = [];

  // Create tokens on testnet
  for (const token of tokensToMirror) {
    const currentBalance = await client.getMonBalance();
    if (parseFloat(currentBalance) < parseFloat(deployFee)) {
      console.log(`\n⚠️ Insufficient balance. Stopping.`);
      break;
    }

    const { token_info } = token;
    console.log(`\n${'─'.repeat(50)}`);
    console.log(`Creating: ${token_info.symbol} (${token_info.name})`);
    console.log(`${'─'.repeat(50)}`);

    try {
      // Try to download the original image
      let imageBuffer: Buffer | undefined;
      if (token_info.image_uri) {
        console.log(`Downloading image...`);
        imageBuffer = (await downloadImage(token_info.image_uri)) || undefined;
      }

      // Skip social links to avoid validation issues
      const result = await client.createToken({
        name: token_info.name,
        symbol: token_info.symbol,
        description: token_info.description || `${token_info.name} - Mirrored from Monad mainnet`,
        imageBuffer,
        imageContentType: 'image/png',
        initialBuyAmount: '0.01', // Small initial buy
      });

      createdTokens.push({
        symbol: token_info.symbol,
        name: token_info.name,
        address: result.tokenAddress,
        originalAddress: token_info.token_id,
      });

      console.log(`✓ Created at: ${result.tokenAddress}`);

      // Wait between creations to avoid rate limiting
      console.log('Waiting 10s before next token...');
      await new Promise((r) => setTimeout(r, 10000));
    } catch (error) {
      console.error(`✗ Failed:`, error instanceof Error ? error.message : error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('CREATED TOKENS');
  console.log('='.repeat(60));

  if (createdTokens.length === 0) {
    console.log('No tokens were created.');
  } else {
    console.log(`\nSuccessfully created ${createdTokens.length} tokens:\n`);

    for (const t of createdTokens) {
      console.log(`${t.symbol.padEnd(10)} ${t.address}`);
      console.log(`           (mainnet: ${t.originalAddress})`);
    }

    // Output for config
    console.log('\n// Add to config.ts - TESTNET_TOKENS');
    console.log('export const TESTNET_TOKENS = {');
    for (const t of createdTokens) {
      console.log(`  ${t.symbol.toLowerCase()}: '${t.address}', // ${t.name}`);
    }
    console.log('};');
  }

  const finalBalance = await client.getMonBalance();
  console.log(`\nFinal MON Balance: ${finalBalance}`);
}

main().catch(console.error);
