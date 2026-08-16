import { Response } from "express";
import crypto from "crypto";
import Challenge from "../models/Challenge";
import { AuthedRequest } from "../middleware/auth";

/**
 * Deterministically derive a 32-byte hex contract challenge ID, used as the
 * on-chain BytesN<32> key. The frontend passes this same id when calling
 * create_challenge on the Soroban contract so Mongo and on-chain state stay
 * linked.
 */
function generateContractChallengeId(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function createChallenge(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "organization") {
    return res.status(403).json({ error: "Only organizations can create challenges" });
  }

  const {
    title,
    description,
    category,
    difficulty,
    rewardAmount,
    totalRewardPool,
    maxWinners,
    deadline,
    requirements,
  } = req.body as {
    title?: string;
    description?: string;
    category?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
    rewardAmount?: number;
    totalRewardPool?: number;
    maxWinners?: number;
    deadline?: string;
    requirements?: string;
  };

  if (
    !title ||
    !description ||
    !category ||
    !difficulty ||
    !rewardAmount ||
    !totalRewardPool ||
    !maxWinners ||
    !deadline ||
    !requirements
  ) {
    return res.status(400).json({ error: "Missing required challenge fields" });
  }

  if (totalRewardPool < rewardAmount * maxWinners) {
    return res.status(400).json({
      error: "totalRewardPool must be at least rewardAmount * maxWinners",
    });
  }

  const deadlineDate = new Date(deadline);
  if (Number.isNaN(deadlineDate.getTime()) || deadlineDate <= new Date()) {
    return res.status(400).json({ error: "deadline must be a valid future date" });
  }

  const challenge = await Challenge.create({
    title,
    description,
    organizationId: req.user.userId,
    category,
    difficulty,
    rewardAmount,
    totalRewardPool,
    remainingRewardPool: totalRewardPool,
    maxWinners,
    deadline: deadlineDate,
    requirements,
    status: "draft", // becomes "active" once funded on-chain (see fundChallenge)
    contractChallengeId: generateContractChallengeId(),
  });

  return res.status(201).json({ challenge });
}

export async function listChallenges(req: AuthedRequest, res: Response) {
  const { status, category, difficulty, organizationId } = req.query as Record<string, string>;

  const filter: Record<string, unknown> = {};
  if (status && status !== "all") filter.status = status;
  else if (!status) filter.status = { $ne: "draft" }; // hide unfunded drafts from the marketplace by default
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (organizationId) filter.organizationId = organizationId;

  const challenges = await Challenge.find(filter)
    .populate("organizationId", "name username verified")
    .sort({ createdAt: -1 })
    .limit(100);

  return res.json({ challenges });
}

export async function getChallenge(req: AuthedRequest, res: Response) {
  const challenge = await Challenge.findById(req.params.id).populate(
    "organizationId",
    "name username verified walletAddress"
  );
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });
  return res.json({ challenge });
}

/**
 * Called by the frontend AFTER the organization has already funded the
 * challenge on-chain via fund_challenge (Freighter tx). We record the
 * resulting tx hash and flip the challenge to "active" so it shows in the
 * marketplace.
 */
export async function fundChallenge(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { fundingTxHash } = req.body as { fundingTxHash?: string };
  if (!fundingTxHash) return res.status(400).json({ error: "fundingTxHash is required" });

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  if (challenge.organizationId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "Only the owning organization can fund this challenge" });
  }
  if (challenge.status === "closed") {
    return res.status(400).json({ error: "Challenge is already closed" });
  }

  challenge.fundingTxHash = fundingTxHash;
  challenge.status = "active";
  await challenge.save();

  return res.json({ challenge });
}

export async function closeChallenge(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  if (challenge.organizationId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "Only the owning organization can close this challenge" });
  }

  challenge.status = "closed";
  await challenge.save();

  return res.json({ challenge });
}
