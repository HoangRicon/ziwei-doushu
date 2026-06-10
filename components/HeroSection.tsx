'use client';
import { useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarField from '@/components/StarField';
import AnnouncementModal from '@/components/AnnouncementModal';

const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Đam Lang' }, { name: 'Cử Môn' }, { name: 'Thiên Xương' }, { name: 'Thiên Lương' },
  { name: 'Thập Sát' }, { name: 'Phá Quân' },
];

function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:     d ? '#020810'                            : '#f5efe0',
    goldSolid:  d ? '#d4a843'                           : '#8b6410',
    goldLine:   d ? 'rgba(212,168,67,0.4)'              : 'rgba(140,100,20,0.4)',
    tagText:    d ? 'rgba(212,168,67,0.6)'              : 'rgba(120,80,10,0.65)',
    textPrimary:d ? '#e8eef6'                            : '#1a1d24',
    textSecond: d ? '#b8c6df'                            : '#3a3f4a',
    textMuted:  d ? '#9db0d0'                           : '#5a6275',
    starBg:     d ? 'rgba(255,255,255,0.04)'            : 'rgba(255,255,255,0.7)',
    starBorder: d ? 'rgba(212,168,67,0.22)'             : 'rgba(160,120,30,0.3)',
    starText:   d ? 'rgba(212,168,67,0.7)'              : 'rgba(120,80,10,0.7)',
    ctaBg:      d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:    d ? '#08080a'                           : '#f8f3e8',
    scrollLine: d ? 'rgba(212,168,67,0.3)'              : 'rgba(140,100,20,0.3)',
    scrollText: d ? 'rgba(255,255,255,0.12)'           : '#c0a870',
    glowTint:  d ? 'rgba(212,168,67,0.07)'             : 'rgba(180,140,40,0.06)',
    glowBlue:  d ? 'rgba(40,80,160,0.12)'              : 'rgba(58,90,130,0.06)',
    glowPurple:d ? 'rgba(120,50,180,0.08)'             : 'rgba(96,80,140,0.04)',
  };
}

export default function HeroSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <>
      {/* Announcement modal */}
      <AnnouncementModal />

      {/* Animated star background */}
      <StarField />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowTint} 0%, transparent 70%)` }} />
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowBlue} 0%, transparent 70%)` }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${c.glowPurple} 0%, transparent 70%)` }} />
      </div>

      {/* ── Hero ── */}
      <section
        ref={heroRef}
        className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }}
          className="text-center w-full mx-auto mt-10"
        >
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[11px] tracking-[0.45em] transition-colors duration-300" style={{ color: c.tagText }}>
              Tử Vi Đẩu Số · Hệ thống Nị Hải Hạ
            </span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <h1
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{ fontSize: 'clamp(56px, 10vw, 124px)', letterSpacing: '0.07em' }}
            >
              Bản đồ Tử Vi
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: c.textSecond, fontWeight: 500 }}
          >
            Tử Vi là cửa · Trời Đất Nhân là đường · Nị Hải Hạ là thầy
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: c.textMuted, opacity: 0.85 }}
          >
            AI trả lời · Tri thức hành động hợp nhất
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-sm max-w-xl mx-auto leading-relaxed mb-10"
            style={{ color: c.textMuted }}
          >
            Nhập ngày tháng năm sinh, tạo bản đồ Tử Vi Đẩu Số riêng cho bạn — Các mô-đun học tập Thiên Kỷ, Địa Kỷ, Nhân Kỷ sẽ lần lượt mở cửa.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }} whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="px-12 py-4 font-semibold text-base tracking-widest rounded-full"
              style={{ background: c.ctaBg, color: c.ctaText }}
            >
              Sắp bản đồ ngay
            </motion.button>
          </motion.div>

          {/* 14 Chính tinh */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[540px] mx-auto"
          >
            {STARS.map((star, i) => (
              <motion.div
                key={star.name}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{ background: c.starBg, border: `1px solid ${c.starBorder}` }}
              >
                <span className="text-[11px] tracking-wide" style={{ color: c.starText }}>{star.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-[9px] tracking-[0.4em] uppercase" style={{ color: c.scrollText }}>Khám phá thêm</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: `linear-gradient(to bottom, ${c.scrollLine}, transparent)` }}
          />
        </motion.div>
      </section>
    </>
  );
}
