import { prisma, TradeStatus, TradeAction } from "../db/client.js";
import type { RecordTradeInput } from "../types/index.js";

export async function recordTrade(userId: string, input: RecordTradeInput) {
  return prisma.trade.create({
    data: {
      userId,
      tokenAddress: input.tokenAddress,
      tokenSymbol: input.tokenSymbol,
      action: input.action as TradeAction,
      amountIn: input.amountIn,
      amountOut: input.amountOut,
      priceAtTrade: input.priceAtTrade,
      confidence: input.confidence,
      signalSource: input.signalSource,
      reasoning: input.reasoning,
      txHash: input.txHash,
      status: input.txHash ? TradeStatus.SUCCESS : TradeStatus.PENDING,
      executedAt: input.txHash ? new Date() : null,
    },
  });
}

export async function updateTradeStatus(
  tradeId: string,
  status: TradeStatus,
  txHash?: string,
  error?: string
) {
  return prisma.trade.update({
    where: { id: tradeId },
    data: {
      status,
      txHash,
      error,
      executedAt: status === TradeStatus.SUCCESS ? new Date() : undefined,
    },
  });
}

export async function getUserTrades(
  userId: string,
  limit = 50,
  offset = 0
) {
  return prisma.trade.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    skip: offset,
  });
}

export async function getTradesByWallet(
  walletAddress: string,
  limit = 50,
  offset = 0
) {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) return [];

  return getUserTrades(user.id, limit, offset);
}

export async function getPendingTrades() {
  return prisma.trade.findMany({
    where: { status: TradeStatus.PENDING },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
}

export async function getTradeStats(userId: string) {
  const trades = await prisma.trade.findMany({
    where: {
      userId,
      status: TradeStatus.SUCCESS,
    },
  });

  const buyTrades = trades.filter((t) => t.action === TradeAction.BUY);
  const sellTrades = trades.filter((t) => t.action === TradeAction.SELL);

  return {
    totalTrades: trades.length,
    buyCount: buyTrades.length,
    sellCount: sellTrades.length,
    avgConfidence: trades.length > 0
      ? trades.reduce((sum, t) => sum + t.confidence, 0) / trades.length
      : 0,
  };
}
