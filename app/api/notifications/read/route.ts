import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      const allNotifications = await prisma.notification.findMany({
        select: { id: true },
      });

      for (const n of allNotifications) {
        await prisma.notificationRead.upsert({
          where: {
            notificationId_userId: {
              notificationId: n.id,
              userId: user.id,
            },
          },
          create: {
            notificationId: n.id,
            userId: user.id,
          },
          update: {},
        }).catch(() => {});
      }

      return NextResponse.json({ success: true, message: 'All marked as read' });
    }

    if (notificationId) {
      await prisma.notificationRead.upsert({
        where: {
          notificationId_userId: {
            notificationId,
            userId: user.id,
          },
        },
        create: {
          notificationId,
          userId: user.id,
        },
        update: {},
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Mark notification read error:', error);
    return NextResponse.json({ error: 'Failed to update read status' }, { status: 500 });
  }
}
