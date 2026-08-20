import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              select: {
                id: true,
                title: true,
                duration: true,
                isPreview: true,
                order: true,
                description: true,
              },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          include: {
            user: {
              select: { name: true, avatar: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    let isEnrolled = false;
    let progressPercent = 0;

    if (user) {
      if (user.role === 'ADMIN') {
        isEnrolled = true;
      } else {
        const enrollment = await prisma.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
        });
        if (enrollment) {
          isEnrolled = true;
          progressPercent = enrollment.progressPercent;
        }
      }
    }

    let requirements = [];
    let learningOutcomes = [];
    let faqs = [];

    try {
      requirements = JSON.parse(course.requirements || '[]');
    } catch {}
    try {
      learningOutcomes = JSON.parse(course.learningOutcomes || '[]');
    } catch {}
    try {
      faqs = JSON.parse(course.faqs || '[]');
    } catch {}

    const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);

    return NextResponse.json({
      course: {
        ...course,
        requirements,
        learningOutcomes,
        faqs,
        totalLessons,
        isEnrolled,
        progressPercent,
      },
    });
  } catch (error) {
    console.error('Course detail fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}
