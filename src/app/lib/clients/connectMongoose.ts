import mongoose from "mongoose";

export function connectMongoose() {
  const db_url = process.env.DATABASE_URL;
  if (!db_url) {
    throw new Error('Invalid/Missing environment variable: "DATABASE_URL"');
  }
  mongoose.connect(db_url);
}
