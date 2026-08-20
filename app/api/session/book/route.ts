import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser, hashPassword } from '@/lib/auth';
import { createRazorpayOrder } from '@/lib/razorpay';
import { z } from 'zod';

const bookingSchema = z.object({
  date: z.string().min(10, 'Valid date required'),
  startTime: z.string().min(1, 'Start time required'),
  endTime: z.string().optional(),
  studentName: z.string().min(2, 'Name is required'),
  studentEmail: z.string().email('Valid email required'),
  studentPhone: z.string().min(10, 'Valid phone number required'),
  topic: z.string().min(3, 'Please specify your discussion topic'),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = bookingSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0]?.message || 'Invalid input' }, { status: 400 });
    }

    const { date, startTime, studentName, studentEmail, studentPhone, topic, notes } = result.data;
    const normalizedEmail = studentEmail.toLowerCase().trim();

    // Check if slot is already booked for this date
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

    // Determine User ID (logged in user or find/create student by email)
    let finalUserId: string;
    const loggedInUser = await getCurrentUser();

    if (loggedInUser) {
      finalUserId = loggedInUser.id;
    } else {
      const existingDbUser = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (existingDbUser) {
        finalUserId = existingDbUser.id;
      } else {
        const defaultHash = await hashPassword('Student@123456');
        const newStudent = await prisma.user.create({
          data: {
            name: studentName,
            email: normalizedEmail,
            passwordHash: defaultHash,
            role: 'STUDENT',
            phone: studentPhone,
          },
        });
        finalUserId = newStudent.id;
      }
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
        userId: finalUserId,
        studentName,
        studentEmail: normalizedEmail,
        studentPhone,
        bookingDate: date,
        startTime,
        endTime: result.data.endTime || calculateEndTime(startTime),
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
        userId: finalUserId,
        itemType: 'SESSION',
      },
    });

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: finalUserId,
        sessionId: booking.id,
        itemType: 'SESSION',
        amount: sessionAmount,
        originalAmount: sessionAmount,
        status: 'PAID',
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

function calculateEndTime(start: string) {
  if (start.includes(' - ')) {
    return start.split(' - ')[1];
  }
  const parts = start.split(':');
  let hour = parseInt(parts[0]);
  const rest = parts[1] || '00';
  hour = hour === 12 ? 1 : hour + 1;
  return `${hour.toString().padStart(2, '0')}:${rest}`;
}
