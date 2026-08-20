import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Admin blog fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { title, slug, excerpt, content, coverImage, author, category, tags, readTime, isPublished, seoTitle, seoDescription } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Title, slug and content are required' }, { status: 400 });
    }

    const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-');
    const existing = await prisma.blogPost.findUnique({ where: { slug: cleanSlug } });

    if (existing) {
      return NextResponse.json({ error: 'A post with this slug already exists' }, { status: 409 });
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: cleanSlug,
        excerpt: excerpt || '',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
        author: author || 'Munna Bhai',
        category: category || 'Growth Strategy',
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        readTime: readTime || '5 min read',
        isPublished: isPublished !== false,
        seoTitle: seoTitle || title,
        seoDescription: seoDescription || excerpt,
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    console.error('Admin create post error:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const body = await req.json();
    const { id, title, slug, excerpt, content, coverImage, author, category, tags, readTime, isPublished, seoTitle, seoDescription } = body;

    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });

    const cleanSlug = slug ? slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-') : undefined;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: cleanSlug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags: typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        readTime,
        isPublished: Boolean(isPublished),
        seoTitle,
        seoDescription,
      },
    });

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Admin update post error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAuth(['ADMIN']);
    if (auth.error) return NextResponse.json({ error: auth.error }, { status: auth.status });

    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'Post ID required' }, { status: 400 });

    await prisma.blogPost.delete({ where: { id } });
    return NextResponse.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    console.error('Admin delete post error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}
