import { NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

// Configure S3 client outside of the handler
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: Request) {
  try {
    // Log environment variables (remove in production)
    console.log('AWS Config:', {
      region: process.env.AWS_REGION,
      bucket: process.env.AWS_BUCKET_NAME,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
    });

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      files.map(async (file) => {
        try {
          const buffer = Buffer.from(await file.arrayBuffer());
          const filename = `${uuidv4()}-${file.name.replace(/\s/g, '-')}`;

          await s3.send(new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
          }));

          return {
            success: true,
            filename,
            url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`
          };
        } catch (error) {
          console.error('Error uploading file:', file.name, error);
          return {
            success: false,
            filename: file.name,
            error: error instanceof Error ? error.message : 'Upload failed'
          };
        }
      })
    );

    return NextResponse.json({ results: uploadResults });

  } catch (error) {
    console.error('Upload handler error:', error);
    return NextResponse.json(
      { error: 'Upload failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}