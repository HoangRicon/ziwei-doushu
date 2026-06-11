// app/api/share/[token]/route.ts — GET public chart by share token
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

type Params = { params: Promise<{ token: string }> };

// GET /api/share/[token]
export async function GET(_req: NextRequest, { params }: Params) {
  const { token } = await params;

  const chart = await db.ziweiChart.findUnique({
    where: { shareToken: token },
    select: {
      id: true,
      name: true,
      isPublic: true,
      viewCount: true,
      birthInfo: true,
      lunarInfo: true,
      chartData: true,
      createdAt: true,
    },
  });

  if (!chart || !chart.isPublic) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // Increment view count (non-blocking)
  db.ziweiChart.update({
    where: { id: chart.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  return NextResponse.json(chart);
}
