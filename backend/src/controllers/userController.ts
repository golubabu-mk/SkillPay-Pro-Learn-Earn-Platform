import { Response } from "express";
import User from "../models/User";
import { AuthedRequest } from "../middleware/auth";

/**
 * Complete/update the authenticated user's profile. Used right after first
 * login to let them pick role (learner/organization), username, name, bio.
 */
export async function updateProfile(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { role, username, name, bio, skills, email } = req.body as {
    role?: "learner" | "organization";
    username?: string;
    name?: string;
    bio?: string;
    skills?: string[];
    email?: string;
  };

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ error: "User not found" });

  if (role && ["learner", "organization"].includes(role)) user.role = role;
  if (username) {
    const taken = await User.findOne({ username: username.toLowerCase(), _id: { $ne: user._id } });
    if (taken) return res.status(409).json({ error: "Username already taken" });
    user.username = username.toLowerCase();
  }
  if (name) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (skills) user.skills = skills;
  if (email) user.email = email.toLowerCase();

  await user.save();

  return res.json({
    user: {
      id: user._id,
      walletAddress: user.walletAddress,
      role: user.role,
      username: user.username,
      name: user.name,
      bio: user.bio,
      skills: user.skills,
      verified: user.verified,
    },
  });
}

export async function getPublicProfile(req: AuthedRequest, res: Response) {
  const { username } = req.params;
  const user = await User.findOne({ username: username.toLowerCase() }).select(
    "-authNonce -authNonceExpiresAt -email"
  );
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ user });
}
