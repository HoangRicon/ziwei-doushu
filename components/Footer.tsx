'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

const FOOTER_LINKS = [
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Lá số', href: '/chart' },
      { label: 'Bản đồ hợp', href: '/heming' },
    ],
  },
  {
    title: 'Pháp lý',
    links: [
      { label: 'Điều khoản sử dụng', href: '/terms' },
      { label: 'Chính sách bảo mật', href: '/privacy' },
    ],
  },
];

export default function Footer() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const accent      = isDark ? '#D4A843' : '#9A7A1A';
  const textMuted   = isDark ? '#6A6258' : '#8A8078';
  const textBody     = isDark ? '#A09888' : '#5A5248';
  const textHeading = isDark ? '#D8D0C0' : '#2D2820';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(154,122,26,0.12)';

  return (
    <footer style={{
      background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(253,252,248,0.8)',
      borderTop: `1px solid ${borderColor}`,
    }}>
      {/* Gold gradient line at top */}
      <div className="h-px" style={{
        background: `linear-gradient(to right, transparent, ${accent}, transparent)`,
        opacity: 0.4,
      }} />

      <div className="max-w-page mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <svg width="26" height="26" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="14" r="12" stroke={accent} strokeWidth="1.5" />
                <circle cx="14" cy="14" r="5" fill={accent} />
                {[0,60,120,180,240,300].map((deg) => (
                  <circle
                    key={deg}
                    cx={14 + 8 * Math.cos((deg - 90) * Math.PI / 180)}
                    cy={14 + 8 * Math.sin((deg - 90) * Math.PI / 180)}
                    r="1.4"
                    fill={accent}
                  />
                ))}
              </svg>
              <span className="text-base font-semibold tracking-[0.15em]" style={{ color: accent }}>
                Tu Vi
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: textBody }}>
              Hệ thống chính thống<br />
              Tử Vi Đẩu Số Ni Hải Hạ
            </p>
            <p className="text-sm leading-relaxed" style={{ color: textMuted }}>
              Khoa học cổ đại,<br />
              hiểu biết hiện đại.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold tracking-[0.08em] uppercase mb-4" style={{ color: textHeading }}>
                {col.title}
              </h3>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-150 hover:opacity-70"
                      style={{ color: textMuted }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <p className="text-sm" style={{ color: textMuted }}>
            &copy; {new Date().getFullYear()} Bản đồ Tử Vi &middot; Hệ thống Ni Hải Hạ
          </p>
          <p className="text-sm" style={{ color: textMuted }}>
            Dựa trên hệ thống giảng dạy của thầy Ni Hải Hạ
          </p>
        </div>
      </div>
    </footer>
  );
}
