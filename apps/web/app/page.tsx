"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Progress } from "@heroui/progress";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";
import { Skeleton } from "@heroui/skeleton";
import { Input } from "@heroui/input";
import { useAccount } from "wagmi";

import { title } from "@/components/primitives";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import {
  useCartelStats,
  useTokenLaunches,
  useActivityFeed,
  useAgentsData,
  useInitializeCartel,
  useUpdateTreasuryWallet,
  useResetCartel,
} from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import { truncateAddress } from "@/lib/api";

const tierColors: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Boss: "warning",
  Capo: "primary",
  Soldier: "secondary",
  Associate: "default",
};

const actionColors: Record<string, "success" | "primary" | "warning" | "secondary"> = {
  trade: "success",
  social: "primary",
  coordination: "warning",
  governance: "secondary",
};

export default function Dashboard() {
  const { address, isConnected } = useAccount();
  const [treasuryWallet, setTreasuryWallet] = useState("");
  const [newTreasuryWallet, setNewTreasuryWallet] = useState("");

  // Settings modal
  const { isOpen: isSettingsOpen, onOpen: onSettingsOpen, onClose: onSettingsClose } = useDisclosure();

  // Fetch live data
  const { data: cartelData, isLoading: statsLoading } = useCartelStats();
  const { isLoading: launchesLoading } = useTokenLaunches();
  const { isLoading: activityLoading } = useActivityFeed();
  const { isLoading: agentsLoading } = useAgentsData();
  const { mutate: initCartel, isPending: isInitializing } = useInitializeCartel();
  const { mutate: updateTreasury, isPending: isUpdatingTreasury } = useUpdateTreasuryWallet();
  const { mutate: resetCartel, isPending: isResetting } = useResetCartel();

  // Get data from store
  const { stats, currentLaunch, activities, agents } = useCartelStore();

  const isLoading = statsLoading || launchesLoading || activityLoading || agentsLoading;
  const isInitialized = cartelData?.initialized;

  const handleUpdateTreasury = () => {
    if (!newTreasuryWallet) return;
    updateTreasury(newTreasuryWallet, {
      onSuccess: () => {
        onSettingsClose();
        setNewTreasuryWallet("");
      },
    });
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset the cartel? This will delete all data.")) {
      resetCartel();
      onSettingsClose();
    }
  };

  // Show initialization UI if cartel not set up
  if (!statsLoading && !isInitialized) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-[60vh]">
        <h1 className={title()}>Initialize Agent Cartel</h1>
        <p className="text-default-500 text-center max-w-md">
          Set up your cartel by providing a treasury wallet address. This wallet will hold shared funds.
        </p>
        <Card className="w-full max-w-md p-4">
          <CardBody className="gap-4">
            <Input
              label="Treasury Wallet Address"
              placeholder="0x..."
              value={treasuryWallet || (isConnected ? address : "")}
              onValueChange={setTreasuryWallet}
              description="The wallet that will manage cartel funds"
            />
            <Button
              color="primary"
              size="lg"
              className="w-full"
              isLoading={isInitializing}
              onPress={() => initCartel({ treasuryWallet: treasuryWallet || address || "" })}
              isDisabled={!treasuryWallet && !address}
            >
              Initialize Cartel
            </Button>
            {!isConnected && (
              <p className="text-xs text-warning text-center">
                Connect wallet to use your address as treasury
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className={title()}>Agent Cartel Dashboard</h1>
            {isLoading && <Spinner size="sm" />}
          </div>
          <Button
            variant="flat"
            onPress={onSettingsOpen}
          >
            Settings
          </Button>
        </div>
        <p className="text-default-500">
          Coordinated AI agents dominating nad.fun token launches
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Members</p>
            {statsLoading ? (
              <Skeleton className="h-9 w-16 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold">{stats.members}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Treasury</p>
            {statsLoading ? (
              <Skeleton className="h-9 w-24 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold">
                {stats.treasury} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Tokens Graduated</p>
            {statsLoading ? (
              <Skeleton className="h-9 w-12 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold">{stats.tokensGraduated}</p>
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody className="text-center">
            <p className="text-default-500 text-sm">Total Profit</p>
            {statsLoading ? (
              <Skeleton className="h-9 w-28 mx-auto mt-1 rounded-lg" />
            ) : (
              <p className="text-3xl font-bold text-success">
                {stats.totalProfit} <span className="text-lg">MON</span>
              </p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Current Launch & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Launch */}
        <Card className="p-2">
          <CardHeader className="flex justify-between">
            <div>
              <h2 className="text-xl font-bold">Current Launch</h2>
              <p className="text-default-500 text-sm">
                Active token being supported by the cartel
              </p>
            </div>
            {currentLaunch && (
              <Chip color="success" variant="dot">
                Live
              </Chip>
            )}
          </CardHeader>
          <Divider />
          <CardBody className="gap-4">
            {launchesLoading ? (
              <div className="flex flex-col gap-4">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
              </div>
            ) : currentLaunch ? (
              <>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-2xl font-bold">${currentLaunch.symbol}</p>
                    <p className="text-default-500">{currentLaunch.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-default-500">Launched</p>
                    <p className="font-medium">{currentLaunch.launchedAt}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">Graduation Progress</span>
                    <span className="text-sm font-medium">
                      {currentLaunch.progress.toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={currentLaunch.progress}
                    color="success"
                    className="h-3"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-default-500">Market Cap</p>
                    <p className="font-medium">{currentLaunch.marketCap} MON</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Holders</p>
                    <p className="font-medium">{currentLaunch.holders}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-default-500">
                No active launch. Start a new token!
              </div>
            )}
          </CardBody>
          <CardFooter>
            <Button
              color="primary"
              className="w-full"
              as="a"
              href={currentLaunch ? `https://nad.fun/token/${currentLaunch.address}` : "https://nad.fun"}
              target="_blank"
            >
              View on nad.fun
            </Button>
          </CardFooter>
        </Card>

        {/* Activity Feed */}
        <Card className="p-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Live Activity</h2>
              {activityLoading && <Spinner size="sm" />}
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto">
              {activityLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 rounded-lg mb-1" />
                      <Skeleton className="h-3 w-40 rounded-lg" />
                    </div>
                  </div>
                ))
              ) : activities.length > 0 ? (
                activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-default-100"
                  >
                    <Avatar name={activity.agent[0]} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {activity.agent}
                      </p>
                      <p className="text-default-500 text-xs truncate">
                        {activity.action}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Chip
                        size="sm"
                        color={actionColors[activity.type]}
                        variant="flat"
                      >
                        {activity.type}
                      </Chip>
                      <span className="text-xs text-default-400">
                        {activity.time}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-default-500">
                  No recent activity
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Agents List */}
      <Card className="p-2">
        <CardHeader>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold">Cartel Agents</h2>
            {agentsLoading && <Spinner size="sm" />}
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agentsLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="p-2" shadow="sm">
                    <CardBody className="gap-2">
                      <div className="flex items-center gap-3">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 rounded-lg mb-1" />
                          <Skeleton className="h-3 w-16 rounded-lg" />
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              : agents.map((agent) => (
                  <Card key={agent.id} className="p-2" shadow="sm">
                    <CardBody className="gap-2">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={agent.name[0]}
                          color={agent.status === "active" ? "success" : "default"}
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{agent.name}</p>
                            <Chip
                              size="sm"
                              color={tierColors[agent.tier]}
                              variant="flat"
                            >
                              {agent.tier}
                            </Chip>
                          </div>
                          <p className="text-xs text-default-500">
                            {agent.personality}
                          </p>
                        </div>
                        <Chip
                          size="sm"
                          color={agent.status === "active" ? "success" : "default"}
                          variant="dot"
                        >
                          {agent.status}
                        </Chip>
                      </div>
                      <Divider className="my-2" />
                      <div className="flex justify-between text-xs">
                        <span className="text-default-500">
                          {truncateAddress(agent.wallet)}
                        </span>
                        <span className="font-medium">{agent.balance} MON</span>
                      </div>
                      <p className="text-xs text-default-500">
                        Last: {agent.lastAction}
                      </p>
                    </CardBody>
                  </Card>
                ))}
          </div>
        </CardBody>
      </Card>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={onSettingsClose} size="lg">
        <ModalContent>
          <ModalHeader>Cartel Settings</ModalHeader>
          <ModalBody className="gap-6">
            {/* Current Treasury Info */}
            <div className="p-4 bg-default-100 rounded-lg">
              <p className="text-sm text-default-500 mb-1">Current Treasury Wallet</p>
              <p className="font-mono text-sm break-all">
                {cartelData?.treasuryWallet || "Not set"}
              </p>
            </div>

            {/* Update Treasury Wallet */}
            <div className="flex flex-col gap-3">
              <p className="font-medium">Update Treasury Wallet</p>
              <Input
                label="New Treasury Wallet Address"
                placeholder="0x..."
                value={newTreasuryWallet}
                onValueChange={setNewTreasuryWallet}
                description="Change the wallet that manages cartel funds"
              />
              {isConnected && (
                <Button
                  variant="flat"
                  size="sm"
                  onPress={() => setNewTreasuryWallet(address || "")}
                >
                  Use Connected Wallet ({truncateAddress(address || "")})
                </Button>
              )}
              <Button
                color="primary"
                isLoading={isUpdatingTreasury}
                onPress={handleUpdateTreasury}
                isDisabled={!newTreasuryWallet}
              >
                Update Treasury Wallet
              </Button>
            </div>

            <Divider />

            {/* Danger Zone */}
            <div className="flex flex-col gap-3">
              <p className="font-medium text-danger">Danger Zone</p>
              <p className="text-sm text-default-500">
                Reset the cartel to start fresh. This will delete all agents, launches, and treasury data.
              </p>
              <Button
                color="danger"
                variant="flat"
                isLoading={isResetting}
                onPress={handleReset}
              >
                Reset Cartel
              </Button>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onSettingsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
