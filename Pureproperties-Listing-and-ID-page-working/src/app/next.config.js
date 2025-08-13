// app/api/test/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    environment: process.env.NODE_ENV,
    hasToken: !!process.env.PROPTX_DLA_TOKEN,
    tokenFirstChars: process.env.PROPTX_DLA_TOKEN?.substring(0, 10),
    availableEnvVars: Object.keys(process.env)
  });
}