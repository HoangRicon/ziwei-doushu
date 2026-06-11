import { NextRequest, NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';

export async function POST(req: NextRequest) {
  try {
    const info = await req.json() as BirthInfo;

    if (!info.year || !info.month || !info.day || info.hour === undefined || !info.gender) {
      return NextResponse.json({ error: 'Thiếu thông tin sinh' }, { status: 400 });
    }

    const chart = generateChart(info);
    return NextResponse.json(chart);
  } catch (err) {
    console.error('Generate chart error:', err);
    return NextResponse.json({ error: 'Lỗi khi sắp xếp bản đồ' }, { status: 500 });
  }
}
