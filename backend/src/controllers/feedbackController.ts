import { Response } from "express";
import Feedback from "../models/Feedback";
import { AuthedRequest } from "../middleware/auth";

export async function submitFeedback(req: AuthedRequest, res: Response) {
  if (!req.user) return res.status(401).json({ error: "Not authenticated" });

  const { rating, message } = req.body as { rating?: number; message?: string };
  if (!rating || rating < 1 || rating > 5 || !message) {
    return res.status(400).json({ error: "rating (1-5) and message are required" });
  }

  const feedback = await Feedback.create({
    userId: req.user.userId,
    rating,
    message,
    role: req.user.role,
  });

  return res.status(201).json({ feedback });
}
