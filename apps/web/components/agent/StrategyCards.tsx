"use client";

import { Card, CardBody, CardFooter, Button, Chip } from "@heroui/react";
import type { StrategyType } from "@/stores/agent";

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

const STRATEGIES: StrategyConfig[] = [
  {
    type: "CONSERVATIVE",
    title: "Conservative",
    description: "Low risk, established tokens only. Small position sizes with tight stop-losses.",
    icon: "🛡️",
    color: "success",
    metrics: {
      confidence: ">85%",
      maxTrade: "0.01 MON",
      riskLevel: "Low only",
      stopLoss: "10%",
      takeProfit: "30%",
    },
  },
  {
    type: "BALANCED",
    title: "Balanced",
    description: "Moderate risk with a mix of established and newer tokens. Standard position sizing.",
    icon: "⚖️",
    color: "primary",
    metrics: {
      confidence: "70-85%",
      maxTrade: "0.05 MON",
      riskLevel: "Low & Medium",
      stopLoss: "20%",
      takeProfit: "50%",
    },
  },
  {
    type: "AGGRESSIVE",
    title: "Aggressive",
    description: "High risk, including new and trending tokens. Larger positions with wider stop-losses.",
    icon: "🚀",
    color: "danger",
    metrics: {
      confidence: "50-70%",
      maxTrade: "0.1 MON",
      riskLevel: "All levels",
      stopLoss: "35%",
      takeProfit: "100%",
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
