import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');

    const where: Record<string, any> = {
      role: 'STUDENT',
    };

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatar: true,
        isActive: true,
        createdAt: true,
        enrollments: {
          include: {
            course: { select: { id: true, title: true, slug: true } },
          },
        },
        orders: {
          select: { id: true, amount: true, status: true, createdAt: true },
        },
        sessionBookings: {
          select: { id: true, bookingDate: true, startTime: true, status: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ students });
  } catch (error) {
    console.error('Admin students fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { studentId, isActive } = await req.json();
    if (!studentId) return NextResponse.json({ error: 'Student ID required' }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: studentId },
      data: { isActive: Boolean(isActive) },
      select: { id: true, name: true, email: true, isActive: true },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (error) {
    console.error('Admin student status update error:', error);
    return NextResponse.json({ error: 'Failed to update student' }, { status: 500 });
  }
}
