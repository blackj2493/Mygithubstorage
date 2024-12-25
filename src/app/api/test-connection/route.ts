import { NextResponse } from 'next/server';
import { testS3Connection } from '@/utils/testConnections';

// Add specific allowed methods
export const runtime = 'edge'; // Optional: Use edge runtime
export const dynamic = 'force-dynamic'; // Optional: Disable caching

// Define allowed methods
export async function GET(request: Request) {
    try {
        const isS3Connected = await testS3Connection();
        return NextResponse.json({
            s3Connected: isS3Connected,
            message: 'Connection test completed'
        });
    } catch (error) {
        console.error('Error testing connection:', error);
        return NextResponse.json(
            { error: 'Connection test failed', details: error },
            { status: 500 }
        );
    }
}

// Add OPTIONS method to handle preflight requests
export async function OPTIONS(request: Request) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST() {
    return GET();
} 