"use client";

import { useState } from "react";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Avatar } from "@heroui/avatar";
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
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { useAccount } from "wagmi";

import { title } from "@/components/primitives";
import { useAgentsData, useAddAgent } from "@/hooks/useCartelData";
import { useCartelStore } from "@/stores/cartel";
import { truncateAddress } from "@/lib/api";

const tierColors: Record<string, "warning" | "primary" | "secondary" | "default"> = {
  Boss: "warning",
  Capo: "primary",
  Soldier: "secondary",
  Associate: "default",
};

const tierRequirements = {
  Associate: { minBalance: 0, label: "New member" },
  Soldier: { minBalance: 1, label: "1+ MON staked" },
  Capo: { minBalance: 5, label: "5+ MON staked" },
  Boss: { minBalance: 10, label: "10+ MON staked" },
};

const personalities = [
  "Aggressive Trader",
  "Conservative Holder",
  "Momentum Chaser",
  "Contrarian",
  "Social Influencer",
  "Data Analyst",
];

export default function AgentsPage() {
  const { address, isConnected } = useAccount();
  const { isLoading } = useAgentsData();
  const { agents } = useCartelStore();
  const { mutate: addAgent, isPending: isAddingAgent } = useAddAgent();

  // Add agent modal
  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const [agentForm, setAgentForm] = useState({
    name: "",
    wallet: "",
    personality: "Aggressive Trader",
  });

  // Agent detail modal
  const { isOpen: isDetailOpen, onOpen: onDetailOpen, onClose: onDetailClose } = useDisclosure();
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);

  const handleAddAgent = () => {
    if (!agentForm.name || !agentForm.wallet) return;

    addAgent(
      {
        name: agentForm.name,
        wallet: agentForm.wallet,
        personality: agentForm.personality,
      },
      {
        onSuccess: () => {
          onAddClose();
          setAgentForm({ name: "", wallet: "", personality: "Aggressive Trader" });
        },
      }
    );
  };

  const viewAgentProfile = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    onDetailOpen();
  };

  const viewAgentTrades = (wallet: string) => {
    window.open(`https://testnet.monadexplorer.com/address/${wallet}`, "_blank");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className={title()}>Cartel Agents</h1>
          {isLoading && <Spinner size="sm" />}
        </div>
        <p className="text-default-500">
          View and manage all agents in the cartel network
        </p>
      </div>

      {/* Tier Legend */}
      <Card className="p-4">
        <CardBody>
          <div className="flex flex-wrap gap-4 justify-center">
            {Object.entries(tierRequirements).map(([tier, info]) => (
              <div key={tier} className="flex items-center gap-2">
                <Chip color={tierColors[tier]} size="sm" variant="flat">
                  {tier}
                </Chip>
                <span className="text-xs text-default-500">{info.label}</span>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-2">
              <CardHeader className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div>
                    <Skeleton className="h-5 w-28 rounded-lg mb-2" />
                    <Skeleton className="h-3 w-20 rounded-lg" />
                  </div>
                </div>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                <Skeleton className="h-4 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4 rounded-lg" />
              </CardBody>
            </Card>
          ))
        ) : agents.length > 0 ? (
          agents.map((agent) => (
            <Card key={agent.id} className="p-2">
              <CardHeader className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={agent.name[0]}
                    size="lg"
                    color={agent.status === "active" ? "success" : "default"}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">{agent.name}</p>
                      <Chip size="sm" color={tierColors[agent.tier]} variant="flat">
                        {agent.tier}
                      </Chip>
                    </div>
                    <p className="text-sm text-default-500">{agent.personality}</p>
                  </div>
                </div>
                <Chip
                  size="sm"
                  color={agent.status === "active" ? "success" : "default"}
                  variant="dot"
                >
                  {agent.status}
                </Chip>
              </CardHeader>
              <Divider />
              <CardBody className="gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500">Wallet</p>
                    <p className="font-mono text-sm">{truncateAddress(agent.wallet)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Balance</p>
                    <p className="font-medium">{agent.balance} MON</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500">Total Trades</p>
                    <p className="font-medium">{agent.totalTrades}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Joined</p>
                    <p className="font-medium">{agent.joinedAt}</p>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-default-500">Success Rate</span>
                    <span className="text-xs font-medium">{agent.successRate}%</span>
                  </div>
                  <Progress
                    value={agent.successRate}
                    color={agent.successRate >= 80 ? "success" : agent.successRate >= 60 ? "warning" : "danger"}
                    size="sm"
                  />
                </div>

                {agent.lastAction && (
                  <p className="text-xs text-default-500">
                    Last action: {agent.lastAction}
                  </p>
                )}

                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="flat"
                    className="flex-1"
                    onPress={() => viewAgentProfile(agent)}
                  >
                    View Profile
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    variant="flat"
                    className="flex-1"
                    onPress={() => viewAgentTrades(agent.wallet)}
                  >
                    View Trades
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))
        ) : (
          <div className="col-span-2 text-center py-12 text-default-500">
            No agents yet. Deploy your first agent to get started!
          </div>
        )}
      </div>

      {/* Add Agent CTA */}
      <Card className="p-4">
        <CardBody className="text-center">
          <p className="text-default-500 mb-4">Want to add more agents to your cartel?</p>
          <Button color="primary" size="lg" onPress={onAddOpen}>
            Deploy New Agent
          </Button>
        </CardBody>
      </Card>

      {/* Add Agent Modal */}
      <Modal isOpen={isAddOpen} onClose={onAddClose} size="lg">
        <ModalContent>
          <ModalHeader>Deploy New Agent</ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="Agent Name"
              placeholder="e.g., Alpha Trader"
              value={agentForm.name}
              onValueChange={(v) => setAgentForm({ ...agentForm, name: v })}
              isRequired
            />
            <Input
              label="Wallet Address"
              placeholder="0x..."
              value={agentForm.wallet || (isConnected ? address : "")}
              onValueChange={(v) => setAgentForm({ ...agentForm, wallet: v })}
              description="The wallet this agent will use for trading"
              isRequired
            />
            <div>
              <label className="text-sm text-default-600 mb-2 block">Personality</label>
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="bordered" className="w-full justify-start">
                    {agentForm.personality}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Select personality"
                  onAction={(key) => setAgentForm({ ...agentForm, personality: key as string })}
                >
                  {personalities.map((p) => (
                    <DropdownItem key={p}>{p}</DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
              <p className="text-xs text-default-500 mt-1">
                Defines how the agent behaves in the market
              </p>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onAddClose}>
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleAddAgent}
              isLoading={isAddingAgent}
              isDisabled={!agentForm.name || !agentForm.wallet}
            >
              Deploy Agent
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Agent Detail Modal */}
      <Modal isOpen={isDetailOpen} onClose={onDetailClose} size="lg">
        <ModalContent>
          {selectedAgent && (
            <>
              <ModalHeader className="flex items-center gap-3">
                <Avatar
                  name={selectedAgent.name[0]}
                  size="lg"
                  color={selectedAgent.status === "active" ? "success" : "default"}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold">{selectedAgent.name}</span>
                    <Chip size="sm" color={tierColors[selectedAgent.tier]} variant="flat">
                      {selectedAgent.tier}
                    </Chip>
                  </div>
                  <p className="text-sm text-default-500">{selectedAgent.personality}</p>
                </div>
              </ModalHeader>
              <Divider />
              <ModalBody className="gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-default-500">Wallet Address</p>
                    <p className="font-mono text-sm break-all">{selectedAgent.wallet}</p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Status</p>
                    <Chip
                      size="sm"
                      color={selectedAgent.status === "active" ? "success" : "default"}
                      variant="dot"
                    >
                      {selectedAgent.status}
                    </Chip>
                  </div>
                </div>

                <Divider />

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedAgent.balance}</p>
                    <p className="text-xs text-default-500">MON Balance</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{selectedAgent.totalTrades}</p>
                    <p className="text-xs text-default-500">Total Trades</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-success">{selectedAgent.successRate}%</p>
                    <p className="text-xs text-default-500">Success Rate</p>
                  </div>
                </div>

                <Divider />

                <div>
                  <p className="text-xs text-default-500 mb-1">Trading Performance</p>
                  <Progress
                    value={selectedAgent.successRate}
                    color={selectedAgent.successRate >= 80 ? "success" : selectedAgent.successRate >= 60 ? "warning" : "danger"}
                    size="md"
                    showValueLabel
                  />
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Joined</span>
                  <span>{selectedAgent.joinedAt}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-default-500">Last Activity</span>
                  <span>{selectedAgent.lastAction}</span>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onDetailClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => viewAgentTrades(selectedAgent.wallet)}
                >
                  View on Explorer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
