import mongoose from "mongoose";

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGO_URI is not set in environment variables");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(uri);
  console.log("[db] Connected to MongoDB");

  mongoose.connection.on("error", (err) => {
    console.error("[db] MongoDB connection error:", err);
  });
}
