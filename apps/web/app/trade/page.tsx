"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
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
import { useTokenLaunches } from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import {
  useBuyToken,
  useSellToken,
  useBuyQuote,
  useSellQuote,
  useTokenBalance,
} from "@/hooks/useTrading";

export default function TradePage() {
  const { isConnected } = useAccount();
  const { isLoading } = useTokenLaunches();
  const { launches } = useCartelStore();
  const { buyToken, isPending: isBuying } = useBuyToken();
  const { sellToken, isPending: isSelling } = useSellToken();

  // Trade modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedToken, setSelectedToken] = useState<{ address: string; symbol: string } | null>(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quotes
  const { amountOut: buyQuote, isLoading: quoteLoading } = useBuyQuote(
    selectedToken?.address || "",
    tradeType === "buy" ? tradeAmount : "0"
  );
  const { amountOut: sellQuote } = useSellQuote(
    selectedToken?.address || "",
    tradeType === "sell" ? tradeAmount : "0"
  );
  const { balance: tokenBalance } = useTokenBalance(selectedToken?.address || "");

  // All tradeable tokens
  const tokens = launches.filter((l) => l.status === "live" || l.status === "graduated");

  const openTrade = (token: { address: string; symbol: string }, type: "buy" | "sell") => {
    setSelectedToken(token);
    setTradeType(type);
    setTradeAmount("");
    setTxHash(null);
    setError(null);
    onOpen();
  };

  const handleTrade = async () => {
    if (!selectedToken || !tradeAmount || !isConnected) return;

    setError(null);
    try {
      if (tradeType === "buy") {
        const result = await buyToken(selectedToken.address, tradeAmount, 1);
        setTxHash(result.hash);
      } else {
        const result = await sellToken(selectedToken.address, tradeAmount, 1);
        setTxHash(result.hash);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed");
    }
  };

  const closeTrade = () => {
    onClose();
    setTradeAmount("");
    setTxHash(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className={title()}>Trade</h1>
        <p className="text-default-500 mt-2">Buy and sell tokens on nad.fun</p>
      </div>

      {!isConnected && (
        <Card className="bg-warning-50">
          <CardBody className="text-center text-warning-600">
            Connect wallet to trade
          </CardBody>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardBody className="gap-3">
                <Skeleton className="h-6 w-20 rounded-lg" />
                <Skeleton className="h-2 w-full rounded-lg" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-lg" />
                  <Skeleton className="h-9 flex-1 rounded-lg" />
                </div>
              </CardBody>
            </Card>
          ))
        ) : tokens.length > 0 ? (
          tokens.map((token) => (
            <Card key={token.id}>
              <CardBody className="gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">${token.symbol}</span>
                      <Chip
                        size="sm"
                        color={token.status === "graduated" ? "primary" : "success"}
                        variant="flat"
                      >
                        {token.status}
                      </Chip>
                    </div>
                    <p className="text-sm text-default-500">{token.name}</p>
                  </div>
                  <span className="text-sm font-medium">{token.marketCap} MON</span>
                </div>

                {token.status === "live" && (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Progress</span>
                      <span>{token.progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={token.progress} size="sm" color="success" />
                  </div>
                )}
              </CardBody>
              <CardFooter className="gap-2 pt-0">
                <Button
                  color="success"
                  size="sm"
                  className="flex-1"
                  onPress={() => openTrade({ address: token.address, symbol: token.symbol }, "buy")}
                  isDisabled={!isConnected}
                >
                  Buy
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  size="sm"
                  className="flex-1"
                  onPress={() => openTrade({ address: token.address, symbol: token.symbol }, "sell")}
                  isDisabled={!isConnected}
                >
                  Sell
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-default-500">
            No tokens available
          </div>
        )}
      </div>

      {/* Trade Modal */}
      <Modal isOpen={isOpen} onClose={closeTrade}>
        <ModalContent>
          <ModalHeader>
            {tradeType === "buy" ? "Buy" : "Sell"} ${selectedToken?.symbol}
          </ModalHeader>
          <ModalBody className="gap-4">
            {txHash ? (
              <div className="text-center py-4">
                <Chip color="success" size="lg" className="mb-3">Success</Chip>
                <p className="text-sm text-default-500 break-all mb-3">TX: {txHash}</p>
                <Button
                  as="a"
                  href={`https://testnet.monadexplorer.com/tx/${txHash}`}
                  target="_blank"
                  variant="flat"
                  size="sm"
                >
                  View on Explorer
                </Button>
              </div>
            ) : (
              <>
                {tradeType === "sell" && parseFloat(tokenBalance) > 0 && (
                  <div className="p-3 bg-default-100 rounded-lg text-sm">
                    Balance: <span className="font-medium">{parseFloat(tokenBalance).toFixed(4)}</span> tokens
                  </div>
                )}

                <Input
                  label={tradeType === "buy" ? "MON Amount" : "Token Amount"}
                  placeholder="0.0"
                  type="number"
                  value={tradeAmount}
                  onValueChange={setTradeAmount}
                  endContent={
                    tradeType === "sell" && parseFloat(tokenBalance) > 0 && (
                      <Button size="sm" variant="flat" onPress={() => setTradeAmount(tokenBalance)}>
                        MAX
                      </Button>
                    )
                  }
                />

                {tradeAmount && parseFloat(tradeAmount) > 0 && (
                  <div className="p-3 bg-default-100 rounded-lg text-sm">
                    You receive: {quoteLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <span className="font-medium">
                        {tradeType === "buy"
                          ? `${parseFloat(buyQuote).toFixed(4)} tokens`
                          : `${parseFloat(sellQuote).toFixed(4)} MON`}
                      </span>
                    )}
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-danger-100 text-danger-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={closeTrade}>
              {txHash ? "Close" : "Cancel"}
            </Button>
            {!txHash && (
              <Button
                color={tradeType === "buy" ? "success" : "danger"}
                onPress={handleTrade}
                isLoading={isBuying || isSelling}
                isDisabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
              >
                {tradeType === "buy" ? "Buy" : "Sell"}
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
