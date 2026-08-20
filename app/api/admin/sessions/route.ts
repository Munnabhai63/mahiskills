import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const [bookings, availabilities, blockedDates] = await Promise.all([
      prisma.sessionBooking.findMany({
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { bookingDate: 'desc' },
      }),
      prisma.sessionAvailability.findMany({
        orderBy: { dayOfWeek: 'asc' },
      }),
      prisma.blockedDate.findMany({
        orderBy: { date: 'asc' },
      }),
    ]);

    return NextResponse.json({
      bookings,
      availabilities,
      blockedDates,
    });
  } catch (error) {
    console.error('Admin sessions fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch sessions data' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { bookingId, status, meetingLink, bookingDate, startTime, endTime, notes } = body;

    if (!bookingId) {
      return NextResponse.json({ error: 'Booking ID required' }, { status: 400 });
    }

    const updateData: Record<string, any> = {};
    if (status) updateData.status = status;
    if (meetingLink) updateData.meetingLink = meetingLink;
    if (bookingDate) updateData.bookingDate = bookingDate;
    if (startTime) updateData.startTime = startTime;
    if (endTime) updateData.endTime = endTime;
    if (notes !== undefined) updateData.notes = notes;

    const updated = await prisma.sessionBooking.update({
      where: { id: bookingId },
      data: updateData,
      include: { user: true },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error('Admin update session error:', error);
    return NextResponse.json({ error: 'Failed to update session booking' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { action, date, reason } = body;

    if (action === 'BLOCK_DATE') {
      if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

      const blocked = await prisma.blockedDate.upsert({
        where: { date },
        create: { date, reason: reason || 'Mentor unavailable' },
        update: { reason: reason || 'Mentor unavailable' },
      });

      return NextResponse.json({ success: true, blocked });
    }

    if (action === 'UNBLOCK_DATE') {
      if (!date) return NextResponse.json({ error: 'Date is required' }, { status: 400 });

      await prisma.blockedDate.delete({ where: { date } }).catch(() => {});
      return NextResponse.json({ success: true, message: 'Date unblocked' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Admin session action error:', error);
    return NextResponse.json({ error: 'Failed to perform session action' }, { status: 500 });
  }
}
