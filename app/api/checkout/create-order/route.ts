import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to complete your purchase' }, { status: 401 });
    }

    const body = await req.json();
    const { courseId, sessionId, couponCode, paymentMethod } = body;

    let totalAmount = 0;
    let originalAmount = 0;
    let itemType = 'COURSE';
    let course = null;

    if (courseId) {
      course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 });
      }

      // Check if user is already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: course.id,
          },
        },
      });

      if (existingEnrollment) {
        return NextResponse.json({ error: 'You are already enrolled in this course' }, { status: 400 });
      }

      originalAmount = course.originalPrice || course.price;
      totalAmount = course.price;
      itemType = 'COURSE';
    } else if (sessionId) {
      const session = await prisma.sessionBooking.findUnique({ where: { id: sessionId } });
      if (!session) {
        return NextResponse.json({ error: 'Session booking not found' }, { status: 404 });
      }
      originalAmount = session.amount;
      totalAmount = session.amount;
      itemType = 'SESSION';
    } else {
      return NextResponse.json({ error: 'No item specified for checkout' }, { status: 400 });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    let validCouponCode: string | null = null;

    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });

      if (coupon && coupon.isActive && (!coupon.expiresAt || new Date(coupon.expiresAt) > new Date())) {
        if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
          if (totalAmount >= coupon.minPurchase) {
            validCouponCode = coupon.code;
            if (coupon.discountType === 'PERCENTAGE') {
              discountAmount = Math.round((totalAmount * coupon.discountValue) / 100);
              if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
                discountAmount = coupon.maxDiscount;
              }
            } else {
              discountAmount = coupon.discountValue;
            }
            discountAmount = Math.min(discountAmount, totalAmount);
            totalAmount = Math.max(0, totalAmount - discountAmount);
          }
        }
      }
    }

    const orderNumber = `ORD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const rzpOrder = createRazorpayOrder({
      amount: totalAmount,
      receipt: orderNumber,
      notes: {
        userId: user.id,
        itemType,
        courseId: courseId || '',
        sessionId: sessionId || '',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        courseId: courseId || null,
        sessionId: sessionId || null,
        itemType,
        amount: totalAmount,
        originalAmount,
        discountAmount,
        couponCode: validCouponCode,
        currency: 'INR',
        status: 'PENDING',
        paymentMethod: paymentMethod || 'ONLINE',
        razorpayOrderId: rzpOrder.id,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: totalAmount,
      currency: 'INR',
      razorpayOrderId: rzpOrder.id,
      keyId: rzpOrder.keyId,
      customer: {
        name: user.name,
        email: user.email,
        phone: user.phone || '',
      },
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to initiate order. Please try again.' }, { status: 500 });
  }
}
