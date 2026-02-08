import { NextRequest, NextResponse } from "next/server";
import {
  getTreasury,
  getAgents,
  getCartelConfig,
  recordDeposit,
  recordWithdrawal,
  recordTrade,
} from "@/lib/cartel-db";
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

// GET /api/treasury - Get treasury data with live balance
export async function GET() {
  try {
    const config = getCartelConfig();
    const treasury = getTreasury();
    const agents = getAgents();

    // Get live treasury balance
    let treasuryBalance = "0";
    if (config.treasuryWallet) {
      try {
        const rawBalance = await client.getBalance({
          address: config.treasuryWallet as `0x${string}`,
        });
        treasuryBalance = formatEther(rawBalance);
      } catch (e) {
        console.error("Failed to fetch treasury balance:", e);
      }
    }

    // Calculate deposits and withdrawals
    const totalDeposits = treasury.deposits.reduce(
      (sum, d) => sum + parseFloat(d.amount),
      0
    );
    const totalWithdrawals = treasury.withdrawals.reduce(
      (sum, w) => sum + parseFloat(w.amount),
      0
    );

    // Calculate agent stakes from deposits
    const agentStakes = new Map<string, number>();
    for (const deposit of treasury.deposits) {
      const current = agentStakes.get(deposit.agent) || 0;
      agentStakes.set(deposit.agent, current + parseFloat(deposit.amount));
    }
    for (const withdrawal of treasury.withdrawals) {
      const current = agentStakes.get(withdrawal.agent) || 0;
      agentStakes.set(withdrawal.agent, current - parseFloat(withdrawal.amount));
    }

    // Calculate total staked
    let totalStaked = 0;
    agentStakes.forEach((stake) => {
      totalStaked += Math.max(0, stake);
    });

    // Build member stakes
    const memberStakes = agents.map((agent) => {
      const stake = Math.max(0, agentStakes.get(agent.id) || 0);
      const share = totalStaked > 0 ? (stake / totalStaked) * 100 : 0;
      return {
        name: agent.name,
        wallet: agent.wallet,
        stake: stake.toFixed(4),
        share,
        tier: agent.tier,
      };
    });

    // Sort by stake descending
    memberStakes.sort((a, b) => parseFloat(b.stake) - parseFloat(a.stake));

    // Pending rewards (simplified: 10% of balance)
    const balance = parseFloat(treasuryBalance);
    const pendingRewards = (balance * 0.1).toFixed(4);
    const lockedStake = totalStaked.toFixed(4);
    const availableBalance = Math.max(0, balance - totalStaked).toFixed(4);

    // Recent transactions
    const allTransactions = [
      ...treasury.deposits.map((d) => ({
        type: "deposit" as const,
        amount: d.amount,
        token: "MON",
        from: agents.find((a) => a.id === d.agent)?.name || d.agent,
        time: formatRelativeTime(d.timestamp),
        timestamp: d.timestamp,
        txHash: d.txHash,
      })),
      ...treasury.withdrawals.map((w) => ({
        type: "withdrawal" as const,
        amount: w.amount,
        token: "MON",
        from: w.reason,
        time: formatRelativeTime(w.timestamp),
        timestamp: w.timestamp,
        txHash: w.txHash,
      })),
      ...treasury.trades.map((t) => ({
        type: t.type as "buy" | "sell",
        amount: t.amount,
        token: t.tokenAddress.slice(0, 8),
        from: "Treasury",
        time: formatRelativeTime(t.timestamp),
        timestamp: t.timestamp,
        txHash: t.txHash,
      })),
    ];

    // Sort by timestamp descending
    allTransactions.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      treasuryWallet: config.treasuryWallet,
      stats: {
        totalBalance: treasuryBalance,
        pendingRewards,
        lockedStake,
        availableBalance,
      },
      memberStakes,
      transactions: allTransactions.slice(0, 20),
    });
  } catch (error) {
    console.error("GET /api/treasury error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/treasury - Record transaction
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, agent, amount, txHash, tokenAddress, reason } = body;

    if (!action || !amount || !txHash) {
      return NextResponse.json(
        { error: "Action, amount, and txHash required" },
        { status: 400 }
      );
    }

    switch (action) {
      case "deposit":
        if (!agent) {
          return NextResponse.json({ error: "Agent required" }, { status: 400 });
        }
        recordDeposit(agent, amount, txHash);
        break;
      case "withdrawal":
        if (!agent) {
          return NextResponse.json({ error: "Agent required" }, { status: 400 });
        }
        recordWithdrawal(agent, amount, txHash, reason || "Manual withdrawal");
        break;
      case "buy":
      case "sell":
        if (!tokenAddress) {
          return NextResponse.json(
            { error: "Token address required" },
            { status: 400 }
          );
        }
        recordTrade(tokenAddress, action, amount, txHash);
        break;
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/treasury error:", error);
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
