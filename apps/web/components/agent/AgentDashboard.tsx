'use client';

import { Card, CardBody, CardHeader } from '@heroui/card';
import { Button } from '@heroui/button';
import { Chip } from '@heroui/chip';
import { Switch } from '@heroui/switch';
import { Input } from '@heroui/input';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/modal';
import { Progress } from '@heroui/progress';
import { Divider } from '@heroui/divider';
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';

import { useVault } from '@/hooks/useVault';
import { usePositions, useUserSettings, useTradeHistory } from '@/hooks/usePositions';
import { useAgentStore, type Position } from '@/stores/agent';

const strategyColors = {
  CONSERVATIVE: 'success' as const,
  BALANCED: 'primary' as const,
  AGGRESSIVE: 'danger' as const,
};

const strategyLabels = {
  CONSERVATIVE: 'Conservative',
  BALANCED: 'Balanced',
  AGGRESSIVE: 'Aggressive',
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
    positions: backendPositions,
    isLoading: positionsLoading,
    refetch: refetchPositions,
  } = usePositions();

  const { settings, isLoading: settingsLoading, updateSettings } = useUserSettings();

  // Keep trade history hook for future use
  useTradeHistory(10);

  const { selectedStrategy } = useAgentStore();

  const positions = backendPositions.length > 0 ? backendPositions : [];
  const autoTrade = settings.autoTrade;
  const autoRebalance = settings.autoRebalance;
  const stopLossPercent = settings.stopLossPercent;
  const takeProfitPercent = settings.takeProfitPercent;

  const handleAutoTradeChange = async (value: boolean) => {
    await updateSettings({ autoTrade: value });
  };

  const handleAutoRebalanceChange = async (value: boolean) => {
    await updateSettings({ autoRebalance: value });
  };

  const depositModal = useDisclosure();
  const withdrawModal = useDisclosure();

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  const handleDeposit = async () => {
    if (!depositAmount) return;
    try {
      await deposit(depositAmount);
      setDepositAmount('');
      depositModal.onClose();
      refetchBalance();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Deposit failed:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    try {
      await withdraw(withdrawAmount);
      setWithdrawAmount('');
      withdrawModal.onClose();
      refetchBalance();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Withdraw failed:', error);
    }
  };

  const strategyKey =
    selectedStrategy ||
    (strategyType === 0 ? 'CONSERVATIVE' : strategyType === 2 ? 'AGGRESSIVE' : 'BALANCED');

  const totalPositionValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
  const totalValue = parseFloat(balance) + totalPositionValue;
  const totalPnl = positions.reduce((sum, p) => sum + parseFloat(p.unrealizedPnl), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Card */}
      <Card className="border border-default-200">
        <CardBody className="p-4 sm:p-6">
          {/* Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Strategy</p>
              <Chip className="mt-1" color={strategyColors[strategyKey]} size="sm">
                {strategyLabels[strategyKey]}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Vault Balance</p>
              <p className="text-xl font-bold mt-1">{parseFloat(balance).toFixed(4)} MON</p>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Total Value</p>
              <p className="text-xl font-bold mt-1">{totalValue.toFixed(4)} MON</p>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">P&L</p>
              <p
                className={`text-xl font-bold mt-1 ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}
              >
                {totalPnl >= 0 ? '+' : ''}
                {totalPnl.toFixed(4)} MON
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="flat" onPress={depositModal.onOpen}>
              Deposit
            </Button>
            <Button size="sm" variant="flat" onPress={withdrawModal.onOpen}>
              Withdraw
            </Button>
            <Button
              color={paused ? 'success' : 'danger'}
              isLoading={isConfirming}
              size="sm"
              variant="flat"
              onPress={() => setPaused(!paused)}
            >
              {paused ? 'Resume Agent' : 'Pause Agent'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Positions */}
      <Card className="border border-default-200">
        <CardHeader className="flex flex-row justify-between items-center">
          <h2 className="text-lg font-bold">Current Positions</h2>
          <Button isLoading={positionsLoading} size="sm" variant="flat" onPress={refetchPositions}>
            Refresh
          </Button>
        </CardHeader>
        <CardBody>
          {positionsLoading && positions.length === 0 ? (
            <div className="flex justify-center py-8">
              <Spinner />
            </div>
          ) : positions.length === 0 ? (
            <p className="text-default-500 text-center py-8">
              No positions yet. The agent will start trading based on signals.
            </p>
          ) : (
            <div className="space-y-3">
              {positions.map((position) => (
                <PositionCard key={position.tokenAddress} position={position} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Automation Settings */}
      <Card className="border border-default-200">
        <CardHeader>
          <h2 className="text-lg font-bold">Automation</h2>
        </CardHeader>
        <CardBody className="gap-6">
          <div className="flex justify-between items-center gap-4">
            <div className="min-w-0">
              <p className="font-medium">Auto-Trade</p>
              <p className="text-sm text-default-500">
                Automatically execute trades based on AI signals
              </p>
            </div>
            <Switch
              color="success"
              isDisabled={settingsLoading}
              isSelected={autoTrade}
              onValueChange={handleAutoTradeChange}
            />
          </div>

          <Divider />

          <div className="flex justify-between items-center gap-4">
            <div className="min-w-0">
              <p className="font-medium">Auto-Rebalance</p>
              <p className="text-sm text-default-500">
                Automatically rebalance portfolio to target allocations
              </p>
            </div>
            <Switch
              color="success"
              isDisabled={settingsLoading}
              isSelected={autoRebalance}
              onValueChange={handleAutoRebalanceChange}
            />
          </div>

          <Divider />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-medium mb-2">Stop-Loss</p>
              <Chip color="danger" variant="flat">
                {stopLossPercent ? `-${stopLossPercent}%` : 'Not set'}
              </Chip>
            </div>
            <div>
              <p className="font-medium mb-2">Take-Profit</p>
              <Chip color="success" variant="flat">
                {takeProfitPercent ? `+${takeProfitPercent}%` : 'Not set'}
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
              endContent={<span className="text-default-400">MON</span>}
              label="Amount"
              placeholder="0.0"
              type="number"
              value={depositAmount}
              onValueChange={setDepositAmount}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={depositModal.onClose}>
              Cancel
            </Button>
            <Button color="primary" isLoading={isConfirming} onPress={handleDeposit}>
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
              description={`Available: ${balance} MON`}
              endContent={<span className="text-default-400">MON</span>}
              label="Amount"
              placeholder="0.0"
              type="number"
              value={withdrawAmount}
              onValueChange={setWithdrawAmount}
            />
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={withdrawModal.onClose}>
              Cancel
            </Button>
            <Button color="primary" isLoading={isConfirming} onPress={handleWithdraw}>
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-default-100 rounded-xl">
      <div className="min-w-0">
        <p className="font-bold">{position.tokenSymbol}</p>
        <p className="text-sm text-default-500 font-mono">
          {position.tokenAddress.slice(0, 6)}...{position.tokenAddress.slice(-4)}
        </p>
      </div>
      <div className="text-left sm:text-right">
        <p className="font-medium">{parseFloat(position.balance).toFixed(4)} tokens</p>
        <p className="text-sm text-default-500">
          Value: {parseFloat(position.currentValue).toFixed(4)} MON
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-left sm:text-right">
          <p className={`font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
            {isProfit ? '+' : ''}
            {pnlPercent.toFixed(2)}%
          </p>
          <p className={`text-sm ${isProfit ? 'text-success' : 'text-danger'}`}>
            {isProfit ? '+' : ''}
            {parseFloat(position.unrealizedPnl).toFixed(4)} MON
          </p>
        </div>
        <Progress
          className="w-16 sm:w-20"
          color={isProfit ? 'success' : 'danger'}
          size="sm"
          value={Math.min(Math.abs(pnlPercent), 100)}
        />
      </div>
    </div>
  );
}
