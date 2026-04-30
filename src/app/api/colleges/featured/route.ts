import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const colleges = await prisma.college.findMany({
      orderBy: { rating: 'desc' },
      take: 6,
    });
    return NextResponse.json({ colleges });
  } catch (error) {
    console.error('Featured colleges error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
