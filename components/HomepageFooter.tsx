'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

const TRUST_INDICATORS = [
  { icon: '◈', label: '518,000+ mẫu dữ liệu' },
  { icon: '◉', label: 'Hệ thống Nị Hải Hạ' },
  { icon: '✦', label: 'AI giải đoán sâu' },
];

function useColors(theme: 'dark' | 'light') {
  const d = theme === 'dark';
  return {
    accent:        d ? '#D4A843'                               : '#9A7A1A',
    accentLight:   d ? '#F0C060'                               : '#C8A030',
    goldLine:      d ? 'rgba(212,168,67,0.4)'                  : 'rgba(154,122,26,0.4)',
    tagText:       d ? 'rgba(212,168,67,0.7)'                  : 'rgba(154,122,26,0.75)',
    textPrimary:   d ? '#F0EBE0'                                : '#1A1510',
    textSecondary: d ? '#D8D0C0'                                : '#2D2820',
    textBody:      d ? '#A09888'                                : '#5A5248',
    textMuted:     d ? '#6A6258'                                : '#8A8078',
    cardBg:        d ? 'rgba(255,255,255,0.03)'              : 'rgba(255,255,255,0.85)',
    cardBorder:    d ? 'rgba(255,255,255,0.07)'               : 'rgba(154,122,26,0.14)',
    cardShadow:    d ? '0 4px 24px rgba(0,0,0,0.45), 0 1px 4px rgba(0,0,0,0.3)'
                      : '0 4px 24px rgba(154,122,26,0.08), 0 1px 4px rgba(0,0,0,0.05)',
    sectionBg:     d ? 'rgba(255,255,255,0.02)'               : 'rgba(253,252,248,0.55)',
    footerBg:      d ? 'rgba(255,255,255,0.02)'               : 'rgba(253,252,248,0.8)',
    footerBorder:  d ? 'rgba(255,255,255,0.07)'               : 'rgba(154,122,26,0.12)',
    footerText:    d ? 'rgba(255,255,255,0.2)'               : 'rgba(154,122,26,0.5)',
  };
}

export default function HomepageFooter() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <>
      {/* ── Final CTA ── */}
      <section
        className="relative z-10 py-24 md:py-36 px-6 text-center"
        style={{ background: c.sectionBg }}
      >
        <FadeIn>
          <p
            className="text-[13px] tracking-[0.22em] uppercase font-semibold mb-8"
            style={{ color: c.tagText }}
          >
            Bắt đầu hành trình lá số của bạn
          </p>

          <h2
            className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-10 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 58px)' }}
          >
            Bản đồ Tử Vi của bạn<br />
            Đang chờ bạn giải đoán
          </h2>

          <p
            className="text-[16px] mb-12 max-w-lg mx-auto leading-relaxed"
            style={{ color: c.textBody }}
          >
            Nhập ngày tháng năm sinh, trong vài giây tạo lá số riêng cho bạn. Sau đó AI dựa trên hệ thống Nị Hải Hạ giải đoán sâu cho bạn.
          </p>

          {/* Main CTA button */}
          <motion.button
            whileHover={{ scale: 1.03, boxShadow: '0 6px 28px rgba(154,122,26,0.45)' }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-[16px] tracking-wider rounded-full"
            style={{
              background: `linear-gradient(135deg, ${theme === 'dark' ? '#b8892a' : '#6a4206'}, ${theme === 'dark' ? '#f0d070' : '#9a6810'}, ${theme === 'dark' ? '#b8892a' : '#6a4206'})`,
              color: theme === 'dark' ? '#0C0A08' : '#f8f3e8',
              boxShadow: '0 4px 20px rgba(154,122,26,0.35)',
            }}
          >
            Sắp lá số miễn phí
          </motion.button>

          {/* Secondary links */}
          <div className="mt-5 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-[13px] tracking-[0.12em] inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                color: c.accent,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              Cơ sở tri thức Tử Vi Đẩu Số →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-[13px] tracking-[0.12em] inline-flex items-center gap-2 px-5 py-2.5 rounded-full"
              style={{
                color: c.accent,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
              Kho cổ thư nguyên tác →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* ── Trust indicators ── */}
      <section
        className="relative z-10 py-16 px-6"
        style={{ background: c.sectionBg }}
      >
        <FadeIn>
          <div
            className="mx-auto max-w-2xl rounded-2xl p-8 text-center"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TRUST_INDICATORS.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-3">
                  <span
                    className="text-3xl"
                    style={{ color: c.accent }}
                  >
                    {item.icon}
                  </span>
                  <span
                    className="text-[13px] font-semibold tracking-wider"
                    style={{ color: c.textSecondary }}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      {/* ── Bottom copyright bar ── */}
      <footer
        className="relative z-10 py-10 px-6"
        style={{
          background: c.footerBg,
          borderTop: `1px solid ${c.footerBorder}`,
        }}
      >
        <div className="mx-auto text-center" style={{ maxWidth: '900px' }}>
          {/* Gold line */}
          <div
            className="h-px w-full mb-8"
            style={{
              background: `linear-gradient(to right, transparent, ${c.accent}, transparent)`,
              opacity: 0.3,
            }}
          />

          <p
            className="text-[13px] tracking-wider font-medium mb-3"
            style={{ color: c.textSecondary }}
          >
            Bản đồ Tử Vi · Hệ thống chính thống Nị Hải Hạ · Chỉ để tham khảo, vận mệnh nằm trong tay bạn
          </p>
          <p
            className="text-[13px] tracking-wider mb-4 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.textMuted }}
          >
            Nền tảng này dựa trên nghiên cứu văn hóa truyền thống cổ đại, chỉ cung cấp để tham khảo học tập. Nền tảng này không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý hoặc quyết định quan trọng nào.
          </p>
          <p
            className="text-[13px] tracking-wider"
            style={{ color: c.textMuted }}
          >
            <a href="/terms" className="hover:opacity-70 transition-opacity" style={{ color: c.textMuted }}>Điều khoản dịch vụ</a>
            {' · '}
            <a href="/privacy" className="hover:opacity-70 transition-opacity" style={{ color: c.textMuted }}>Chính sách bảo mật</a>
          </p>
        </div>
      </footer>
    </>
  );
}
