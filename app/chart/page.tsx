'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import BirthForm from '@/components/BirthForm';
import ChartBoard from '@/components/ChartBoard';
import TimeNav, { type TimeView } from '@/components/TimeNav';
import { useAuthPrompt } from '@/components/auth/AuthContext';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo, ZiweiChart, Palace } from '@/lib/ziwei/types';

/**
 * Trang lá số Tử Vi - Demo công cụ sắp lá số nguồn mở
 */
export default function ChartPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { showLoginPrompt } = useAuthPrompt();
  const [chart, setChart] = useState<ZiweiChart | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<Palace | null>(null);
  const [view, setView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState(() => new Date().getFullYear());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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
      <div className="max-w-[800px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="heading-2">Lá số Tử Vi</h1>
            <p className="body mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setChart(null); setSelectedPalace(null); }}
              className="btn-ghost"
            >
              Sắp lá số mới
            </button>
            <button
              type="button"
              disabled={saving || saved}
              onClick={async () => {
                if (!session?.user) {
                  showLoginPrompt();
                  return;
                }
                setSaving(true);
                try {
                  const res = await fetch('/api/charts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      birth_info: chart.birthInfo,
                      lunar_info: chart.lunarInfo,
                      chart_data: {
                        birthInfo: chart.birthInfo,
                        lunarInfo: chart.lunarInfo,
                        mingGongBranch: chart.mingGongBranch,
                        shenGongBranch: chart.shenGongBranch,
                        wuxingJu: chart.wuxingJu,
                        wuxingJuName: chart.wuxingJuName,
                        ziweiPos: chart.ziweiPos,
                        palaces: chart.palaces,
                        daXians: chart.daXians,
                        currentAge: chart.currentAge,
                        currentDaXianIndex: chart.currentDaXianIndex,
                      },
                      is_public: false,
                    }),
                  });
                  if (res.ok) {
                    setSaved(true);
                    router.push('/dashboard');
                  }
                } finally {
                  setSaving(false);
                }
              }}
              className="px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                background: saved ? '#22C55E' : 'var(--accent)',
                color: '#fff',
                opacity: saving ? 0.7 : 1,
                boxShadow: saved ? 'none' : '0 2px 8px rgba(154,122,26,0.25)',
              }}
            >
              {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu lá số'}
            </button>
          </div>
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

        <div className="mt-6">
          <ChartBoard chart={chart} view={view} liunianYear={liunianYear} onPalaceSelect={setSelectedPalace} />
        </div>
      </div>
    </main>
  );
}
