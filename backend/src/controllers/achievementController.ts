import { Response } from "express";
import Achievement from "../models/Achievement";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import { AuthedRequest } from "../middleware/auth";

/**
 * Persists an achievement record AFTER issue_achievement has already been
 * confirmed on-chain (the frontend calls the contract directly via
 * Freighter, then reports the result here).
 */
export async function issueAchievement(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { submissionId, credentialHash, rewardTxHash } = req.body as {
    submissionId?: string;
    credentialHash?: string;
    rewardTxHash?: string;
  };

  if (!submissionId || !credentialHash || !rewardTxHash) {
    return res.status(400).json({
      error: "submissionId, credentialHash, and rewardTxHash are required",
    });
  }

  const submission = await Submission.findById(submissionId);
  if (!submission) return res.status(404).json({ error: "Submission not found" });
  if (submission.status !== "approved") {
    return res.status(400).json({ error: "Submission must be approved before issuing an achievement" });
  }

  const challenge = await Challenge.findById(submission.challengeId);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });
  if (challenge.organizationId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "Only the owning organization can issue this achievement" });
  }

  const existing = await Achievement.findOne({
    learnerId: submission.learnerId,
    challengeId: challenge._id,
  });
  if (existing) {
    return res.status(409).json({ error: "An achievement has already been issued for this submission" });
  }

  const achievement = await Achievement.create({
    learnerId: submission.learnerId,
    challengeId: challenge._id,
    title: `${challenge.title} — Verified Completion`,
    description: challenge.description,
    issuerName: "SkillPay Pro",
    credentialHash,
    rewardTxHash,
    issuedAt: new Date(),
  });

  return res.status(201).json({ achievement });
}

export async function listAchievementsForUser(req: AuthedRequest, res: Response) {
  const achievements = await Achievement.find({ learnerId: req.params.userId })
    .populate("challengeId", "title category difficulty organizationId")
    .sort({ issuedAt: -1 });

  return res.json({ achievements });
}
