import { Schema, model, Document, Types } from "mongoose";

export interface IAchievement extends Document {
  _id: Types.ObjectId;
  learnerId: Types.ObjectId;
  challengeId: Types.ObjectId;
  title: string;
  description: string;
  issuerName: string;
  credentialHash: string; // hex BytesN<32> stored on-chain
  rewardTxHash: string;
  issuedAt: Date;
}

const achievementSchema = new Schema<IAchievement>(
  {
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    issuerName: { type: String, required: true },
    credentialHash: { type: String, required: true, unique: true },
    rewardTxHash: { type: String, required: true },
    issuedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

achievementSchema.index({ learnerId: 1, challengeId: 1 }, { unique: true });

export default model<IAchievement>("Achievement", achievementSchema);
