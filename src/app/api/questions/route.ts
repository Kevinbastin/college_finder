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
    const { collegeId, text } = await request.json();
    if (!text || text.length < 10 || text.length > 500) {
      return NextResponse.json({ error: 'Validation failed', details: { text: 'Question must be 10-500 characters' } }, { status: 400 });
    }
    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) return NextResponse.json({ error: 'College not found' }, { status: 404 });

    const question = await prisma.question.create({
      data: { text, userId: session.user.id, collegeId },
      include: { user: { select: { name: true } } },
    });
    return NextResponse.json({ question }, { status: 201 });
  } catch (error) {
    console.error('Create question error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
