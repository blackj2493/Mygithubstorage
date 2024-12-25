import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export async function testS3Connection() {
    console.log('Testing S3 connection...');
    console.log('Region:', process.env.AWS_REGION);
    console.log('Bucket:', process.env.AWS_BUCKET_NAME);
    
    const s3 = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        },
    });

    try {
        await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: 'test-connection.txt',
            Body: 'Test connection',
            ContentType: 'text/plain'
        }));
        console.log('✅ S3 Connection Successful!');
        return true;
    } catch (error) {
        console.error('❌ S3 Connection Failed:', error);
        return false;
    }
} 