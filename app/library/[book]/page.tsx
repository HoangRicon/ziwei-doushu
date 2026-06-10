/**
 * /library/[book] — Trang mục lục của một bộ cổ thư
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getBookBySlug } from '@/lib/classics';

export async function generateStaticParams() {
  return ALL_BOOKS.map(b => ({ book: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};
  return {
    title: `《${book.title}》· ${book.dynasty} · Kho cổ thư nguyên tác Tử Vi Đẩu Số`,
    description: book.intro,
  };
}

export default async function BookPage({ params }: { params: Promise<{ book: string }> }) {
  const { book: slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) notFound();

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-accent-bdr)', background: 'var(--color-bg-page)' }}>
        <Link href="/library" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          ← Kho cổ thư
        </Link>
        <div className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          《{book.title}》
        </div>
        <Link href="/" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          Trang chủ →
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="text-xs tracking-wider mb-8" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/library" className="no-underline hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>Thư viện</Link>
          <span className="mx-2">›</span>
          <span style={{ color: 'var(--color-text-primary)' }}>《{book.title}》</span>
        </nav>

        {/* Thông tin tên sách */}
        <div className="text-center mb-12">
          <div className="text-xs tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
            {book.dynasty} · {book.author}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-wide"
            style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(28px, 4vw, 42px)' }}>
            《{book.title}》
          </h1>
          <p className="text-sm leading-relaxed max-w-lg mx-auto" style={{ color: 'var(--color-text-body)' }}>
            {book.intro}
          </p>
        </div>

        {/* Mục lục chương */}
        <div className="card overflow-hidden" style={{ borderColor: 'var(--color-accent-bdr)' }}>
          <div className="px-5 py-3.5 text-xs tracking-widest border-b"
            style={{ borderColor: 'var(--color-accent-bdr)', color: 'var(--color-text-muted)', background: 'var(--color-accent-bg)' }}>
            MỤC LỤC · CHAPTERS
          </div>
          {book.chapters.map((chapter, i) => (
            <Link
              key={i}
              href={`/library/${book.slug}/${i}`}
              className="flex items-baseline gap-4 px-5 py-3.5 no-underline transition-colors hover:bg-stone-50 border-b border-dashed last:border-b-0"
              style={{
                borderColor: 'var(--color-accent-bdr)',
                color: 'inherit',
              }}
            >
              <div className="text-sm font-semibold min-w-10 tracking-wider" style={{ color: 'var(--color-accent)' }}>
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="flex-1">
                <div className="text-base font-medium mb-0.5 tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                  {chapter.title}
                </div>
                {chapter.subtitle && (
                  <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {chapter.subtitle}
                  </div>
                )}
              </div>
              <div className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                {chapter.paragraphs.length} đoạn
              </div>
              <div className="text-sm" style={{ color: 'var(--color-accent)' }}>→</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
