import { Router } from "express";
import { requestChallenge, verifySignature, getMe } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.post("/challenge", requestChallenge);
router.post("/verify", verifySignature);
router.get("/me", requireAuth, getMe);

export default router;
