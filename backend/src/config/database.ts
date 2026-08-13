import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  console.log("[db] Connected to MongoDB");

  const User = require("../models/User").default;
  await User.collection.dropIndex("email_1").catch(() => console.log("email_1 index not found or already dropped"));

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err);
  });
}
