import { PutObjectCommand} from '@aws-sdk/client-s3';
import { s3Client } from './S3Client';

export async function createS3UserBucket(user_email: string){
    const bucketName = process.env.S3_BUCKET_NAME

    const s3BucketUrl = `s3://${bucketName}/${user_email}/`;
    const folderKey = `${user_email}/`;
        
    await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: folderKey,
        Body: '',
        ContentType: 'application/x-directory'
    }));

    return s3BucketUrl
}