import { Response } from "express";
import Submission from "../models/Submission";
import Challenge from "../models/Challenge";
import { AuthedRequest } from "../middleware/auth";

export async function createSubmission(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });
  if (req.user.role !== "learner") {
    return res.status(403).json({ error: "Only learners can submit work" });
  }

  const { challengeId, githubLink, liveDemoLink, videoLink, notes } = req.body as {
    challengeId?: string;
    githubLink?: string;
    liveDemoLink?: string;
    videoLink?: string;
    notes?: string;
  };

  if (!challengeId || (!githubLink && !liveDemoLink && !videoLink)) {
    return res.status(400).json({
      error: "challengeId and at least one of githubLink, liveDemoLink, videoLink are required",
    });
  }

  const challenge = await Challenge.findById(challengeId);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });
  if (challenge.status !== "active") {
    return res.status(400).json({ error: "This challenge is not currently accepting submissions" });
  }
  if (new Date() > challenge.deadline) {
    return res.status(400).json({ error: "The submission deadline has passed" });
  }

  const existing = await Submission.findOne({ challengeId, learnerId: req.user.userId });
  if (existing) {
    return res.status(409).json({ error: "You already submitted work for this challenge" });
  }

  const submission = await Submission.create({
    challengeId,
    learnerId: req.user.userId,
    githubLink,
    liveDemoLink,
    videoLink,
    notes,
    status: "pending",
  });

  return res.status(201).json({ submission });
}

export async function listSubmissionsForChallenge(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const challenge = await Challenge.findById(req.params.challengeId);
  if (!challenge) return res.status(404).json({ error: "Challenge not found" });

  if (challenge.organizationId.toString() !== req.user.userId && req.user.role !== "admin") {
    return res.status(403).json({ error: "Only the owning organization can view submissions" });
  }

  const submissions = await Submission.find({ challengeId: req.params.challengeId })
    .populate("learnerId", "name username walletAddress")
    .sort({ submittedAt: -1 });

  return res.json({ submissions });
}

export async function listMySubmissions(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const submissions = await Submission.find({ learnerId: req.user.userId })
    .populate("challengeId", "title rewardAmount deadline status")
    .sort({ submittedAt: -1 });

  return res.json({ submissions });
}

/**
 * Marks a submission approved AFTER the organization has already signed and
 * confirmed the on-chain approve_submission + issue_achievement calls. The
 * frontend orchestrates the on-chain steps; this endpoint just persists the
 * resulting tx hashes and updates status/pool bookkeeping.
 */
export async function approveSubmission(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { rewardTxHash, reviewComment } = req.body as {
    rewardTxHash?: string;
    reviewComment?: string;
  };
  if (!rewardTxHash) return res.status(400).json({ error: "rewardTxHash is required" });

  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ error: "Submission not found" });
  if (submission.status !== "pending") {
    return res.status(400).json({ error: "This submission has already been reviewed" });
  }

  const challenge = await Challenge.findById(submission.challengeId);
  if (!challenge) return res.status(404).json({ error: "Associated challenge not found" });
  if (challenge.organizationId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "Only the owning organization can approve submissions" });
  }
  if (challenge.approvedCount >= challenge.maxWinners) {
    return res.status(400).json({ error: "This challenge has already reached max winners" });
  }
  if (challenge.remainingRewardPool < challenge.rewardAmount) {
    return res.status(400).json({ error: "Insufficient remaining reward pool" });
  }

  submission.status = "approved";
  submission.rewardTxHash = rewardTxHash;
  submission.reviewComment = reviewComment;
  submission.reviewedAt = new Date();
  await submission.save();

  challenge.approvedCount += 1;
  challenge.remainingRewardPool -= challenge.rewardAmount;
  if (challenge.approvedCount >= challenge.maxWinners) {
    challenge.status = "closed";
  }
  await challenge.save();

  return res.json({ submission, challenge });
}

export async function rejectSubmission(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { reviewComment } = req.body as { reviewComment?: string };

  const submission = await Submission.findById(req.params.id);
  if (!submission) return res.status(404).json({ error: "Submission not found" });
  if (submission.status !== "pending") {
    return res.status(400).json({ error: "This submission has already been reviewed" });
  }

  const challenge = await Challenge.findById(submission.challengeId);
  if (!challenge) return res.status(404).json({ error: "Associated challenge not found" });
  if (challenge.organizationId.toString() !== req.user.userId) {
    return res.status(403).json({ error: "Only the owning organization can reject submissions" });
  }

  submission.status = "rejected";
  submission.reviewComment = reviewComment;
  submission.reviewedAt = new Date();
  await submission.save();

  return res.json({ submission });
}
