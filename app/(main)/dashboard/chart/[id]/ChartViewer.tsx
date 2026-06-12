'use client';
// app/(main)/dashboard/chart/[id]/ChartViewer.tsx
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ChartBoard from '@/components/ChartBoard';
import InterpretationPanel from '@/components/dashboard/InterpretationPanel';
import { useTheme } from '@/components/ThemeProvider';
import type { TimeView } from '@/components/TimeNav';
import type { ZiweiChart } from '@/lib/ziwei/types';

interface ChartViewerProps {
  chart: {
    id: string;
    name?: string | null;
    birthInfo: { name?: string; year: number; month: number; day: number; hour: number; gender: string };
    lunarInfo: unknown;
    chartData: {
      mingGongBranch: number;
      shenGongBranch: number;
      wuxingJu: number;
      wuxingJuName: string;
      ziweiPos: number;
      palaces: unknown[];
      daXians: unknown[];
      currentAge: number;
      currentDaXianIndex: number;
    };
    overviewInterpretation?: string | null;
    chatHistory?: { role: 'user' | 'assistant'; content: string }[];
    isPublic: boolean;
    shareToken?: string | null;
    createdAt: Date;
  };
}

export default function ChartViewer({ chart }: ChartViewerProps) {
  const router = useRouter();
  const { theme } = useTheme();
  const [name, setName] = useState(chart.name ?? '');
  const [isPublic, setIsPublic] = useState(chart.isPublic);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  const isDark = theme === 'dark';
  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/charts/${chart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, is_public: isPublic }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const res = await fetch(`/api/charts/${chart.id}/share`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      await navigator.clipboard.writeText(data.share_url);
      setIsPublic(true);
    }
  };

  // Reconstruct the full chart object for ChartBoard
  const fullChart = {
    id: chart.id,
    name: chart.name ?? undefined,
    birthInfo: chart.birthInfo as ZiweiChart['birthInfo'],
    lunarInfo: chart.lunarInfo as ZiweiChart['lunarInfo'],
    chartData: chart.chartData,
    isPublic: chart.isPublic,
    shareToken: chart.shareToken ?? undefined,
    createdAt: chart.createdAt,
    mingGongBranch: (chart.chartData as any).mingGongBranch,
    shenGongBranch: (chart.chartData as any).shenGongBranch,
    wuxingJu: (chart.chartData as any).wuxingJu,
    wuxingJuName: (chart.chartData as any).wuxingJuName,
    ziweiPos: (chart.chartData as any).ziweiPos,
    palaces: (chart.chartData as any).palaces,
    daXians: (chart.chartData as any).daXians,
    currentAge: (chart.chartData as any).currentAge,
    currentDaXianIndex: (chart.chartData as any).currentDaXianIndex,
  } as ZiweiChart;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', background: bgPage }}>
      {/* Toolbar */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-page)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="max-w-page mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Bảng lá số
            </button>

            <div
              className="h-4 w-px"
              style={{ background: 'var(--border)' }}
            />

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaved(false); }}
                placeholder="Tên lá số..."
                className="input-luxury"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  maxWidth: '360px',
                  padding: '7px 14px',
                }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: saved ? '#22C55E' : 'var(--accent)',
                color: '#fff',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: 'transparent',
                color: 'var(--accent)',
                border: '1.5px solid var(--border-gold)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-page mx-auto px-6 py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] grid-cols-1">
          {/* Left: ChartBoard */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              className="rounded-xl p-6"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
              }}
            >
              <ChartBoard
                chart={fullChart}
                view={timeView}
                liunianYear={liunianYear}
                onPalaceSelect={() => {}}
                onStarSelect={() => {}}
                onSiHuaClick={() => {}}
              />
            </div>
          </motion.div>

          {/* Right: InterpretationPanel */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="h-[calc(100vh-180px)] sticky top-[96px]"
          >
            <InterpretationPanel
              chartId={chart.id}
              savedOverview={chart.overviewInterpretation}
              savedChatHistory={chart.chatHistory}
              birthInfo={{
                name: chart.birthInfo.name ?? 'Không tên',
                year: chart.birthInfo.year,
                month: chart.birthInfo.month,
                day: chart.birthInfo.day,
                hour: chart.birthInfo.hour,
                gender: chart.birthInfo.gender,
              }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
