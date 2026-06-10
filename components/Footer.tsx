'use client';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

const FOOTER_LINKS = [
  {
    title: 'Dịch vụ',
    links: [
      { label: 'Lập bản đồ', href: '/chart' },
      { label: 'Hằng sao', href: '/heming' },
      { label: 'Thư viện kinh điển', href: '/library' },
    ],
  },
  {
    title: 'Tài nguyên',
    links: [
      { label: 'Kiến thức Tử Vi', href: '/knowledge' },
      { label: '14 Chính tinh', href: '/knowledge' },
      { label: 'Cổ thư học thuật', href: '/library' },
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

  const goldSolid = isDark ? '#d4a843' : '#8b6410';
  const textMuted = isDark ? '#6a7a96' : '#7a7368';
  const textSecondary = isDark ? '#9db0d0' : '#4a4540';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(160,120,30,0.15)';

  return (
    <footer
      style={{
        background: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(255,252,242,0.8)',
        borderTop: `1px solid ${borderColor}`,
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke={goldSolid} strokeWidth="1.5" />
                <circle cx="12" cy="12" r="4" fill={goldSolid} />
                {[0,60,120,180,240,300].map((deg) => (
                  <circle
                    key={deg}
                    cx={12 + 6.5 * Math.cos((deg - 90) * Math.PI / 180)}
                    cy={12 + 6.5 * Math.sin((deg - 90) * Math.PI / 180)}
                    r="1.2"
                    fill={goldSolid}
                  />
                ))}
              </svg>
              <span className="font-semibold tracking-[0.2em]" style={{ color: goldSolid }}>
                Tử Vi
              </span>
            </div>
            <p className="text-xs leading-relaxed mb-4" style={{ color: textMuted }}>
              Hệ thống chính thống<br />
              Tử Vi Đẩu Số Nị Hải Hạ
            </p>
            <p className="text-xs" style={{ color: textMuted }}>
              Khoa học cổ đại,<br />
              hiểu biết hiện đại.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-[0.12em] uppercase mb-3" style={{ color: textSecondary }}>
                {col.title}
              </h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs transition-colors duration-150 hover:opacity-70"
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
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <p className="text-xs" style={{ color: textMuted }}>
            © {new Date().getFullYear()} Tử Vi Đẩu Số · Hệ thống Nị Hải Hạ
          </p>
          <p className="text-xs" style={{ color: textMuted }}>
            Dựa trên hệ thống giảng dạy của thầy Nị Hải Hạ
          </p>
        </div>
      </div>
    </footer>
  );
}
