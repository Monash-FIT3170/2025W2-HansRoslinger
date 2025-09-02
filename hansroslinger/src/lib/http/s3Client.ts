import { S3Client } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = process.env;

// Check if AWS credentials are available
export const isAWSConfigured = !!(
  AWS_REGION &&
  AWS_ACCESS_KEY_ID &&
  AWS_SECRET_ACCESS_KEY
);

if (!isAWSConfigured) {
  console.warn(
    "AWS credentials not found in .env file. S3 functionality will be disabled.",
  );
}

console.log("ENV DEBUG:", {
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || "Missing",
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY
    ? "Present"
    : "Missing",
  AWS_REGION: process.env.AWS_REGION || "Missing",
  isAWSConfigured,
});

// Only create S3Client if credentials are available
export const s3Client = isAWSConfigured
  ? new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID!,
        secretAccessKey: AWS_SECRET_ACCESS_KEY!,
      },
    })
  : null;
