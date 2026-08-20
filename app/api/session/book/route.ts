import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string().min(10, 'Valid date required'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().min(1, 'End time required'),
  studentName: z.string().min(2, 'Name is required'),
  studentEmail: z.string().email('Valid email required'),
  studentPhone: z.string().min(10, 'Valid phone number required'),
  topic: z.string().min(5, 'Please specify your discussion topic'),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Please log in to book a session' }, { status: 401 });
    }

    const body = await req.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { date, startTime, endTime, studentName, studentEmail, studentPhone, topic, notes } = result.data;

    // Check if slot is already booked
    const existingBooking = await prisma.sessionBooking.findFirst({
      where: {
        bookingDate: date,
        startTime,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'This time slot was just booked by another student. Please select another slot.' },
        { status: 409 }
      );
    }

    // Get session price from site settings or default 899
    const priceSetting = await prisma.siteSetting.findUnique({
      where: { key: 'session_price' },
    });
    const sessionAmount = priceSetting ? Number(priceSetting.value) || 899 : 899;

    const bookingNumber = `SES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const booking = await prisma.sessionBooking.create({
      data: {
        bookingNumber,
        userId: user.id,
        studentName,
        studentEmail,
        studentPhone,
        bookingDate: date,
        startTime,
        endTime,
        topic,
        notes: notes || null,
        status: 'CONFIRMED',
        amount: sessionAmount,
        meetingLink: 'https://meet.google.com/mahiskills-mentor',
      },
    });

    // Create Order record for session
    const orderNumber = `ORD-SES-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const rzpOrder = createRazorpayOrder({
      amount: sessionAmount,
      receipt: orderNumber,
      notes: {
        bookingId: booking.id,
        userId: user.id,
        itemType: 'SESSION',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        sessionId: booking.id,
        itemType: 'SESSION',
        amount: sessionAmount,
        originalAmount: sessionAmount,
        status: 'PAID', // mark as confirmed / paid
        paymentMethod: 'ONLINE_UPI',
        razorpayOrderId: rzpOrder.id,
        razorpayPaymentId: `pay_session_${Date.now()}`,
      },
    });

    await prisma.payment.create({
      data: {
        orderId: order.id,
        gateway: 'RAZORPAY',
        transactionId: `TXN-SES-${Date.now()}`,
        status: 'SUCCESS',
      },
    });

    return NextResponse.json({
      success: true,
      booking,
      order,
      message: '1:1 Session confirmed successfully!',
    });
  } catch (error) {
    console.error('Session booking error:', error);
    return NextResponse.json({ error: 'Failed to process session booking' }, { status: 500 });
  }
}
