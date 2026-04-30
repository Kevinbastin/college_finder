import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }
  try {
    const { questionId, text } = await request.json();
    if (!text || text.length < 5 || text.length > 1000) {
      return NextResponse.json({ error: 'Validation failed', details: { text: 'Answer must be 5-1000 characters' } }, { status: 400 });
    }
    const question = await prisma.question.findUnique({ where: { id: questionId } });
    if (!question) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const answer = await prisma.answer.create({
      data: { text, userId: session.user.id, questionId },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json({ answer }, { status: 201 });
  } catch (error) {
    console.error('Create answer error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
