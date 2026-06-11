'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme, type Theme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

const FEATURES = [
  {
    tag: 'Hệ thống sắp bản đồ',
    title: 'Lập lá số Tử Vi\nchính thống',
    brief: 'Nạp Ngũ Hành cục sắp lá số, 14 Chính tinh đầy đủ, Tứ hóa phi tinh theo pháp nguyên Nị Hải Hạ.',
    cta: 'Sắp lá số ngay',
    href: '/chart',
  },
  {
    tag: 'Ghép lá số hợp',
    title: 'Hằng sao phân tích\nhợp cục',
    brief: 'Phân tích duyên khớp, điểm hòa hợp tình cảm và đề xuất cách hòa thuận dựa trên hệ thống Nị Hải Hạ.',
    cta: 'Ghép lá số',
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
    accent:       d ? '#D4A843'                               : '#9A7A1A',
    accentLight:  d ? '#F0C060'                               : '#C8A030',
    accentDim:    d ? 'rgba(212,168,67,0.7)'                  : 'rgba(154,122,26,0.7)',
    goldLine:     d ? 'rgba(212,168,67,0.4)'                  : 'rgba(154,122,26,0.4)',
    tagText:      d ? 'rgba(212,168,67,0.7)'                  : 'rgba(154,122,26,0.75)',
    textPrimary:  d ? '#F0EBE0'                               : '#1A1510',
    textSecondary:d ? '#D8D0C0'                               : '#2D2820',
    textBody:     d ? '#A09888'                               : '#5A5248',
    textMuted:    d ? '#6A6258'                               : '#8A8078',
    cardBg:       d ? 'rgba(255,255,255,0.04)'               : 'rgba(255,255,255,0.9)',
    cardBorder:   d ? 'rgba(255,255,255,0.08)'               : 'rgba(154,122,26,0.15)',
    cardBorderHov:d ? 'rgba(212,168,67,0.35)'                : 'rgba(154,122,26,0.30)',
    cardShadow:   d ? '0 4px 24px rgba(0,0,0,0.45), 0 1px 3px rgba(0,0,0,0.3)'
                     : '0 4px 20px rgba(154,122,26,0.08), 0 1px 3px rgba(0,0,0,0.05)',
    cardShadowHov:d ? '0 8px 40px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.4)'
                     : '0 8px 36px rgba(154,122,26,0.15), 0 2px 6px rgba(0,0,0,0.08)',
    sectionBg:    d ? 'rgba(255,255,255,0.02)'               : 'rgba(253,252,248,0.6)',
  };
}

export default function FeatureCards() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <section
      className="relative z-10 px-6 md:px-10 lg:px-14 py-20 md:py-24"
      style={{ background: c.sectionBg }}
    >
      <div className="mx-auto" style={{ maxWidth: '1280px' }}>

        {/* Section Header */}
        <FadeIn className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-10" style={{ background: `linear-gradient(to right, transparent, ${c.goldLine})` }} />
            <span
              className="text-[13px] tracking-[0.18em] uppercase font-semibold"
              style={{ color: c.tagText }}
            >
              Tính năng
            </span>
            <div className="h-px w-10" style={{ background: `linear-gradient(to left, transparent, ${c.goldLine})` }} />
          </div>
          <h2
            className="heading-2 mb-4"
            style={{ color: c.textPrimary }}
          >
            Tính năng nổi bật
          </h2>
          <p
            className="body max-w-2xl mx-auto"
            style={{ color: c.textBody }}
          >
            Hệ thống Tử Vi Đẩu Số hoàn chỉnh dựa trên phương pháp Nị Hải Hạ
          </p>
        </FadeIn>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">
          {FEATURES.map((feature, i) => (
            <FadeIn key={feature.href} delay={i * 0.12}>
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl p-7 md:p-8 h-full flex flex-col cursor-pointer group"
                style={{
                  background: c.cardBg,
                  border: `1px solid ${c.cardBorder}`,
                  boxShadow: c.cardShadow,
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
                }}
                onClick={() => router.push(feature.href)}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = c.cardBorderHov;
                  el.style.boxShadow = c.cardShadowHov;
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = c.cardBorder;
                  el.style.boxShadow = c.cardShadow;
                }}
              >
                {/* Tag */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px w-6 flex-shrink-0" style={{ background: c.goldLine }} />
                  <span
                    className="text-[12px] tracking-[0.22em] uppercase font-semibold"
                    style={{ color: c.tagText }}
                  >
                    {feature.tag}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className="font-bold leading-tight mb-5 tracking-tight"
                  style={{
                    fontSize: 'clamp(20px, 2.2vw, 24px)',
                    color: c.textPrimary,
                    whiteSpace: 'pre-line',
                  }}
                >
                  {feature.title}
                </h3>

                {/* Description */}
                <p
                  className="text-[16px] leading-relaxed flex-1 mb-7"
                  style={{ color: c.textBody }}
                >
                  {feature.brief}
                </p>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-3 font-semibold text-[15px] tracking-wider rounded-full w-full flex items-center justify-center gap-2"
                  style={{
                    background: `linear-gradient(135deg, ${c.accent}, ${c.accentLight})`,
                    color: theme === 'dark' ? '#0C0A08' : '#FFFFFF',
                    boxShadow: `0 2px 12px rgba(154,122,26,0.25)`,
                    transition: 'box-shadow 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 4px 20px rgba(154,122,26,0.40)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 2px 12px rgba(154,122,26,0.25)`;
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(feature.href);
                  }}
                >
                  {feature.cta}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ transition: 'transform 0.2s ease' }}
                    className="group-hover:translate-x-0.5"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
