// API endpoints for nad.fun and Moltbook
const NADFUN_API = "https://testnet-api.nad.fun";
const MOLTBOOK_API = "https://api.moltbook.com";

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

// nad.fun API calls
export async function fetchTokensByMarketCap(limit = 20) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/list?orderBy=marketCap&direction=desc&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch tokens");
    return await response.json();
  } catch (error) {
    console.error("fetchTokensByMarketCap error:", error);
    return { items: [] };
  }
}

export async function fetchTokensByCreationTime(limit = 20) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/list?orderBy=creationTime&direction=desc&limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch tokens");
    return await response.json();
  } catch (error) {
    console.error("fetchTokensByCreationTime error:", error);
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
    const response = await fetch(`${NADFUN_API}/token/${address}/market`);
    if (!response.ok) throw new Error("Failed to fetch token market");
    return await response.json();
  } catch (error) {
    console.error("fetchTokenMarket error:", error);
    return null;
  }
}

export async function fetchTokenHolders(address: string, limit = 50) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/${address}/holder?limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch holders");
    return await response.json();
  } catch (error) {
    console.error("fetchTokenHolders error:", error);
    return { items: [] };
  }
}

export async function fetchTokenSwaps(address: string, limit = 50) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/${address}/swap?limit=${limit}`
    );
    if (!response.ok) throw new Error("Failed to fetch swaps");
    return await response.json();
  } catch (error) {
    console.error("fetchTokenSwaps error:", error);
    return { items: [] };
  }
}

export async function fetchAccountPositions(wallet: string) {
  try {
    const response = await fetch(`${NADFUN_API}/account/${wallet}/position`);
    if (!response.ok) throw new Error("Failed to fetch positions");
    return await response.json();
  } catch (error) {
    console.error("fetchAccountPositions error:", error);
    return { items: [] };
  }
}

export async function fetchBuyQuote(tokenAddress: string, monAmount: string) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/${tokenAddress}/quote/buy?mon=${monAmount}`
    );
    if (!response.ok) throw new Error("Failed to get buy quote");
    return await response.json();
  } catch (error) {
    console.error("fetchBuyQuote error:", error);
    return null;
  }
}

export async function fetchSellQuote(tokenAddress: string, tokenAmount: string) {
  try {
    const response = await fetch(
      `${NADFUN_API}/token/${tokenAddress}/quote/sell?tokenAmount=${tokenAmount}`
    );
    if (!response.ok) throw new Error("Failed to get sell quote");
    return await response.json();
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
