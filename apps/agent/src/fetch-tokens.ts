/**
 * Fetch Tokens from nad.fun API
 * Gets real tokens categorized by market cap (High, Medium, Low)
 */

// nad.fun API base URL (mainnet)
const API_BASE = 'https://api.nad.fun';

interface TokenResponse {
  tokens: Array<{
    token_info: {
      token_id: string;
      name: string;
      symbol: string;
      image_uri: string;
      description: string;
      is_graduated: boolean;
      twitter?: string;
      telegram?: string;
      website?: string;
    };
    market_info: {
      market_type: string;
      reserve_native: string;
      reserve_token: string;
      price: string;
      price_usd: string;
      total_supply: string;
      volume: string;
      holder_count: number;
    };
    percent: number;
  }>;
}

interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  marketCapUsd: number;
  priceUsd: number;
  holders: number;
  graduated: boolean;
  tier: 'HIGH' | 'MEDIUM' | 'LOW';
}

async function fetchTokensByMarketCap(page = 1, limit = 100): Promise<TokenResponse> {
  const url = `${API_BASE}/order/market_cap?page=${page}&limit=${limit}`;
  console.log(`Fetching: ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch tokens: ${res.status}`);
  }
  return (await res.json()) as TokenResponse;
}

function categorizeTier(marketCapUsd: number): 'HIGH' | 'MEDIUM' | 'LOW' {
  // Categorize based on market cap in USD
  if (marketCapUsd >= 100000) return 'HIGH'; // >= $100K
  if (marketCapUsd >= 10000) return 'MEDIUM'; // >= $10K
  return 'LOW'; // < $10K
}

function calculateMarketCap(priceUsd: string, totalSupply: string): number {
  const price = parseFloat(priceUsd) || 0;
  const supply = parseFloat(totalSupply) / 1e18 || 0; // Convert from wei
  return price * supply;
}

async function main() {
  console.log('='.repeat(60));
  console.log('Fetching Tokens from nad.fun (Monad Mainnet)');
  console.log('='.repeat(60));

  try {
    // Fetch tokens ordered by market cap
    const response = await fetchTokensByMarketCap(1, 100);
    console.log(`\nFetched ${response.tokens.length} tokens\n`);

    const tokens: TokenInfo[] = [];

    // Process each token
    for (const item of response.tokens) {
      const { token_info, market_info } = item;

      const marketCapUsd = calculateMarketCap(market_info.price_usd, market_info.total_supply);
      const priceUsd = parseFloat(market_info.price_usd) || 0;

      tokens.push({
        address: token_info.token_id,
        name: token_info.name,
        symbol: token_info.symbol,
        marketCapUsd,
        priceUsd,
        holders: market_info.holder_count,
        graduated: token_info.is_graduated,
        tier: categorizeTier(marketCapUsd),
      });
    }

    // Sort by market cap descending
    tokens.sort((a, b) => b.marketCapUsd - a.marketCapUsd);

    // Group by tier
    const highCap = tokens.filter((t) => t.tier === 'HIGH');
    const mediumCap = tokens.filter((t) => t.tier === 'MEDIUM');
    const lowCap = tokens.filter((t) => t.tier === 'LOW');

    console.log('─'.repeat(70));
    console.log('HIGH CAP TOKENS (Market Cap >= $100K) - For Conservative Strategy');
    console.log('─'.repeat(70));
    for (const t of highCap.slice(0, 10)) {
      const mc =
        t.marketCapUsd >= 1000000
          ? `$${(t.marketCapUsd / 1000000).toFixed(2)}M`
          : `$${(t.marketCapUsd / 1000).toFixed(1)}K`;
      console.log(
        `  ${t.symbol.padEnd(12)} ${t.address}  MC: ${mc.padEnd(10)} Holders: ${t.holders}`
      );
    }
    if (highCap.length === 0) console.log('  No high cap tokens found');

    console.log('\n' + '─'.repeat(70));
    console.log('MEDIUM CAP TOKENS (Market Cap $10K-$100K) - For Balanced Strategy');
    console.log('─'.repeat(70));
    for (const t of mediumCap.slice(0, 10)) {
      const mc = `$${(t.marketCapUsd / 1000).toFixed(1)}K`;
      console.log(
        `  ${t.symbol.padEnd(12)} ${t.address}  MC: ${mc.padEnd(10)} Holders: ${t.holders}`
      );
    }
    if (mediumCap.length === 0) console.log('  No medium cap tokens found');

    console.log('\n' + '─'.repeat(70));
    console.log('LOW CAP TOKENS (Market Cap < $10K) - For Aggressive Strategy');
    console.log('─'.repeat(70));
    for (const t of lowCap.slice(0, 10)) {
      const mc =
        t.marketCapUsd >= 1000
          ? `$${(t.marketCapUsd / 1000).toFixed(1)}K`
          : `$${t.marketCapUsd.toFixed(0)}`;
      console.log(
        `  ${t.symbol.padEnd(12)} ${t.address}  MC: ${mc.padEnd(10)} Holders: ${t.holders}`
      );
    }
    if (lowCap.length === 0) console.log('  No low cap tokens found');

    // Output for config
    console.log('\n' + '='.repeat(70));
    console.log('CONFIG OUTPUT - Add to apps/agent/src/config.ts');
    console.log('='.repeat(70));

    console.log('\n// Real tokens from nad.fun categorized by market cap');
    console.log('export const MARKET_TOKENS = {');
    console.log('  // High cap (>=$100K) - Conservative strategy targets');
    console.log('  high: [');
    for (const t of highCap.slice(0, 5)) {
      const mc =
        t.marketCapUsd >= 1000000
          ? `$${(t.marketCapUsd / 1000000).toFixed(2)}M`
          : `$${(t.marketCapUsd / 1000).toFixed(0)}K`;
      console.log(`    '${t.address}', // ${t.symbol} - ${mc}`);
    }
    console.log('  ],');
    console.log('  // Medium cap ($10K-$100K) - Balanced strategy targets');
    console.log('  medium: [');
    for (const t of mediumCap.slice(0, 5)) {
      const mc = `$${(t.marketCapUsd / 1000).toFixed(0)}K`;
      console.log(`    '${t.address}', // ${t.symbol} - ${mc}`);
    }
    console.log('  ],');
    console.log('  // Low cap (<$10K) - Aggressive strategy targets');
    console.log('  low: [');
    for (const t of lowCap.slice(0, 5)) {
      const mc =
        t.marketCapUsd >= 1000
          ? `$${(t.marketCapUsd / 1000).toFixed(1)}K`
          : `$${t.marketCapUsd.toFixed(0)}`;
      console.log(`    '${t.address}', // ${t.symbol} - ${mc}`);
    }
    console.log('  ],');
    console.log('};');

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total tokens analyzed: ${tokens.length}`);
    console.log(`High cap (>=$100K):    ${highCap.length} tokens`);
    console.log(`Medium cap ($10K-100K): ${mediumCap.length} tokens`);
    console.log(`Low cap (<$10K):       ${lowCap.length} tokens`);

    // Top tokens by holders
    console.log('\n' + '─'.repeat(60));
    console.log('TOP 5 BY HOLDER COUNT');
    console.log('─'.repeat(60));
    const byHolders = [...tokens].sort((a, b) => b.holders - a.holders).slice(0, 5);
    for (const t of byHolders) {
      console.log(`  ${t.symbol.padEnd(12)} ${t.holders.toLocaleString()} holders`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main().catch(console.error);
