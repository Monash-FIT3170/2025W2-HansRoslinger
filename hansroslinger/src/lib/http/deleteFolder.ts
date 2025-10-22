import { ListObjectsV2Command, DeleteObjectsCommand } from "@aws-sdk/client-s3";

import { s3Client } from "./s3Client";


export async function deleteS3Folder( folderKey: string, userEmail: string): Promise<void> {
  try {
    // Ensure the prefix ends with "/"
    const prefix = folderKey.endsWith("/") ? folderKey : `${folderKey}/`;
    const bucketName = process.env.AWS_BUCKET_NAME;
    
    const listedObjects = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        Prefix: `${userEmail}/${prefix}`,
      })
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("No objects found under this prefix.");
      return;
    }

    const deleteParams = {
      Bucket: bucketName,
      Delete: {
        Objects: listedObjects.Contents.map(obj => ({ Key: obj.Key! })),
      },
    };

    await s3Client.send(new DeleteObjectsCommand(deleteParams));

    console.log(`Deleted folder and contents at prefix: ${prefix}`);
  } catch (error) {
    console.error("Error deleting folder:", error);
  }
}
