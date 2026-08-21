import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: { orderBy: { order: 'asc' } },
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json({ course });
  } catch (error) {
    console.error('Admin get course error:', error);
    return NextResponse.json({ error: 'Failed to fetch course' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await req.json();

    const {
      title,
      slug,
      shortDescription,
      description,
      price,
      originalPrice,
      thumbnail,
      previewVideo,
      level,
      category,
      badge,
      instructor,
      duration,
      requirements,
      learningOutcomes,
      faqs,
      published,
      status,
      isReadyToSell,
    } = body;

    const discount =
      originalPrice && price
        ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100)
        : null;

    const courseStatus = status || (isReadyToSell === false ? 'UPCOMING' : 'LIVE');

    const updated = await prisma.course.update({
      where: { id },
      data: {
        title,
        slug,
        shortDescription,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount,
        thumbnail,
        previewVideo,
        level,
        category,
        badge,
        status: courseStatus,
        isReadyToSell: courseStatus === 'LIVE' && isReadyToSell !== false,
        instructor,
        duration,
        requirements: typeof requirements === 'string' ? requirements : JSON.stringify(requirements || []),
        learningOutcomes: typeof learningOutcomes === 'string' ? learningOutcomes : JSON.stringify(learningOutcomes || []),
        faqs: typeof faqs === 'string' ? faqs : JSON.stringify(faqs || []),
        published: Boolean(published),
      },
    });

    return NextResponse.json({ success: true, course: updated });
  } catch (error) {
    console.error('Admin update course error:', error);
    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    const body = await req.json();
    const { status, isReadyToSell, published } = body;

    const data: any = {};
    if (status !== undefined) {
      data.status = status;
      data.isReadyToSell = status === 'LIVE';
      data.published = status !== 'DRAFT';
    }
    if (isReadyToSell !== undefined) data.isReadyToSell = Boolean(isReadyToSell);
    if (published !== undefined) data.published = Boolean(published);

    const updated = await prisma.course.update({
      where: { id },
      data,
    });

    return NextResponse.json({
      success: true,
      message: `Course "${updated.title}" status updated to ${updated.status}`,
      course: updated,
    });
  } catch (error) {
    console.error('Admin patch course error:', error);
    return NextResponse.json({ error: 'Failed to patch course status' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await params;
    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Admin delete course error:', error);
    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });
  }
}
