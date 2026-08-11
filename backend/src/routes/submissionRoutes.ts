import { Router } from "express";
import {
  createSubmission,
  listSubmissionsForChallenge,
  listMySubmissions,
  approveSubmission,
  rejectSubmission,
} from "../controllers/submissionController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, requireRole("learner"), createSubmission);
router.get("/challenge/:challengeId", requireAuth, listSubmissionsForChallenge);
router.get("/my", requireAuth, requireRole("learner"), listMySubmissions);
router.patch("/:id/approve", requireAuth, requireRole("organization"), approveSubmission);
router.patch("/:id/reject", requireAuth, requireRole("organization"), rejectSubmission);

export default router;
