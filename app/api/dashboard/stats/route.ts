import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [enrollments, sessions, orders, certificates] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
          course: {
            include: {
              modules: {
                include: {
                  lessons: { select: { id: true, duration: true } },
                },
              },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      }),
      prisma.sessionBooking.findMany({
        where: { userId: user.id },
        orderBy: { bookingDate: 'asc' },
      }),
      prisma.order.findMany({
        where: { userId: user.id },
        include: {
          course: { select: { title: true, thumbnail: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.certificate.findMany({
        where: { userId: user.id },
        orderBy: { issueDate: 'desc' },
      }),
    ]);

    const completedCoursesCount = enrollments.filter((e) => e.progressPercent >= 100).length;
    const totalEnrolled = enrollments.length;

    const formattedEnrollments = enrollments.map((e) => {
      const totalLessons = e.course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      return {
        id: e.id,
        courseId: e.course.id,
        title: e.course.title,
        slug: e.course.slug,
        thumbnail: e.course.thumbnail,
        instructor: e.course.instructor,
        duration: e.course.duration,
        progressPercent: e.progressPercent,
        totalLessons,
        enrolledAt: e.enrolledAt,
        completedAt: e.completedAt,
      };
    });

    return NextResponse.json({
      stats: {
        totalEnrolled,
        completedCoursesCount,
        upcomingSessionsCount: sessions.filter((s) => s.status === 'CONFIRMED').length,
        certificatesCount: certificates.length,
      },
      enrollments: formattedEnrollments,
      sessions,
      orders,
      certificates,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
