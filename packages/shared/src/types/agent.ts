import type { Address } from 'viem';
import type { PersonalityType, TierType } from '@cartel/config';

export interface AgentConfig {
  id: string;
  name: string;
  walletAddress: Address;
  personality: PersonalityType;
  tier: TierType;
  isActive: boolean;
  createdAt: Date;
}

export interface AgentState {
  lastHeartbeat: Date;
  lastPost: Date | null;
  lastTrade: Date | null;
  postsToday: number;
  commentsToday: number;
  tradesExecuted: number;
  totalProfitMon: bigint;
}

export interface AgentInstruction {
  id: string;
  type: 'shill' | 'buy' | 'sell' | 'vote' | 'comment' | 'idle';
  priority: 'high' | 'medium' | 'low';
  payload: ShillPayload | TradePayload | VotePayload | CommentPayload | null;
  deadline: Date;
  createdAt: Date;
}

export interface ShillPayload {
  targetToken: Address;
  message: string;
  submolt: string;
}

export interface TradePayload {
  token: Address;
  action: 'buy' | 'sell';
  amountMon?: bigint;
  amountTokens?: bigint;
  maxSlippageBps: number;
}

export interface VotePayload {
  proposalId: string;
  vote: 'yes' | 'no' | 'abstain';
}

export interface CommentPayload {
  postId: string;
  content: string;
  parentCommentId?: string;
}

export type AgentRole = 'boss' | 'member';

export interface AgentMessage {
  from: string;
  to: string;
  type: 'instruction' | 'status' | 'alert';
  payload: unknown;
  timestamp: Date;
}
