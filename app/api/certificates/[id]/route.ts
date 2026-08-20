import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const certificate = await prisma.certificate.findUnique({
      where: { certificateNumber: id },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            thumbnail: true,
            duration: true,
          },
        },
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found or invalid ID' }, { status: 404 });
    }

    return NextResponse.json({ certificate });
  } catch (error) {
    console.error('Certificate verification error:', error);
    return NextResponse.json({ error: 'Failed to verify certificate' }, { status: 500 });
  }
}
