import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const college = await prisma.college.findUnique({ where: { id } });
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    // Find similar: same state first, then nearest fees
    let similar = await prisma.college.findMany({
      where: { state: college.state, id: { not: college.id } },
      take: 3,
      orderBy: { rating: 'desc' },
    });

    if (similar.length < 3) {
      const more = await prisma.college.findMany({
        where: { id: { notIn: [college.id, ...similar.map(s => s.id)] } },
        orderBy: { annualFees: 'asc' },
        take: 3 - similar.length,
      });
      similar = [...similar, ...more];
    }

    return NextResponse.json({ colleges: similar });
  } catch (error) {
    console.error('Similar colleges error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
