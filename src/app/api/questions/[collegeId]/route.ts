import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ collegeId: string }> }) {
  try {
    const { collegeId } = await params;
    const questions = await prisma.question.findMany({
      where: { collegeId },
      include: { user: { select: { name: true } }, _count: { select: { answers: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
