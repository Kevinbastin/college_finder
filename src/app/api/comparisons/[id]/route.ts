import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const comparison = await prisma.savedComparison.findFirst({
      where: { id, userId: session.user.id },
    });

    if (!comparison) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.savedComparison.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete comparison error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}