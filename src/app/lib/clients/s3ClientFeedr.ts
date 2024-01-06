import { S3Client } from "@aws-sdk/client-s3";

if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_ACCESS_KEY) {
  throw new Error("Missing S3_ACCESS_KEY or S3_SECRET_ACCESS_KEY");
}

export const S3ClientFeedr = new S3Client({
  region: "eu-central-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});
