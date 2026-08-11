import { Router } from "express";
import {
  getPlatformStats,
  listPendingOrganizations,
  verifyOrganization,
} from "../controllers/adminController";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.get("/stats", requireAuth, requireRole("admin"), getPlatformStats);
router.get("/organizations/pending", requireAuth, requireRole("admin"), listPendingOrganizations);
router.patch("/organizations/:userId/verify", requireAuth, requireRole("admin"), verifyOrganization);

export default router;
