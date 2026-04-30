import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }
    return NextResponse.json({ college });
  } catch (error) {
    console.error('College detail error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
