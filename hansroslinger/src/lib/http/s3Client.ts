import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

<<<<<<< HEAD
export const s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    });
=======
if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  throw new Error("Missing AWS credentials or region in .env file");
}

console.log("ENV DEBUG:", {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "Missing",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? "Present" : "Missing",
  AWS_REGION: process.env.AWS_REGION || "Missing",
  isAWSConfigured
});

// Only create S3Client if credentials are available
export const s3Client = isAWSConfigured ? new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID!,
    secretAccessKey: AWS_SECRET_ACCESS_KEY!,
  },
});
>>>>>>> 1674550 (fix: fix s3 client setup)
