'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

const FEATURES = [
  {
    tag: 'Hệ thống sắp bản đồ',
    title: 'Lập bản đồ Tử Vi\nchính thống',
    brief: 'Na ẩm Ngũ hành cục sắp bản đồ, 14 Chính tinh đầy đủ, Tứ hóa phi tinh theo pháp nguyên Nị Hải Hạ.',
    cta: 'Sắp bản đồ ngay',
    href: '/chart',
  },
  {
    tag: 'Ghép bản đồ hợp',
    title: 'Hằng sao phân tích\nhợp cục',
    brief: 'Phân tích duyên khớp, điểm hòa hợp tình cảm và đề xuất cách hòa thuận dựa trên hệ thống Nị Hải Hạ.',
    cta: 'Ghép bản đồ',
    href: '/heming',
  },
  {
    tag: 'Thư viện kinh điển',
    title: 'Cơ sở tri thức\nTử Vi Đẩu Số',
    brief: 'Tìm hiểu hệ thống tri thức bài bản: 14 Chính tinh, 13 Cung, Tứ hóa, cục diện và phương pháp luận.',
    cta: 'Khám phá tri thức',
    href: '/library',
  },
];

function useColors(theme: Theme) {
  const d = theme === 'dark';
  return {
    bgBase:       d ? '#020810'                                : '#f5efe0',
    goldSolid:    d ? '#d4a843'                               : '#8b6410',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(140,100,20,0.4)',
    goldGrad:     d ? 'linear-gradient(160deg,#c8993a 0%,#f0d070 40%,#c8993a 70%,#f0c755 100%)'
                    : 'linear-gradient(160deg,#6a4206 0%,#9a6a10 40%,#6a4206 70%,#885010 100%)',
    tagText:      d ? 'rgba(212,168,67,0.6)'                  : 'rgba(120,80,10,0.65)',
    textPrimary:  d ? '#e8eef6'                               : '#1a1d24',
    textSecond:   d ? '#b8c6df'                               : '#3a3f4a',
    textMuted:    d ? '#9db0d0'                               : '#5a6275',
    cardBg:       d ? 'rgba(255,255,255,0.05)'              : 'rgba(255,255,255,0.88)',
    cardBorder:   d ? 'rgba(255,255,255,0.10)'                : 'rgba(200,160,60,0.25)',
    cardShadow:   d ? '0 4px 32px rgba(0,0,0,0.5)'           : '0 4px 24px rgba(140,100,20,0.12)',
    ctaBg:        d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                    : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:      d ? '#08080a'                               : '#f8f3e8',
    altSection:   d ? 'rgba(255,255,255,0.02)'                : 'rgba(255,255,255,0.4)',
  };
}

export default function FeatureCards() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <section className="relative z-10 px-6 md:px-10 lg:px-14 py-20"
      style={{ background: c.altSection }}>
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span className="text-[10px] tracking-[0.5em] uppercase" style={{ color: c.tagText }}>Features</span>
            <div className="h-px w-12" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <h2 className="font-bold mb-4 tracking-tight"
            style={{ fontSize: 'clamp(28px, 4vw, 42px)', color: c.textPrimary }}>
            Tính năng nổi bật
          </h2>
          <p className="text-sm max-w-xl mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Hệ thống Tử Vi Đẩu Số hoàn chỉnh dựa trên phương pháp Nị Hải Hạ
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.href} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl p-7 h-full flex flex-col cursor-pointer"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.cardShadow,
                }}
                onClick={() => router.push(feature.href)}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px w-6" style={{ background: c.goldLine }} />
                  <span className="text-[10px] tracking-[0.4em] uppercase" style={{ color: c.tagText }}>
                    {feature.tag}
                  </span>
                </div>

                <h3 className="font-bold leading-tight mb-4 tracking-tight"
                  style={{
                    fontSize: 'clamp(20px, 2.5vw, 26px)',
                    color: c.textPrimary,
                    whiteSpace: 'pre-line',
                  }}>
                  {feature.title}
                </h3>

                <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: c.textMuted }}>
                  {feature.brief}
                </p>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 font-medium text-sm tracking-wider rounded-full w-full"
                  style={{
                    background: c.ctaBg,
                    color: c.ctaText,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(feature.href);
                  }}
                >
                  {feature.cta}
                </motion.button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
