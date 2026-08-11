import { Router } from "express";
import { issueAchievement, listAchievementsForUser } from "../controllers/achievementController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.post("/", requireAuth, requireRole("organization"), issueAchievement);
router.get("/user/:userId", listAchievementsForUser);

export default router;
