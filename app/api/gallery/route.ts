// app/api/gallery/route.ts — GET paginated public charts
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/gallery — paginated public charts (no auth required)
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 24);
  const skip = (page - 1) * limit;

  const [charts, total] = await Promise.all([
    db.ziweiChart.findMany({
      where: { isPublic: true },
      select: {
        id: true,
        name: true,
        viewCount: true,
        birthInfo: true,
        createdAt: true,
        shareToken: true,
      },
      orderBy: { viewCount: 'desc' },
      skip,
      take: limit,
    }),
    db.ziweiChart.count({ where: { isPublic: true } }),
  ]);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const results = charts.map((c) => ({
    ...c,
    shareUrl: c.shareToken ? `${baseUrl}/share/${c.shareToken}` : null,
    shareToken: undefined,
  }));

  return NextResponse.json({
    charts: results,
    total,
    page,
    limit,
    hasMore: skip + charts.length < total,
  });
}
