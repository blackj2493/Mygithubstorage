import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';

export async function GET(request: Request) {
  try {
    // Create S3 client
    const s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    // Test connection by listing buckets
    const command = new ListBucketsCommand({});
    const response = await s3.send(command);

    return NextResponse.json({
      success: true,
      message: 'AWS connection successful',
      buckets: response.Buckets?.map(b => b.Name),
    });
  } catch (error: any) {
    console.error('AWS Error:', error);
    return NextResponse.json({
      success: false,
      message: 'AWS connection failed',
      error: error.message,
    }, { status: 500 });
  }
}