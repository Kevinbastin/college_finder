import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

function signatureFromIds(ids: string[]) {
  return [...new Set(ids)].sort().join('|');
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const comparisons = await prisma.savedComparison.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    const collegeIds = [...new Set(comparisons.flatMap(c => c.collegeIds))];
    const colleges = collegeIds.length
      ? await prisma.college.findMany({ where: { id: { in: collegeIds } } })
      : [];

    const collegeMap = new Map(colleges.map(c => [c.id, c]));

    return NextResponse.json({
      comparisons: comparisons.map(c => ({
        ...c,
        colleges: c.collegeIds.map(id => collegeMap.get(id)).filter(Boolean),
      })),
    });
  } catch (error) {
    console.error('Get comparisons error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const collegeIds = Array.isArray(body.collegeIds) ? body.collegeIds.filter(Boolean) : [];

    if (collegeIds.length < 2 || collegeIds.length > 3) {
      return NextResponse.json({ error: 'Validation failed', details: { collegeIds: 'Select 2 to 3 colleges' } }, { status: 400 });
    }

    const signature = signatureFromIds(collegeIds);
    const existing = await prisma.savedComparison.findUnique({
      where: { userId_signature: { userId: session.user.id, signature } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already saved' }, { status: 409 });
    }

    const colleges = await prisma.college.findMany({
      where: { id: { in: collegeIds } },
      select: { id: true },
    });

    if (colleges.length !== collegeIds.length) {
      return NextResponse.json({ error: 'One or more colleges not found' }, { status: 404 });
    }

    const saved = await prisma.savedComparison.create({
      data: {
        userId: session.user.id,
        signature,
        collegeIds,
      },
    });

    return NextResponse.json({ comparison: saved }, { status: 201 });
  } catch (error) {
    console.error('Save comparison error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}