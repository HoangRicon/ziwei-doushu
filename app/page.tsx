'use client';
import { useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import StarPreviewCards from '@/components/StarPreviewCards';
import HomepageFooter from '@/components/HomepageFooter';

function useColors(theme: 'dark' | 'light') {
  const d = theme === 'dark';
  return {
    bgBase:     d ? '#020810'                            : '#f5efe0',
    goldSolid:  d ? '#d4a843'                           : '#8b6410',
    goldLine:   d ? 'rgba(212,168,67,0.4)'              : 'rgba(140,100,20,0.4)',
    tagText:    d ? 'rgba(212,168,67,0.6)'              : 'rgba(120,80,10,0.65)',
    textPrimary:d ? '#e8eef6'                            : '#1a1d24',
    textSecond: d ? '#b8c6df'                            : '#3a3f4a',
    textMuted:  d ? '#9db0d0'                           : '#5a6275',
    navBorder:  d ? 'rgba(255,255,255,0.05)'           : 'rgba(160,120,30,0.15)',
    altSection: d ? 'rgba(255,255,255,0.02)'            : 'rgba(255,255,255,0.4)',
  };
}

export default function HomePage() {
  const { theme } = useTheme();
  const c = useColors(theme);

  useLayoutEffect(() => {
    document.documentElement.style.background = c.bgBase;
    document.body.style.background = c.bgBase;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [c.bgBase]);

  return (
    <div style={{ background: c.bgBase, transition: 'background 0.35s ease' }} className="overflow-x-hidden">

      {/* Hero */}
      <HeroSection />

      {/* ── Philosophy quote ── */}
      <section
        className="relative z-10 overflow-hidden flex items-center"
        style={{ padding: '72px 24px', minHeight: '70vh' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: theme === 'dark'
              ? 'linear-gradient(to bottom, #020810 0%, #020810 6%, #030a18 22%, #0d0820 40%, #0a0618 68%, #030a18 86%, #020810 100%)'
              : 'linear-gradient(to bottom, #f5efe0 0%, #f5efe0 6%, #c08055 18%, #6a2810 32%, #1e0a02 50%, #1e0a02 70%, #6a2810 84%, #f5efe0 100%)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span
            className="font-bold"
            style={{ fontSize: 'clamp(220px, 38vw, 460px)', color: 'rgba(212,168,67,0.012)', lineHeight: 1, fontFamily: 'serif' }}
          >
            Mệnh
          </span>
        </div>
        <FadeIn className="relative mx-auto text-center w-full" y={20}>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(212,168,67,0.45))' }} />
            <span className="text-[10px] tracking-[0.55em] uppercase" style={{ color: 'rgba(212,168,67,0.5)' }}>
              Mệnh · Vận · Quan
            </span>
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, rgba(212,168,67,0.45))' }} />
          </div>
          <div className="space-y-3" style={{ maxWidth: '840px', margin: '0 auto' }}>
            {[
              { text: 'Ý nghĩa của việc dòm trước vận mệnh', size: 'clamp(17px, 2.2vw, 28px)', delay: 0.1 },
              { text: 'Không nằm ở chỗ biết trước tương lai', size: 'clamp(21px, 2.6vw, 32px)', delay: 0.25 },
              { text: 'Mà nằm ở chỗ không ngừng nhận thức bản thân', size: 'clamp(24px, 3vw, 40px)', delay: 0.34 },
            ].map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: line.delay }}
                className="tracking-wider"
                style={{ fontSize: line.size, color: 'rgba(218,230,248,0.8)', fontWeight: 400 }}
              >
                {line.text}
              </motion.p>
            ))}
            <motion.p
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold`}
              style={{ fontSize: 'clamp(24px, 3.4vw, 48px)', letterSpacing: '0.05em', lineHeight: 1.35 }}
            >
              Cuối cùng viết nên kịch bản cuộc đời thuộc về bạn
            </motion.p>
          </div>
        </FadeIn>
      </section>

      {/* Feature Cards */}
      <FeatureCards />

      {/* 14 Stars Preview */}
      <section
        className="relative z-10 py-20"
        style={{ background: theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.4)' }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
              <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.goldSolid, opacity: 0.7 }}>
                Chính Tinh
              </span>
              <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
            </div>
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 tracking-[0.15em]" style={{ color: c.textPrimary }}>
              14 Chính Tinh
            </h2>
            <p className="text-sm" style={{ color: c.textMuted }}>
              Khám phá 14 chính tinh trong hệ thống Tử Vi Đẩu Số
            </p>
          </FadeIn>
          <StarPreviewCards />
        </div>
      </section>

      {/* CTA Footer */}
      <HomepageFooter />

    </div>
  );
}
