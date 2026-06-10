'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

function useColors(theme: 'dark' | 'light') {
  const d = theme === 'dark';
  return {
    goldSolid:   d ? '#d4a843'                           : '#8b6410',
    goldLine:    d ? 'rgba(212,168,67,0.4)'              : 'rgba(140,100,20,0.4)',
    tagText:     d ? 'rgba(212,168,67,0.6)'              : 'rgba(120,80,10,0.65)',
    textPrimary: d ? '#e8eef6'                            : '#1a1d24',
    textSecond:  d ? '#b8c6df'                            : '#3a3f4a',
    textMuted:   d ? '#9db0d0'                           : '#5a6275',
    cardBg:      d ? 'rgba(255,255,255,0.03)'            : 'rgba(255,255,255,0.8)',
    cardBorder:  d ? 'rgba(255,255,255,0.08)'           : 'rgba(200,160,60,0.2)',
    cardShadow:  d ? '0 4px 32px rgba(0,0,0,0.5)'       : '0 4px 24px rgba(140,100,20,0.12)',
    ctaBg:       d ? 'linear-gradient(135deg,#b8892a,#f0d070,#b8892a)'
                       : 'linear-gradient(135deg,#6a4206,#9a6810,#6a4206)',
    ctaText:     d ? '#08080a'                           : '#f8f3e8',
    altSection:  d ? 'rgba(255,255,255,0.02)'            : 'rgba(255,255,255,0.4)',
    footerText:  d ? 'rgba(255,255,255,0.08)'           : '#d0b878',
  };
}

const TRUST_INDICATORS = [
  { icon: '◈', label: '518,000+ mẫu dữ liệu' },
  { icon: '◉', label: 'Hệ thống Nị Hải Hạ' },
  { icon: '✦', label: 'AI giải đoán sâu' },
];

export default function HomepageFooter() {
  const router = useRouter();
  const { theme } = useTheme();
  const c = useColors(theme);

  return (
    <>
      {/* ── Final CTA ── */}
      <section
        className="relative z-10 py-40 px-6 text-center"
        style={{ background: c.altSection }}
      >
        <FadeIn>
          <p className="text-[10px] tracking-[0.6em] uppercase mb-6" style={{ color: c.tagText }}>
            Bắt đầu hành trình bản đồ của bạn
          </p>
          <h2
            className={`grad-text ${theme === 'dark' ? 'grad-text-dark' : 'grad-text-light'} font-bold mb-8 tracking-tight leading-tight`}
            style={{ fontSize: 'clamp(32px, 5vw, 60px)' }}
          >
            Bản đồ Tử Vi của bạn<br />Đang chờ bạn giải đoán
          </h2>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed" style={{ color: c.textSecond }}>
            Nhập ngày tháng năm sinh, trong vài giây tạo bản đồ riêng cho bạn<br />
            Sau đó AI dựa trên hệ thống Nị Hải Hạ giải đoán sâu cho bạn
          </p>

          {/* CTA button */}
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => router.push('/chart')}
            className="px-14 py-4 font-semibold text-base tracking-widest rounded-full"
            style={{ background: c.ctaBg, color: c.ctaText }}
          >
            Sắp bản đồ miễn phí
          </motion.button>

          {/* Secondary links */}
          <div className="mt-4 flex flex-wrap gap-3 justify-center">
            <motion.a
              href="/knowledge"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}
            >
              ✦ Cơ sở tri thức Tử Vi Đẩu Số →
            </motion.a>
            <motion.a
              href="/library"
              whileHover={{ scale: 1.02 }}
              className="text-xs tracking-[0.2em] inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                color: c.goldSolid,
                border: `1px solid ${c.goldLine}`,
                background: 'transparent',
                textDecoration: 'none',
              }}
            >
              📜 Kho cổ thư nguyên tác →
            </motion.a>
          </div>
        </FadeIn>
      </section>

      {/* ── Trust indicators ── */}
      <section className="relative z-10 py-16 px-6">
        <FadeIn>
          <div
            className="mx-auto max-w-2xl rounded-2xl p-8 text-center"
            style={{
              background: c.cardBg,
              border: `1px solid ${c.cardBorder}`,
              boxShadow: c.cardShadow,
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {TRUST_INDICATORS.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2">
                  <span className="text-2xl" style={{ color: c.goldSolid }}>
                    {item.icon}
                  </span>
                  <span className="text-xs font-medium tracking-wider" style={{ color: c.textSecond }}>
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
        className="relative z-10 py-8 px-6"
        style={{ borderTop: `1px solid ${c.cardBorder}` }}
      >
        <div className="text-center">
          <p className="text-[10px] tracking-wider mb-3" style={{ color: c.footerText }}>
            Bản đồ Tử Vi · Dựa trên hệ thống chính thống của Nị Hải Hạ · Chỉ để tham khảo, vận mệnh nằm trong tay bạn
          </p>
          <p className="text-[10px] tracking-wider mb-3 max-w-2xl mx-auto leading-relaxed"
            style={{ color: c.footerText, opacity: 0.85 }}>
            Nền tảng này dựa trên nghiên cứu văn hóa truyền thống Trung Quốc, chỉ cung cấp để tham khảo học tập.<br className="sm:hidden" />
            Nền tảng này không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý hoặc quyết định quan trọng nào.
          </p>
          <p className="text-[10px] tracking-wider" style={{ color: c.footerText }}>
            <a href="/terms" style={{ color: c.footerText, textDecoration: 'underline' }}>Điều khoản dịch vụ</a>
            {' · '}
            <a href="/privacy" style={{ color: c.footerText, textDecoration: 'underline' }}>Chính sách bảo mật</a>
          </p>
        </div>
      </footer>
    </>
  );
}
