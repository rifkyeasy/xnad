"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import { useAccount } from "wagmi";

import { title } from "@/components/primitives";
import { useTreasuryData, useWalletData } from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import { truncateAddress } from "@/lib/api";

const tierColors: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Boss: "warning",
  Capo: "primary",
  Soldier: "secondary",
  Associate: "default",
};

export default function TreasuryPage() {
  const { isConnected } = useAccount();
  const { isLoading } = useTreasuryData();
  const { data: walletData } = useWalletData();
  const { treasuryStats, memberStakes } = useCartelStore();

  // Mock recent transactions - would come from indexer/API
  const recentTransactions = [
    { type: "deposit", amount: "5.0", token: "MON", from: "Agent-Alpha", time: "2 hours ago" },
    { type: "buy", amount: "2.0", token: "BETA", from: "Treasury", time: "3 hours ago" },
    { type: "profit", amount: "8.5", token: "MON", from: "ALPHA graduation", time: "1 day ago" },
    { type: "deposit", amount: "3.0", token: "MON", from: "Agent-Beta", time: "1 day ago" },
    { type: "buy", amount: "1.5", token: "MOON", from: "Treasury", time: "2 days ago" },
  ];

  // Mock token holdings - would come from wallet positions
  const tokenHoldings = [
    { symbol: "ALPHA", amount: "125,000", value: "2.5", status: "graduated" },
    { symbol: "BETA", amount: "89,000", value: "1.8", status: "live" },
    { symbol: "MOON", amount: "45,000", value: "0.9", status: "live" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className={title()}>Cartel Treasury</h1>
          {isLoading && <Spinner size="sm" />}
        </div>
        <p className="text-default-500">
          Shared funds and profit distribution for the cartel
        </p>
      </div>

      {/* Wallet Connection Notice */}
      {!isConnected && (
        <Card className="bg-warning-100 dark:bg-warning-900/20">
          <CardBody className="text-center">
            <p className="text-warning-600 dark:text-warning-400">
              Connect your wallet to interact with the treasury
            </p>
          </CardBody>
        </Card>
      )}

      {/* Treasury Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-success-100 to-success-50 dark:from-success-900/20 dark:to-success-800/10">
          <CardBody className="text-center">
            <p className="text-default-600 text-sm">Total Balance</p>
            {isLoading ? (
              <Skeleton className="h-9 w-24 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold">
                {treasuryStats.totalBalance} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Pending Rewards</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-warning">
                {treasuryStats.pendingRewards} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Locked Stake</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold">
                {treasuryStats.lockedStake} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Available</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-success">
                {treasuryStats.availableBalance} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Your Wallet (if connected) */}
      {isConnected && walletData && (
        <Card className="p-2 border-2 border-primary">
          <CardHeader>
            <h2 className="text-xl font-bold">Your Wallet</h2>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-default-500">Address</p>
                <p className="font-mono text-sm">{truncateAddress(walletData.address)}</p>
              </div>
              <div>
                <p className="text-xs text-default-500">Balance</p>
                <p className="font-medium">{parseFloat(walletData.balance).toFixed(4)} MON</p>
              </div>
              <div>
                <p className="text-xs text-default-500">Positions</p>
                <p className="font-medium">{walletData.positions.length}</p>
              </div>
              <div>
                <p className="text-xs text-default-500">Total Value</p>
                <p className="font-medium">{walletData.totalValue.toFixed(4)} MON</p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Token Holdings */}
        <Card className="p-2">
          <CardHeader>
            <div>
              <h2 className="text-xl font-bold">Token Holdings</h2>
              <p className="text-default-500 text-sm">Tokens held by the cartel treasury</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              {tokenHoldings.map((token, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-default-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {token.symbol[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">${token.symbol}</p>
                        <Chip
                          size="sm"
                          color={token.status === "graduated" ? "primary" : "success"}
                          variant="flat"
                        >
                          {token.status}
                        </Chip>
                      </div>
                      <p className="text-sm text-default-500">{token.amount} tokens</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{token.value} MON</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Member Stakes */}
        <Card className="p-2">
          <CardHeader>
            <div>
              <h2 className="text-xl font-bold">Member Stakes</h2>
              <p className="text-default-500 text-sm">Contribution and share distribution</p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-2 w-full rounded-lg" />
                  </div>
                ))
              ) : (
                memberStakes.map((member, index) => (
                  <div key={index} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{member.name}</p>
                        <Chip size="sm" color={tierColors[member.tier]} variant="flat">
                          {member.tier}
                        </Chip>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{member.stake} MON</p>
                        <p className="text-xs text-default-500">{member.share.toFixed(1)}% share</p>
                      </div>
                    </div>
                    <Progress value={member.share} size="sm" color="primary" />
                  </div>
                ))
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-2">
        <CardHeader>
          <div>
            <h2 className="text-xl font-bold">Recent Transactions</h2>
            <p className="text-default-500 text-sm">Latest treasury activity</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="flex flex-col gap-2">
            {recentTransactions.map((tx, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-default-100">
                <div className="flex items-center gap-3">
                  <Chip
                    size="sm"
                    color={
                      tx.type === "deposit" ? "success" :
                      tx.type === "profit" ? "warning" :
                      tx.type === "buy" ? "primary" : "default"
                    }
                    variant="flat"
                  >
                    {tx.type}
                  </Chip>
                  <div>
                    <p className="font-medium">
                      {tx.type === "buy" ? `Bought $${tx.token}` :
                       tx.type === "profit" ? `Profit from ${tx.from}` :
                       `Deposit from ${tx.from}`}
                    </p>
                    <p className="text-xs text-default-500">{tx.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${tx.type === "buy" ? "text-primary" : "text-success"}`}>
                    {tx.type === "buy" ? "-" : "+"}{tx.amount} {tx.type === "buy" ? "MON" : tx.token}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
        <CardFooter>
          <Button variant="flat" className="w-full">
            View All Transactions
          </Button>
        </CardFooter>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <CardBody className="text-center gap-4">
            <h3 className="font-bold">Deposit</h3>
            <p className="text-sm text-default-500">Add funds to the cartel treasury</p>
            <Button color="success" className="w-full" isDisabled={!isConnected}>
              Deposit MON
            </Button>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center gap-4">
            <h3 className="font-bold">Claim Rewards</h3>
            <p className="text-sm text-default-500">Claim your share of profits</p>
            <Button
              color="warning"
              className="w-full"
              isDisabled={!isConnected || parseFloat(treasuryStats.pendingRewards) === 0}
            >
              Claim {treasuryStats.pendingRewards} MON
            </Button>
          </CardBody>
        </Card>
        <Card className="p-4">
          <CardBody className="text-center gap-4">
            <h3 className="font-bold">Propose Spend</h3>
            <p className="text-sm text-default-500">Submit a treasury proposal</p>
            <Button color="primary" className="w-full" isDisabled={!isConnected}>
              New Proposal
            </Button>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
