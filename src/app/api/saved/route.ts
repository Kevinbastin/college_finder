import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const saved = await prisma.savedCollege.findMany({
      where: { userId: session.user.id },
      include: { college: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ saved: saved.map(s => s.college) });
  } catch (error) {
    console.error('Get saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { collegeId } = await request.json();
    if (!collegeId) {
      return NextResponse.json({ error: 'Validation failed', details: { collegeId: 'College ID required' } }, { status: 400 });
    }

    const college = await prisma.college.findUnique({ where: { id: collegeId } });
    if (!college) {
      return NextResponse.json({ error: 'College not found' }, { status: 404 });
    }

    const existing = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId } },
    });
    if (existing) {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 });
    }

    await prisma.savedCollege.create({
      data: { userId: session.user.id, collegeId },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Save college error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
