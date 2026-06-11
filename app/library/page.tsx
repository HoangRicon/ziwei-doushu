/**
 * /library — Trang Thư viện Kinh điển Tử Vi
 * Hiển thị kho cổ thư nguyên tác Tử Vi Đẩu Số
 */

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

export default function LibraryHomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const bg1 = isDark ? '#141210' : '#F7F5F0';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary = isDark ? '#D8D0C0' : '#2D2820';
  const textBody = isDark ? '#A09888' : '#5A5248';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  return (
    <div style={{ minHeight: '100vh', background: bgPage }}>
      {/* Header Bar */}
      <div className="container-page">
        <div className="flex items-center justify-between py-5"
          style={{ borderBottom: `1px solid ${borderColor}` }}>
          <Link href="/" className="text-sm tracking-widest no-underline transition-all hover:opacity-70"
            style={{ color: accent }}>
            ← Trang chủ
          </Link>
          <div className="text-xs tracking-widest hidden sm:block" style={{ color: textMuted }}>
            Thư viện kinh điển · CLASSICS
          </div>
          <Link href="/chart" className="text-sm tracking-widest no-underline transition-all hover:opacity-70"
            style={{ color: accent }}>
            Sắp bản đồ →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container-page">
        <FadeIn>
          <div className="text-center pt-16 pb-14">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${borderGold})` }} />
              <span className="text-xs tracking-widest font-medium" style={{ color: accent }}>CỔ THƯ NGUYÊN TÁC</span>
              <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${borderGold})` }} />
            </div>

            <h1 className="heading-1 mb-4" style={{ color: textPrimary }}>
              Thư viện kinh điển
            </h1>

            <p className="body max-w-2xl mx-auto" style={{ color: textBody }}>
              Kho cổ thư nguyên tác Tử Vi Đẩu Số. Tra cứu toàn văn các cổ thư uy tín được thu thập và biên soạn bài bản.
            </p>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{ALL_BOOKS.length}</span>
                <span className="text-sm" style={{ color: textMuted }}>bộ cổ thư</span>
              </div>
              <div className="w-px h-4" style={{ background: borderColor }} />
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{TOTAL_PARAGRAPHS}</span>
                <span className="text-sm" style={{ color: textMuted }}>đoạn tinh hoa</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Search Section */}
      <div className="container-page">
        <FadeIn delay={0.1}>
          <div className="max-w-2xl mx-auto mb-14">
            <LibrarySearch />
          </div>
        </FadeIn>
      </div>

      {/* Books Grid */}
      <div className="container-page pb-20">
        <FadeIn delay={0.15}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALL_BOOKS.map((book, idx) => (
              <motion.div
                key={book.slug}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
              >
                <Link
                  href={`/library/${book.slug}`}
                  className="block no-underline transition-all duration-200 group"
                  style={{
                    background: bgCard,
                    border: `1px solid ${borderColor}`,
                    borderRadius: '16px',
                    padding: '24px',
                    height: '100%',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = borderGold;
                    el.style.transform = 'translateY(-4px)';
                    el.style.boxShadow = isDark
                      ? '0 12px 32px rgba(0,0,0,0.5), 0 0 24px rgba(212,168,67,0.12)'
                      : '0 12px 32px rgba(0,0,0,0.12), 0 0 24px rgba(154,122,26,0.1)';
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = borderColor;
                    el.style.transform = 'translateY(0)';
                    el.style.boxShadow = 'none';
                  }}
                >
                  {/* Book Cover Placeholder */}
                  <div className="mb-5 flex items-center justify-center"
                    style={{
                      height: '100px',
                      background: isDark
                        ? 'linear-gradient(135deg, rgba(212,168,67,0.08) 0%, rgba(212,168,67,0.03) 100%)'
                        : 'linear-gradient(135deg, rgba(154,122,26,0.06) 0%, rgba(154,122,26,0.02) 100%)',
                      border: `1px solid ${borderGold}`,
                      borderRadius: '12px',
                    }}>
                    <div className="text-center">
                      <div className="text-4xl mb-2" style={{ color: accent }}>📜</div>
                      <div className="text-xs tracking-widest" style={{ color: textMuted }}>CỔ THƯ</div>
                    </div>
                  </div>

                  {/* Book Info */}
                  <div className="text-xs tracking-wider mb-2" style={{ color: textMuted }}>
                    {book.dynasty} · {book.author.split(' ')[0]}
                  </div>

                  <div className="text-xl font-semibold mb-3 tracking-wide" style={{ color: textPrimary }}>
                    《{book.title}》
                  </div>

                  <div className="body-small mb-4" style={{
                    color: textBody,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {book.intro}
                  </div>

                  <div className="flex gap-4 text-xs" style={{ color: textMuted }}>
                    <span>{book.chapters.length} chương</span>
                    <span>·</span>
                    <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} đoạn</span>
                  </div>

                  <div className="mt-4 text-sm font-medium tracking-wider" style={{ color: accent }}>
                    Vào tra cứu →
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* Footer Info */}
        <FadeIn delay={0.3}>
          <div className="mt-16 p-8 text-center rounded-xl" style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(212,168,67,0.06) 0%, rgba(212,168,67,0.02) 100%)'
              : 'linear-gradient(135deg, rgba(154,122,26,0.04) 0%, rgba(154,122,26,0.01) 100%)',
            border: `1px solid ${borderGold}`,
          }}>
            <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: accent }}>
              Về kho cổ thư này
            </div>
            <div className="body-small max-w-2xl mx-auto mb-4" style={{ color: textBody }}>
              Tất cả cổ thư được thu thập đều là bản quyền công (bản in thời Minh). Nội dung đang được hoàn thiện, trong tương lai sẽ bổ sung toàn bộ &quot;Tử Vi Đẩu Số Toàn Tập&quot; và mục lục trích dẫn &quot;Thiên Kỷ&quot; của Nị Hải Hạ.
            </div>
            <div className="text-xs" style={{ color: textMuted }}>
              Nếu phát hiện bất kỳ sai sót nào, xin liên hệ với chúng tôi.
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
