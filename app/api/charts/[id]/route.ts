// app/api/charts/[id]/route.ts — GET, PUT, DELETE single chart
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { UpdateChartSchema } from '@/lib/validators/chart';

type Params = { params: Promise<{ id: string }> };

// GET /api/charts/[id]
export async function GET(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const chart = await db.ziweiChart.findUnique({ where: { id } });

  if (!chart) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (chart.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(chart);
}

// PUT /api/charts/[id]
export async function PUT(req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = UpdateChartSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const chart = await db.ziweiChart.findUnique({ where: { id } });

  if (!chart) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (chart.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const updated = await db.ziweiChart.update({
    where: { id },
    data: parsed.data,
  });

  return NextResponse.json(updated);
}

// DELETE /api/charts/[id]
export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const chart = await db.ziweiChart.findUnique({ where: { id } });

  if (!chart) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (chart.userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await db.ziweiChart.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
