import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error('Admin fetch messages error:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id, isRead, replied } = await req.json();
    if (!id) return NextResponse.json({ error: 'Message ID required' }, { status: 400 });

    const updateData: Record<string, boolean> = {};
    if (isRead !== undefined) updateData.isRead = Boolean(isRead);
    if (replied !== undefined) updateData.replied = Boolean(replied);

    const message = await prisma.contactMessage.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error('Admin update message error:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}
