// app/api/settings/route.ts — GET and PUT user settings
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { UpdateSettingsSchema } from '@/lib/validators/chart';

// GET /api/settings
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let settings = await db.userSettings.findUnique({
    where: { userId: session.user.id },
  });

  // Auto-create default settings if not exists
  if (!settings) {
    settings = await db.userSettings.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json(settings);
}

// PUT /api/settings
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = UpdateSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid data', details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const settings = await db.userSettings.upsert({
    where: { userId: session.user.id },
    update: parsed.data,
    create: { userId: session.user.id, ...parsed.data },
  });

  return NextResponse.json(settings);
}
