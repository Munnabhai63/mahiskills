import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import BlogArticleView from '@/components/BlogArticleView';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mahiskills.in';

  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!post || !post.isPublished) {
      return {
        title: 'Article Not Found | MAHI SKILLS',
        description: 'The requested growth article could not be found.',
      };
    }

    const title = post.seoTitle || `${post.title} | MAHI SKILLS`;
    const description = post.seoDescription || post.excerpt;
    const url = `${baseUrl}/blog/${post.slug}`;
    const image = post.coverImage.startsWith('http')
      ? post.coverImage
      : `${baseUrl}${post.coverImage}`;

    return {
      title,
      description,
      keywords: [
        'MAHI SKILLS',
        'Munna Bhai',
        post.category,
        'online income',
        'digital growth',
        'creator economy',
        'freelancing India',
      ],
      authors: [{ name: post.author || 'Munna Bhai', url: `${baseUrl}/about` }],
      creator: 'Munna Bhai',
      publisher: 'MAHI SKILLS',
      alternates: {
        canonical: url,
      },
      openGraph: {
        title,
        description,
        url,
        siteName: 'MAHI SKILLS',
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
        type: 'article',
        publishedTime: (post.publishedAt || post.createdAt).toISOString(),
        modifiedTime: post.updatedAt.toISOString(),
        authors: [post.author || 'Munna Bhai'],
        section: post.category,
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
        creator: '@mahiskills',
      },
    };
  } catch {
    return {
      title: 'Blog & Insights | MAHI SKILLS',
      description: 'Practical digital growth blueprints and monetization strategies by Munna Bhai.',
    };
  }
}

export default async function SingleBlogPostPage({ params }: Props) {
  const { slug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mahiskills.in';

  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      category: post.category,
      id: { not: post.id },
      isPublished: true,
    },
    take: 3,
  });

  // Generate Schema.org JSON-LD Structured Data for Google Rich Snippets
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage.startsWith('http')
      ? post.coverImage
      : `${baseUrl}${post.coverImage}`,
    datePublished: (post.publishedAt || post.createdAt).toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author || 'Munna Bhai',
      url: `${baseUrl}/about`,
      jobTitle: 'Founder & Lead Growth Mentor',
      worksFor: {
        '@type': 'Organization',
        name: 'MAHI SKILLS',
      },
    },
    publisher: {
      '@type': 'Organization',
      name: 'MAHI SKILLS',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/brand-logo.png`,
      },
    },
    articleSection: post.category,
    wordCount: post.content.split(/\s+/).length,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${baseUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `${baseUrl}/blog/${post.slug}`,
      },
    ],
  };

  // Convert dates to ISO strings for client serialization
  const serializedPost = {
    ...post,
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  };

  const serializedRelated = relatedPosts.map((r) => ({
    ...r,
    publishedAt: (r.publishedAt || r.createdAt).toISOString(),
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <>
      {/* Schema.org Structured Data for Google Indexing & Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <BlogArticleView post={serializedPost} relatedPosts={serializedRelated} />
    </>
  );
}
