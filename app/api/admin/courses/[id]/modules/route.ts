import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id: courseId } = await params;
    const { title, order } = await req.json();

    if (!title) {
      return NextResponse.json({ error: 'Module title is required' }, { status: 400 });
    }

    const currentCount = await prisma.courseModule.count({ where: { courseId } });

    const moduleRecord = await prisma.courseModule.create({
      data: {
        courseId,
        title,
        order: order ?? currentCount + 1,
      },
    });

    return NextResponse.json({ success: true, module: moduleRecord }, { status: 201 });
  } catch (error) {
    console.error('Admin create module error:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { moduleId } = await req.json();
    if (!moduleId) return NextResponse.json({ error: 'Module ID required' }, { status: 400 });

    await prisma.courseModule.delete({ where: { id: moduleId } });
    return NextResponse.json({ success: true, message: 'Module deleted' });
  } catch (error) {
    console.error('Admin delete module error:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}
