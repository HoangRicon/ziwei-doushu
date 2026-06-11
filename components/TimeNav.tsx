'use client';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import { STEMS, SI_HUA_TABLE } from '@/lib/ziwei/constants';
import { vnStar, vnSiHua, vnStem } from '@/lib/ziwei/starNames';
import type { ZiweiChart } from '@/lib/ziwei/types';

export type TimeView = 'mingpan' | 'daxian' | 'liunian';

interface TimeNavProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  onViewChange: (view: TimeView) => void;
  onYearChange: (year: number) => void;
}

/** Tính chỉ số thiên can theo năm (0-9) */
export function getYearStemIndex(year: number): number {
  return ((year - 4) % 10 + 10) % 10;
}

/** Trả về bảng tứ hóa theo chỉ số thiên can */
export function buildSiHuaOverlay(stemIndex: number): Record<string, string> {
  const stars = SI_HUA_TABLE[stemIndex];
  if (!stars) return {};
  return {
    [stars[0]]: '禄',
    [stars[1]]: '权',
    [stars[2]]: '科',
    [stars[3]]: '忌',
  };
}

const SIHUA_COLORS: Record<string, string> = {
  '禄': '#4ade80',
  '权': '#60a5fa',
  '科': '#facc15',
  '忌': '#f87171',
};

const TABS: { value: TimeView; label: string }[] = [
  { value: 'mingpan', label: 'Mệnh bản' },
  { value: 'daxian', label: 'Đại hạn' },
  { value: 'liunian', label: 'Lưu niên' },
];

export default function TimeNav({
  chart,
  view,
  liunianYear,
  onViewChange,
  onYearChange,
}: TimeNavProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const currentDx = chart.daXians[chart.currentDaXianIndex];

  const accentColor = isDark ? '#D4A843' : '#9A7A1A';
  const activeBg = isDark ? 'rgba(212,168,67,0.12)' : 'rgba(154,122,26,0.08)';
  const activeBorder = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';
  const inactiveColor = isDark ? '#6A6258' : '#8A8078';

  // Tính thông tin tứ hóa
  const getOverlayInfo = (): { stemName: string; overlay: Record<string, string> } | null => {
    if (view === 'mingpan') return null;

    if (view === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (!dxPalace) return null;
      const stemIndex = dxPalace.stem;
      return {
        stemName: STEMS[stemIndex],
        overlay: buildSiHuaOverlay(stemIndex),
      };
    }

    if (view === 'liunian') {
      const stemIndex = getYearStemIndex(liunianYear);
      return {
        stemName: STEMS[stemIndex],
        overlay: buildSiHuaOverlay(stemIndex),
      };
    }

    return null;
  };

  const overlayInfo = getOverlayInfo();

  const getTabLabel = (tab: typeof TABS[number]): string => {
    if (tab.value === 'daxian' && currentDx) {
      return `${tab.label} ${currentDx.startAge}–${currentDx.endAge}`;
    }
    return tab.label;
  };

  return (
    <div>
      {/* Tab Navigation */}
      <div
        className="tab-container"
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.80)',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.10)' : 'rgba(26,21,16,0.10)'}`,
          backdropFilter: 'blur(12px)',
        }}
      >
        {TABS.map((tab) => {
          const isActive = view === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onViewChange(tab.value)}
              className={`tab-item ${isActive ? 'active' : ''}`}
              style={{
                padding: '10px 20px',
                fontSize: '17px',
                borderRadius: 'var(--radius-md)',
                fontWeight: isActive ? 600 : 500,
                background: isActive ? 'var(--color-bg-card)' : 'transparent',
                color: isActive ? accentColor : inactiveColor,
                border: isActive ? `1px solid ${activeBorder}` : '1px solid transparent',
                boxShadow: isActive ? 'var(--shadow-xs)' : 'none',
                transition: 'all var(--transition-base)',
              }}
            >
              {getTabLabel(tab)}
            </button>
          );
        })}
      </div>

      {/* Lưu niên: Year Selector */}
      {view === 'liunian' && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 mt-4"
        >
          <label className="body" style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>
            Năm:
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onYearChange(liunianYear - 1)}
              className="btn-icon"
              style={{ width: '36px', height: '36px', fontSize: '18px' }}
            >
              ‹
            </button>
            <input
              type="number"
              value={liunianYear}
              onChange={(e) => onYearChange(parseInt(e.target.value) || new Date().getFullYear())}
              className="input-base"
              style={{
                width: '100px',
                padding: '10px 14px',
                fontSize: '17px',
                textAlign: 'center',
                fontFamily: 'var(--primitive-font-mono)',
              }}
            />
            <button
              onClick={() => onYearChange(liunianYear + 1)}
              className="btn-icon"
              style={{ width: '36px', height: '36px', fontSize: '18px' }}
            >
              ›
            </button>
          </div>
        </motion.div>
      )}

      {/* Tứ hóa overlay info */}
      {overlayInfo && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-3 mt-3 flex-wrap"
          style={{ padding: '12px 16px', background: 'var(--color-bg-1)', borderRadius: 'var(--radius-md)' }}
        >
          <span className="caption" style={{ fontSize: '14px' }}>
            {view === 'daxian' ? 'Đại hạn' : `${liunianYear}`} · {vnStem(overlayInfo.stemName)} năm tứ hóa:
          </span>
          <div className="flex items-center gap-4">
            {(['禄', '权', '科', '忌'] as const).map((sh) => {
              const starName = Object.keys(overlayInfo.overlay).find(k => overlayInfo.overlay[k] === sh);
              if (!starName) return null;
              return (
                <span key={sh} style={{ fontSize: '14px', fontWeight: 600, color: SIHUA_COLORS[sh] }}>
                  {vnStar(starName)}化{vnSiHua(sh)}
                </span>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
