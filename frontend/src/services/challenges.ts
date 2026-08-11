import { api } from "./api";
import { Challenge, CreateChallengeInput } from "../types/challenge";
import { createChallengeOnChain, fundChallengeOnChain, xlmToStroops } from "./stellar";

interface ListFilters {
  status?: string;
  category?: string;
  difficulty?: string;
  organizationId?: string;
}

export async function listChallenges(filters: ListFilters = {}): Promise<Challenge[]> {
  const { data } = await api.get("/challenges", { params: filters });
  return data.challenges as Challenge[];
}

export async function getChallenge(id: string): Promise<Challenge> {
  const { data } = await api.get(`/challenges/${id}`);
  return data.challenge as Challenge;
}

/**
 * Full "create challenge" flow:
 * 1. Create the draft record in our DB (gets us a contractChallengeId)
 * 2. Create the challenge on-chain via Soroban (Freighter signs)
 * 3. Fund it on-chain with the initial reward pool
 * 4. Tell the backend it's funded (records tx hash, flips status to active)
 */
export async function createAndFundChallenge(
  input: CreateChallengeInput,
  organizationWalletAddress: string
): Promise<Challenge> {
  const { data: createData } = await api.post("/challenges", input);
  const challenge = createData.challenge as Challenge;

  const deadlineUnixSeconds = Math.floor(new Date(input.deadline).getTime() / 1000);

  await createChallengeOnChain(
    challenge.contractChallengeId,
    organizationWalletAddress,
    xlmToStroops(input.totalRewardPool),
    input.maxWinners,
    deadlineUnixSeconds
  );

  const fundingTxHash = await fundChallengeOnChain(
    challenge.contractChallengeId,
    organizationWalletAddress,
    xlmToStroops(input.totalRewardPool)
  );

  const { data: fundedData } = await api.patch(`/challenges/${challenge._id}/fund`, {
    fundingTxHash,
  });

  return fundedData.challenge as Challenge;
}

export async function closeChallenge(id: string): Promise<Challenge> {
  const { data } = await api.patch(`/challenges/${id}/close`);
  return data.challenge as Challenge;
}
