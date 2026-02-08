import { NextRequest, NextResponse } from "next/server";
import { loadDatabase, initializeCartel, getCartelConfig, resetCartel, updateTreasuryWallet } from "@/lib/cartel-db";

// GET /api/cartel - Get cartel info and stats
export async function GET() {
  try {
    const db = loadDatabase();

    if (!db.cartelId) {
      return NextResponse.json({ initialized: false }, { status: 200 });
    }

    const config = getCartelConfig();
    const agents = db.agents;
    const launches = db.launches;
    const treasury = db.treasury;

    // Calculate stats
    const totalDeposits = treasury.deposits.reduce(
      (sum, d) => sum + parseFloat(d.amount),
      0
    );
    const totalWithdrawals = treasury.withdrawals.reduce(
      (sum, w) => sum + parseFloat(w.amount),
      0
    );
    const treasuryBalance = totalDeposits - totalWithdrawals;

    const graduatedTokens = launches.filter((l) => l.status === "graduated").length;
    const activeLaunches = launches.filter((l) => l.status === "live").length;

    // Calculate total profit from graduated tokens
    const totalProfit = launches
      .filter((l) => l.status === "graduated")
      .reduce((sum, l) => {
        const profit = parseFloat(l.currentValue) - parseFloat(l.investmentAmount);
        return sum + Math.max(0, profit);
      }, 0);

    return NextResponse.json({
      initialized: true,
      cartelId: config.cartelId,
      treasuryWallet: config.treasuryWallet,
      createdAt: config.createdAt,
      stats: {
        members: agents.length,
        treasury: treasuryBalance.toFixed(4),
        tokensGraduated: graduatedTokens,
        totalProfit: totalProfit.toFixed(4),
        activeLaunches,
      },
      config: config.config,
    });
  } catch (error) {
    console.error("GET /api/cartel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/cartel - Initialize cartel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { treasuryWallet, force } = body;

    if (!treasuryWallet) {
      return NextResponse.json(
        { error: "Treasury wallet address required" },
        { status: 400 }
      );
    }

    const db = loadDatabase();

    // If force is true, reset first
    if (force && db.cartelId) {
      resetCartel();
    } else if (db.cartelId) {
      return NextResponse.json(
        { error: "Cartel already initialized. Use force: true to reset." },
        { status: 400 }
      );
    }

    const newDb = initializeCartel(treasuryWallet);

    return NextResponse.json({
      success: true,
      cartelId: newDb.cartelId,
      treasuryWallet: newDb.treasuryWallet,
    });
  } catch (error) {
    console.error("POST /api/cartel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/cartel - Update treasury wallet
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { treasuryWallet } = body;

    if (!treasuryWallet) {
      return NextResponse.json(
        { error: "Treasury wallet address required" },
        { status: 400 }
      );
    }

    const db = loadDatabase();
    if (!db.cartelId) {
      return NextResponse.json(
        { error: "Cartel not initialized" },
        { status: 400 }
      );
    }

    const updatedDb = updateTreasuryWallet(treasuryWallet);

    return NextResponse.json({
      success: true,
      treasuryWallet: updatedDb.treasuryWallet,
    });
  } catch (error) {
    console.error("PATCH /api/cartel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/cartel - Reset cartel
export async function DELETE() {
  try {
    resetCartel();
    return NextResponse.json({ success: true, message: "Cartel reset" });
  } catch (error) {
    console.error("DELETE /api/cartel error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
