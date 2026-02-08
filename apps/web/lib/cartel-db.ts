import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

// Database file path
const DB_PATH = join(process.cwd(), ".cartel-data.json");

// Types
export interface AgentRecord {
  id: string;
  name: string;
  wallet: string;
  privateKey?: string; // Encrypted in production
  tier: "Boss" | "Capo" | "Soldier" | "Associate";
  personality: string;
  status: "active" | "idle" | "offline";
  createdAt: number;
  lastActiveAt: number;
  totalTrades: number;
  successfulTrades: number;
  totalVolume: string;
}

export interface LaunchRecord {
  id: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  imageUri?: string;
  status: "pending" | "live" | "graduated" | "failed";
  proposedBy: string;
  proposedAt: number;
  launchedAt?: number;
  graduatedAt?: number;
  votes: { agent: string; vote: "yes" | "no"; timestamp: number }[];
  investmentAmount: string;
  currentValue: string;
}

export interface TreasuryRecord {
  deposits: { agent: string; amount: string; timestamp: number; txHash: string }[];
  withdrawals: { agent: string; amount: string; timestamp: number; txHash: string; reason: string }[];
  trades: { tokenAddress: string; type: "buy" | "sell"; amount: string; timestamp: number; txHash: string }[];
}

export interface CartelDatabase {
  cartelId: string;
  createdAt: number;
  treasuryWallet: string;
  agents: AgentRecord[];
  launches: LaunchRecord[];
  treasury: TreasuryRecord;
  config: {
    minStakeForSoldier: string;
    minStakeForCapo: string;
    minStakeForBoss: string;
    votingPeriodMs: number;
    profitSharePercent: number;
  };
}

// Default empty database
const defaultDB: CartelDatabase = {
  cartelId: "",
  createdAt: 0,
  treasuryWallet: "",
  agents: [],
  launches: [],
  treasury: {
    deposits: [],
    withdrawals: [],
    trades: [],
  },
  config: {
    minStakeForSoldier: "1000000000000000000", // 1 MON
    minStakeForCapo: "5000000000000000000", // 5 MON
    minStakeForBoss: "10000000000000000000", // 10 MON
    votingPeriodMs: 3600000, // 1 hour
    profitSharePercent: 80,
  },
};

// Load database
export function loadDatabase(): CartelDatabase {
  try {
    if (existsSync(DB_PATH)) {
      const data = readFileSync(DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Failed to load database:", error);
  }
  return { ...defaultDB };
}

// Save database
export function saveDatabase(db: CartelDatabase): void {
  try {
    writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error("Failed to save database:", error);
  }
}

// Initialize cartel
export function initializeCartel(treasuryWallet: string): CartelDatabase {
  const db: CartelDatabase = {
    ...defaultDB,
    cartelId: `cartel-${Date.now().toString(36)}`,
    createdAt: Date.now(),
    treasuryWallet,
  };
  saveDatabase(db);
  return db;
}

// Reset cartel (clears all data)
export function resetCartel(): void {
  saveDatabase({ ...defaultDB });
}

// Update treasury wallet
export function updateTreasuryWallet(newWallet: string): CartelDatabase {
  const db = loadDatabase();
  db.treasuryWallet = newWallet;
  saveDatabase(db);
  return db;
}

// Agent operations
export function addAgent(agent: Omit<AgentRecord, "id" | "createdAt" | "lastActiveAt" | "totalTrades" | "successfulTrades" | "totalVolume">): AgentRecord {
  const db = loadDatabase();
  const newAgent: AgentRecord = {
    ...agent,
    id: `agent-${Date.now().toString(36)}`,
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    totalTrades: 0,
    successfulTrades: 0,
    totalVolume: "0",
  };
  db.agents.push(newAgent);
  saveDatabase(db);
  return newAgent;
}

export function updateAgent(id: string, updates: Partial<AgentRecord>): AgentRecord | null {
  const db = loadDatabase();
  const index = db.agents.findIndex((a) => a.id === id);
  if (index === -1) return null;
  db.agents[index] = { ...db.agents[index], ...updates, lastActiveAt: Date.now() };
  saveDatabase(db);
  return db.agents[index];
}

export function getAgents(): AgentRecord[] {
  return loadDatabase().agents;
}

// Launch operations
export function proposeLaunch(launch: Omit<LaunchRecord, "id" | "proposedAt" | "votes" | "currentValue">): LaunchRecord {
  const db = loadDatabase();
  const newLaunch: LaunchRecord = {
    ...launch,
    id: `launch-${Date.now().toString(36)}`,
    proposedAt: Date.now(),
    votes: [],
    currentValue: launch.investmentAmount,
  };
  db.launches.push(newLaunch);
  saveDatabase(db);
  return newLaunch;
}

export function voteLaunch(launchId: string, agentId: string, vote: "yes" | "no"): boolean {
  const db = loadDatabase();
  const launch = db.launches.find((l) => l.id === launchId);
  if (!launch) return false;

  // Remove existing vote from this agent
  launch.votes = launch.votes.filter((v) => v.agent !== agentId);
  launch.votes.push({ agent: agentId, vote, timestamp: Date.now() });
  saveDatabase(db);
  return true;
}

export function updateLaunch(id: string, updates: Partial<LaunchRecord>): LaunchRecord | null {
  const db = loadDatabase();
  const index = db.launches.findIndex((l) => l.id === id);
  if (index === -1) return null;
  db.launches[index] = { ...db.launches[index], ...updates };
  saveDatabase(db);
  return db.launches[index];
}

export function getLaunches(): LaunchRecord[] {
  return loadDatabase().launches;
}

// Treasury operations
export function recordDeposit(agent: string, amount: string, txHash: string): void {
  const db = loadDatabase();
  db.treasury.deposits.push({ agent, amount, timestamp: Date.now(), txHash });
  saveDatabase(db);
}

export function recordWithdrawal(agent: string, amount: string, txHash: string, reason: string): void {
  const db = loadDatabase();
  db.treasury.withdrawals.push({ agent, amount, timestamp: Date.now(), txHash, reason });
  saveDatabase(db);
}

export function recordTrade(tokenAddress: string, type: "buy" | "sell", amount: string, txHash: string): void {
  const db = loadDatabase();
  db.treasury.trades.push({ tokenAddress, type, amount, timestamp: Date.now(), txHash });
  saveDatabase(db);
}

export function getTreasury(): TreasuryRecord {
  return loadDatabase().treasury;
}

export function getCartelConfig() {
  const db = loadDatabase();
  return {
    cartelId: db.cartelId,
    treasuryWallet: db.treasuryWallet,
    createdAt: db.createdAt,
    config: db.config,
  };
}
