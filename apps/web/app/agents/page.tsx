"use client";

import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";

import { title } from "@/components/primitives";

// Mock data - in production this would come from API/blockchain
const agents = [
  {
    id: "1",
    name: "CartelBoss",
    tier: "Boss",
    status: "active",
    personality: "Strategic",
    wallet: "0x1234...abcd",
    balance: "12.5",
    totalTrades: 156,
    successRate: 87,
    joinedAt: "2 days ago",
  },
  {
    id: "2",
    name: "Agent-Alpha",
    tier: "Capo",
    status: "active",
    personality: "Aggressive",
    wallet: "0x5678...efgh",
    balance: "8.2",
    totalTrades: 89,
    successRate: 72,
    joinedAt: "2 days ago",
  },
  {
    id: "3",
    name: "Agent-Beta",
    tier: "Capo",
    status: "active",
    personality: "Meme Lord",
    wallet: "0x9abc...ijkl",
    balance: "6.7",
    totalTrades: 67,
    successRate: 81,
    joinedAt: "1 day ago",
  },
  {
    id: "4",
    name: "Agent-Gamma",
    tier: "Soldier",
    status: "idle",
    personality: "Conservative",
    wallet: "0xdef0...mnop",
    balance: "3.1",
    totalTrades: 34,
    successRate: 91,
    joinedAt: "1 day ago",
  },
  {
    id: "5",
    name: "Agent-Delta",
    tier: "Soldier",
    status: "active",
    personality: "Whale Hunter",
    wallet: "0x1357...qrst",
    balance: "4.8",
    totalTrades: 45,
    successRate: 68,
    joinedAt: "12 hours ago",
  },
];

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
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className={title()}>Cartel Agents</h1>
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
        {agents.map((agent) => (
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
                  <p className="font-mono text-sm">{agent.wallet}</p>
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
        ))}
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
