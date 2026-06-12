'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import type { ZiweiChart, Palace, Star } from '@/lib/ziwei/types';
import { BRANCHES, STEMS } from '@/lib/ziwei/constants';
import { vnPalace, vnStar, vnBranch, vnStem } from '@/lib/ziwei/starNames';
import PalaceCell from './PalaceCell';
import type { TimeView } from './TimeNav';
import { getYearStemIndex, buildSiHuaOverlay } from './TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  onStarSelect?: (star: Star, palace: Palace) => void;
  onPalaceSelect?: (palace: Palace) => void;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

// Grid positions for the 4x4 layout (1-indexed grid row/col)
const BRANCH_GRID_POS: Record<number, [number, number]> = {
  5: [1, 1], 6: [1, 2], 7: [1, 3], 8: [1, 4],
  4: [2, 1], 9: [2, 4],
  3: [3, 1], 10: [3, 4],
  2: [4, 1], 1: [4, 2], 0: [4, 3], 11: [4, 4],
};

// SVG positions as percentages for diagonal lines
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

export default function ChartBoard({ chart, view, liunianYear, onStarSelect, onPalaceSelect, onSiHuaClick }: ChartBoardProps) {
  const { theme } = useTheme();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);

  const isDark = theme === 'dark';
  const bgPage = isDark ? '#0C0A08' : '#FFFCF5';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFCF5';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  const palaceMap: Record<number, Palace> = {};
  chart.palaces.forEach(p => { palaceMap[p.branch] = p; });

  const currentDx = chart.daXians[chart.currentDaXianIndex];
  const overlayData: Record<string, string> = (() => {
    if (view === 'daxian' && currentDx) {
      const dxPalace = chart.palaces.find(p => p.branch === currentDx.palaceBranch);
      if (dxPalace) return buildSiHuaOverlay(dxPalace.stem);
    }
    if (view === 'liunian') {
      return buildSiHuaOverlay(getYearStemIndex(liunianYear));
    }
    return {};
  })();
  const overlayLabel = view === 'daxian' ? 'Hạn' : view === 'liunian' ? 'Niên' : undefined;

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
    if (view === 'daxian') return 'Lá số Đại hạn';
    if (view === 'liunian') return `Lá số Lưu niên ${liunianYear}`;
    return 'Lá số Mệnh bản';
  })();

  // Find special branch positions (Triệt and Tuần)
  const trietBranch = (() => {
    // Triệt is at Tý (0) — find the palace at branch 0
    return 0;
  })();
  const tuanBranch = (() => {
    // Tuần is at Dần (3) — find the palace at branch 3
    return 3;
  })();

  return (
    <div className="w-full select-none">
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

      {/* Main chart container */}
      <div
        className="grid relative overflow-hidden"
        style={{
          gridTemplateColumns: 'repeat(4, 1fr)',
          gridTemplateRows: 'repeat(4, auto)',
          gap: '0px',
          background: '#FFFCF5',
          border: `0.5px solid rgba(26,21,16,0.08)`,
        }}
      >
        {/* Palace cells */}
        {ANIMATION_ORDER.map((branch, i) => {
          const [row, col] = BRANCH_GRID_POS[branch];
          const palace = palaceMap[branch];
          if (!palace) return null;

          // Determine if this is a special position (Tuần or Triệt)
          const hasTuan = branch === tuanBranch;
          const hasTriet = branch === trietBranch;

          return (
            <div
              key={branch}
              style={{
                gridRow: row,
                gridColumn: col,
                background: bgCard,
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
                onSiHuaClick={(starName, siHua) => onSiHuaClick?.(starName, siHua, view)}
              />
            </div>
          );
        })}

        {/* Center panel — 2x2 spanning rows 2-3, cols 2-3 */}
        <div
          className="flex flex-col items-center justify-center p-3 gap-2 relative col-span-2 row-span-2 col-start-2 row-start-2"
          style={{ background: bgCard }}
        >
          <p className="text-sm text-center text-gray-700">Chương trình luận giải Tử Vi bằng AI</p>
          <a className="underline text-lg text-center text-blue-600">AItuvi.com</a>
          <hr className="border-gray-800 w-1/2 my-1 mx-auto" />
          <h1 className="uppercase text-gray-800 text-lg font-bold w-full text-center mb-1">Lá số tử vi</h1>

          {/* Birth info grid */}
          <div className="flex flex-col gap-2 w-full px-4">
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Họ tên</p>
              <p className="text-gray-900 font-semibold text-sm col-span-2">{chart.birthInfo.name || '—'}</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Năm</p>
              <p className="text-gray-900 font-semibold text-sm">{chart.lunarInfo.lunarYear}</p>
              <p className="text-gray-900 font-bold text-sm">
                {vnStem(STEMS[chart.lunarInfo.yearStem])}{vnBranch(BRANCHES[chart.lunarInfo.yearBranch])}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Tháng</p>
              <div className="flex">
                <p className="text-gray-900 font-bold text-sm">{chart.lunarInfo.lunarMonth}</p>
                <p className="text-gray-900 font-bold text-sm">({Math.abs(chart.lunarInfo.lunarMonth)})</p>
              </div>
              <p className="text-gray-900 font-bold text-sm">
                {vnStem(STEMS[chart.lunarInfo.yearStem])}{vnBranch(BRANCHES[chart.lunarInfo.yearBranch])}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Ngày</p>
              <div className="flex">
                <p className="text-gray-900 font-bold text-sm">{chart.lunarInfo.lunarDay}</p>
              </div>
              <p className="text-gray-900 font-bold text-sm">
                {vnStem(STEMS[chart.lunarInfo.yearStem])}{vnBranch(BRANCHES[chart.lunarInfo.yearBranch])}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Giờ</p>
              <p className="text-gray-900 font-semibold text-sm col-span-1">—</p>
              <p className="text-gray-900 font-bold text-sm">—</p>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-800 w-1/2 my-1 mx-auto" />

          {/* Fate info */}
          <div className="flex flex-col gap-2 w-full px-4">
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Mệnh</p>
              <p className="text-gray-900 font-bold text-sm col-span-2 uppercase">{chart.wuxingJuName}</p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Cục</p>
              <div className="flex flex-col">
                <p className="text-gray-900 font-bold text-sm">{chart.wuxingJuName}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Mệnh chủ</p>
              <p className="text-gray-900 font-bold text-sm col-span-2 lowercase capitalize">
                {chart.palaces.find(p => p.branch === chart.mingGongBranch)?.stars.find(s => s.type === 'major')?.name ?? '—'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <p className="text-sm font-normal text-gray-800">Thân chủ</p>
              <p className="text-gray-900 font-bold text-sm col-span-2 lowercase capitalize">
                {chart.palaces.find(p => p.branch === chart.shenGongBranch)?.stars.find(s => s.type === 'major')?.name ?? '—'}
              </p>
            </div>
          </div>

          {/* Diagonal SVG lines overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top-left to bottom-right diagonal */}
              <line
                x1="12.5" y1="12.5"
                x2="87.5" y2="87.5"
                stroke="#9A7A1A"
                style={{ strokeWidth: '0.3', opacity: 0.25 }}
              />
              {/* Top-right to bottom-left diagonal */}
              <line
                x1="87.5" y1="12.5"
                x2="12.5" y2="87.5"
                stroke="#9A7A1A"
                style={{ strokeWidth: '0.3', opacity: 0.25 }}
              />
            </svg>
          </div>

          {/* Bottom-right corner icons */}
          <div className="absolute bottom-0 right-0 flex flex-col gap-2.5 mr-2.5 mb-2.5">
            <img alt="triet_icon" loading="lazy" width="36" height="36" decoding="async"
              className="object-contain ml-3"
              src="/_next/static/media/triet-icon.91cd7d72.svg"
            />
            <img alt="icon_spells" loading="lazy" width="56" height="56" decoding="async"
              className="object-contain"
              src="/_next/static/media/spells.27ff54b6.svg"
            />
          </div>
        </div>

        {/* San fang SVG overlay */}
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

      {/* Legend bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-4 flex items-center justify-center gap-3 text-[10px] flex-wrap"
      >
        {[
          { h: 'M: Miếu', c: 'text-gray-900' },
          { h: 'V: Vượng', c: 'text-gray-900' },
          { h: 'Đ: Đắc', c: 'text-gray-900' },
          { h: 'B: Bình hòa', c: 'text-gray-900' },
          { h: 'H: Hãm', c: 'text-gray-900' },
        ].map(({ h }) => (
          <span
            key={h}
            className="text-sm text-gray-900"
          >
            {h}
          </span>
        ))}
        <div className="flex items-center gap-2 ml-4">
          <div className="flex h-full items-center gap-1">
            <span className="bg-gray-400 aspect-square h-[14px] block" />
            <span className="text-sm text-gray-900">Kim</span>
          </div>
          <div className="flex h-full items-center gap-1">
            <span className="bg-green-500 aspect-square h-[14px] block" />
            <span className="text-sm text-gray-900">Mộc</span>
          </div>
          <div className="flex h-full items-center gap-1">
            <span className="bg-gray-900 aspect-square h-[14px] block" />
            <span className="text-sm text-gray-900">Thủy</span>
          </div>
          <div className="flex h-full items-center gap-1">
            <span className="bg-red-500 aspect-square h-[14px] block" />
            <span className="text-sm text-gray-900">Hỏa</span>
          </div>
          <div className="flex h-full items-center gap-1">
            <span className="bg-yellow-500 aspect-square h-[14px] block" />
            <span className="text-sm text-gray-900">Thổ</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
