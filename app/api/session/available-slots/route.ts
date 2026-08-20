import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const dateStr = searchParams.get('date'); // Format: YYYY-MM-DD

    if (!dateStr) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // Check if date is blocked
    const isBlocked = await prisma.blockedDate.findUnique({
      where: { date: dateStr },
    });

    if (isBlocked) {
      return NextResponse.json({
        available: false,
        reason: isBlocked.reason || 'This date is not available for mentorship bookings',
        slots: [],
        availableSlots: [],
      });
    }

    // Standard available hourly slots across the day
    const standardSlots = [
      { startTime: '11:00 AM', endTime: '12:00 PM', label: '11:00 AM - 12:00 PM' },
      { startTime: '12:30 PM', endTime: '01:30 PM', label: '12:30 PM - 01:30 PM' },
      { startTime: '03:00 PM', endTime: '04:00 PM', label: '03:00 PM - 04:00 PM' },
      { startTime: '04:30 PM', endTime: '05:30 PM', label: '04:30 PM - 05:30 PM' },
      { startTime: '06:00 PM', endTime: '07:00 PM', label: '06:00 PM - 07:00 PM' },
      { startTime: '07:30 PM', endTime: '08:30 PM', label: '07:30 PM - 08:30 PM' },
    ];

    // Fetch existing confirmed bookings for this date to prevent double-booking
    const existingBookings = await prisma.sessionBooking.findMany({
      where: {
        bookingDate: dateStr,
        status: { in: ['CONFIRMED', 'COMPLETED'] },
      },
      select: { startTime: true },
    });

    const bookedTimes = new Set(existingBookings.map((b) => b.startTime));

    const slots = standardSlots.map((slot) => ({
      ...slot,
      isAvailable: !bookedTimes.has(slot.startTime) && !bookedTimes.has(slot.label),
    }));

    const availableSlots = slots
      .filter((s) => s.isAvailable)
      .map((s) => s.label);

    return NextResponse.json({
      available: true,
      date: dateStr,
      slots,
      availableSlots,
    });
  } catch (error) {
    console.error('Available slots error:', error);
    return NextResponse.json({ error: 'Failed to fetch available slots' }, { status: 500 });
  }
}
