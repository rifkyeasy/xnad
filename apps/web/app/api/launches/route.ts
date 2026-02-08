import { NextRequest, NextResponse } from "next/server";
import { getLaunches, proposeLaunch, voteLaunch, updateLaunch } from "@/lib/cartel-db";

const NADFUN_API = "https://testnet-api.nad.fun";

// GET /api/launches - Get all launches with live data
export async function GET() {
  try {
    const launches = getLaunches();

    // Fetch live data for each launch from nad.fun
    const launchesWithLiveData = await Promise.all(
      launches.map(async (launch) => {
        let liveData = {
          marketCap: "0",
          holders: 0,
          volume24h: "0",
          progress: 0,
        };

        if (launch.tokenAddress && launch.status !== "pending") {
          try {
            // Fetch token info
            const tokenRes = await fetch(`${NADFUN_API}/token/${launch.tokenAddress}`);
            if (tokenRes.ok) {
              const token = await tokenRes.json();
              liveData.marketCap = token.marketCap
                ? (parseFloat(token.marketCap) / 1e18).toFixed(2)
                : "0";
              liveData.progress = token.bondingCurve?.curveProgress
                ? token.bondingCurve.curveProgress * 100
                : 0;

              // Check if graduated
              if (liveData.progress >= 100 && launch.status === "live") {
                updateLaunch(launch.id, {
                  status: "graduated",
                  graduatedAt: Date.now(),
                });
                launch.status = "graduated";
              }
            }

            // Fetch holders
            const holdersRes = await fetch(
              `${NADFUN_API}/token/${launch.tokenAddress}/holder?limit=100`
            );
            if (holdersRes.ok) {
              const holders = await holdersRes.json();
              liveData.holders = holders.items?.length || 0;
            }

            // Fetch market data
            const marketRes = await fetch(
              `${NADFUN_API}/token/${launch.tokenAddress}/market`
            );
            if (marketRes.ok) {
              const market = await marketRes.json();
              liveData.volume24h = market.volume24h
                ? (parseFloat(market.volume24h) / 1e18).toFixed(2)
                : "0";
            }
          } catch (e) {
            console.error(`Failed to fetch data for ${launch.tokenAddress}:`, e);
          }
        }

        // Calculate vote counts
        const yesVotes = launch.votes.filter((v) => v.vote === "yes").length;
        const noVotes = launch.votes.filter((v) => v.vote === "no").length;

        // Calculate profit
        const investment = parseFloat(launch.investmentAmount);
        const currentValue = parseFloat(launch.currentValue);
        const profit = currentValue - investment;
        const profitPercent = investment > 0 ? (profit / investment) * 100 : 0;

        return {
          id: launch.id,
          address: launch.tokenAddress,
          symbol: launch.symbol,
          name: launch.name,
          imageUri: launch.imageUri,
          status: launch.status,
          progress: liveData.progress,
          marketCap: liveData.marketCap,
          holders: liveData.holders,
          volume24h: liveData.volume24h,
          cartelHolding: "0", // TODO: Calculate from positions
          launchedAt: launch.launchedAt
            ? formatRelativeTime(launch.launchedAt)
            : "pending",
          proposedAt: formatRelativeTime(launch.proposedAt),
          creator: launch.proposedBy,
          votes: { yes: yesVotes, no: noVotes },
          investmentAmount: launch.investmentAmount,
          profit: profit > 0 ? profit.toFixed(4) : undefined,
          profitPercent: profit > 0 ? profitPercent.toFixed(1) : undefined,
        };
      })
    );

    return NextResponse.json({ launches: launchesWithLiveData });
  } catch (error) {
    console.error("GET /api/launches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/launches - Propose new launch
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenAddress, symbol, name, imageUri, proposedBy, investmentAmount } = body;

    if (!symbol || !name || !proposedBy) {
      return NextResponse.json(
        { error: "Symbol, name, and proposedBy required" },
        { status: 400 }
      );
    }

    const launch = proposeLaunch({
      tokenAddress: tokenAddress || "",
      symbol,
      name,
      imageUri,
      status: "pending",
      proposedBy,
      investmentAmount: investmentAmount || "0",
    });

    return NextResponse.json({ success: true, launch });
  } catch (error) {
    console.error("POST /api/launches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/launches - Vote or update launch
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, action, agentId, vote, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Launch ID required" }, { status: 400 });
    }

    if (action === "vote") {
      if (!agentId || !vote) {
        return NextResponse.json(
          { error: "Agent ID and vote required" },
          { status: 400 }
        );
      }
      const success = voteLaunch(id, agentId, vote);
      if (!success) {
        return NextResponse.json({ error: "Launch not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    const launch = updateLaunch(id, updates);
    if (!launch) {
      return NextResponse.json({ error: "Launch not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, launch });
  } catch (error) {
    console.error("PATCH /api/launches error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function formatRelativeTime(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
