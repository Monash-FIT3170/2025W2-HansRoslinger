import { GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client } from "./S3Client";

export async function getObject(userEmail: string, keyOrFileName: string) {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Key = keyOrFileName.includes("/")
      ? keyOrFileName
      : `${userEmail}/${keyOrFileName}`;

    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    const response = await s3Client.send(command);
    return {
      body: response.Body,
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      etag: response.ETag,
      s3Key,
      bucket: bucketName,
    };
  } catch (error) {
    console.error("Error getting S3 object:", error);
    throw error;
  }
}
