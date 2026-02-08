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
import { Input } from "@heroui/input";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useAccount } from "wagmi";

import { title } from "@/components/primitives";
import {
  useTokenLaunches,
  useCartelStats,
  useProposeLaunch,
  useVoteLaunch,
} from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import {
  useBuyToken,
  useSellToken,
  useBuyQuote,
  useSellQuote,
  useTokenBalance,
} from "@/hooks/useTrading";

export default function LaunchesPage() {
  const { address, isConnected } = useAccount();
  const { isLoading: launchesLoading } = useTokenLaunches();
  const { isLoading: statsLoading } = useCartelStats();
  const { launches, stats, agents } = useCartelStore();
  const { buyToken, isPending: isBuying, error: buyError } = useBuyToken();
  const { sellToken, isPending: isSelling, error: sellError } = useSellToken();
  const { mutate: proposeLaunch, isPending: isProposing } = useProposeLaunch();
  const { mutate: voteLaunch, isPending: isVoting } = useVoteLaunch();

  // Trade modal
  const { isOpen: isTradeOpen, onOpen: onTradeOpen, onClose: onTradeClose } = useDisclosure();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [slippage, setSlippage] = useState("1");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [tradeError, setTradeError] = useState<string | null>(null);

  // Get quote for selected token
  const { amountOut: buyQuote, isLoading: buyQuoteLoading } = useBuyQuote(
    selectedToken || "",
    tradeType === "buy" ? tradeAmount : "0"
  );
  const { amountOut: sellQuote, isLoading: sellQuoteLoading } = useSellQuote(
    selectedToken || "",
    tradeType === "sell" ? tradeAmount : "0"
  );
  const { balance: tokenBalance } = useTokenBalance(selectedToken || "");

  // Propose modal
  const { isOpen: isProposeOpen, onOpen: onProposeOpen, onClose: onProposeClose } = useDisclosure();
  const [proposeForm, setProposeForm] = useState({
    symbol: "",
    name: "",
    tokenAddress: "",
    investmentAmount: "1",
  });

  const activeLaunches = launches.filter((l) => l.status === "live");
  const graduatedTokens = launches.filter((l) => l.status === "graduated");
  const pendingLaunches = launches.filter((l) => l.status === "pending");

  const handleTrade = async () => {
    if (!selectedToken || !tradeAmount || !isConnected) return;

    setTradeError(null);
    setTxHash(null);

    try {
      const slippagePercent = parseFloat(slippage) || 1;

      if (tradeType === "buy") {
        const result = await buyToken(selectedToken, tradeAmount, slippagePercent);
        setTxHash(result.hash);
      } else {
        const result = await sellToken(selectedToken, tradeAmount, slippagePercent);
        setTxHash(result.hash);
      }
    } catch (error) {
      console.error("Trade error:", error);
      setTradeError(error instanceof Error ? error.message : "Transaction failed");
    }
  };

  const openTradeModal = (tokenAddress: string, type: "buy" | "sell") => {
    setSelectedToken(tokenAddress);
    setTradeType(type);
    setTradeAmount("");
    setTxHash(null);
    setTradeError(null);
    onTradeOpen();
  };

  const closeTradeModal = () => {
    onTradeClose();
    setTradeAmount("");
    setTxHash(null);
    setTradeError(null);
  };

  const handlePropose = () => {
    if (!proposeForm.symbol || !proposeForm.name) return;

    proposeLaunch(
      {
        symbol: proposeForm.symbol.toUpperCase(),
        name: proposeForm.name,
        tokenAddress: proposeForm.tokenAddress || undefined,
        proposedBy: address || "Anonymous",
        investmentAmount: proposeForm.investmentAmount,
      },
      {
        onSuccess: () => {
          onProposeClose();
          setProposeForm({ symbol: "", name: "", tokenAddress: "", investmentAmount: "1" });
        },
      }
    );
  };

  const handleVote = (launchId: string, vote: "yes" | "no") => {
    // Use first agent or connected wallet as voter
    const voterId = agents[0]?.id || address || "anonymous";
    voteLaunch({ launchId, agentId: voterId, vote });
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
                  <CardFooter>
                    <Button
                      variant="flat"
                      className="w-full"
                      as="a"
                      href={`https://nad.fun/token/${token.address}`}
                      target="_blank"
                    >
                      View on nad.fun
                    </Button>
                  </CardFooter>
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
                        <div className="text-right text-sm text-default-500">
                          {token.votes.yes + token.votes.no} total votes
                        </div>
                      </div>
                    )}
                  </CardBody>
                  <CardFooter className="gap-2">
                    <Button
                      color="success"
                      className="flex-1"
                      onPress={() => handleVote(token.id, "yes")}
                      isLoading={isVoting}
                    >
                      Vote Yes
                    </Button>
                    <Button
                      color="danger"
                      variant="flat"
                      className="flex-1"
                      onPress={() => handleVote(token.id, "no")}
                      isLoading={isVoting}
                    >
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
          <Button color="primary" size="lg" onPress={onProposeOpen}>
            Propose New Launch
          </Button>
        </CardBody>
      </Card>

      {/* Trade Modal */}
      <Modal isOpen={isTradeOpen} onClose={closeTradeModal} size="lg">
        <ModalContent>
          <ModalHeader>
            {tradeType === "buy" ? "Buy Token" : "Sell Token"}
          </ModalHeader>
          <ModalBody className="gap-4">
            {!isConnected && (
              <div className="p-3 bg-warning-100 text-warning-700 rounded-lg text-sm">
                Please connect your wallet to trade
              </div>
            )}

            {txHash ? (
              <div className="text-center py-4">
                <Chip color="success" size="lg" className="mb-4">Transaction Submitted</Chip>
                <p className="text-sm text-default-500 break-all">
                  TX: {txHash}
                </p>
                <Button
                  as="a"
                  href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                  target="_blank"
                  variant="flat"
                  className="mt-4"
                >
                  View on Explorer
                </Button>
              </div>
            ) : (
              <>
                {tradeType === "sell" && tokenBalance !== "0" && (
                  <div className="p-3 bg-default-100 rounded-lg">
                    <p className="text-sm text-default-500">Your Balance</p>
                    <p className="font-medium">{parseFloat(tokenBalance).toFixed(4)} tokens</p>
                  </div>
                )}

                <Input
                  label={tradeType === "buy" ? "Amount (MON)" : "Amount (tokens)"}
                  placeholder="Enter amount"
                  type="number"
                  value={tradeAmount}
                  onValueChange={setTradeAmount}
                  endContent={
                    tradeType === "sell" && tokenBalance !== "0" && (
                      <Button
                        size="sm"
                        variant="flat"
                        onPress={() => setTradeAmount(tokenBalance)}
                      >
                        MAX
                      </Button>
                    )
                  }
                />

                {tradeAmount && parseFloat(tradeAmount) > 0 && (
                  <div className="p-3 bg-default-100 rounded-lg">
                    <p className="text-sm text-default-500">Estimated Output</p>
                    {(buyQuoteLoading || sellQuoteLoading) ? (
                      <Skeleton className="h-5 w-24 rounded-lg mt-1" />
                    ) : (
                      <p className="font-medium">
                        {tradeType === "buy"
                          ? `${parseFloat(buyQuote).toFixed(4)} tokens`
                          : `${parseFloat(sellQuote).toFixed(4)} MON`}
                      </p>
                    )}
                  </div>
                )}

                <Input
                  label="Slippage Tolerance (%)"
                  placeholder="1"
                  type="number"
                  value={slippage}
                  onValueChange={setSlippage}
                  description="Transaction will revert if price changes more than this %"
                />

                {tradeError && (
                  <div className="p-3 bg-danger-100 text-danger-700 rounded-lg text-sm">
                    {tradeError}
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeTradeModal}>
              {txHash ? "Close" : "Cancel"}
            </Button>
            {!txHash && (
              <Button
                color={tradeType === "buy" ? "success" : "danger"}
                onPress={handleTrade}
                isLoading={isBuying || isSelling}
                isDisabled={!tradeAmount || parseFloat(tradeAmount) <= 0 || !isConnected}
              >
                {tradeType === "buy" ? "Buy" : "Sell"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Propose Launch Modal */}
      <Modal isOpen={isProposeOpen} onClose={onProposeClose} size="lg">
        <ModalContent>
          <ModalHeader>Propose New Token Launch</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Token Symbol"
              placeholder="e.g., CARTEL"
              value={proposeForm.symbol}
              onValueChange={(v) => setProposeForm({ ...proposeForm, symbol: v })}
              isRequired
            />
            <Input
              label="Token Name"
              placeholder="e.g., Cartel Token"
              value={proposeForm.name}
              onValueChange={(v) => setProposeForm({ ...proposeForm, name: v })}
              isRequired
            />
            <Input
              label="Token Address (optional)"
              placeholder="0x... (leave empty to create new)"
              value={proposeForm.tokenAddress}
              onValueChange={(v) => setProposeForm({ ...proposeForm, tokenAddress: v })}
              description="If you already deployed a token on nad.fun, paste its address"
            />
            <Input
              label="Initial Investment (MON)"
              placeholder="1"
              type="number"
              value={proposeForm.investmentAmount}
              onValueChange={(v) => setProposeForm({ ...proposeForm, investmentAmount: v })}
              description="Suggested initial investment from treasury"
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onProposeClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handlePropose}
              isLoading={isProposing}
              isDisabled={!proposeForm.symbol || !proposeForm.name}
            >
              Submit Proposal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
