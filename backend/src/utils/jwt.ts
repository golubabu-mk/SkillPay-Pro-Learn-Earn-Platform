import jwt from "jsonwebtoken";
import { Types } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  walletAddress: string;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export function toObjectId(id: string): Types.ObjectId {
  return new Types.ObjectId(id);
}
