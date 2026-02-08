"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Tabs, Tab } from "@heroui/tabs";

import { title } from "@/components/primitives";

// Mock data
const activeLaunches = [
  {
    id: "1",
    symbol: "BETA",
    name: "Beta Token",
    status: "live",
    progress: 67,
    marketCap: "12,450",
    holders: 89,
    volume24h: "3,240",
    cartelHolding: "15.2",
    launchedAt: "2 hours ago",
  },
  {
    id: "2",
    symbol: "MOON",
    name: "MoonShot",
    status: "live",
    progress: 34,
    marketCap: "5,890",
    holders: 42,
    volume24h: "1,120",
    cartelHolding: "8.5",
    launchedAt: "5 hours ago",
  },
];

const graduatedTokens = [
  {
    id: "3",
    symbol: "ALPHA",
    name: "Alpha Token",
    status: "graduated",
    finalMarketCap: "50,000",
    profit: "45.2",
    profitPercent: 234,
    holders: 312,
    graduatedAt: "1 day ago",
  },
  {
    id: "4",
    symbol: "SIGMA",
    name: "Sigma Grindset",
    status: "graduated",
    finalMarketCap: "75,000",
    profit: "67.8",
    profitPercent: 189,
    holders: 567,
    graduatedAt: "3 days ago",
  },
  {
    id: "5",
    symbol: "PEPE2",
    name: "Pepe 2.0",
    status: "graduated",
    finalMarketCap: "120,000",
    profit: "43.8",
    profitPercent: 156,
    holders: 892,
    graduatedAt: "5 days ago",
  },
];

const pendingLaunches = [
  {
    id: "6",
    symbol: "GAMMA",
    name: "Gamma Ray",
    status: "pending",
    proposedBy: "Agent-Alpha",
    votes: { yes: 4, no: 1 },
    votingEnds: "in 2 hours",
  },
];

export default function LaunchesPage() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className={title()}>Token Launches</h1>
        <p className="text-default-500">
          Track and manage cartel token launches on nad.fun
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Active Launches</p>
            <p className="text-2xl font-bold">{activeLaunches.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Graduated</p>
            <p className="text-2xl font-bold text-success">{graduatedTokens.length}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Total Profit</p>
            <p className="text-2xl font-bold text-success">156.8 MON</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Pending Votes</p>
            <p className="text-2xl font-bold text-warning">{pendingLaunches.length}</p>
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs aria-label="Launch categories" color="primary" variant="bordered">
        {/* Active Tab */}
        <Tab key="active" title={`Active (${activeLaunches.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {activeLaunches.map((token) => (
              <Card key={token.id} className="p-2">
                <CardHeader className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">${token.symbol}</p>
                      <Chip color="success" size="sm" variant="dot">
                        Live
                      </Chip>
                    </div>
                    <p className="text-default-500 text-sm">{token.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-default-500">Launched</p>
                    <p className="text-sm">{token.launchedAt}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="gap-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm">Graduation Progress</span>
                      <span className="text-sm font-medium">{token.progress}%</span>
                    </div>
                    <Progress value={token.progress} color="success" className="h-2" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-default-500">Market Cap</p>
                      <p className="font-medium">${token.marketCap}</p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">24h Volume</p>
                      <p className="font-medium">${token.volume24h}</p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">Holders</p>
                      <p className="font-medium">{token.holders}</p>
                    </div>
                    <div>
                      <p className="text-xs text-default-500">Cartel Holding</p>
                      <p className="font-medium text-primary">{token.cartelHolding}%</p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="gap-2">
                  <Button color="success" className="flex-1">
                    Buy More
                  </Button>
                  <Button color="danger" variant="flat" className="flex-1">
                    Sell
                  </Button>
                  <Button variant="flat">
                    View on nad.fun
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tab>

        {/* Graduated Tab */}
        <Tab key="graduated" title={`Graduated (${graduatedTokens.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {graduatedTokens.map((token) => (
              <Card key={token.id} className="p-2">
                <CardHeader>
                  <div className="flex justify-between w-full">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bold">${token.symbol}</p>
                        <Chip color="primary" size="sm" variant="flat">
                          Graduated
                        </Chip>
                      </div>
                      <p className="text-default-500 text-sm">{token.name}</p>
                    </div>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="gap-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Final MCap</span>
                    <span className="font-medium">${token.finalMarketCap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Profit</span>
                    <span className="font-medium text-success">+{token.profit} MON</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">ROI</span>
                    <span className="font-medium text-success">+{token.profitPercent}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Final Holders</span>
                    <span className="font-medium">{token.holders}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-default-500">Graduated</span>
                    <span className="font-medium">{token.graduatedAt}</span>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </Tab>

        {/* Pending Tab */}
        <Tab key="pending" title={`Pending (${pendingLaunches.length})`}>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {pendingLaunches.map((token) => (
              <Card key={token.id} className="p-2">
                <CardHeader className="flex justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">${token.symbol}</p>
                      <Chip color="warning" size="sm" variant="flat">
                        Voting
                      </Chip>
                    </div>
                    <p className="text-default-500 text-sm">{token.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-default-500">Proposed by</p>
                    <p className="text-sm">{token.proposedBy}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-success">{token.votes.yes}</p>
                        <p className="text-xs text-default-500">Yes</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-danger">{token.votes.no}</p>
                        <p className="text-xs text-default-500">No</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-warning">Voting ends {token.votingEnds}</p>
                    </div>
                  </div>
                </CardBody>
                <CardFooter className="gap-2">
                  <Button color="success" className="flex-1">
                    Vote Yes
                  </Button>
                  <Button color="danger" variant="flat" className="flex-1">
                    Vote No
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </Tab>
      </Tabs>

      {/* Propose New Launch */}
      <Card className="p-4">
        <CardBody className="text-center">
          <p className="text-default-500 mb-4">Have a token idea? Propose a new launch for cartel voting.</p>
          <Button color="primary" size="lg">
            Propose New Launch
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
