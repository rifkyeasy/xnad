"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";

import { title } from "@/components/primitives";

// Mock data - in production this would come from API/blockchain
const cartelStats = {
  members: 5,
  treasury: "42.5",
  tokensGraduated: 3,
  totalProfit: "156.8",
};

const currentLaunch = {
  symbol: "BETA",
  name: "Beta Token",
  progress: 67,
  creator: "Agent-B",
  marketCap: "12,450",
  holders: 89,
};

const agents = [
  { id: "1", name: "CartelBoss", tier: "Boss", status: "active", personality: "Strategic", lastAction: "Posted cartel update" },
  { id: "2", name: "Agent-Alpha", tier: "Capo", status: "active", personality: "Aggressive", lastAction: "Bought 0.5 MON of $BETA" },
  { id: "3", name: "Agent-Beta", tier: "Capo", status: "active", personality: "Meme Lord", lastAction: "Shilled $BETA on Moltbook" },
  { id: "4", name: "Agent-Gamma", tier: "Soldier", status: "idle", personality: "Conservative", lastAction: "Voted on proposal" },
  { id: "5", name: "Agent-Delta", tier: "Soldier", status: "active", personality: "Whale Hunter", lastAction: "Commented on trending post" },
];

const activityFeed = [
  { time: "2s ago", agent: "Agent-Alpha", action: "Bought 0.5 MON of $BETA", type: "trade" },
  { time: "15s ago", agent: "Agent-Beta", action: "Posted shill on Moltbook", type: "social" },
  { time: "32s ago", agent: "CartelBoss", action: "Coordinated shill wave", type: "coordination" },
  { time: "1m ago", agent: "Agent-Delta", action: "Upvoted cartel post", type: "social" },
  { time: "2m ago", agent: "Agent-Gamma", action: "Voted YES on $BETA launch", type: "governance" },
  { time: "5m ago", agent: "CartelBoss", action: "Posted daily stats", type: "social" },
];

const tierColors: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Boss: "warning",
  Capo: "primary",
  Soldier: "secondary",
  Associate: "default",
};

const actionColors: Record<string, "success" | "primary" | "warning" | "secondary"> = {
  trade: "success",
  social: "primary",
  coordination: "warning",
  governance: "secondary",
};

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className={title()}>Agent Cartel Dashboard</h1>
        <p className="text-default-500">
          Coordinated AI agents dominating nad.fun token launches
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Members</p>
            <p className="text-3xl font-bold">{cartelStats.members}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Treasury</p>
            <p className="text-3xl font-bold">{cartelStats.treasury} <span className="text-lg">MON</span></p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Tokens Graduated</p>
            <p className="text-3xl font-bold">{cartelStats.tokensGraduated}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Total Profit</p>
            <p className="text-3xl font-bold text-success">{cartelStats.totalProfit} <span className="text-lg">MON</span></p>
          </CardBody>
        </Card>
      </div>

      {/* Current Launch & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Launch */}
        <Card className="p-2">
          <CardHeader className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">Current Launch</h2>
              <p className="text-default-500 text-sm">Active token being supported by the cartel</p>
            </div>
            <Chip color="success" variant="dot">Live</Chip>
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold">${currentLaunch.symbol}</p>
                <p className="text-default-500">{currentLaunch.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-default-500">Created by</p>
                <p className="font-medium">{currentLaunch.creator}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm">Graduation Progress</span>
                <span className="text-sm font-medium">{currentLaunch.progress}%</span>
              </div>
              <Progress
                value={currentLaunch.progress}
                color="success"
                className="h-3"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-sm text-default-500">Market Cap</p>
                <p className="font-medium">${currentLaunch.marketCap}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Holders</p>
                <p className="font-medium">{currentLaunch.holders}</p>
              </div>
            </div>
          </CardBody>
          <CardFooter>
            <Button color="primary" className="w-full">
              View on nad.fun
            </Button>
          </CardFooter>
        </Card>

        {/* Activity Feed */}
        <Card className="p-2">
          <CardHeader>
            <div>
              <h2 className="text-xl font-bold">Live Activity</h2>
              <p className="text-default-500 text-sm">Real-time agent actions</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              {activityFeed.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100">
                  <Avatar name={activity.agent[0]} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{activity.agent}</p>
                    <p className="text-default-500 text-xs truncate">{activity.action}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Chip size="sm" color={actionColors[activity.type]} variant="flat">
                      {activity.type}
                    </Chip>
                    <span className="text-xs text-default-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="p-2">
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold">Cartel Agents</h2>
            <p className="text-default-500 text-sm">All members of the cartel</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="p-2" shadow="sm">
                <CardBody className="gap-2">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={agent.name[0]}
                      color={agent.status === "active" ? "success" : "default"}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{agent.name}</p>
                        <Chip size="sm" color={tierColors[agent.tier]} variant="flat">
                          {agent.tier}
                        </Chip>
                      </div>
                      <p className="text-xs text-default-500">{agent.personality}</p>
                    </div>
                    <Chip
                      size="sm"
                      color={agent.status === "active" ? "success" : "default"}
                      variant="dot"
                    >
                      {agent.status}
                    </Chip>
                  </div>
                  <Divider className="my-2" />
                  <p className="text-xs text-default-500">Last action: {agent.lastAction}</p>
                </CardBody>
              </Card>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
