import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Client } from './S3Client';
import type { FileObject } from './fileInterfaces';

export async function retrieveUserFiles(userEmail: string): Promise<FileObject[]> {
    
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix:  `${userEmail}/`,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const files = response.Contents || [];

    return files.map(file => ({
      key: file.Key!,
      size: file.Size!,
      lastModified: file.LastModified!,
      etag: file.ETag!,
      url: `s3://${bucketName}/${file.Key}`
    }));
  } catch (error) {
    console.error('Error retrieving user files:', error);
    throw error;
  }
}