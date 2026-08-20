import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    const where: Record<string, any> = {
      published: true,
    };

    if (category && category !== 'All') {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { shortDescription: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: {
              select: { id: true, duration: true },
            },
          },
        },
        reviews: {
          where: { isApproved: true },
          select: { rating: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    const formatted = courses.map((course) => {
      const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
      const avgRating =
        course.reviews.length > 0
          ? course.reviews.reduce((acc, r) => acc + r.rating, 0) / course.reviews.length
          : course.rating;

      return {
        id: course.id,
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription,
        price: course.price,
        originalPrice: course.originalPrice,
        discount: course.discount,
        thumbnail: course.thumbnail,
        level: course.level,
        category: course.category,
        badge: course.badge,
        instructor: course.instructor,
        duration: course.duration,
        rating: Number(avgRating.toFixed(1)),
        reviewCount: course.reviews.length || 320,
        totalStudents: course.totalStudents,
        totalLessons,
      };
    });

    return NextResponse.json({ courses: formatted });
  } catch (error) {
    console.error('Courses fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}
