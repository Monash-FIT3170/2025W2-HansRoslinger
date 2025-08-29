import { PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs/promises';
import path from 'path';
import { s3Client } from './S3Client';

import type { FileUpload, UploadResult } from './fileInterfaces';

export async function uploadFile(
  userId: string, 
  file: FileUpload, 
): Promise<UploadResult> {
  try {
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3BucketUrl = `s3://${bucketName}/${userId}/`;
    const fileContent = await fs.readFile(file.path);

    const fileName = path.basename(file.path);
    const s3Key = `${s3BucketUrl}${fileName}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
      Body: fileContent
    });

    const result = await s3Client.send(command);
    
    return {
      fileName,
      s3Key,
      success: true,
      etag: result.ETag,
      location: `s3://${bucketName}/${s3Key}`,
      size: fileContent.length
    };

  } catch (error) {
    console.error('Error retrieving user files:', error);
    throw error;
  }
}