'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import InsightPanel from '@/components/InsightPanel';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * Trang lá số Tử Vi - Demo công cụ sắp lá số nguồn mở
 */
export default function ChartPage() {
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());

  // ── Chưa sắp lá số: Hiển thị biểu mẫu thông tin sinh ──
  if (!chart) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--color-bg-page)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1 className="heading-2 mb-3">Lá số Tử Vi</h1>
            <p className="body" style={{ color: 'var(--color-text-muted)' }}>
              Hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ
            </p>
          </div>
          <BirthForm onSubmit={(info: BirthInfo) => setChart(generateChart(info))} />
        </motion.div>
      </main>
    );
  }

  // ── Đã sắp lá số: Hiển thị bản đồ + Giải đoán ──
  return (
    <main className="min-h-screen px-4 py-6" style={{ background: 'var(--color-bg-page)' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-2">Lá số Tử Vi</h1>
            <p className="body mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ
            </p>
          </div>
          <button
            type="button"
            onClick={() => { setChart(null); setSelectedPalace(null); }}
            className="btn-ghost"
          >
            Sắp lá số mới
          </button>
        </div>

        <div className="mt-6">
          <TimeNav
            chart={chart}
            view={view}
            liunianYear={liunianYear}
            onViewChange={setView}
            onYearChange={setLiunianYear}
          />
        </div>

        <div className="grid gap-6 mt-6 lg:grid-cols-[1fr_380px] grid-cols-1">
          <ChartBoard chart={chart} onPalaceSelect={setSelectedPalace} />
          <InsightPanel chart={chart} selectedPalace={selectedPalace} />
        </div>
      </div>
    </main>
  );
}
