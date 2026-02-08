"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Chip,
  Switch,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Progress,
  Divider,
} from "@heroui/react";
import { useState } from "react";
import { useVault } from "@/hooks/useVault";
import { useAgentStore, type Position } from "@/stores/agent";

const strategyColors = {
  CONSERVATIVE: "success" as const,
  BALANCED: "primary" as const,
  AGGRESSIVE: "danger" as const,
};

const strategyLabels = {
  CONSERVATIVE: "Conservative",
  BALANCED: "Balanced",
  AGGRESSIVE: "Aggressive",
};

interface AgentDashboardProps {
  vaultAddress: string;
}

export function AgentDashboard({ vaultAddress }: AgentDashboardProps) {
  const {
    balance,
    strategyType,
    paused,
    isConfirming,
    deposit,
    withdraw,
    setPaused,
    refetchBalance,
  } = useVault(vaultAddress);

  const {
    selectedStrategy,
    autoTrade,
    autoRebalance,
    stopLossPercent,
    takeProfitPercent,
    positions,
    setAutoTrade,
    setAutoRebalance,
  } = useAgentStore();

  const depositModal = useDisclosure();
  const withdrawModal = useDisclosure();

  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const handleDeposit = async () => {
    if (!depositAmount) return;
    try {
      await deposit(depositAmount);
      setDepositAmount("");
      depositModal.onClose();
      refetchBalance();
    } catch (error) {
      console.error("Deposit failed:", error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount("");
      withdrawModal.onClose();
      refetchBalance();
    } catch (error) {
      console.error("Withdraw failed:", error);
    }
  };

  const strategyKey = selectedStrategy || (strategyType === 0 ? "CONSERVATIVE" : strategyType === 2 ? "AGGRESSIVE" : "BALANCED");

  // Calculate total portfolio value
  const totalPositionValue = positions.reduce(
    (sum, p) => sum + parseFloat(p.currentValue),
    0
  );
  const totalValue = parseFloat(balance) + totalPositionValue;
  const totalPnl = positions.reduce(
    (sum, p) => sum + parseFloat(p.unrealizedPnl),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <Card>
        <CardBody className="flex flex-row justify-between items-center">
          <div className="flex items-center gap-4">
            <Chip color={strategyColors[strategyKey]} size="lg">
              {strategyLabels[strategyKey]}
            </Chip>
            <div>
              <p className="text-sm text-default-500">Vault Balance</p>
              <p className="text-2xl font-bold">{parseFloat(balance).toFixed(4)} MON</p>
            </div>
            <Divider orientation="vertical" className="h-12" />
            <div>
              <p className="text-sm text-default-500">Total Value</p>
              <p className="text-2xl font-bold">{totalValue.toFixed(4)} MON</p>
            </div>
            <div>
              <p className="text-sm text-default-500">Unrealized P&L</p>
              <p className={`text-xl font-bold ${totalPnl >= 0 ? "text-success" : "text-danger"}`}>
                {totalPnl >= 0 ? "+" : ""}{totalPnl.toFixed(4)} MON
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="flat" onPress={depositModal.onOpen}>
              Deposit
            </Button>
            <Button variant="flat" onPress={withdrawModal.onOpen}>
              Withdraw
            </Button>
            <Button
              color={paused ? "success" : "danger"}
              variant="flat"
              onPress={() => setPaused(!paused)}
              isLoading={isConfirming}
            >
              {paused ? "Resume Agent" : "Pause Agent"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Positions */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Current Positions</h2>
        </CardHeader>
        <CardBody>
          {positions.length === 0 ? (
            <p className="text-default-500 text-center py-8">
              No positions yet. The agent will start trading based on signals.
            </p>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => (
                <PositionCard key={position.tokenAddress} position={position} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-bold">Automation</h2>
        </CardHeader>
        <CardBody className="gap-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto-Trade</p>
              <p className="text-sm text-default-500">
                Automatically execute trades based on AI signals
              </p>
            </div>
            <Switch
              isSelected={autoTrade}
              onValueChange={setAutoTrade}
              color="success"
            />
          </div>

          <Divider />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Auto-Rebalance</p>
              <p className="text-sm text-default-500">
                Automatically rebalance portfolio to target allocations
              </p>
            </div>
            <Switch
              isSelected={autoRebalance}
              onValueChange={setAutoRebalance}
              color="success"
            />
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Stop-Loss</p>
              <Chip color="danger" variant="flat">
                {stopLossPercent ? `-${stopLossPercent}%` : "Not set"}
              </Chip>
            </div>
            <div>
              <p className="font-medium mb-2">Take-Profit</p>
              <Chip color="success" variant="flat">
                {takeProfitPercent ? `+${takeProfitPercent}%` : "Not set"}
              </Chip>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Deposit Modal */}
      <Modal isOpen={depositModal.isOpen} onClose={depositModal.onClose}>
        <ModalContent>
          <ModalHeader>Deposit MON</ModalHeader>
          <ModalBody>
            <Input
              label="Amount"
              placeholder="0.0"
              type="number"
              value={depositAmount}
              onValueChange={setDepositAmount}
              endContent={<span className="text-default-400">MON</span>}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={depositModal.onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleDeposit}
              isLoading={isConfirming}
            >
              Deposit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Withdraw Modal */}
      <Modal isOpen={withdrawModal.isOpen} onClose={withdrawModal.onClose}>
        <ModalContent>
          <ModalHeader>Withdraw MON</ModalHeader>
          <ModalBody>
            <Input
              label="Amount"
              placeholder="0.0"
              type="number"
              value={withdrawAmount}
              onValueChange={setWithdrawAmount}
              endContent={<span className="text-default-400">MON</span>}
              description={`Available: ${balance} MON`}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={withdrawModal.onClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleWithdraw}
              isLoading={isConfirming}
            >
              Withdraw
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function PositionCard({ position }: { position: Position }) {
  const pnlPercent = position.unrealizedPnlPct;
  const isProfit = pnlPercent >= 0;

  return (
    <div className="flex justify-between items-center p-4 bg-default-100 rounded-lg">
      <div>
        <p className="font-bold">{position.tokenSymbol}</p>
        <p className="text-sm text-default-500 font-mono">
          {position.tokenAddress.slice(0, 6)}...{position.tokenAddress.slice(-4)}
        </p>
      </div>
      <div className="text-right">
        <p className="font-medium">{parseFloat(position.balance).toFixed(4)} tokens</p>
        <p className="text-sm text-default-500">
          Value: {parseFloat(position.currentValue).toFixed(4)} MON
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isProfit ? "text-success" : "text-danger"}`}>
          {isProfit ? "+" : ""}{pnlPercent.toFixed(2)}%
        </p>
        <p className={`text-sm ${isProfit ? "text-success" : "text-danger"}`}>
          {isProfit ? "+" : ""}{parseFloat(position.unrealizedPnl).toFixed(4)} MON
        </p>
      </div>
      <Progress
        value={Math.min(Math.abs(pnlPercent), 100)}
        color={isProfit ? "success" : "danger"}
        className="w-20"
        size="sm"
      />
    </div>
  );
}
