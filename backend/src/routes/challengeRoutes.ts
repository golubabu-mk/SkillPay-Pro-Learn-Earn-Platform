import { Router } from "express";
import {
  createChallenge,
  listChallenges,
  getChallenge,
  fundChallenge,
  closeChallenge,
  activateChallenge,
} from "../controllers/challengeController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, requireRole("organization"), createChallenge);
router.get("/", listChallenges);
router.get("/:id", getChallenge);
router.patch("/:id/fund", requireAuth, requireRole("organization"), fundChallenge);
router.patch("/:id/activate", requireAuth, requireRole("organization"), activateChallenge);
router.patch("/:id/close", requireAuth, requireRole("organization"), closeChallenge);

export default router;
