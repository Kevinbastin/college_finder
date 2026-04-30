import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const minFees = searchParams.get('minFees');
    const maxFees = searchParams.get('maxFees');
    const naac = searchParams.get('naac') || '';
    const minRating = searchParams.get('minRating');
    const courses = searchParams.get('courses') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const sort = searchParams.get('sort') || 'rating';
    const limit = 12;

    const where: Prisma.CollegeWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (state) where.state = state;
    if (type === 'GOVERNMENT' || type === 'PRIVATE') where.type = type;
    if (minFees) where.annualFees = { ...((where.annualFees as any) || {}), gte: parseInt(minFees) };
    if (maxFees) where.annualFees = { ...((where.annualFees as any) || {}), lte: parseInt(maxFees) };
    if (naac) where.naacGrade = { in: naac.split(',') };
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (courses) where.courses = { hasSome: courses.split(',') };

    const orderBy: Prisma.CollegeOrderByWithRelationInput = 
      sort === 'fees_asc' ? { annualFees: 'asc' } :
      sort === 'fees_desc' ? { annualFees: 'desc' } :
      sort === 'name' ? { name: 'asc' } :
      sort === 'newest' ? { createdAt: 'desc' } :
      { rating: 'desc' };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Colleges API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
