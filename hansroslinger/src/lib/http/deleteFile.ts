import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client } from './S3Client';

export async function deleteFile(userEmail: string, keyOrFileName: string): Promise<{ success: boolean; s3Key: string; }> {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const s3Key = keyOrFileName.includes('/') ? keyOrFileName : `${userEmail}/${keyOrFileName}`;

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: s3Key,
    });

    await s3Client.send(command);
    return { success: true, s3Key };
  } catch (error) {
    console.error('Error deleting S3 object:', error);
    throw error;
  }
}

