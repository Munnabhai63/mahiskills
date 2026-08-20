import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalRevenueResult,
      totalStudents,
      totalCourses,
      totalOrders,
      todayOrders,
      monthOrders,
      pendingSessions,
      completedSessions,
      recentOrders,
      recentBookings,
    ] = await Promise.all([
      prisma.order.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      }),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.course.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: { gte: startOfToday },
        },
      }),
      prisma.order.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: { gte: startOfMonth },
        },
      }),
      prisma.sessionBooking.count({ where: { status: 'CONFIRMED' } }),
      prisma.sessionBooking.count({ where: { status: 'COMPLETED' } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true, email: true } },
          course: { select: { title: true } },
        },
      }),
      prisma.sessionBooking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const todaySales = todayOrders._sum.amount || 0;
    const monthlySales = monthOrders._sum.amount || 0;

    return NextResponse.json({
      stats: {
        totalRevenue,
        totalStudents,
        totalCourses,
        totalOrders,
        todaySales,
        monthlySales,
        pendingSessions,
        completedSessions,
      },
      recentOrders,
      recentBookings,
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin analytics' }, { status: 500 });
  }
}
