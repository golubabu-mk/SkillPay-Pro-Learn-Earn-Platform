import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import * as Sentry from "@sentry/node";
import { connectDatabase } from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import challengeRoutes from "./routes/challengeRoutes";
import submissionRoutes from "./routes/submissionRoutes";
import achievementRoutes from "./routes/achievementRoutes";
import feedbackRoutes from "./routes/feedbackRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const PORT = process.env.PORT || 4000;

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || "development",
    tracesSampleRate: 0.2,
  });
}

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("[error]", err);
  if (process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

async function start() {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`[server] SkillPay Pro API running on port ${PORT}`);
    });
  } catch (err) {
    console.error("[server] Failed to start:", err);
    process.exit(1);
  }
}

start();
