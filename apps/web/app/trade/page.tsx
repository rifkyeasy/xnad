"use client";

import { useState } from "react";
import { Card, CardBody, CardFooter } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Button } from "@heroui/button";
import { Progress } from "@heroui/progress";
import { Spinner } from "@heroui/spinner";
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

import { usePublicClient } from "wagmi";
import { type Address } from "viem";
import { title } from "@/components/primitives";
import {
  useBuyToken,
  useSellToken,
  useBuyQuote,
  useSellQuote,
  useTokenBalance,
  useTokenProgress,
} from "@/hooks/useTrading";
import { erc20Abi } from "@/lib/contracts";

interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
}

export default function TradePage() {
  const { isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { buyToken, isPending: isBuying } = useBuyToken();
  const { sellToken, isPending: isSelling } = useSellToken();

  // Token input
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);
  const [loadingToken, setLoadingToken] = useState(false);
  const [tokenError, setTokenError] = useState<string | null>(null);

  // Trade modal
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tradeAmount, setTradeAmount] = useState("");
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quotes & balance for current token
  const { amountOut: buyQuote, isLoading: quoteLoading } = useBuyQuote(
    tokenInfo?.address || "",
    tradeType === "buy" ? tradeAmount : "0"
  );
  const { amountOut: sellQuote } = useSellQuote(
    tokenInfo?.address || "",
    tradeType === "sell" ? tradeAmount : "0"
  );
  const { balance: tokenBalance } = useTokenBalance(tokenInfo?.address || "");
  const { progress, isLoading: progressLoading } = useTokenProgress(tokenInfo?.address || "");

  // Load token from blockchain
  const loadToken = async () => {
    if (!tokenAddress || tokenAddress.length < 42 || !publicClient) return;

    setLoadingToken(true);
    setTokenError(null);

    try {
      // Read token info directly from blockchain
      const [symbol, name] = await Promise.all([
        publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: "symbol",
        }),
        publicClient.readContract({
          address: tokenAddress as Address,
          abi: erc20Abi,
          functionName: "name",
        }).catch(() => null), // name is optional
      ]);

      if (symbol) {
        setTokenInfo({
          address: tokenAddress,
          symbol: symbol as string,
          name: (name as string) || (symbol as string),
        });
      } else {
        setTokenError("Invalid token address");
      }
    } catch {
      setTokenError("Failed to load token - check address");
    } finally {
      setLoadingToken(false);
    }
  };

  const openTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    setTradeAmount("");
    setTxHash(null);
    setError(null);
    onOpen();
  };

  const handleTrade = async () => {
    if (!tokenInfo || !tradeAmount || !isConnected) return;

    setError(null);
    try {
      if (tradeType === "buy") {
        const result = await buyToken(tokenInfo.address, tradeAmount, 1);
        setTxHash(result.hash);
      } else {
        const result = await sellToken(tokenInfo.address, tradeAmount, 1);
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

  const clearToken = () => {
    setTokenInfo(null);
    setTokenAddress("");
    setTokenError(null);
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

      {/* Token Input */}
      <Card>
        <CardBody className="gap-4">
          <div className="flex gap-2">
            <Input
              label="Token Address"
              placeholder="0x... (paste nad.fun token address)"
              value={tokenAddress}
              onValueChange={setTokenAddress}
              className="flex-1"
            />
            <Button
              color="primary"
              onPress={loadToken}
              isLoading={loadingToken}
              isDisabled={!tokenAddress || tokenAddress.length < 42}
              className="self-end"
            >
              Load
            </Button>
          </div>

          {tokenError && (
            <p className="text-danger text-sm">{tokenError}</p>
          )}
        </CardBody>
      </Card>

      {/* Token Card */}
      {tokenInfo && (
        <Card>
          <CardBody className="gap-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">${tokenInfo.symbol}</span>
                  <Chip size="sm" color="success" variant="flat">
                    {progress >= 100 ? "graduated" : "live"}
                  </Chip>
                </div>
                <p className="text-default-500">{tokenInfo.name}</p>
              </div>
              <Button size="sm" variant="flat" onPress={clearToken}>
                Clear
              </Button>
            </div>

            {!progressLoading && progress < 100 && (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Graduation Progress</span>
                  <span className="font-medium">{progress.toFixed(1)}%</span>
                </div>
                <Progress value={progress} color="success" className="h-2" />
              </div>
            )}

            {parseFloat(tokenBalance) > 0 && (
              <div className="p-3 bg-default-100 rounded-lg">
                <p className="text-sm text-default-500">Your Balance</p>
                <p className="font-medium">{parseFloat(tokenBalance).toFixed(4)} tokens</p>
              </div>
            )}
          </CardBody>
          <CardFooter className="gap-2">
            <Button
              color="success"
              className="flex-1"
              onPress={() => openTrade("buy")}
              isDisabled={!isConnected}
            >
              Buy
            </Button>
            <Button
              color="danger"
              variant="flat"
              className="flex-1"
              onPress={() => openTrade("sell")}
              isDisabled={!isConnected}
            >
              Sell
            </Button>
            <Button
              variant="flat"
              as="a"
              href={`https://nad.fun/token/${tokenInfo.address}`}
              target="_blank"
            >
              nad.fun
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Empty State */}
      {!tokenInfo && !loadingToken && (
        <div className="text-center py-12 text-default-500">
          Enter a nad.fun token address above to start trading
        </div>
      )}

      {/* Trade Modal */}
      <Modal isOpen={isOpen} onClose={closeTrade}>
        <ModalContent>
          <ModalHeader>
            {tradeType === "buy" ? "Buy" : "Sell"} ${tokenInfo?.symbol}
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
