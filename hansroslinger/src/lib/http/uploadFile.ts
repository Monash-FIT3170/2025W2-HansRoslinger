import { PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs/promises";
import path from "path";
import { s3Client } from "./s3Client";

import type { FileUpload, UploadResult } from "./fileInterface";

export async function uploadFile(
  userEmail: string,
  file: FileUpload,
): Promise<UploadResult> {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const fileContent = await fs.readFile(file.path);

    const fileName = path.basename(file.path);
    const s3Key = `${userEmail}/${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent,
    });

    const result = await s3Client.send(command);

    return {
      fileName,
      s3Key,
      success: true,
      etag: result.ETag,
      location: `s3://${bucketName}/${s3Key}`,
      size: fileContent.length,
    };
  } catch (error) {
    console.error("Error uploading user file:", error);
    throw error;
  }
}
