import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Try to perform a simple query
    await prisma.$queryRaw`SELECT 1`;
    
    // If successful, try to count properties
    const count = await prisma.property.count();
    
    return NextResponse.json({ 
      status: 'Connected',
      message: 'Database connection successful',
      propertiesCount: count
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      { 
        status: 'Error',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}