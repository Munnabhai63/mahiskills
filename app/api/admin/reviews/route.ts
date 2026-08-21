import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const reviews = await prisma.review.findMany({
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Admin reviews fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error || !auth.user) return NextResponse.json({ error: auth.error || 'Unauthorized' }, { status: auth.status || 401 });

    const body = await req.json();
    const { courseId, studentName, studentEmail, rating, comment, isApproved } = body;

    if (!courseId || !comment || !rating) {
      return NextResponse.json(
        { error: 'Course, Rating (1-5), and Review comment are required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let targetUserId = auth.user.id;

    if (studentName?.trim()) {
      const cleanName = studentName.trim();
      const emailToUse = studentEmail?.trim().toLowerCase() ||
        `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@student.mahiskills.in`;

      let studentUser = await prisma.user.findUnique({ where: { email: emailToUse } });

      if (!studentUser) {
        studentUser = await prisma.user.create({
          data: {
            name: cleanName,
            email: emailToUse,
            passwordHash: '$2a$10$e74j2q03kY7aE45H4aJg1ue78.bL0s5z7Z5m/4K7R4kG5oH0m4N5e', // default hash
            role: 'STUDENT',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(cleanName)}`,
          },
        });
      }

      targetUserId = studentUser.id;
    }

    const review = await prisma.review.create({
      data: {
        userId: targetUserId,
        courseId,
        rating: Math.min(5, Math.max(1, Number(rating))),
        comment: comment.trim(),
        isApproved: isApproved !== false,
      },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    return NextResponse.json({ success: true, message: 'Review created successfully!', review }, { status: 201 });
  } catch (error) {
    console.error('Admin create review error:', error);
    return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { id, rating, comment, isApproved } = body;

    if (!id) return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = Math.min(5, Math.max(1, Number(rating)));
    if (comment !== undefined) updateData.comment = comment.trim();
    if (isApproved !== undefined) updateData.isApproved = Boolean(isApproved);

    const updated = await prisma.review.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    return NextResponse.json({ success: true, message: 'Review updated successfully', review: updated });
  } catch (error) {
    console.error('Admin edit review error:', error);
    return NextResponse.json({ error: 'Failed to edit review' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id, isApproved } = await req.json();
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 });

    const updated = await prisma.review.update({
      where: { id },
      data: { isApproved: Boolean(isApproved) },
    });

    return NextResponse.json({ success: true, review: updated });
  } catch (error) {
    console.error('Admin update review error:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Review ID required' }, { status: 400 });

    await prisma.review.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Admin delete review error:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}

