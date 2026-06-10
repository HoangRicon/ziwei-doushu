/**
 * /library/[book]/[chapter] — Trang đọc một chương
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ALL_BOOKS, getChapter } from '@/lib/classics';
import ReadingProgress from './ReadingProgress';

export async function generateStaticParams() {
  return ALL_BOOKS.flatMap(b =>
    b.chapters.map((_, i) => ({ book: b.slug, chapter: String(i) }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapter(bookSlug, parseInt(chIdx));
  if (!result) return {};
  return {
    title: `${result.chapter.title} · 《${result.book.title}》· Cổ thư Tử Vi Đẩu Số`,
    description: result.chapter.subtitle || `《${result.book.title}》${result.chapter.title} nguyên văn`,
  };
}

export default async function ChapterPage({ params }: { params: Promise<{ book: string; chapter: string }> }) {
  const { book: bookSlug, chapter: chIdx } = await params;
  const result = getChapter(bookSlug, parseInt(chIdx));
  if (!result) notFound();

  const { book, chapter, chapterIdx } = result;
  const prevIdx = chapterIdx - 1;
  const nextIdx = chapterIdx + 1;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      <ReadingProgress />

      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--color-accent-bdr)', background: 'color-mix(in srgb, var(--color-bg-page) 92%, transparent)' }}>
        <Link href={`/library/${book.slug}`} className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          ← Mục lục《{book.title}》
        </Link>
        <div className="text-xs tracking-wider hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
          {chapter.title}
        </div>
        <Link href="/library" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          Kho cổ thư →
        </Link>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-2xl mx-auto px-6 pt-6">
        <nav className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/library" className="no-underline hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>Thư viện</Link>
          <span className="mx-2">›</span>
          <Link href={`/library/${book.slug}`} className="no-underline hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>{book.title}</Link>
          <span className="mx-2">›</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{chapter.title}</span>
        </nav>
      </div>

      <article className="max-w-2xl mx-auto px-6 py-10">
        {/* Tiêu đề */}
        <div className="text-center mb-10">
          <div className="text-xs tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
            《{book.title}》· {book.dynasty}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 tracking-wide"
            style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(24px, 3.5vw, 36px)' }}>
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <div className="text-sm tracking-wide" style={{ color: 'var(--color-text-body)' }}>
              {chapter.subtitle}
            </div>
          )}
        </div>

        {/* Đoạn văn */}
        <div className="card p-8 md:p-10" style={{ borderColor: 'var(--color-accent-bdr)' }}>
          {chapter.paragraphs.map((p) => (
            <div
              key={p.id}
              id={p.id}
              className="pb-6 mb-6 border-b border-dashed last:pb-0 last:mb-0 last:border-b-0"
              style={{
                borderColor: 'var(--color-accent-bdr)',
                scrollMarginTop: '100px',
              }}
            >
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-semibold tracking-wider min-w-6" style={{ color: 'var(--color-accent)' }}>
                  {String(p.idx).padStart(2, '0')}
                </span>
                <p className="flex-1 text-base leading-[1.85] tracking-wide"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontFamily: '"PingFang SC", "Hiragino Sans GB", serif',
                  }}>
                  {p.text}
                </p>
              </div>
              {p.translation && (
                <div className="mt-2 ml-9 p-3 rounded-lg text-sm leading-relaxed"
                  style={{ background: 'var(--color-accent-bg)', color: 'var(--color-text-body)' }}>
                  <span className="text-xs font-semibold mr-1.5" style={{ color: 'var(--color-accent)' }}>Bạch thoại</span>
                  {p.translation}
                </div>
              )}
              {p.niNote && (
                <div className="mt-2 ml-9 p-3 rounded-lg text-sm leading-relaxed"
                  style={{ background: 'rgba(196,90,45,0.05)', color: 'var(--color-text-body)' }}>
                  <span className="text-xs font-semibold mr-1.5" style={{ color: '#A83228' }}>Chú của Nị sư</span>
                  {p.niNote}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Điều hướng chương */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          {prevIdx >= 0 ? (
            <Link
              href={`/library/${book.slug}/${prevIdx}`}
              className="card flex-1 p-4 no-underline transition-all hover:shadow-md group"
              style={{ borderColor: 'var(--color-accent-bdr)' }}
            >
              <div className="text-xs tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>← Chương trước</div>
              <div className="text-sm font-medium group-hover:opacity-80" style={{ color: 'var(--color-text-primary)' }}>
                {book.chapters[prevIdx].title}
              </div>
            </Link>
          ) : <div className="flex-1" />}
          {nextIdx < book.chapters.length ? (
            <Link
              href={`/library/${book.slug}/${nextIdx}`}
              className="card flex-1 p-4 no-underline transition-all hover:shadow-md group text-right"
              style={{ borderColor: 'var(--color-accent-bdr)' }}
            >
              <div className="text-xs tracking-wider mb-1" style={{ color: 'var(--color-text-muted)' }}>Chương sau →</div>
              <div className="text-sm font-medium group-hover:opacity-80" style={{ color: 'var(--color-text-primary)' }}>
                {book.chapters[nextIdx].title}
              </div>
            </Link>
          ) : <div className="flex-1" />}
        </div>
      </article>
    </div>
  );
}
