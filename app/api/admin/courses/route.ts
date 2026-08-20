import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const courses = await prisma.course.findMany({
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        _count: {
          select: { enrollments: true, reviews: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Admin get courses error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

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
    } = body;

    if (!title || !slug || !price) {
      return NextResponse.json({ error: 'Title, slug and price are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');

    const existing = await prisma.course.findUnique({ where: { slug: cleanSlug } });
    if (existing) {
      return NextResponse.json({ error: 'A course with this slug already exists' }, { status: 409 });
    }

    const course = await prisma.course.create({
      data: {
        title,
        slug: cleanSlug,
        shortDescription: shortDescription || '',
        description: description || '',
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: originalPrice && price ? Math.round(((Number(originalPrice) - Number(price)) / Number(originalPrice)) * 100) : null,
        thumbnail: thumbnail || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
        previewVideo: previewVideo || null,
        level: level || 'All Levels',
        category: category || 'Digital Growth',
        badge: badge || null,
        instructor: instructor || 'Munna Bhai',
        duration: duration || '10+ Hours',
        requirements: typeof requirements === 'string' ? requirements : JSON.stringify(requirements || []),
        learningOutcomes: typeof learningOutcomes === 'string' ? learningOutcomes : JSON.stringify(learningOutcomes || []),
        faqs: typeof faqs === 'string' ? faqs : JSON.stringify(faqs || []),
        published: published !== false,
      },
    });

    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error) {
    console.error('Admin create course error:', error);
    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });
  }
}
