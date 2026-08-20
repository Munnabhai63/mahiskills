import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin only' }, { status: 403 });
    }

    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { reads: true },
        },
      },
    });

    const totalStudents = await prisma.user.count({ where: { role: 'STUDENT' } });

    return NextResponse.json({
      notifications: notifications.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.type,
        targetRole: n.targetRole,
        link: n.link,
        senderName: n.senderName,
        createdAt: n.createdAt,
        readCount: n._count.reads,
        totalStudents,
      })),
      totalStudents,
    });
  } catch (error) {
    console.error('Admin fetch notifications error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin only' }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, type, link, targetRole } = body;

    if (!title?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Title and Message are required' }, { status: 400 });
    }

    const notification = await prisma.notification.create({
      data: {
        title: title.trim(),
        message: message.trim(),
        type: type || 'ANNOUNCEMENT',
        link: link?.trim() || null,
        targetRole: targetRole || 'ALL',
        senderName: 'Munna Bhai',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Broadcast Notification sent to all students successfully!',
      notification,
    });
  } catch (error) {
    console.error('Admin create notification error:', error);
    return NextResponse.json({ error: 'Failed to broadcast notification' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied: Admin only' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Admin delete notification error:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
