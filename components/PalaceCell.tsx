'use client';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import type { Palace, Star } from '@/lib/ziwei/types';
import { STEMS, BRANCHES } from '@/lib/ziwei/constants';
import { vnStar, vnPalace, vnStem, vnBranch, vnSiHua } from '@/lib/ziwei/starNames';
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
  onSiHuaClick?: (starName: string, siHua: string) => void;
}

const STAR_COLORS: Record<string, string> = {
  'Tử Vi':       'text-pink-400',
  'Tử Bồng':     'text-pink-300',
  'Vũ Khúc':     'text-orange-400',
  'Thái Dương':  'text-yellow-300',
  'Xương Khúc':  'text-yellow-400',
  'Liêm Trinh':  'text-green-400',
  'Tham Lang':   'text-emerald-400',
  'Cự Môn':      'text-purple-400',
  'Phá Quân':    'text-red-400',
  'Thiên Tướng': 'text-slate-300',
  'Thiên Thọ':   'text-amber-300',
  'Thái Âm':     'text-cyan-300',
  'Thiên Cơ':    'text-indigo-300',
};

const SIHUA_STYLES: Record<string, string> = {
  '禄': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  '权': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  '科': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  '忌': 'text-red-400 bg-red-500/10 border-red-500/30',
};

const SiHuaBadge = ({
  siHua,
  overlay,
  label,
  onClick,
}: {
  siHua: string;
  overlay?: boolean;
  label?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center text-[9px] px-1.5 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
        SIHUA_STYLES[siHua],
        overlay && 'border-dashed opacity-80',
        onClick && 'cursor-pointer hover:opacity-100',
      )}
      onClick={onClick}
    >
      {overlay && label && <span className="mr-px opacity-70">{label}</span>}
      {vnSiHua(siHua)}
    </span>
  );
};

export default function PalaceCell({
  palace, onClick, onStarClick, isSelected, isSanFang, delay = 0,
  overlayStarSiHua, overlayLabel, onSiHuaClick,
}: PalaceCellProps) {
  const { theme } = useTheme();
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${vnStem(STEMS[stem])}${vnBranch(BRANCHES[branch])}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const isDark = theme === 'dark';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const accentLight = isDark ? '#F0C060' : '#C8A030';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderMed = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(26,21,16,0.14)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  const cellBg = (() => {
    if (isCurrentDaXian) return isDark ? 'rgba(147,51,234,0.08)' : 'rgba(147,51,234,0.05)';
    if (isSelected) return isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)';
    if (isSanFang) return isDark ? 'rgba(212,168,67,0.04)' : 'rgba(154,122,26,0.03)';
    return isDark ? 'rgba(255,255,255,0.02)' : '#FAFAF8';
  })();

  const cellBorder = (() => {
    if (isSelected) return `1px solid ${borderGold}`;
    if (isSanFang) return `1px solid ${isDark ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.12)'}`;
    if (isMingGong) return `2px solid ${isDark ? 'rgba(212,168,67,0.4)' : 'rgba(154,122,26,0.35)'}`;
    if (isShenGong) return `2px solid ${isDark ? 'rgba(59,130,246,0.4)' : 'rgba(59,130,246,0.3)'}`;
    if (isCurrentDaXian) return `1px solid ${isDark ? 'rgba(147,51,234,0.3)' : 'rgba(147,51,234,0.2)'}`;
    return `1px solid ${borderColor}`;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="relative flex flex-col cursor-pointer transition-all duration-150 h-full"
      style={{
        minHeight: '100px',
        padding: '10px 12px',
        background: cellBg,
        border: cellBorder,
        borderRadius: '8px',
      }}
    >
      {/* DaXian age badge */}
      {daXianAge && (
        <div
          className={clsx(
            'absolute top-2 right-2 text-[10px] font-mono tabular-nums font-medium',
          )}
          style={{
            color: isCurrentDaXian ? '#A855F7' : textMuted,
            opacity: isCurrentDaXian ? 1 : 0.7,
          }}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* Palace name row */}
      <div className="flex items-center gap-1.5 mb-1 pr-10">
        <span
          className="text-[15px] font-semibold tracking-wide"
          style={{
            color: isMingGong ? accentLight : isShenGong ? '#60A5FA' : textPrimary,
          }}
        >
          {vnPalace(name)}
        </span>
        {isMingGong && (
          <span
            className="text-[9px] px-1 rounded leading-tight font-semibold"
            style={{
              color: accent,
              border: `1px solid ${borderGold}`,
              background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
            }}
          >
            命
          </span>
        )}
        {isShenGong && (
          <span
            className="text-[9px] px-1 rounded leading-tight font-semibold"
            style={{
              color: '#60A5FA',
              border: `1px solid ${isDark ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.25)'}`,
              background: isDark ? 'rgba(59,130,246,0.06)' : 'rgba(59,130,246,0.05)',
            }}
          >
            身
          </span>
        )}
      </div>

      {/* GanZhi */}
      <div
        className="text-[11px] font-mono mb-1.5 font-medium"
        style={{ color: accent, opacity: 0.85 }}
      >
        {ganzhi}
      </div>

      {/* Major stars */}
      <div className="flex flex-col gap-1 flex-1">
        {majorStars.length === 0 && (
          <span
            className="text-[12px] italic"
            style={{ color: textMuted, opacity: 0.5 }}
          >
            Không cung
          </span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const colorClass = STAR_COLORS[star.name] ?? (
            star.brightness === 'bright'
              ? 'text-amber-300'
              : star.brightness === 'dim'
              ? 'text-amber-600'
              : 'text-amber-400'
          );
          return (
            <div
              key={star.name}
              className="flex items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span
                className={clsx(
                  'text-[15px] leading-tight font-semibold tracking-tight cursor-pointer hover:opacity-80 transition-opacity',
                  colorClass,
                )}
              >
                {vnStar(star.name)}
              </span>
              {star.siHua && <SiHuaBadge siHua={star.siHua} />}
              {overlaySiHua && (
                <SiHuaBadge
                  siHua={overlaySiHua}
                  overlay
                  label={overlayLabel}
                  onClick={e => {
                    e.stopPropagation();
                    onSiHuaClick?.(star.name, overlaySiHua);
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Lucky stars */}
      {luckyStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 mt-1">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span
                key={s.name}
                className="inline-flex items-center text-[13px] leading-tight"
                style={{ color: '#7DD3FC', opacity: 0.75 }}
              >
                {vnStar(s.name)}
                {s.siHua && <SiHuaBadge siHua={s.siHua} />}
                {overlaySiHua && (
                  <SiHuaBadge
                    siHua={overlaySiHua}
                    overlay
                    label={overlayLabel}
                    onClick={e => {
                      e.stopPropagation();
                      onSiHuaClick?.(s.name, overlaySiHua);
                    }}
                  />
                )}
              </span>
            );
          })}
        </div>
      )}

      {/* Sha stars */}
      {shaStars.length > 0 && (
        <div className="flex flex-wrap gap-x-1.5 mt-0.5">
          {shaStars.map(s => (
            <span
              key={s.name}
              className="text-[13px] leading-tight"
              style={{ color: '#F87171', opacity: 0.65 }}
            >
              {vnStar(s.name)}
              {s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
