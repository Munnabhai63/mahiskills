import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    // Fetch all active notifications (newest first, limit 30)
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 30,
      include: {
        reads: user ? { where: { userId: user.id } } : true,
      },
    });

    const formatted = notifications.map((n: any) => {
      const isRead = user ? Boolean(n.reads && n.reads.length > 0) : false;
      return {
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        link: n.link,
        senderName: n.senderName,
        createdAt: n.createdAt,
        isRead,
      };
    });

    const unreadCount = formatted.filter((n) => !n.isRead).length;

    return NextResponse.json({
      notifications: formatted,
      unreadCount,
    });
  } catch (error) {
    console.error('Fetch notifications error:', error);
    return NextResponse.json({ notifications: [], unreadCount: 0 }, { status: 500 });
  }
}
