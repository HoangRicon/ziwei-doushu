// app/api/charts/route.ts — GET list, POST create
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { CreateChartSchema } from '@/lib/validators/chart';
import crypto from 'crypto';

// GET /api/charts — list user's charts
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '12', 10), 50);
  const skip = (page - 1) * limit;
  const search = searchParams.get('search') ?? '';

  const where: Record<string, unknown> = { userId: session.user.id };
  if (search) {
    where.name = { contains: search, mode: 'insensitive' };
  }

  const [charts, total] = await Promise.all([
    db.ziweiChart.findMany({
      where,
      select: {
        id: true,
        name: true,
        isPublic: true,
        shareToken: true,
        viewCount: true,
        birthInfo: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    db.ziweiChart.count({ where }),
  ]);

  return NextResponse.json({
    charts,
    total,
    page,
    limit,
    hasMore: skip + charts.length < total,
  });
}

// POST /api/charts — create a new chart
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = CreateChartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, birth_info, lunar_info, chart_data, is_public } = parsed.data;

  const shareToken = is_public ? crypto.randomBytes(16).toString('hex') : null;

  const chart = await db.ziweiChart.create({
    data: {
      userId: session.user.id,
      name: name ?? null,
      birthInfo: birth_info,
      lunarInfo: lunar_info,
      chartData: chart_data,
      isPublic: is_public,
      shareToken,
    },
  });

  return NextResponse.json(chart, { status: 201 });
}
