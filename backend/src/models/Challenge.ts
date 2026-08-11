import { Schema, model, Document, Types } from "mongoose";

export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced";
export type ChallengeStatus = "draft" | "active" | "closed";

export interface IChallenge extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  organizationId: Types.ObjectId;
  category: string;
  difficulty: ChallengeDifficulty;
  rewardAmount: number; // reward per approved learner, in XLM (stroops handled on-chain)
  totalRewardPool: number;
  remainingRewardPool: number;
  maxWinners: number;
  approvedCount: number;
  deadline: Date;
  requirements: string;
  status: ChallengeStatus;
  contractChallengeId: string; // hex BytesN<32> used on-chain
  fundingTxHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    category: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    rewardAmount: { type: Number, required: true, min: 0 },
    totalRewardPool: { type: Number, required: true, min: 0 },
    remainingRewardPool: { type: Number, required: true, min: 0 },
    maxWinners: { type: Number, required: true, min: 1 },
    approvedCount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    requirements: { type: String, required: true },
    status: { type: String, enum: ["draft", "active", "closed"], default: "draft" },
    contractChallengeId: { type: String, required: true, unique: true },
    fundingTxHash: { type: String },
  },
  { timestamps: true }
);

challengeSchema.index({ status: 1, category: 1, difficulty: 1 });

export default model<IChallenge>("Challenge", challengeSchema);
