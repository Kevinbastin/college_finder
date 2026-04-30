import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ collegeId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  try {
    const { collegeId } = await params;
    const saved = await prisma.savedCollege.findUnique({
      where: { userId_collegeId: { userId: session.user.id, collegeId } },
    });
    if (!saved) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.savedCollege.delete({ where: { id: saved.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete saved error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
