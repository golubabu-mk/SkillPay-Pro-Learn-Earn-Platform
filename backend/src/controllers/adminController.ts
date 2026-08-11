import { Response } from "express";
import User from "../models/User";
import Challenge from "../models/Challenge";
import Submission from "../models/Submission";
import Achievement from "../models/Achievement";
import Feedback from "../models/Feedback";
import { AuthedRequest } from "../middleware/auth";

export async function getPlatformStats(_req: AuthedRequest, res: Response) {
  const [userCount, learnerCount, orgCount, challengeCount, activeChallengeCount, submissionCount, approvedSubmissionCount, achievementCount, feedbackDocs] =
    await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "learner" }),
      User.countDocuments({ role: "organization" }),
      Challenge.countDocuments(),
      Challenge.countDocuments({ status: "active" }),
      Submission.countDocuments(),
      Submission.countDocuments({ status: "approved" }),
      Achievement.countDocuments(),
      Feedback.find().select("rating"),
    ]);

  const avgRating =
    feedbackDocs.length > 0
      ? feedbackDocs.reduce((sum, f) => sum + f.rating, 0) / feedbackDocs.length
      : null;

  return res.json({
    users: { total: userCount, learners: learnerCount, organizations: orgCount },
    challenges: { total: challengeCount, active: activeChallengeCount },
    submissions: { total: submissionCount, approved: approvedSubmissionCount },
    achievements: { total: achievementCount },
    feedback: { count: feedbackDocs.length, averageRating: avgRating },
  });
}

export async function listPendingOrganizations(_req: AuthedRequest, res: Response) {
  const orgs = await User.find({ role: "organization", verified: false }).select(
    "-authNonce -authNonceExpiresAt"
  );
  return res.json({ organizations: orgs });
}

export async function verifyOrganization(req: AuthedRequest, res: Response) {
  const user = await User.findById(req.params.userId);
  if (!user || user.role !== "organization") {
    return res.status(404).json({ error: "Organization not found" });
  }
  user.verified = true;
  await user.save();
  return res.json({ user });
}
