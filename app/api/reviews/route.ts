import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { z } from 'zod';

const reviewSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5, 'Review must be at least 5 characters'),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    const user = await getCurrentUser();

    if (courseId && user) {
      const existingReview = await prisma.review.findFirst({
        where: {
          courseId,
          userId: user.id,
        },
      });
      return NextResponse.json({ review: existingReview });
    }

    if (courseId) {
      const reviews = await prisma.review.findMany({
        where: {
          courseId,
          isApproved: true,
        },
        include: {
          user: { select: { name: true, avatar: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return NextResponse.json({ reviews });
    }

    return NextResponse.json({ error: 'courseId is required' }, { status: 400 });
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to submit a review' }, { status: 401 });
    }

    const body = await req.json();
    const result = reviewSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { courseId, rating, comment } = result.data;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId,
        },
      },
    });

    if (!enrollment && user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Only enrolled students can submit a review for this course' },
        { status: 403 }
      );
    }

    // Check if user already submitted a review for this course
    const existing = await prisma.review.findFirst({
      where: {
        userId: user.id,
        courseId,
      },
    });

    let review;
    if (existing) {
      review = await prisma.review.update({
        where: { id: existing.id },
        data: {
          rating,
          comment: comment.trim(),
          isApproved: true,
        },
        include: {
          user: { select: { name: true, avatar: true } },
        },
      });
    } else {
      review = await prisma.review.create({
        data: {
          userId: user.id,
          courseId,
          rating,
          comment: comment.trim(),
          isApproved: true,
        },
        include: {
          user: { select: { name: true, avatar: true } },
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (error) {
    console.error('Submit review error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}

