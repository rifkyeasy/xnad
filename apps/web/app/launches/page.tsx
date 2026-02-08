"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Tabs, Tab } from "@heroui/tabs";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input" ;
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { title } from "@/components/primitives";
import { useTokenLaunches, useCartelStats, useBuyToken, useSellToken } from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";

export default function LaunchesPage() {
  const { isLoading: launchesLoading } = useTokenLaunches();
  const { isLoading: statsLoading } = useCartelStats();
  const { launches, stats } = useCartelStore();
  const { buyToken, isPending: isBuying } = useBuyToken();
  const { sellToken, isPending: isSelling } = useSellToken();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");

  const activeLaunches = launches.filter((l) => l.status === "live");
  const graduatedTokens = launches.filter((l) => l.status === "graduated");
  const pendingLaunches = launches.filter((l) => l.status === "pending");

  const handleTrade = async () => {
    if (!selectedToken || !tradeAmount) return;

    try {
      if (tradeType === "buy") {
        await buyToken(selectedToken, tradeAmount);
      } else {
        await sellToken(selectedToken, tradeAmount);
      }
      onClose();
      setTradeAmount("");
    } catch (error) {
      console.error("Trade error:", error);
    }
  };

  const openTradeModal = (tokenAddress: string, type: "buy" | "sell") => {
    setSelectedToken(tokenAddress);
    setTradeType(type);
    onOpen();
  };

  const isLoading = launchesLoading || statsLoading;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className={title()}>Token Launches</h1>
          {isLoading && <Spinner size="sm" />}
        </div>
        <p className="text-default-500">
          Track and manage cartel token launches on nad.fun
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Active Launches</p>
            {isLoading ? (
              <Skeleton className="h-8 w-8 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold">{activeLaunches.length}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Graduated</p>
            {isLoading ? (
              <Skeleton className="h-8 w-8 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-success">{stats.tokensGraduated}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Total Profit</p>
            {isLoading ? (
              <Skeleton className="h-8 w-20 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-success">{stats.totalProfit} MON</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Pending Votes</p>
            {isLoading ? (
              <Skeleton className="h-8 w-8 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-warning">{pendingLaunches.length}</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs aria-label="Launch categories" color="primary" variant="bordered">
        {/* Active Tab */}
        <Tab key="active" title={`Active (${activeLaunches.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {isLoading ? (
              Array.from({ length: 2 }).map((_, i) => (
                <Card key={i} className="p-2">
                  <CardHeader>
                    <Skeleton className="h-6 w-24 rounded-lg" />
                  </CardHeader>
                  <Divider />
                  <CardBody className="gap-4">
                    <Skeleton className="h-3 w-full rounded-lg" />
                    <Skeleton className="h-16 w-full rounded-lg" />
                  </CardBody>
                </Card>
              ))
            ) : activeLaunches.length > 0 ? (
              activeLaunches.map((token) => (
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
                        <span className="text-sm font-medium">{token.progress.toFixed(1)}%</span>
                      </div>
                      <Progress value={token.progress} color="success" className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-default-500">Market Cap</p>
                        <p className="font-medium">{token.marketCap} MON</p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500">24h Volume</p>
                        <p className="font-medium">{token.volume24h} MON</p>
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
                    <Button
                      color="success"
                      className="flex-1"
                      onPress={() => openTradeModal(token.address, "buy")}
                    >
                      Buy
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      className="flex-1"
                      onPress={() => openTradeModal(token.address, "sell")}
                    >
                      Sell
                    </Button>
                    <Button
                      variant="flat"
                      as="a"
                      href={`https://nad.fun/token/${token.address}`}
                      target="_blank"
                    >
                      nad.fun
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-12 text-default-500">
                No active launches. Create a new token to get started!
              </div>
            )}
          </div>
        </Tab>

        {/* Graduated Tab */}
        <Tab key="graduated" title={`Graduated (${graduatedTokens.length})`}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-2">
                  <CardHeader>
                    <Skeleton className="h-5 w-20 rounded-lg" />
                  </CardHeader>
                  <Divider />
                  <CardBody className="gap-3">
                    <Skeleton className="h-4 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                  </CardBody>
                </Card>
              ))
            ) : graduatedTokens.length > 0 ? (
              graduatedTokens.map((token) => (
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
                      <span className="text-sm text-default-500">Market Cap</span>
                      <span className="font-medium">{token.marketCap} MON</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-default-500">Holders</span>
                      <span className="font-medium">{token.holders}</span>
                    </div>
                    {token.profit && (
                      <div className="flex justify-between">
                        <span className="text-sm text-default-500">Profit</span>
                        <span className="font-medium text-success">+{token.profit} MON</span>
                      </div>
                    )}
                    {token.profitPercent && (
                      <div className="flex justify-between">
                        <span className="text-sm text-default-500">ROI</span>
                        <span className="font-medium text-success">+{token.profitPercent}%</span>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 text-default-500">
                No graduated tokens yet. Keep pushing launches to graduation!
              </div>
            )}
          </div>
        </Tab>

        {/* Pending Tab */}
        <Tab key="pending" title={`Pending (${pendingLaunches.length})`}>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {pendingLaunches.length > 0 ? (
              pendingLaunches.map((token) => (
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
                    {token.creator && (
                      <div className="text-right">
                        <p className="text-xs text-default-500">Proposed by</p>
                        <p className="text-sm">{token.creator}</p>
                      </div>
                    )}
                  </CardHeader>
                  <Divider />
                  <CardBody>
                    {token.votes && (
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
                      </div>
                    )}
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
              ))
            ) : (
              <div className="text-center py-12 text-default-500">
                No pending proposals. Propose a new token launch!
              </div>
            )}
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

      {/* Trade Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {tradeType === "buy" ? "Buy Token" : "Sell Token"}
          </ModalHeader>
          <ModalBody>
            <Input
              label={tradeType === "buy" ? "Amount (MON)" : "Amount (tokens)"}
              placeholder="Enter amount"
              type="number"
              value={tradeAmount}
              onValueChange={setTradeAmount}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancel
            </Button>
            <Button
              color={tradeType === "buy" ? "success" : "danger"}
              onPress={handleTrade}
              isLoading={isBuying || isSelling}
            >
              {tradeType === "buy" ? "Buy" : "Sell"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
