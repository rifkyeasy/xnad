"use client";

import { Card, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import type { StrategyType } from "@/stores/agent";
import { STRATEGY_CONFIG, StrategyType as StrategyEnum } from "@/config/contracts";

interface StrategyConfig {
  type: StrategyType;
  title: string;
  description: string;
  icon: string;
  color: "success" | "primary" | "danger";
  metrics: {
    confidence: string;
    maxTrade: string;
    riskLevel: string;
    stopLoss: string;
    takeProfit: string;
  };
}

// Map strategy enum to UI config
const STRATEGIES: StrategyConfig[] = [
  {
    type: "CONSERVATIVE",
    title: STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].name,
    description: STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].description,
    icon: "🛡️",
    color: "success",
    metrics: {
      confidence: `>${(STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].minConfidence * 100).toFixed(0)}%`,
      maxTrade: `${STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].maxTradeAmount} MON`,
      riskLevel: STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].riskLevels.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(" only"),
      stopLoss: `${(STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].stopLoss * 100).toFixed(0)}%`,
      takeProfit: `${(STRATEGY_CONFIG[StrategyEnum.CONSERVATIVE].takeProfit * 100).toFixed(0)}%`,
    },
  },
  {
    type: "BALANCED",
    title: STRATEGY_CONFIG[StrategyEnum.BALANCED].name,
    description: STRATEGY_CONFIG[StrategyEnum.BALANCED].description,
    icon: "⚖️",
    color: "primary",
    metrics: {
      confidence: `${(STRATEGY_CONFIG[StrategyEnum.BALANCED].minConfidence * 100).toFixed(0)}-85%`,
      maxTrade: `${STRATEGY_CONFIG[StrategyEnum.BALANCED].maxTradeAmount} MON`,
      riskLevel: STRATEGY_CONFIG[StrategyEnum.BALANCED].riskLevels.map(r => r.charAt(0).toUpperCase() + r.slice(1)).join(" & "),
      stopLoss: `${(STRATEGY_CONFIG[StrategyEnum.BALANCED].stopLoss * 100).toFixed(0)}%`,
      takeProfit: `${(STRATEGY_CONFIG[StrategyEnum.BALANCED].takeProfit * 100).toFixed(0)}%`,
    },
  },
  {
    type: "AGGRESSIVE",
    title: STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].name,
    description: STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].description,
    icon: "🚀",
    color: "danger",
    metrics: {
      confidence: `${(STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].minConfidence * 100).toFixed(0)}-70%`,
      maxTrade: `${STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].maxTradeAmount} MON`,
      riskLevel: "All levels",
      stopLoss: `${(STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].stopLoss * 100).toFixed(0)}%`,
      takeProfit: `${(STRATEGY_CONFIG[StrategyEnum.AGGRESSIVE].takeProfit * 100).toFixed(0)}%`,
    },
  },
];

interface StrategyCardsProps {
  recommendedStrategy: StrategyType | null;
  onSelect: (strategy: StrategyType) => void;
  isLoading?: boolean;
}

export function StrategyCards({
  recommendedStrategy,
  onSelect,
  isLoading,
}: StrategyCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {STRATEGIES.map((strategy) => {
        const isRecommended = strategy.type === recommendedStrategy;

        return (
          <Card
            key={strategy.type}
            className={`relative ${isRecommended ? "ring-2 ring-primary" : ""}`}
          >
            {isRecommended && (
              <Chip
                color="primary"
                size="sm"
                className="absolute -top-2 left-1/2 -translate-x-1/2 z-10"
              >
                Recommended
              </Chip>
            )}

            <CardBody className="gap-4 pt-6">
              <div className="text-center">
                <span className="text-4xl">{strategy.icon}</span>
                <h3 className="text-xl font-bold mt-2">{strategy.title}</h3>
                <p className="text-default-500 text-sm mt-1">
                  {strategy.description}
                </p>
              </div>

              <div className="space-y-2 mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Min Confidence</span>
                  <span className="font-medium">{strategy.metrics.confidence}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Max Trade</span>
                  <span className="font-medium">{strategy.metrics.maxTrade}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Risk Level</span>
                  <span className="font-medium">{strategy.metrics.riskLevel}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Stop-Loss</span>
                  <span className="font-medium text-danger">-{strategy.metrics.stopLoss}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Take-Profit</span>
                  <span className="font-medium text-success">+{strategy.metrics.takeProfit}</span>
                </div>
              </div>
            </CardBody>

            <CardFooter>
              <Button
                color={strategy.color}
                variant={isRecommended ? "solid" : "flat"}
                className="w-full"
                onPress={() => onSelect(strategy.type)}
                isLoading={isLoading}
              >
                Select {strategy.title}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
