'use client';
import { motion } from 'framer-motion';
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

/** Color map for major stars — matches reference image aesthetic */
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
        'inline-flex items-center text-[8px] px-1 rounded-full border leading-none py-px font-bold ml-1 flex-shrink-0',
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
  const { branch, stem, name, stars, daXianAge, isCurrentDaXian, isMingGong, isShenGong } = palace;
  const ganzhi = `${vnStem(STEMS[stem])}${vnBranch(BRANCHES[branch])}`;

  const majorStars = stars.filter(s => s.type === 'major');
  const luckyStars = stars.filter(s => s.type === 'lucky');
  const shaStars = stars.filter(s => s.type === 'sha');

  const cellBg = isCurrentDaXian
    ? 'rgba(147,51,234,0.08)'
    : isSelected
    ? 'var(--color-bg-selected)'
    : isSanFang
    ? 'var(--color-bg-sf)'
    : 'var(--color-bg-surface)';

  const cellBorder = isCurrentDaXian
    ? 'inset 2px 0 0 rgba(147,51,234,0.5)'
    : isSelected
    ? 'inset 0 0 0 1.5px rgba(212,168,67,0.6)'
    : isSanFang
    ? 'inset 0 0 0 1px rgba(59,130,246,0.35)'
    : isMingGong
    ? 'inset 2px 0 0 rgba(212,168,67,0.6)'
    : isShenGong
    ? 'inset 2px 0 0 rgba(59,130,246,0.5)'
    : 'none';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: 'easeOut' }}
      onClick={onClick}
      className="relative flex flex-col p-2 cursor-pointer transition-colors duration-150 h-full"
      style={{
        minHeight: '90px',
        background: cellBg,
        boxShadow: cellBorder,
      }}
    >
      {/* DaXian age badge */}
      {daXianAge && (
        <div className={clsx(
          'absolute top-1 right-1 text-[9px] font-mono tabular-nums',
          isCurrentDaXian ? 'text-purple-400' : ''
        )}
          style={!isCurrentDaXian ? { color: 'var(--color-text-muted)', opacity: 0.7 } : undefined}
        >
          {daXianAge[0]}–{daXianAge[1]}
        </div>
      )}

      {/* Palace name row */}
      <div className="flex items-center gap-1 mb-0.5 pr-8">
        <span className={clsx('text-[10px] font-medium tracking-wide',
          isMingGong ? 'text-amber-400' : isShenGong ? 'text-blue-400' : ''
        )}
          style={!isMingGong && !isShenGong ? { color: 'var(--color-text-muted)' } : undefined}
        >
          {vnPalace(name)}
        </span>
        {isMingGong && (
          <span className="text-[7px] text-amber-400/80 border border-amber-400/30 px-0.5 rounded leading-tight">命</span>
        )}
        {isShenGong && (
          <span className="text-[7px] text-blue-400/80 border border-blue-400/30 px-0.5 rounded leading-tight">身</span>
        )}
      </div>

      {/* GanZhi */}
      <div className="text-[9px] font-mono mb-1" style={{ color: 'var(--color-accent)', opacity: 0.8 }}>{ganzhi}</div>

      {/* Major stars */}
      <div className="flex flex-col gap-0.5 flex-1">
        {majorStars.length === 0 && (
          <span className="text-[10px] italic" style={{ color: 'var(--color-text-muted)', opacity: 0.5 }}>Không cung</span>
        )}
        {majorStars.map((star) => {
          const overlaySiHua = overlayStarSiHua?.[star.name];
          const colorClass = STAR_COLORS[star.name] ?? (star.brightness === 'bright' ? 'text-amber-300' : star.brightness === 'dim' ? 'text-amber-600' : 'text-amber-400');
          return (
            <div
              key={star.name}
              className="flex items-center"
              onClick={e => { e.stopPropagation(); onStarClick?.(star); }}
            >
              <span className={clsx(
                'text-[12px] leading-tight font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity',
                colorClass,
              )}>
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
        <div className="flex flex-wrap gap-x-1 mt-0.5">
          {luckyStars.map(s => {
            const overlaySiHua = overlayStarSiHua?.[s.name];
            return (
              <span key={s.name} className="inline-flex items-center text-[9px] text-sky-400/70 leading-tight">
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
        <div className="flex flex-wrap gap-x-1">
          {shaStars.map(s => (
            <span key={s.name} className="text-[9px] text-red-400/60 leading-tight">
              {vnStar(s.name)}{s.siHua && <SiHuaBadge siHua={s.siHua} />}
            </span>
          ))}
        </div>
      )}

    </motion.div>
  );
}
