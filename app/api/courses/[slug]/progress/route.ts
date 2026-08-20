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

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Get all lesson IDs for this course
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const allLessonIds = allLessons.map((l) => l.id);

    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId: user.id,
        lessonId: { in: allLessonIds },
        isCompleted: true,
      },
    });

    const completedLessonIds = progressRecords.map((p) => p.lessonId);
    const progressPercent = allLessonIds.length > 0
      ? Math.round((completedLessonIds.length / allLessonIds.length) * 100)
      : 0;

    // Check certificate
    const certificate = await prisma.certificate.findFirst({
      where: {
        userId: user.id,
        courseId: course.id,
      },
    });

    return NextResponse.json({
      completedLessonIds,
      progressPercent,
      isCompleted: progressPercent >= 100,
      certificateNumber: certificate?.certificateNumber || null,
    });
  } catch (error) {
    console.error('Fetch progress error:', error);
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { lessonId, isCompleted } = await req.json();

    const course = await prisma.course.findUnique({
      where: { slug },
      include: {
        modules: {
          include: { lessons: true },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Upsert lesson progress
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.id,
          lessonId,
        },
      },
      create: {
        userId: user.id,
        lessonId,
        isCompleted: isCompleted !== false,
        completedAt: new Date(),
      },
      update: {
        isCompleted: isCompleted !== false,
        completedAt: isCompleted !== false ? new Date() : null,
      },
    });

    // Calculate updated course progress
    const allLessons = course.modules.flatMap((m) => m.lessons);
    const allLessonIds = allLessons.map((l) => l.id);

    const completedCount = await prisma.lessonProgress.count({
      where: {
        userId: user.id,
        lessonId: { in: allLessonIds },
        isCompleted: true,
      },
    });

    const progressPercent = allLessonIds.length > 0
      ? Math.round((completedCount / allLessonIds.length) * 100)
      : 0;

    // Update enrollment progress
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      create: {
        userId: user.id,
        courseId: course.id,
        progressPercent,
        completedAt: progressPercent >= 100 ? new Date() : null,
      },
      update: {
        progressPercent,
        completedAt: progressPercent >= 100 ? new Date() : null,
      },
    });

    // If 100% completed, auto-issue certificate
    let newCertificate = null;
    if (progressPercent >= 100) {
      const existingCert = await prisma.certificate.findFirst({
        where: { userId: user.id, courseId: course.id },
      });

      if (!existingCert) {
        const certNum = `MS-CERT-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
        newCertificate = await prisma.certificate.create({
          data: {
            certificateNumber: certNum,
            userId: user.id,
            courseId: course.id,
            studentName: user.name,
            courseName: course.title,
            instructorName: course.instructor || 'Munna Bhai',
            verificationUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mahiskills.in'}/verify-certificate/${certNum}`,
          },
        });
      } else {
        newCertificate = existingCert;
      }
    }

    return NextResponse.json({
      success: true,
      progressPercent,
      isCompleted: progressPercent >= 100,
      certificate: newCertificate,
    });
  } catch (error) {
    console.error('Update progress error:', error);
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}
