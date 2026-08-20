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

    const body = await req.json();
    const { moduleId, title, description, videoUrl, duration, isPreview, resources, order } = body;

    if (!moduleId || !title || !videoUrl) {
      return NextResponse.json({ error: 'Module ID, title and video URL are required' }, { status: 400 });
    }

    const currentCount = await prisma.lesson.count({ where: { moduleId } });

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title,
        description: description || '',
        videoUrl,
        duration: duration || '15m',
        isPreview: Boolean(isPreview),
        order: order ?? currentCount + 1,
        resources: typeof resources === 'string' ? resources : JSON.stringify(resources || []),
      },
    });

    return NextResponse.json({ success: true, lesson }, { status: 201 });
  } catch (error) {
    console.error('Admin create lesson error:', error);
    return NextResponse.json({ error: 'Failed to create lesson' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { lessonId, title, description, videoUrl, duration, isPreview, resources } = body;

    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        description,
        videoUrl,
        duration,
        isPreview: Boolean(isPreview),
        resources: typeof resources === 'string' ? resources : JSON.stringify(resources || []),
      },
    });

    return NextResponse.json({ success: true, lesson: updated });
  } catch (error) {
    console.error('Admin update lesson error:', error);
    return NextResponse.json({ error: 'Failed to update lesson' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { lessonId } = await req.json();
    if (!lessonId) return NextResponse.json({ error: 'Lesson ID required' }, { status: 400 });

    await prisma.lesson.delete({ where: { id: lessonId } });
    return NextResponse.json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    console.error('Admin delete lesson error:', error);
    return NextResponse.json({ error: 'Failed to delete lesson' }, { status: 500 });
  }
}
