import { Schema, model, Document, Types } from "mongoose";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface ISubmission extends Document {
  _id: Types.ObjectId;
  challengeId: Types.ObjectId;
  learnerId: Types.ObjectId;
  githubLink?: string;
  liveDemoLink?: string;
  videoLink?: string;
  notes?: string;
  status: SubmissionStatus;
  reviewComment?: string;
  rewardTxHash?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

const submissionSchema = new Schema<ISubmission>(
  {
    challengeId: { type: Schema.Types.ObjectId, ref: "Challenge", required: true, index: true },
    learnerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    githubLink: { type: String },
    liveDemoLink: { type: String },
    videoLink: { type: String },
    notes: { type: String },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reviewComment: { type: String },
    rewardTxHash: { type: String },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

// A learner may only submit once per challenge
submissionSchema.index({ challengeId: 1, learnerId: 1 }, { unique: true });

export default model<ISubmission>("Submission", submissionSchema);
