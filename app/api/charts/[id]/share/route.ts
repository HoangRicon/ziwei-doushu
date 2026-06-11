// app/api/charts/[id]/share/route.ts — POST share, DELETE share
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import crypto from 'crypto';

type Params = { params: Promise<{ id: string }> };

// POST /api/charts/[id]/share — generate or regenerate share token
export async function POST(_req: NextRequest, { params }: Params) {
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

  const shareToken = crypto.randomBytes(16).toString('hex');

  const updated = await db.ziweiChart.update({
    where: { id },
    data: {
      shareToken,
      isPublic: true,
    },
  });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const shareUrl = `${baseUrl}/share/${shareToken}`;

  return NextResponse.json({ share_token: shareToken, share_url: shareUrl });
}

// DELETE /api/charts/[id]/share — remove share token
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

  await db.ziweiChart.update({
    where: { id },
    data: {
      shareToken: null,
      isPublic: false,
    },
  });

  return new NextResponse(null, { status: 204 });
}
