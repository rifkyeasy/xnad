import { prisma, StrategyType } from '../db/client.js';
import type { CreateUserInput, UpdateStrategyInput, XAnalysis } from '../types/index.js';
import { STRATEGY_CONFIGS } from '../types/index.js';

export async function createUser(input: CreateUserInput) {
  return prisma.user.upsert({
    where: { walletAddress: input.walletAddress },
    update: {
      vaultAddress: input.vaultAddress,
    },
    create: {
      walletAddress: input.walletAddress,
      vaultAddress: input.vaultAddress,
    },
  });
}

export async function getUser(walletAddress: string) {
  return prisma.user.findUnique({
    where: { walletAddress },
    include: {
      trades: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      positions: true,
    },
  });
}

export async function getUserByVault(vaultAddress: string) {
  return prisma.user.findFirst({
    where: { vaultAddress },
  });
}

export async function updateUserStrategy(walletAddress: string, input: UpdateStrategyInput) {
  const data: Record<string, unknown> = {};

  if (input.strategyType) {
    const config = STRATEGY_CONFIGS[input.strategyType];
    data.strategyType = input.strategyType as StrategyType;
    data.confidenceThreshold = config.minConfidence;
    data.maxTradeAmount = parseFloat(config.maxTradeAmount);
    data.stopLossPercent = config.stopLossPercent;
    data.takeProfitPercent = config.takeProfitPercent;
    data.rebalanceInterval = config.rebalanceInterval;
  }

  if (input.autoTrade !== undefined) data.autoTrade = input.autoTrade;
  if (input.autoRebalance !== undefined) data.autoRebalance = input.autoRebalance;
  if (input.rebalanceInterval !== undefined) data.rebalanceInterval = input.rebalanceInterval;
  if (input.stopLossPercent !== undefined) data.stopLossPercent = input.stopLossPercent;
  if (input.takeProfitPercent !== undefined) data.takeProfitPercent = input.takeProfitPercent;

  return prisma.user.update({
    where: { walletAddress },
    data,
  });
}

export async function updateUserXAnalysis(
  walletAddress: string,
  xHandle: string,
  analysis: XAnalysis,
  strategyType: StrategyType
) {
  const config = STRATEGY_CONFIGS[strategyType];

  return prisma.user.update({
    where: { walletAddress },
    data: {
      xHandle,
      xAnalysis: analysis as object,
      riskProfile: analysis.riskTolerance,
      strategyType,
      confidenceThreshold: config.minConfidence,
      maxTradeAmount: parseFloat(config.maxTradeAmount),
      stopLossPercent: config.stopLossPercent,
      takeProfitPercent: config.takeProfitPercent,
      rebalanceInterval: config.rebalanceInterval,
    },
  });
}

export async function getAllActiveUsers() {
  return prisma.user.findMany({
    where: {
      autoTrade: true,
      vaultAddress: { not: null },
    },
    include: {
      positions: true,
    },
  });
}

export async function deleteUser(walletAddress: string) {
  return prisma.user.delete({
    where: { walletAddress },
  });
}
