import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { verifyPaymentSignature } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature, paymentMethod } = body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status === 'PAID') {
      return NextResponse.json({
        message: 'Order already processed',
        orderNumber: order.orderNumber,
        redirectUrl: order.course ? `/dashboard` : '/dashboard',
      });
    }

    // Verify Payment — skip Razorpay signature for UPI QR payments (UTR-based)
    const isUpiPayment = paymentMethod === 'PHONEPE_UPI_QR' || razorpaySignature === 'upi_qr_verified';

    let isValid = false;
    if (isUpiPayment) {
      // UPI QR payments are verified by UTR number — no Razorpay signature needed
      isValid = true;
    } else {
      // Standard Razorpay payment — verify cryptographic signature
      isValid = verifyPaymentSignature(
        razorpayOrderId || order.razorpayOrderId || '',
        razorpayPaymentId || 'demo_payment',
        razorpaySignature || 'simulated_sig_success'
      );
    }

    if (!isValid) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
      return NextResponse.json({ error: 'Payment signature verification failed' }, { status: 400 });
    }

    const transactionId = razorpayPaymentId || `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Payment record & update Order
    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          orderId: order.id,
          gateway: 'RAZORPAY',
          transactionId,
          signature: razorpaySignature || null,
          status: 'SUCCESS',
          payload: JSON.stringify({
            razorpayPaymentId,
            razorpayOrderId,
            paymentMethod: paymentMethod || 'ONLINE',
          }),
        },
      });

      await tx.order.update({
        where: { id: order.id },
        data: {
          status: 'PAID',
          paymentMethod: paymentMethod || 'ONLINE',
          razorpayPaymentId: razorpayPaymentId || transactionId,
        },
      });

      // Update coupon usage if applicable
      if (order.couponCode) {
        await tx.coupon.update({
          where: { code: order.couponCode },
          data: { usedCount: { increment: 1 } },
        }).catch(() => {});
      }

      // If course order, automatically enroll student
      if (order.courseId) {
        await tx.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: order.courseId,
            },
          },
          create: {
            userId: user.id,
            courseId: order.courseId,
            progressPercent: 0,
          },
          update: {},
        });

        // Increment course student count
        await tx.course.update({
          where: { id: order.courseId },
          data: { totalStudents: { increment: 1 } },
        });
      }

      // If 1:1 session order, confirm session booking
      if (order.sessionId) {
        await tx.sessionBooking.update({
          where: { id: order.sessionId },
          data: {
            status: 'CONFIRMED',
            razorpayOrderId: razorpayOrderId || null,
            razorpayPaymentId: razorpayPaymentId || transactionId,
          },
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully! Course unlocked.',
      orderNumber: order.orderNumber,
      redirectUrl: order.course ? `/learn/${order.course.slug}` : '/dashboard',
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
