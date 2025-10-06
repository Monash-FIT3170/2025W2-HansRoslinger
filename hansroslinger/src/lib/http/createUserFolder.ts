import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

export async function createUserFolder(user_email: string, folder?: string): Promise<string> {
  const bucketName = process.env.AWS_BUCKET_NAME;

  const s3BucketUrl = `s3://${bucketName}/${user_email}/`;
  const folderKey = `${user_email}/${folder ? folder + "/" : ""}`;

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
