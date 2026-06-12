// app/(main)/dashboard/chart/[id]/page.tsx — View/edit a saved chart
import { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';
import ChartViewer from './ChartViewer';

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const chart = await db.ziweiChart.findUnique({
    where: { id },
    select: { name: true },
  });
  return {
    title: chart?.name ? `${chart.name} — Tử Vi Đẩu Số` : 'Lá số — Tử Vi Đẩu Số',
  };
}

export default async function SavedChartPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    return notFound();
  }

  const chart = await db.ziweiChart.findUnique({
    where: { id },
  });

  if (!chart || chart.userId !== session.user.id) {
    return notFound();
  }

  // Cast JSON fields to match ChartViewer interface
  const viewerChart = {
    ...chart,
    birthInfo: chart.birthInfo as { name?: string; year: number; month: number; day: number; hour: number; gender: string },
    lunarInfo: chart.lunarInfo as unknown,
    chartData: chart.chartData as {
      mingGongBranch: number;
      shenGongBranch: number;
      wuxingJu: number;
      wuxingJuName: string;
      ziweiPos: number;
      palaces: unknown[];
      daXians: unknown[];
      currentAge: number;
      currentDaXianIndex: number;
    },
    overviewInterpretation: chart.overviewInterpretation,
    chatHistory: (chart.chatHistory as { role: 'user' | 'assistant'; content: string }[]) ?? [],
  };

  return <ChartViewer chart={viewerChart} />;
}
