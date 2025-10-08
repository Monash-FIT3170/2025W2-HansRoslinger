import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";

export async function uploadBufferToS3(
  userEmail: string,
  fileName: string,
  buffer: Buffer,
  collectionID: string = "Home",
) {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Key = `${userEmail}/${collectionID}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: buffer,
    });

    const result = await s3Client.send(command);

    return {
      fileName,
      s3Key,
      success: true,
      etag: result.ETag,
      location: `s3://${bucketName}/${s3Key}`,
      size: buffer.length,
    };
  } catch (error) {
    console.error("Error uploading buffer to S3:", error);
    throw error;
  }
}
