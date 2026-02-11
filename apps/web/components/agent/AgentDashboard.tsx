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
import { Spinner } from '@heroui/spinner';
import { useState } from 'react';

import { useVault } from '@/hooks/useVault';
import { usePositions, useUserSettings, useTradeHistory } from '@/hooks/usePositions';
import { useAgentStore, type Position } from '@/stores/agent';
import { txToast } from '@/components/TxToast';

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
      txToast('error', error instanceof Error ? error.message : 'Deposit failed');
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
      txToast('error', error instanceof Error ? error.message : 'Withdraw failed');
    }
  };

  const strategyKey =
    selectedStrategy ||
    (strategyType === 0 ? 'CONSERVATIVE' : strategyType === 2 ? 'AGGRESSIVE' : 'BALANCED');

  const totalPositionValue = positions.reduce((sum, p) => sum + parseFloat(p.currentValue), 0);
  const totalValue = parseFloat(balance) + totalPositionValue;
  const totalPnl = positions.reduce((sum, p) => sum + parseFloat(p.unrealizedPnl), 0);

  return (
    <div className="flex flex-col gap-4">
      {/* Stats + Actions */}
      <Card className="border border-success/40 shadow-none bg-transparent">
        <CardBody className="p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Strategy</p>
              <Chip className="mt-1" color={strategyColors[strategyKey]} size="sm">
                {strategyLabels[strategyKey]}
              </Chip>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Vault</p>
              <p className="text-lg font-bold mt-0.5">{parseFloat(balance).toFixed(2)} MON</p>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">Total Value</p>
              <p className="text-lg font-bold mt-0.5">{totalValue.toFixed(2)} MON</p>
            </div>
            <div>
              <p className="text-xs text-default-500 uppercase tracking-wider">P&L</p>
              <p
                className={`text-lg font-bold mt-0.5 ${totalPnl >= 0 ? 'text-success' : 'text-danger'}`}
              >
                {totalPnl >= 0 ? '+' : ''}
                {totalPnl.toFixed(2)} MON
              </p>
            </div>
          </div>
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
              {paused ? 'Resume' : 'Pause'}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Positions */}
      <Card className="border border-success/40 shadow-none bg-transparent">
        <CardHeader className="flex flex-row justify-between items-center pb-0">
          <h2 className="text-sm font-bold">Positions</h2>
          <Button
            isLoading={positionsLoading}
            size="sm"
            variant="light"
            onPress={() => refetchPositions()}
          >
            Refresh
          </Button>
        </CardHeader>
        <CardBody>
          {positionsLoading && positions.length === 0 ? (
            <div className="flex justify-center py-6">
              <Spinner size="sm" />
            </div>
          ) : positions.length === 0 ? (
            <p className="text-default-500 text-center text-sm py-6">
              No positions yet. The agent will trade based on signals.
            </p>
          ) : (
            <div className="space-y-2">
              {positions.map((position) => (
                <PositionCard key={position.tokenAddress} position={position} />
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Automation */}
      <Card className="border border-success/40 shadow-none bg-transparent">
        <CardHeader className="pb-0">
          <h2 className="text-sm font-bold">Automation</h2>
        </CardHeader>
        <CardBody className="gap-4">
          <div className="flex justify-between items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Auto-Trade</p>
              <p className="text-xs text-default-500">Execute trades from AI signals</p>
            </div>
            <Switch
              color="success"
              isDisabled={settingsLoading}
              isSelected={autoTrade}
              size="sm"
              onValueChange={handleAutoTradeChange}
            />
          </div>
          <div className="flex justify-between items-center gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">Auto-Rebalance</p>
              <p className="text-xs text-default-500">Rebalance to target allocations</p>
            </div>
            <Switch
              color="success"
              isDisabled={settingsLoading}
              isSelected={autoRebalance}
              size="sm"
              onValueChange={handleAutoRebalanceChange}
            />
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-default-500">Stop-Loss</span>
              <Chip color="danger" size="sm" variant="flat">
                {stopLossPercent ? `-${stopLossPercent}%` : 'N/A'}
              </Chip>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-default-500">Take-Profit</span>
              <Chip color="success" size="sm" variant="flat">
                {takeProfitPercent ? `+${takeProfitPercent}%` : 'N/A'}
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
    <div className="flex items-center justify-between gap-3 p-3 bg-default-100 rounded-lg">
      <div className="min-w-0">
        <p className="font-bold text-sm">{position.tokenSymbol}</p>
        <p className="text-xs text-default-500 font-mono">
          {position.tokenAddress.slice(0, 6)}...{position.tokenAddress.slice(-4)}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm">{parseFloat(position.currentValue).toFixed(2)} MON</p>
        <div className="flex items-center gap-2 justify-end">
          <p className={`text-xs font-bold ${isProfit ? 'text-success' : 'text-danger'}`}>
            {isProfit ? '+' : ''}
            {pnlPercent.toFixed(2)}%
          </p>
          <Progress
            className="w-12"
            color={isProfit ? 'success' : 'danger'}
            size="sm"
            value={Math.min(Math.abs(pnlPercent), 100)}
          />
        </div>
      </div>
    </div>
  );
}
