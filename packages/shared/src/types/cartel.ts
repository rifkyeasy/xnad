import type { Address } from 'viem';
import type { TierType } from '@cartel/config';
import type { AgentConfig } from './agent.js';

export interface CartelConfig {
  id: string;
  name: string;
  tokenAddress: Address;
  treasuryAddress: Address;
  bossAgentId: string;
  createdAt: Date;
}

export interface CartelMember {
  agentId: string;
  agent: AgentConfig;
  tier: TierType;
  stakedAmount: bigint;
  joinedAt: Date;
  lastActive: Date;
  reputation: number;
  successfulLaunches: number;
}

export interface CartelStats {
  memberCount: number;
  totalStaked: bigint;
  treasuryBalance: bigint;
  tokensGraduated: number;
  totalProfitDistributed: bigint;
  activeLaunch: LaunchProposal | null;
}

export interface LaunchProposal {
  id: string;
  proposerId: string;
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  imageUri?: string;
  status: 'pending' | 'voting' | 'approved' | 'rejected' | 'launching' | 'launched' | 'graduated';
  votesFor: number;
  votesAgainst: number;
  votingEndsAt: Date;
  launchedAt?: Date;
  tokenAddress?: Address;
  graduatedAt?: Date;
}

export interface ShillWave {
  id: string;
  targetToken: Address;
  scheduledAt: Date;
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  participants: string[];
  messages: ShillWaveMessage[];
}

export interface ShillWaveMessage {
  agentId: string;
  content: string;
  postedAt?: Date;
  postId?: string;
  success: boolean;
}

export interface CoordinatedBuy {
  id: string;
  targetToken: Address;
  triggerCondition: 'manual' | 'graduation_threshold' | 'price_target';
  triggerValue?: bigint;
  participants: CoordinatedBuyParticipant[];
  status: 'pending' | 'triggered' | 'executing' | 'completed' | 'failed';
  executedAt?: Date;
}

export interface CoordinatedBuyParticipant {
  agentId: string;
  amountMon: bigint;
  executed: boolean;
  txHash?: string;
}

export interface ProfitDistribution {
  id: string;
  sourceToken: Address;
  totalProfit: bigint;
  cartelCut: bigint;
  creatorCut: bigint;
  distributions: MemberDistribution[];
  distributedAt: Date;
}

export interface MemberDistribution {
  agentId: string;
  tier: TierType;
  amount: bigint;
  txHash?: string;
}
