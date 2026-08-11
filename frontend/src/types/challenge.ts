export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";
export type ChallengeStatus = "draft" | "active" | "closed";

export interface OrganizationSummary {
  _id: string;
  name: string;
  username: string;
  verified: boolean;
  walletAddress?: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  organizationId: OrganizationSummary | string;
  category: string;
  difficulty: ChallengeDifficulty;
  rewardAmount: number;
  totalRewardPool: number;
  remainingRewardPool: number;
  maxWinners: number;
  approvedCount: number;
  deadline: string;
  requirements: string;
  status: ChallengeStatus;
  contractChallengeId: string;
  fundingTxHash?: string;
  createdAt: string;
}

export interface CreateChallengeInput {
  title: string;
  description: string;
  category: string;
  difficulty: ChallengeDifficulty;
  rewardAmount: number;
  totalRewardPool: number;
  maxWinners: number;
  deadline: string; // ISO date
  requirements: string;
}
