"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { useAccount, useBalance } from "wagmi";
import { useRouter } from "next/navigation";

import { title } from "@/components/primitives";
import { useAgentStore } from "@/stores/agent";
import { useVaultFactory, useVault } from "@/hooks/useVault";

export default function Dashboard() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });

  const { selectedStrategy, vaultAddress, positions, autoTrade } = useAgentStore();
  const { hasVault } = useVaultFactory(address);
  const { balance: vaultBalance } = useVault(vaultAddress);

  // Calculate portfolio stats
  const totalPositionValue = positions.reduce(
    (sum, p) => sum + parseFloat(p.currentValue || "0"),
    0
  );
  const totalPnl = positions.reduce(
    (sum, p) => sum + parseFloat(p.unrealizedPnl || "0"),
    0
  );

  const strategyLabels = {
    CONSERVATIVE: "Conservative",
    BALANCED: "Balanced",
    AGGRESSIVE: "Aggressive",
  };

  const strategyColors = {
    CONSERVATIVE: "success" as const,
    BALANCED: "primary" as const,
    AGGRESSIVE: "danger" as const,
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className={title()}>Dashboard</h1>
          <p className="text-default-500 mt-1">Freezy - Social AI Trading Agent</p>
        </div>
        {selectedStrategy && (
          <Chip color={strategyColors[selectedStrategy]} size="lg">
            {strategyLabels[selectedStrategy]}
          </Chip>
        )}
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Wallet Balance</p>
            <p className="text-2xl font-bold">
              {balance ? parseFloat(balance.formatted).toFixed(4) : "0"} MON
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Vault Balance</p>
            <p className="text-2xl font-bold">
              {vaultBalance ? parseFloat(vaultBalance).toFixed(4) : "0"} MON
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Positions Value</p>
            <p className="text-2xl font-bold">
              {totalPositionValue.toFixed(4)} MON
            </p>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Unrealized P&L</p>
            <p className={`text-2xl font-bold ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>
              {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(4)} MON
            </p>
          </CardBody>
        </Card>
      </div>

      {/* Agent Status */}
      <Card className="p-2">
        <CardHeader className="flex justify-between">
          <div>
            <h2 className="text-lg font-bold">AI Agent Status</h2>
            <p className="text-default-500 text-sm">Your trading agent configuration</p>
          </div>
          {autoTrade && (
            <Chip color="success" variant="dot">Active</Chip>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          {!isConnected ? (
            <div className="text-center py-8 text-default-500">
              Connect your wallet to get started
            </div>
          ) : !hasVault ? (
            <div className="text-center py-8">
              <p className="text-default-500 mb-4">
                Set up your AI trading agent to start automated trading
              </p>
              <Button color="primary" size="lg" onPress={() => router.push("/agent")}>
                Set Up Agent
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-sm text-default-500">Strategy</p>
                  <p className="font-bold">
                    {selectedStrategy ? strategyLabels[selectedStrategy] : "Not set"}
                  </p>
                </div>
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-sm text-default-500">Auto-Trade</p>
                  <p className="font-bold">{autoTrade ? "Enabled" : "Disabled"}</p>
                </div>
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-sm text-default-500">Positions</p>
                  <p className="font-bold">{positions.length}</p>
                </div>
                <div className="p-3 bg-default-100 rounded-lg">
                  <p className="text-sm text-default-500">Vault</p>
                  <p className="font-mono text-sm truncate">
                    {vaultAddress ? `${vaultAddress.slice(0, 6)}...${vaultAddress.slice(-4)}` : "Not created"}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardBody>
        <CardFooter className="gap-2">
          <Button
            color="primary"
            className="flex-1"
            onPress={() => router.push("/agent")}
          >
            {hasVault ? "Manage Agent" : "Set Up Agent"}
          </Button>
          <Button
            variant="flat"
            onPress={() => router.push("/trade")}
          >
            Manual Trade
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardBody className="text-center gap-3">
            <span className="text-3xl">🤖</span>
            <h3 className="font-bold">AI Analysis</h3>
            <p className="text-sm text-default-500">
              Get personalized strategy based on your X profile
            </p>
            <Button variant="flat" size="sm" onPress={() => router.push("/agent")}>
              Analyze
            </Button>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center gap-3">
            <span className="text-3xl">📈</span>
            <h3 className="font-bold">Trade Tokens</h3>
            <p className="text-sm text-default-500">
              Buy and sell tokens on nad.fun bonding curve
            </p>
            <Button variant="flat" size="sm" onPress={() => router.push("/trade")}>
              Trade
            </Button>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center gap-3">
            <span className="text-3xl">🔗</span>
            <h3 className="font-bold">nad.fun</h3>
            <p className="text-sm text-default-500">
              Explore tokens on the nad.fun platform
            </p>
            <Button
              variant="flat"
              size="sm"
              as="a"
              href="https://nad.fun"
              target="_blank"
            >
              Explore
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
