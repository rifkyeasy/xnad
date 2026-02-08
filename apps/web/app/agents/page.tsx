"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";

import { title } from "@/components/primitives";
import { useAgentsData } from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import { truncateAddress } from "@/lib/api";

const tierColors: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Boss: "warning",
  Capo: "primary",
  Soldier: "secondary",
  Associate: "default",
};

const tierRequirements = {
  Associate: { minBalance: 0, label: "New member" },
  Soldier: { minBalance: 1, label: "1+ MON staked" },
  Capo: { minBalance: 5, label: "5+ MON staked" },
  Boss: { minBalance: 10, label: "10+ MON staked" },
};

export default function AgentsPage() {
  const { isLoading } = useAgentsData();
  const { agents } = useCartelStore();

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className={title()}>Cartel Agents</h1>
          {isLoading && <Spinner size="sm" />}
        </div>
        <p className="text-default-500">
          View and manage all agents in the cartel network
        </p>
      </div>

      {/* Tier Legend */}
      <Card className="p-4">
        <CardBody>
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(tierRequirements).map(([tier, info]) => (
              <div key={tier} className="flex items-center gap-2">
                <Chip color={tierColors[tier]} size="sm" variant="flat">
                  {tier}
                </Chip>
                <span className="text-xs text-default-500">{info.label}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-2">
              <CardHeader className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-28 rounded-lg mb-2" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </CardBody>
            </Card>
          ))
        ) : (
          agents.map((agent) => (
            <Card key={agent.id} className="p-2">
              <CardHeader className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={agent.name[0]}
                    size="lg"
                    color={agent.status === "active" ? "success" : "default"}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{agent.name}</p>
                      <Chip size="sm" color={tierColors[agent.tier]} variant="flat">
                        {agent.tier}
                      </Chip>
                    </div>
                    <p className="text-sm text-default-500">{agent.personality}</p>
                  </div>
                </div>
                <Chip
                  size="sm"
                  color={agent.status === "active" ? "success" : "default"}
                  variant="dot"
                >
                  {agent.status}
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500">Wallet</p>
                    <p className="font-mono text-sm">{truncateAddress(agent.wallet)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Balance</p>
                    <p className="font-medium">{agent.balance} MON</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500">Total Trades</p>
                    <p className="font-medium">{agent.totalTrades}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Joined</p>
                    <p className="font-medium">{agent.joinedAt}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-default-500">Success Rate</span>
                    <span className="text-xs font-medium">{agent.successRate}%</span>
                  </div>
                  <Progress
                    value={agent.successRate}
                    color={agent.successRate >= 80 ? "success" : agent.successRate >= 60 ? "warning" : "danger"}
                    size="sm"
                  />
                </div>

                {agent.lastAction && (
                  <p className="text-xs text-default-500">
                    Last action: {agent.lastAction}
                  </p>
                )}

                <div className="flex gap-2 mt-2">
                  <Button size="sm" variant="flat" className="flex-1">
                    View Profile
                  </Button>
                  <Button size="sm" color="primary" variant="flat" className="flex-1">
                    View Trades
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        )}
      </div>

      {/* Add Agent CTA */}
      <Card className="p-4">
        <CardBody className="text-center">
          <p className="text-default-500 mb-4">Want to add more agents to your cartel?</p>
          <Button color="primary" size="lg">
            Deploy New Agent
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
