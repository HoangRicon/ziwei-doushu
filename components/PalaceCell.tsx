'use client';
import { useTheme } from './ThemeProvider';
import type { Palace, Star } from '@/lib/ziwei/types';
import type { TimeView } from './TimeNav';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { vnStar, vnPalace, vnStem, vnBranch, vnLifePhase } from '@/lib/ziwei/starNames';
import clsx from 'clsx';

interface PalaceCellProps {
  palace: Palace;
  onClick?: () => void;
  onStarClick?: (star: Star) => void;
  isSelected?: boolean;
  isSanFang?: boolean;
  delay?: number;
  overlayStarSiHua?: Record<string, string>;
  overlayLabel?: string;
  onSiHuaClick?: (starName: string, siHua: string, view: TimeView) => void;
}

const SIHUA_COLORS: Record<string, { text: string; label: string }> = {
  '禄': { text: 'text-green-600', label: 'Khoa' },
  '权': { text: 'text-green-600', label: 'Quyền' },
  '科': { text: 'text-yellow-500', label: 'Khoa' },
  '忌': { text: 'text-red-500', label: 'Kỵ' },
};

function SiHuaChip({ siHua, overlay, overlayLabel }: { siHua: string; overlay?: boolean; overlayLabel?: string }) {
  const style = SIHUA_COLORS[siHua] ?? { text: 'text-gray-400', label: '' };
  return (
    <span className={clsx('text-xs capitalize', style.text, overlay && 'font-normal')}>
      {overlay && overlayLabel ? `${style.label} ` : ''}
      {siHua}
    </span>
  );
}

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { theme } = useTheme();
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const isDark = theme === 'dark';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const textPrimary = isDark ? '#1A1510' : '#1A1510';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderMed = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,21,16,0.14)';

  const cellBg = (() => {
    if (isCurrentDaXian) return '#FFF9E6';
    if (isSelected) return 'rgba(154,122,26,0.05)';
    if (isSanFang) return 'rgba(154,122,26,0.02)';
    return isDark ? 'rgba(255,255,255,0.02)' : '#FFFCF5';
  })();

  const headerBg = (() => {
    if (isMingGong) return 'rgba(154,122,26,0.06)';
    if (isShenGong) return 'rgba(59,130,246,0.05)';
    return cellBg;
  })();

  const getStarColor = (star: Star): string => {
    const n = star.name;
    if (n === 'Tử Vi') return 'text-red-500';
    if (n === 'Thiên Cơ') return 'text-green-600';
    if (n === 'Thái Dương') return 'text-yellow-500';
    if (n === 'Võ Khúc') return 'text-red-500';
    if (n === 'Thiên Đồng') return 'text-gray-900';
    if (n === 'Liêm Truyền') return 'text-red-500';
    if (n === 'Thiên Phủ') return 'text-yellow-500';
    if (n === 'Thái Âm') return 'text-gray-900';
    if (n === 'Đam Lang') return 'text-red-500';
    if (n === 'Cử Môn') return 'text-gray-900';
    if (n === 'Thiên Tương') return 'text-gray-900';
    if (n === 'Thiên Lương') return 'text-yellow-500';
    if (n === 'Thất Sát') return 'text-gray-600';
    if (n === 'Phá Quân') return 'text-gray-900';
    if (star.brightness === 'bright') return 'text-yellow-600';
    if (star.brightness === 'dim') return 'text-red-500';
    return 'text-gray-900';
  };

  const lifePhaseText = vnLifePhase(stem);

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col cursor-pointer transition-all duration-150 h-full"
      style={{
        minHeight: '140px',
        background: cellBg,
        border: `0.5px solid ${borderMed}`,
      }}
    >
      {/* Header row: palace name + optional badge */}
      <div
        className="grid grid-cols-5 justify-between relative px-1 py-1"
        style={{ background: headerBg }}
      >
        <p
          className={clsx(
            'text-xs font-semibold col-span-2',
            isMingGong ? 'text-red-500' : isShenGong ? 'text-yellow-500' : 'text-gray-600'
          )}
        >
          {vnPalace(name)}
        </p>
        <div className="flex items-center gap-1 col-span-3 justify-center">
          <p className="uppercase font-bold text-black text-xs mx-0">
            {name}
          </p>
        </div>
        <p className="font-semibold text-xs text-right col-span-1">
          {daXianAge ? `${daXianAge[0]}${daXianAge[1]}` : ''}
        </p>
      </div>

      {/* Center area: major stars + star lists */}
      <div className="flex flex-col gap-1 flex-1 px-1 py-1.5">
        {/* Major stars — centered, stacked if multiple */}
        <div className="flex flex-col items-center justify-center" style={{ minHeight: '28px' }}>
          {majorStars.length === 0 ? (
            <span className="text-gray-400 text-xs italic">-</span>
          ) : (
            majorStars.map(star => {
              const colorClass = getStarColor(star);
              return (
                <div key={star.name} className="flex items-center gap-1">
                  <p className={clsx('text-sm font-semibold capitalize leading-[18px]', colorClass)}>
                    {star.name} ({star.brightness === 'bright' ? 'Đ' : star.brightness === 'dim' ? 'N' : 'B'})
                  </p>
                  {star.siHua && (
                    <span className={clsx('text-xs capitalize', SIHUA_COLORS[star.siHua]?.text ?? 'text-gray-400')}>
                      {star.siHua}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Two-column star lists */}
        <div className="flex flex-1 justify-between gap-1">
          {/* Left column: lucky + some sha */}
          <div className="flex flex-col items-start" style={{ minHeight: '64px' }}>
            {[...luckyStars, ...shaStars].slice(0, 7).map(s => {
              const colorClass = s.type === 'lucky' ? 'text-green-600' : 'text-red-500';
              return (
                <p
                  key={s.name}
                  className={clsx('text-xs capitalize', colorClass, s.type === 'lucky' ? 'font-normal' : 'font-bold')}
                  onClick={e => { e.stopPropagation(); onStarClick?.(s); }}
                >
                  {s.name}
                </p>
              );
            })}
          </div>
          {/* Right column: remaining sha */}
          <div className="flex flex-col items-start" style={{ minHeight: '64px' }}>
            {[...luckyStars, ...shaStars].slice(7).map(s => {
              const colorClass = s.type === 'lucky' ? 'text-green-600' : 'text-red-500';
              return (
                <p
                  key={s.name}
                  className={clsx('text-xs capitalize', colorClass, s.type === 'lucky' ? 'font-normal' : 'font-semibold')}
                  onClick={e => { e.stopPropagation(); onStarClick?.(s); }}
                >
                  {s.name}
                </p>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer row: branch name + life phase + daXian age */}
      <div className="grid grid-cols-5 px-1 py-0.5" style={{ background: headerBg }}>
        <p className="text-xs text-gray-600">{vnBranch(BRANCHES[branch])}</p>
        <div className="col-span-3">
          <p
            className={clsx(
              'capitalize text-sm leading-5 font-semibold text-center',
              stem >= 0 && stem <= 2 ? 'text-green-600' :
              stem >= 3 && stem <= 5 ? 'text-gray-600' :
              stem >= 6 && stem <= 8 ? 'text-yellow-500' :
              'text-red-500'
            )}
          >
            {lifePhaseText}
          </p>
        </div>
        <p className="text-xs font-semibold text-right">
          T.{daXianAge ? daXianAge[0] : ''}
        </p>
      </div>
    </div>
  );
}
