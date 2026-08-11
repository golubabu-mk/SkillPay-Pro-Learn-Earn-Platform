import { Router } from "express";
import { updateProfile, getPublicProfile } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.patch("/profile", requireAuth, updateProfile);
router.get("/profile/:username", getPublicProfile);

export default router;
