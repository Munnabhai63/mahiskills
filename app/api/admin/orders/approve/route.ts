import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { orderId, action } = await req.json();

    if (!orderId || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Order ID and action (approve/reject) required' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        course: true,
        user: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'PAID') {
      return NextResponse.json({ message: 'Order already approved' });
    }

    if (action === 'reject') {
      await prisma.$transaction(async (tx) => {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'FAILED' },
        });
        await tx.payment.updateMany({
          where: { orderId: order.id },
          data: { status: 'FAILED' },
        });
      });

      return NextResponse.json({
        success: true,
        message: `Payment rejected for ${order.user?.name || 'student'}.`,
      });
    }

    // APPROVE — enroll student + update order
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      });

      await tx.payment.updateMany({
        where: { orderId: order.id },
        data: { status: 'SUCCESS' },
      });

      if (order.couponCode) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usedCount: { increment: 1 } },
        }).catch(() => {});
      }

      if (order.courseId && order.userId) {
        await tx.enrollment.upsert({
          where: {
            userId_courseId: { userId: order.userId, courseId: order.courseId },
          },
          create: { userId: order.userId, courseId: order.courseId, progressPercent: 0 },
          update: {},
        });
        await tx.course.update({
          where: { id: order.courseId },
          data: { totalStudents: { increment: 1 } },
        });
      }

      if (order.sessionId) {
        await tx.sessionBooking.update({
          where: { id: order.sessionId },
          data: { status: 'CONFIRMED' },
        });
      }

      // Create approval notification for student
      if (order.userId) {
        await tx.notification.create({
          data: {
            title: '✅ Payment Approved!',
            message: `Your payment for "${order.course?.title || 'your order'}" has been approved! You now have full access. Start learning now!`,
            type: 'SUCCESS',
            targetRole: 'STUDENT',
            senderName: 'Mahi Skills',
            link: order.course ? `/learn/${order.course.slug}` : '/dashboard',
          },
        });
      }
    });

    // Build WhatsApp message for student
    const studentPhone = order.user?.phone?.replace(/[^0-9]/g, '') || '';
    const whatsappPhone = studentPhone.startsWith('91') ? studentPhone : `91${studentPhone}`;
    const courseName = order.course?.title || 'your course';
    const whatsappMsg = encodeURIComponent(
      `✅ *Payment Approved — MAHI SKILLS*\n\n` +
      `Hi ${order.user?.name || 'Student'} 👋\n\n` +
      `Your payment for *${courseName}* has been successfully verified and approved! 🎉\n\n` +
      `🔓 You now have *full access* to all course modules and lessons.\n\n` +
      `👉 Start learning: https://mahiskills.in/learn/${order.course?.slug || ''}\n\n` +
      `Happy Learning! 🚀\n— Munna Bhai | Mahi Skills`
    );
    const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${whatsappMsg}`;

    return NextResponse.json({
      success: true,
      message: `Payment approved for ${order.user?.name || 'student'}! Course unlocked.`,
      whatsappUrl,
      studentName: order.user?.name,
      studentPhone: order.user?.phone,
    });
  } catch (error) {
    console.error('Admin approve order error:', error);
    return NextResponse.json({ error: 'Failed to process order' }, { status: 500 });
  }
}
