"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { useAccount } from "wagmi";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";

import { title } from "@/components/primitives";
import {
  useCartelStats,
  useTokenLaunches,
  useInitializeCartel,
  useUpdateTreasuryWallet,
  useResetCartel,
} from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import { truncateAddress } from "@/lib/api";

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [treasuryWallet, setTreasuryWallet] = useState("");
  const [newTreasuryWallet, setNewTreasuryWallet] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: cartelData, isLoading: statsLoading } = useCartelStats();
  const { isLoading: launchesLoading } = useTokenLaunches();
  const { mutate: initCartel, isPending: isInitializing } = useInitializeCartel();
  const { mutate: updateTreasury, isPending: isUpdating } = useUpdateTreasuryWallet();
  const { mutate: resetCartel, isPending: isResetting } = useResetCartel();

  const { stats, currentLaunch } = useCartelStore();
  const isLoading = statsLoading || launchesLoading;
  const isInitialized = cartelData?.initialized;

  const handleUpdateTreasury = () => {
    if (!newTreasuryWallet) return;
    updateTreasury(newTreasuryWallet, {
      onSuccess: () => {
        onClose();
        setNewTreasuryWallet("");
      },
    });
  };

  const handleReset = () => {
    if (confirm("Reset cartel? This deletes all data.")) {
      resetCartel();
      onClose();
    }
  };

  // Show initialization UI if not set up
  if (!statsLoading && !isInitialized) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
        <h1 className={title()}>Initialize Cartel</h1>
        <p className="text-default-500 text-center max-w-md">
          Set up your cartel with a treasury wallet address.
        </p>
        <Card className="w-full max-w-md p-4">
          <CardBody className="gap-4">
            <Input
              label="Treasury Wallet"
              placeholder="0x..."
              value={treasuryWallet || (isConnected ? address : "")}
              onValueChange={setTreasuryWallet}
            />
            <Button
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isInitializing}
              onPress={() => initCartel({ treasuryWallet: treasuryWallet || address || "" })}
              isDisabled={!treasuryWallet && !address}
            >
              Initialize
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className={title()}>Dashboard</h1>
            {isLoading && <Spinner size="sm" />}
          </div>
          <p className="text-default-500 mt-1">Agent Cartel on nad.fun</p>
        </div>
        <Button variant="flat" size="sm" onPress={onOpen}>
          Settings
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Members</p>
            {statsLoading ? (
              <Skeleton className="h-8 w-12 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold">{stats.members}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Treasury</p>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold">{stats.treasury} MON</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Graduated</p>
            {statsLoading ? (
              <Skeleton className="h-8 w-8 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold">{stats.tokensGraduated}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center py-4">
            <p className="text-default-500 text-sm">Profit</p>
            {statsLoading ? (
              <Skeleton className="h-8 w-16 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-2xl font-bold text-success">{stats.totalProfit} MON</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Current Launch */}
      <Card className="p-2">
        <CardHeader className="flex justify-between">
          <div>
            <h2 className="text-lg font-bold">Current Token</h2>
            <p className="text-default-500 text-sm">Active launch being supported</p>
          </div>
          {currentLaunch && (
            <Chip color="success" variant="dot">Live</Chip>
          )}
        </CardHeader>
        <Divider />
        <CardBody className="gap-4">
          {launchesLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-6 w-24 rounded-lg" />
              <Skeleton className="h-2 w-full rounded-lg" />
            </div>
          ) : currentLaunch ? (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-bold">${currentLaunch.symbol}</p>
                  <p className="text-default-500 text-sm">{currentLaunch.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{currentLaunch.marketCap} MON</p>
                  <p className="text-sm text-default-500">{currentLaunch.holders} holders</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Graduation</span>
                  <span className="font-medium">{currentLaunch.progress.toFixed(1)}%</span>
                </div>
                <Progress value={currentLaunch.progress} color="success" className="h-2" />
              </div>
            </>
          ) : (
            <div className="text-center py-6 text-default-500">
              No active launch
            </div>
          )}
        </CardBody>
        <CardFooter className="gap-2">
          <Button
            color="primary"
            className="flex-1"
            as="a"
            href="/trade"
          >
            Trade Tokens
          </Button>
          {currentLaunch && (
            <Button
              variant="flat"
              as="a"
              href={`https://nad.fun/token/${currentLaunch.address}`}
              target="_blank"
            >
              nad.fun
            </Button>
          )}
        </CardFooter>
      </Card>

      {/* Settings Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>Settings</ModalHeader>
          <ModalBody className="gap-4">
            <div className="p-3 bg-default-100 rounded-lg">
              <p className="text-sm text-default-500">Treasury Wallet</p>
              <p className="font-mono text-sm break-all">
                {cartelData?.treasuryWallet || "Not set"}
              </p>
            </div>

            <Input
              label="New Treasury Wallet"
              placeholder="0x..."
              value={newTreasuryWallet}
              onValueChange={setNewTreasuryWallet}
            />

            {isConnected && (
              <Button
                variant="flat"
                size="sm"
                onPress={() => setNewTreasuryWallet(address || "")}
              >
                Use Connected ({truncateAddress(address || "")})
              </Button>
            )}

            <Button
              color="primary"
              isLoading={isUpdating}
              onPress={handleUpdateTreasury}
              isDisabled={!newTreasuryWallet}
            >
              Update Treasury
            </Button>

            <Divider />

            <Button
              color="danger"
              variant="flat"
              isLoading={isResetting}
              onPress={handleReset}
            >
              Reset Cartel
            </Button>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
