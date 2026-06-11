'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { vnPalace, vnStar, vnBranch } from '@/lib/ziwei/starNames';
import PalaceCell from './PalaceCell';
import TimeNav, { type TimeView, getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

const BRANCH_SVG_POS: Record<number, [number, number]> = {
  5: [12.5, 12.5], 6: [37.5, 12.5], 7: [62.5, 12.5], 8: [87.5, 12.5],
  4: [12.5, 37.5],                                      9: [87.5, 37.5],
  3: [12.5, 62.5],                                     10: [87.5, 62.5],
  2: [12.5, 87.5], 1: [37.5, 87.5], 0: [62.5, 87.5], 11: [87.5, 87.5],
};

const CLOCKWISE_INDEX: Record<number, number> = {
  5: 0, 6: 1, 7: 2, 8: 3,
  9: 4, 10: 5,
  11: 6, 0: 7, 1: 8, 2: 9,
  3: 10, 4: 11,
};

function sortClockwise(branches: number[]): number[] {
  return [...branches].sort((a, b) => CLOCKWISE_INDEX[a] - CLOCKWISE_INDEX[b]);
}

function getSanFangSiZheng(branch: number): [number, number, number, number] {
  return [
    branch,
    (branch + 6) % 12,
    (branch + 4) % 12,
    (branch + 8) % 12,
  ];
}

const ANIMATION_ORDER = [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4];

export default function ChartBoard({ chart, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const { theme } = useTheme();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [timeView, setTimeView] = useState<TimeView>('mingpan');
  const [liunianYear, setLiunianYear] = useState<number>(new Date().getFullYear());

  const isDark = theme === 'dark';
  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (timeView === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (timeView === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = timeView === 'daxian' ? 'Hạn' : timeView === 'liunian' ? 'Niên' : undefined;

  const handlePalaceClick = (branch: number) => {
    const isDeselecting = selectedBranch === branch;
    setSelectedBranch(prev => prev === branch ? null : branch);
    if (!isDeselecting) {
      const palace = palaceMap[branch];
      if (palace) onPalaceSelect?.(palace);
    }
  };

  const sanFangBranches = selectedBranch !== null ? getSanFangSiZheng(selectedBranch) : null;
  const sanFangSet = sanFangBranches ? new Set(sanFangBranches) : null;

  const chartTitle = (() => {
    if (timeView === 'daxian') return 'Lá số Đại hạn';
    if (timeView === 'liunian') return `Lá số Lưu niên ${liunianYear}`;
    return 'Lá số Mệnh bản';
  })();

  return (
    <div className="w-full select-none">
      <TimeNav
        chart={chart}
        view={timeView}
        liunianYear={liunianYear}
        onViewChange={setTimeView}
        onYearChange={setLiunianYear}
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div
          className="text-[11px] tracking-[0.4em] uppercase mb-1 font-medium"
          style={{ color: textMuted }}
        >
          Tử Vi Đấu Số
        </div>
        <h2 className="text-base tracking-[0.2em] font-semibold" style={{ color: accent }}>
          {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}{chartTitle}
        </h2>
      </motion.div>

      <div
        className="grid rounded-xl overflow-hidden relative"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '1px',
          background: borderColor,
          border: `1px solid ${borderGold}`,
          boxShadow: `0 0 40px ${isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)'}, 0 4px 20px rgba(0,0,0,0.08)`,
        }}
      >
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;
          return (
            <div
              key={branch}
              style={{
                gridRow: row,
                gridColumn: col,
                background: bgCard,
                transition: 'background 0.2s ease',
              }}
            >
              <PalaceCell
                palace={palace}
                onClick={() => handlePalaceClick(branch)}
                onStarClick={(star) => onStarSelect?.(star, palace)}
                isSelected={selectedBranch === branch}
                isSanFang={!!(sanFangSet?.has(branch) && selectedBranch !== branch)}
                delay={i * 0.04}
                overlayStarSiHua={Object.keys(overlayData).length > 0 ? overlayData : undefined}
                overlayLabel={overlayLabel}
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, timeView)}
              />
            </div>
          );
        })}

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center p-5 gap-3"
          style={{
            gridRow: '2 / 4',
            gridColumn: '2 / 4',
            background: bgCard,
          }}
        >
          <div
            className="text-5xl select-none leading-none"
            style={{
              color: accent,
              opacity: 0.12,
              filter: `drop-shadow(0 0 12px ${isDark ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.10)'})`,
            }}
          >
            ☯
          </div>

          <div className="text-center space-y-1.5">
            <div
              className="text-[10px] tracking-[0.25em] font-semibold"
              style={{ color: accent }}
            >
              Tử Vi Đấu Số
            </div>
            <div className="text-[11px] space-y-0.5" style={{ color: textMuted }}>
              <div>
                Mệnh Cung{' '}
                <span style={{ color: accent, opacity: 0.75 }}>
                  {vnBranch(BRANCHES[chart.mingGongBranch])}
                </span>
              </div>
              <div>
                Thân Cung{' '}
                <span style={{ color: accent, opacity: 0.75 }}>
                  {vnBranch(BRANCHES[chart.shenGongBranch])}
                </span>
              </div>
              <div className="text-[10px]" style={{ color: accent, opacity: 0.8 }}>
                {chart.wuxingJuName}
              </div>
            </div>
          </div>

          {chart.currentDaXianIndex >= 0 && (() => {
            const dx = chart.daXians[chart.currentDaXianIndex];
            return (
              <div
                className="rounded-lg px-3 py-2 text-center"
                style={{
                  background: isDark ? 'rgba(147,51,234,0.08)' : 'rgba(147,51,234,0.05)',
                  border: `1px solid ${isDark ? 'rgba(147,51,234,0.25)' : 'rgba(147,51,234,0.15)'}`,
                }}
              >
                <div className="text-[9px] mb-0.5 tracking-wider font-medium" style={{ color: '#A855F7' }}>
                  Đại Hạn Hiện Tại
                </div>
                <div className="text-[13px] font-semibold tabular-nums" style={{ color: '#C084FC' }}>
                  {dx.startAge}–{dx.endAge} tuổi
                </div>
                <div className="text-[10px]" style={{ color: '#A855F7', opacity: 0.7 }}>
                  {vnPalace(dx.palaceName)}
                </div>
              </div>
            );
          })()}

          <div
            className="text-[9px] text-center leading-relaxed font-mono"
            style={{ color: textMuted, opacity: 0.75 }}
          >
            {chart.lunarInfo.lunarYear} · {chart.lunarInfo.isLeapMonth ? 'Nhuận ' : ''}
            {chart.lunarInfo.lunarMonth} · {chart.lunarInfo.lunarDay}
          </div>
        </motion.div>

        <AnimatePresence>
          {sanFangBranches !== null && (
            <motion.div
              key={`sf-${selectedBranch}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none"
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 20,
              }}
            >
              <svg
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
                style={{ display: 'block' }}
              >
                {(() => {
                  const p0 = BRANCH_SVG_POS[sanFangBranches[0]];
                  const p1 = BRANCH_SVG_POS[sanFangBranches[1]];
                  const p2 = BRANCH_SVG_POS[sanFangBranches[2]];
                  const p3 = BRANCH_SVG_POS[sanFangBranches[3]];
                  const dash = "6,5";
                  const stroke = "rgba(212,168,67,0.45)";
                  const sw = "1.5";
                  return (
                    <>
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p1[0]}%`} y2={`${p1[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p0[0]}%`} y1={`${p0[1]}%`}
                        x2={`${p2[0]}%`} y2={`${p2[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p2[0]}%`} y1={`${p2[1]}%`}
                        x2={`${p3[0]}%`} y2={`${p3[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      <line
                        x1={`${p3[0]}%`} y1={`${p3[1]}%`}
                        x2={`${p0[0]}%`} y2={`${p0[1]}%`}
                        stroke={stroke} strokeWidth={sw}
                        strokeDasharray={dash} strokeLinecap="round"
                      />
                      {[p0, p1, p2, p3].map((p, i) => (
                        <circle
                          key={i}
                          cx={`${p[0]}%`} cy={`${p[1]}%`}
                          r="3"
                          fill={i === 0 ? 'rgba(212,168,67,0.8)' : 'rgba(212,168,67,0.45)'}
                        />
                      ))}
                    </>
                  );
                })()}
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 flex items-center justify-center gap-3 text-[10px] flex-wrap"
      >
        {[
          { h: 'Hóa Lộc', c: 'text-emerald-400 border-emerald-500/30' },
          { h: 'Hóa Quyền', c: 'text-blue-400 border-blue-500/30' },
          { h: 'Hóa Khoa', c: 'text-yellow-400 border-yellow-500/30' },
          { h: 'Hóa Kỵ', c: 'text-red-400 border-red-500/30' },
        ].map(({ h, c }) => (
          <span
            key={h}
            className={`border px-2 py-1 rounded-full font-medium ${c}`}
            style={{ background: 'rgba(0,0,0,0.2)' }}
          >
            {h}
          </span>
        ))}
        <span
          className="px-2 py-1 rounded-full"
          style={{
            color: textMuted,
            border: `1px solid ${borderColor}`,
            background: 'rgba(0,0,0,0.2)',
          }}
        >
          Bấm vào cung xem tam phương tứ chính
        </span>
      </motion.div>
    </div>
  );
}
