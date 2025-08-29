import { PutObjectCommand} from '@aws-sdk/client-s3';
import { getUser } from '../../database/common/user/getUser';
import { updateS3BucketUrl } from '../../database/common/user/updateS3BucketUrl';
import { s3Client } from './S3Client';

export async function createS3UserBucket(user_email: string){
    const bucketName = process.env.S3_BUCKET_NAME
    
    const user = await getUser(user_email);
    if (!user) {
        throw new Error(`User not found with email: ${user_email}`);
    }

    const s3BucketUrl = `s3://${bucketName}/${user.id}/`;
    const folderKey = `${user.id}/`;
        
    await s3Client.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: folderKey,
        Body: '',
        ContentType: 'application/x-directory'
    }));

    await updateS3BucketUrl(user.id, s3BucketUrl);
}