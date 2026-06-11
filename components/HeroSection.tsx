'use client';
import { useRef, useLayoutEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { motion, useScroll, useTransform } from 'framer-motion';
import StarField from '@/components/StarField';
import AnnouncementModal from '@/components/AnnouncementModal';

const STARS = [
  { name: 'Tử Vi' }, { name: 'Thiên Cơ' }, { name: 'Thái Dương' }, { name: 'Vũ Khúc' },
  { name: 'Thiên Đồng' }, { name: 'Liêm Trinh' }, { name: 'Thiên Phủ' }, { name: 'Thái Âm' },
  { name: 'Đam Lang' }, { name: 'Cử Môn' }, { name: 'Thiên Xương' }, { name: 'Thiên Lương' },
  { name: 'Thập Sát' }, { name: 'Phá Quân' },
];

export default function HeroSection() {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '28%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);

  // Luxury color palette
  const bgBase     = isDark ? '#0C0A08' : '#FDFCF8';
  const accent     = isDark ? '#D4A843' : '#9A7A1A';
  const accentLight= isDark ? '#F0C060' : '#C8A030';
  const textPrimary= isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary= isDark ? '#D8D0C0' : '#2D2820';
  const textMuted  = isDark ? '#6A6258' : '#8A8078';
  const goldLine   = isDark ? 'rgba(212,168,67,0.4)' : 'rgba(154,122,26,0.4)';
  const tagText    = isDark ? 'rgba(212,168,67,0.6)' : 'rgba(154,122,26,0.65)';
  const starBg     = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
  const starBorder = isDark ? 'rgba(212,168,67,0.22)' : 'rgba(154,122,26,0.3)';
  const starText   = isDark ? 'rgba(212,168,67,0.7)' : 'rgba(154,122,26,0.7)';
  const ctaBg      = isDark
    ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)';
  const ctaText    = isDark ? '#08080a' : '#f8f3e8';
  const scrollLine = isDark ? 'rgba(212,168,67,0.3)' : 'rgba(154,122,26,0.3)';
  const scrollText = isDark ? 'rgba(255,255,255,0.12)' : '#c0a870';
  const glowTint   = isDark ? 'rgba(212,168,67,0.07)' : 'rgba(154,122,26,0.06)';
  const glowBlue   = isDark ? 'rgba(40,80,160,0.12)' : 'rgba(58,90,130,0.06)';
  const glowPurple = isDark ? 'rgba(120,50,180,0.08)' : 'rgba(96,80,140,0.04)';

  useLayoutEffect(() => {
    document.documentElement.style.background = bgBase;
    document.body.style.background = bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [bgBase]);

  return (
    <>
      <AnnouncementModal />
      <StarField />

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full"
          style={{ background: `radial-gradient(ellipse, ${glowTint} 0%, transparent 70%)` }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${glowBlue} 0%, transparent 70%)` }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(ellipse, ${glowPurple} 0%, transparent 70%)` }}
        />
      </div>

      {/* Hero section */}
      <section
        ref={heroRef}
        className="relative min-h-[82svh] lg:min-h-[92vh] flex flex-col items-center justify-center px-6 z-10 pb-24 pt-10"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity, maxWidth: '960px' }}
          className="text-center w-full mx-auto mt-10"
        >
          {/* Top label */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-center gap-3 mb-8"
          >
            <div
              className="h-px w-12"
              style={{ background: `linear-gradient(to right, transparent, ${goldLine})` }}
            />
            <span
              className="text-[11px] tracking-[0.45em] uppercase transition-colors duration-300"
              style={{ color: tagText }}
            >
              Tử Vi Đẩu Số · Hệ thống Ni Hải Hạ
            </span>
            <div
              className="h-px w-12"
              style={{ background: `linear-gradient(to left, transparent, ${goldLine})` }}
            />
          </motion.div>

          {/* Main title */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: 'relative', display: 'inline-block' }}
          >
            <h1
              className={`grad-text ${isDark ? 'grad-text-dark' : 'grad-text-light'} font-bold leading-none mb-5`}
              style={{
                fontSize: 'clamp(52px, 8vw, 100px)',
                letterSpacing: '0.05em',
              }}
            >
              Bản đồ Tử Vi
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="text-base md:text-lg tracking-[0.18em] mb-2"
            style={{ color: textSecondary, fontWeight: 500 }}
          >
            Tử Vi là cửa · Trời Đất Nhân là đường · Ni Hải Hạ là thầy
          </motion.p>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.55 }}
            className="text-xs md:text-sm tracking-[0.3em] mb-6"
            style={{ color: textMuted, opacity: 0.85 }}
          >
            AI trả lời · Tri thức hành động hợp nhất
          </motion.p>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.65 }}
            className="text-base max-w-[680px] mx-auto leading-[1.8] mb-10"
            style={{ color: textMuted, fontSize: '17px' }}
          >
            Nhập ngày tháng năm sinh, tạo lá số Tử Vi Đẩu Số riêng cho bạn — Các mô-đun học tập Thiên Kỷ, Địa Kỷ, Nhân Kỷ sẽ lần lượt mở cửa.
          </motion.p>

          {/* CTA button */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.85 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.button
              whileHover={{ y: -2, filter: 'brightness(1.06)' }}
              whileTap={{ scale: 0.97 }}
              onClick={() => router.push('/chart')}
              className="font-semibold tracking-widest rounded-full"
              style={{
                background: ctaBg,
                color: ctaText,
                fontSize: '17px',
                padding: '16px 44px',
              }}
            >
              Sắp lá số ngay
            </motion.button>
          </motion.div>

          {/* 14 stars preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="mt-12 grid grid-cols-7 gap-1.5 max-w-[540px] mx-auto"
          >
            {STARS.map((star, i) => (
              <motion.div
                key={star.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.05 + i * 0.03, duration: 0.35 }}
                className="flex items-center justify-center px-2 py-1 rounded-full"
                style={{
                  background: starBg,
                  border: `1px solid ${starBorder}`,
                }}
              >
                <span
                  className="tracking-wide"
                  style={{ color: starText, fontSize: '13px' }}
                >
                  {star.name}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span
            className="text-[9px] tracking-[0.4em] uppercase"
            style={{ color: scrollText }}
          >
            Khám phá thêm
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="w-px h-8"
            style={{ background: `linear-gradient(to bottom, ${scrollLine}, transparent)` }}
          />
        </motion.div>
      </section>
    </>
  );
}
