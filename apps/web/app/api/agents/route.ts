import { NextRequest, NextResponse } from "next/server";
import { getAgents, addAgent, updateAgent, loadDatabase } from "@/lib/cartel-db";
import { createPublicClient, http, formatEther } from "viem";

// Monad testnet client
const client = createPublicClient({
  chain: {
    id: 10143,
    name: "Monad Testnet",
    nativeCurrency: { decimals: 18, name: "Monad", symbol: "MON" },
    rpcUrls: { default: { http: ["https://testnet-rpc.monad.xyz"] } },
  },
  transport: http(),
});

// GET /api/agents - Get all agents with live balances
export async function GET() {
  try {
    const agents = getAgents();

    // Fetch live balances for all agents
    const agentsWithBalances = await Promise.all(
      agents.map(async (agent) => {
        let balance = "0";
        try {
          const rawBalance = await client.getBalance({
            address: agent.wallet as `0x${string}`,
          });
          balance = formatEther(rawBalance);
        } catch (e) {
          console.error(`Failed to fetch balance for ${agent.wallet}:`, e);
        }

        const successRate =
          agent.totalTrades > 0
            ? Math.round((agent.successfulTrades / agent.totalTrades) * 100)
            : 0;

        return {
          id: agent.id,
          name: agent.name,
          wallet: agent.wallet,
          tier: agent.tier,
          personality: agent.personality,
          status: agent.status,
          balance,
          totalTrades: agent.totalTrades,
          successRate,
          joinedAt: formatRelativeTime(agent.createdAt),
          lastActiveAt: formatRelativeTime(agent.lastActiveAt),
        };
      })
    );

    return NextResponse.json({ agents: agentsWithBalances });
  } catch (error) {
    console.error("GET /api/agents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/agents - Add new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, wallet, tier, personality } = body;

    if (!name || !wallet) {
      return NextResponse.json(
        { error: "Name and wallet required" },
        { status: 400 }
      );
    }

    // Check if wallet already exists
    const existingAgents = getAgents();
    if (existingAgents.some((a) => a.wallet.toLowerCase() === wallet.toLowerCase())) {
      return NextResponse.json(
        { error: "Agent with this wallet already exists" },
        { status: 400 }
      );
    }

    const agent = addAgent({
      name,
      wallet,
      tier: tier || "Associate",
      personality: personality || "Balanced",
      status: "idle",
    });

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("POST /api/agents error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/agents - Update agent
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "Agent ID required" }, { status: 400 });
    }

    const agent = updateAgent(id, updates);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, agent });
  } catch (error) {
    console.error("PATCH /api/agents error:", error);
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
