import { NextResponse } from "next/server";
import { getLaunches, getAgents, getTreasury } from "@/lib/cartel-db";

const NADFUN_API = "https://dev-api.nad.fun";

// GET /api/activity - Get live activity feed
export async function GET() {
  try {
    const launches = getLaunches();
    const agents = getAgents();
    const treasury = getTreasury();
    const activities: Activity[] = [];

    // Get swaps from cartel token addresses
    const activeTokens = launches
      .filter((l) => l.status === "live" && l.tokenAddress)
      .slice(0, 5);

    for (const launch of activeTokens) {
      try {
        const res = await fetch(
          `${NADFUN_API}/token/${launch.tokenAddress}/swap?limit=10`
        );
        if (res.ok) {
          const data = await res.json();
          for (const swap of data.items || []) {
            // Check if this swap is from a cartel agent
            const agent = agents.find(
              (a) => a.wallet.toLowerCase() === swap.account?.toLowerCase()
            );

            activities.push({
              id: swap.txHash || `${launch.tokenAddress}-${swap.timestamp}`,
              time: formatRelativeTime(swap.timestamp * 1000),
              timestamp: swap.timestamp * 1000,
              agent: agent?.name || truncateAddress(swap.account),
              action: swap.isBuy
                ? `Bought ${formatAmount(swap.tokenAmount)} $${launch.symbol}`
                : `Sold ${formatAmount(swap.tokenAmount)} $${launch.symbol}`,
              type: "trade" as const,
              txHash: swap.txHash,
              tokenSymbol: launch.symbol,
              amount: formatAmount(swap.monAmount),
              isCartelAgent: !!agent,
            });
          }
        }
      } catch (e) {
        console.error(`Failed to fetch swaps for ${launch.tokenAddress}:`, e);
      }
    }

    // Add treasury transactions as activities
    for (const deposit of treasury.deposits.slice(-10)) {
      const agent = agents.find((a) => a.id === deposit.agent);
      activities.push({
        id: deposit.txHash,
        time: formatRelativeTime(deposit.timestamp),
        timestamp: deposit.timestamp,
        agent: agent?.name || deposit.agent,
        action: `Deposited ${parseFloat(deposit.amount).toFixed(2)} MON to treasury`,
        type: "governance" as const,
        txHash: deposit.txHash,
        amount: deposit.amount,
        isCartelAgent: true,
      });
    }

    for (const trade of treasury.trades.slice(-10)) {
      const launch = launches.find((l) => l.tokenAddress === trade.tokenAddress);
      activities.push({
        id: trade.txHash,
        time: formatRelativeTime(trade.timestamp),
        timestamp: trade.timestamp,
        agent: "Treasury",
        action: `${trade.type === "buy" ? "Bought" : "Sold"} ${parseFloat(trade.amount).toFixed(2)} MON of $${launch?.symbol || "???"}`,
        type: "coordination" as const,
        txHash: trade.txHash,
        tokenSymbol: launch?.symbol,
        amount: trade.amount,
        isCartelAgent: true,
      });
    }

    // Sort by timestamp descending
    activities.sort((a, b) => b.timestamp - a.timestamp);

    // Prioritize cartel agent activities
    const cartelActivities = activities.filter((a) => a.isCartelAgent);
    const otherActivities = activities.filter((a) => !a.isCartelAgent);

    return NextResponse.json({
      activities: [...cartelActivities, ...otherActivities].slice(0, 30),
    });
  } catch (error) {
    console.error("GET /api/activity error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

interface Activity {
  id: string;
  time: string;
  timestamp: number;
  agent: string;
  action: string;
  type: "trade" | "social" | "coordination" | "governance";
  txHash?: string;
  tokenSymbol?: string;
  amount?: string;
  isCartelAgent?: boolean;
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function truncateAddress(address: string): string {
  if (!address) return "Unknown";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function formatAmount(amount: string | number): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  const formatted = num / 1e18;
  if (formatted >= 1000000) return `${(formatted / 1000000).toFixed(2)}M`;
  if (formatted >= 1000) return `${(formatted / 1000).toFixed(2)}K`;
  return formatted.toFixed(2);
}
