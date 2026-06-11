// app/api/usage/route.ts — GET user usage stats
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

// GET /api/usage
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true },
  });

  const chartsCount = await db.ziweiChart.count({
    where: { userId: session.user.id },
  });

  const PLAN_LIMITS: Record<string, number> = {
    free: 10,
    pro: 100,
    enterprise: Infinity,
  };

  const plan = user?.plan ?? 'free';
  const limit = PLAN_LIMITS[plan] ?? 10;

  return NextResponse.json({
    charts_count: chartsCount,
    charts_limit: limit,
    plan,
  });
}
