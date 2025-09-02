import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, isAWSConfigured } from "./S3Client";

export async function createS3UserBucket(user_email: string): Promise<string> {
  const bucketName = process.env.AWS_BUCKET_NAME;

  const s3BucketUrl = `s3://${bucketName || "local"}/${user_email}/`;

  // If AWS is not configured, return a mock S3 URL without attempting to create the bucket
  if (!isAWSConfigured || !s3Client) {
    console.warn(
      `AWS not configured. Returning mock S3 URL for user: ${user_email}`,
    );
    return `s3://local-bucket/${user_email}/`;
  }

  const folderKey = `${user_email}/`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: folderKey,
      Body: "",
      ContentType: "application/x-directory",
    }),
  );

  return s3BucketUrl;
}
