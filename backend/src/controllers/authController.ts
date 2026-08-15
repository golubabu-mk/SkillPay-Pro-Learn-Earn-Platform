import { Response } from "express";
import User from "../models/User";
import { generateAuthTransaction, generateNonce, verifyStellarSignature } from "../utils/stellarAuth";
import { signToken } from "../utils/jwt";
import { AuthedRequest } from "../middleware/auth";

const NONCE_TTL_MINUTES = 10;
const STELLAR_ADDRESS_REGEX = /^G[A-Z2-7]{55}$/;

/**
 * STEP 1 — Request a login challenge.
 * Client sends a wallet address; we create/find the user, issue a fresh
 * nonce, and return the exact message the wallet must sign with Freighter.
 *
 * If the wallet has never been seen before, this also pre-registers a
 * skeleton account (role defaults to "learner"); the client should follow
 * up with a profile-completion step after first successful login.
 */
export async function requestChallenge(req: AuthedRequest, res: Response) {
  const { walletAddress } = req.body as { walletAddress?: string };

  if (!walletAddress || !STELLAR_ADDRESS_REGEX.test(walletAddress)) {
    return res.status(400).json({ error: "A valid Stellar wallet address is required" });
  }

  const nonce = generateNonce();
  const expiresAt = new Date(Date.now() + NONCE_TTL_MINUTES * 60 * 1000);

  let user = await User.findOne({ walletAddress });

  if (!user) {
    // Pre-provision a minimal account; profile is completed after first login.
    const shortAddr = walletAddress.slice(0, 6).toLowerCase();
    user = await User.create({
      walletAddress,
      role: "learner",
      username: `user_${shortAddr}_${Date.now().toString(36).slice(-4)}`,
      name: "New User",
      skills: [],
      verified: false,
      authNonce: nonce,
      authNonceExpiresAt: expiresAt,
    });
  } else {
    user.authNonce = nonce;
    user.authNonceExpiresAt = expiresAt;
    await user.save();
  }

  const message = generateAuthTransaction(walletAddress, nonce, expiresAt);

  return res.json({ message, isNewUser: user.name === "New User" });
}

/**
 * STEP 2 — Verify the signed message and issue a JWT.
 */
export async function verifySignature(req: AuthedRequest, res: Response) {
  let { walletAddress, signature } = req.body as {
    walletAddress?: string;
    signature?: string | { signature: string } | any;
  };

  if (typeof signature === "object" && signature !== null && "signature" in signature) {
    signature = signature.signature;
  }

  if (!walletAddress || !signature) {
    return res.status(400).json({ error: "walletAddress and signature are required" });
  }

  const user = await User.findOne({ walletAddress });
  if (!user) {
    return res.status(404).json({ error: "No login challenge found for this wallet. Request one first." });
  }

  if (user.authNonceExpiresAt < new Date()) {
    return res.status(401).json({ error: "Login challenge expired. Request a new one." });
  }

  const expectedMessage = generateAuthTransaction(walletAddress, user.authNonce, user.authNonceExpiresAt);
  
  console.log("verifySignature DEBUG:");
  console.log("wallet:", walletAddress);
  console.log("expectedMessage:", expectedMessage);
  console.log("signature type:", typeof signature);
  console.log("signature:", signature);

  const isValid = verifyStellarSignature(walletAddress, expectedMessage, signature as string);

  if (!isValid) {
    console.log("Signature verification failed!");
    return res.status(401).json({ error: "Signature verification failed" });
  }

  // Rotate the nonce so the signature can't be replayed.
  user.authNonce = "";
  user.authNonceExpiresAt = new Date(0);
  await user.save();

  const token = signToken({
    userId: user._id.toString(),
    walletAddress: user.walletAddress,
    role: user.role,
  });

  return res.json({
    token,
    user: {
      id: user._id,
      walletAddress: user.walletAddress,
      role: user.role,
      username: user.username,
      name: user.name,
      verified: user.verified,
    },
  });
}

export async function getMe(req: AuthedRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  const user = await User.findById(req.user.userId).select("-authNonce -authNonceExpiresAt");
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.json({ user });
}
