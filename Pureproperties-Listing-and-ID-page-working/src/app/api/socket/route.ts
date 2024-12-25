import { NextResponse } from 'next/server';
import { initializeSocket } from '@/lib/socket';

export function GET(req: Request) {
  try {
    // @ts-expect-error - Next.js extends Request with socket property at runtime
    const io = initializeSocket(req.socket.server);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Socket initialization error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize socket' },
      { status: 500 }
    );
  }
}