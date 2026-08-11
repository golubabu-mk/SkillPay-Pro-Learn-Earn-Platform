import { Schema, model, Document, Types } from "mongoose";

export type UserRole = "learner" | "organization" | "admin";

export interface IUser extends Document {
  _id: Types.ObjectId;
  walletAddress: string; // Stellar G... address, primary identity
  role: UserRole;
  username: string;
  name: string;
  email?: string;
  bio?: string;
  skills: string[];
  verified: boolean;
  authNonce: string; // rotated on every login challenge
  authNonceExpiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      index: true,
      match: /^G[A-Z2-7]{55}$/, // Stellar public key format
    },
    role: {
      type: String,
      enum: ["learner", "organization", "admin"],
      required: true,
      default: "learner",
    },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    bio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    verified: { type: Boolean, default: false }, // orgs must be verified by admin
    authNonce: { type: String, required: true },
    authNonceExpiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

export default model<IUser>("User", userSchema);
