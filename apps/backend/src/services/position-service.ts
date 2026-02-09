import { prisma } from '../db/client.js';

export interface PositionUpdate {
  tokenAddress: string;
  tokenSymbol: string;
  balance: string;
  costBasis: string;
  entryPrice: string;
  currentPrice: string;
  currentValue: string;
  unrealizedPnl: string;
  unrealizedPnlPct: number;
  targetAllocation?: number;
}

export async function upsertPosition(userId: string, data: PositionUpdate) {
  return prisma.position.upsert({
    where: {
      userId_tokenAddress: {
        userId,
        tokenAddress: data.tokenAddress,
      },
    },
    update: {
      balance: data.balance,
      costBasis: data.costBasis,
      entryPrice: data.entryPrice,
      currentPrice: data.currentPrice,
      currentValue: data.currentValue,
      unrealizedPnl: data.unrealizedPnl,
      unrealizedPnlPct: data.unrealizedPnlPct,
      targetAllocation: data.targetAllocation,
    },
    create: {
      userId,
      tokenAddress: data.tokenAddress,
      tokenSymbol: data.tokenSymbol,
      balance: data.balance,
      costBasis: data.costBasis,
      entryPrice: data.entryPrice,
      currentPrice: data.currentPrice,
      currentValue: data.currentValue,
      unrealizedPnl: data.unrealizedPnl,
      unrealizedPnlPct: data.unrealizedPnlPct,
      targetAllocation: data.targetAllocation,
    },
  });
}

export async function getUserPositions(userId: string) {
  return prisma.position.findMany({
    where: { userId },
    orderBy: { currentValue: 'desc' },
  });
}

export async function getPositionsByWallet(walletAddress: string) {
  const user = await prisma.user.findUnique({
    where: { walletAddress },
  });

  if (!user) return [];

  return getUserPositions(user.id);
}

export async function deletePosition(userId: string, tokenAddress: string) {
  return prisma.position.delete({
    where: {
      userId_tokenAddress: {
        userId,
        tokenAddress,
      },
    },
  });
}

export async function getPortfolioValue(userId: string) {
  const positions = await getUserPositions(userId);

  const totalValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);

  const totalCostBasis = positions.reduce((sum, p) => sum + parseFloat(p.costBasis), 0);

  const totalPnl = totalValue - totalCostBasis;
  const totalPnlPct = totalCostBasis > 0 ? (totalPnl / totalCostBasis) * 100 : 0;

  return {
    totalValue: totalValue.toString(),
    totalCostBasis: totalCostBasis.toString(),
    totalPnl: totalPnl.toString(),
    totalPnlPct,
    positionCount: positions.length,
  };
}

export async function updatePositionPrices(
  userId: string,
  priceUpdates: { tokenAddress: string; currentPrice: string }[]
) {
  const positions = await getUserPositions(userId);

  for (const update of priceUpdates) {
    const position = positions.find((p) => p.tokenAddress === update.tokenAddress);
    if (!position) continue;

    const balance = parseFloat(position.balance);
    const currentPrice = parseFloat(update.currentPrice);
    const entryPrice = parseFloat(position.entryPrice);
    const costBasis = parseFloat(position.costBasis);

    const currentValue = balance * currentPrice;
    const unrealizedPnl = currentValue - costBasis;
    const unrealizedPnlPct = costBasis > 0 ? (unrealizedPnl / costBasis) * 100 : 0;

    await prisma.position.update({
      where: {
        userId_tokenAddress: {
          userId,
          tokenAddress: update.tokenAddress,
        },
      },
      data: {
        currentPrice: update.currentPrice,
        currentValue: currentValue.toString(),
        unrealizedPnl: unrealizedPnl.toString(),
        unrealizedPnlPct,
      },
    });
  }
}
