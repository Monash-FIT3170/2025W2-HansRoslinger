import { ListObjectsV2Command } from "@aws-sdk/client-s3";
import { s3Client } from "./s3Client";
import type { FileObject } from "./fileInterfaces";


export async function retrieveUserFiles(
  userEmail: string,
  collection: string = "Home",
): Promise<FileObject[]> {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    //const prefix = collection.endsWith("/") ? collection : `${collection}/`;

    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: `${userEmail}/${collection}`,
      MaxKeys: 1000,
    });

    const response = await s3Client.send(command);
    const files = response.Contents || [];

    return files.map((file) => ({
      key: file.Key!,
      size: file.Size!,
      lastModified: file.LastModified!,
      etag: file.ETag!,
      url: `s3://${bucketName}/${file.Key}`,
    }));
  } catch (error) {
    console.error("Error retrieving user files:", error);
    throw error;
  }
}
