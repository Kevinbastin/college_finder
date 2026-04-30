import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ questionId: string }> }) {
  try {
    const { questionId } = await params;
    const answers = await prisma.answer.findMany({
      where: { questionId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ answers });
  } catch (error) {
    console.error('Get answers error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
