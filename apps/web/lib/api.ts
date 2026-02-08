// API endpoints for nad.fun and Moltbook
// Using dev-api.nad.fun for all calls (testnet-bot-api-server.nad.fun has DNS issues)
const NADFUN_API = "https://dev-api.nad.fun";
const MOLTBOOK_API = "https://www.moltbook.com/api/v1";

// Utility to format relative time
export function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Truncate address for display
export function truncateAddress(address: string): string {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Format MON amount
export function formatMon(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "0";
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
  return num.toFixed(2);
}

// nad.fun API calls - use bot API for discovery endpoints
export async function fetchTokensByMarketCap(limit = 20, page = 1) {
  try {
    const response = await fetch(
      `${NADFUN_API}/order/market_cap?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch tokens");
    const data = await response.json();
    return { items: data.tokens || [] };
  } catch (error) {
    console.error("fetchTokensByMarketCap error:", error);
    return { items: [] };
  }
}

export async function fetchTokensByCreationTime(limit = 20, page = 1) {
  try {
    const response = await fetch(
      `${NADFUN_API}/order/creation_time?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch tokens");
    const data = await response.json();
    return { items: data.tokens || [] };
  } catch (error) {
    console.error("fetchTokensByCreationTime error:", error);
    return { items: [] };
  }
}

export async function fetchTokensByLatestTrade(limit = 20, page = 1) {
  try {
    const response = await fetch(
      `${NADFUN_API}/order/latest_trade?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch tokens");
    const data = await response.json();
    return { items: data.tokens || [] };
  } catch (error) {
    console.error("fetchTokensByLatestTrade error:", error);
    return { items: [] };
  }
}

export async function fetchToken(address: string) {
  try {
    const response = await fetch(`${NADFUN_API}/token/${address}`);
    if (!response.ok) throw new Error("Failed to fetch token");
    return await response.json();
  } catch (error) {
    console.error("fetchToken error:", error);
    return null;
  }
}

export async function fetchTokenMarket(address: string) {
  try {
    const response = await fetch(`${NADFUN_API}/token/market/${address}`);
    if (!response.ok) throw new Error("Failed to fetch token market");
    return await response.json();
  } catch (error) {
    console.error("fetchTokenMarket error:", error);
    return null;
  }
}

export async function fetchTokenHolders(address: string, limit = 50, page = 1) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/holder/${address}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch holders");
    const data = await response.json();
    return { items: data.holders || [] };
  } catch (error) {
    console.error("fetchTokenHolders error:", error);
    return { items: [] };
  }
}

export async function fetchTokenSwaps(address: string, limit = 50, page = 1) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/swap/${address}?page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch swaps");
    const data = await response.json();
    return { items: data.swaps || [] };
  } catch (error) {
    console.error("fetchTokenSwaps error:", error);
    return { items: [] };
  }
}

export async function fetchAccountPositions(wallet: string, page = 1, limit = 50) {
  try {
    const response = await fetch(
      `${NADFUN_API}/account/position/${wallet}?position_type=all&page=${page}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch positions");
    return await response.json();
  } catch (error) {
    console.error("fetchAccountPositions error:", error);
    return { items: [] };
  }
}

export async function fetchBuyQuote(tokenAddress: string, monAmount: string) {
  try {
    // Get market data to calculate quote
    const market = await fetchTokenMarket(tokenAddress);
    if (!market) return null;

    const amountIn = parseFloat(monAmount) * 1e18;
    const fee = amountIn * 0.01; // 1% fee
    const amountAfterFee = amountIn - fee;

    // Simplified constant product calculation
    const reserveToken = parseFloat(market.reserveToken || market.virtualToken || "0");
    const reserveNative = parseFloat(market.reserveNative || market.virtualNative || "0");

    if (reserveNative <= 0) return null;

    const amountOut = (amountAfterFee * reserveToken) / (reserveNative + amountAfterFee);

    return {
      tokenAddress,
      amountIn: amountIn.toString(),
      amountOut: amountOut.toString(),
      fee: fee.toString(),
      priceImpact: ((amountAfterFee / reserveNative) * 100).toFixed(2),
    };
  } catch (error) {
    console.error("fetchBuyQuote error:", error);
    return null;
  }
}

export async function fetchSellQuote(tokenAddress: string, tokenAmount: string) {
  try {
    // Get market data to calculate quote
    const market = await fetchTokenMarket(tokenAddress);
    if (!market) return null;

    const amountIn = parseFloat(tokenAmount);
    const reserveToken = parseFloat(market.reserveToken || market.virtualToken || "0");
    const reserveNative = parseFloat(market.reserveNative || market.virtualNative || "0");

    if (reserveToken <= 0) return null;

    const amountOut = (amountIn * reserveNative) / (reserveToken + amountIn);
    const fee = amountOut * 0.01; // 1% fee
    const amountAfterFee = amountOut - fee;

    return {
      tokenAddress,
      amountIn: amountIn.toString(),
      amountOut: amountAfterFee.toString(),
      fee: fee.toString(),
      priceImpact: ((amountIn / reserveToken) * 100).toFixed(2),
    };
  } catch (error) {
    console.error("fetchSellQuote error:", error);
    return null;
  }
}

// Moltbook API calls
export async function fetchMoltbookFeed(
  submolt = "nadfun",
  sortBy = "hot",
  limit = 20
) {
  try {
    const response = await fetch(
      `${MOLTBOOK_API}/r/${submolt}/feed?sort=${sortBy}&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch feed");
    return await response.json();
  } catch (error) {
    console.error("fetchMoltbookFeed error:", error);
    return { posts: [] };
  }
}

export async function fetchAgentProfile(agentId: string) {
  try {
    const response = await fetch(`${MOLTBOOK_API}/agent/${agentId}`);
    if (!response.ok) throw new Error("Failed to fetch agent");
    return await response.json();
  } catch (error) {
    console.error("fetchAgentProfile error:", error);
    return null;
  }
}

// Get graduation progress (0-100%)
export function calculateGraduationProgress(
  currentMon: number,
  targetMon: number = 200
): number {
  if (targetMon <= 0) return 0;
  const progress = (currentMon / targetMon) * 100;
  return Math.min(Math.max(progress, 0), 100);
}

// Calculate profit/loss percentage
export function calculatePnlPercent(
  currentValue: number,
  costBasis: number
): number {
  if (costBasis <= 0) return 0;
  return ((currentValue - costBasis) / costBasis) * 100;
}
