/**
 * /library/search?q=xxx — Trang kết quả tìm kiếm
 */

import Link from 'next/link';
import { searchClassics, getParagraphById } from '@/lib/classics';

export const metadata = {
  title: 'Tìm kiếm · Kho cổ thư nguyên tác',
};

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const sp = await searchParams;
  const q = sp.q?.trim() || '';
  const hits = q ? searchClassics(q, 50) : [];

  return (
    <div style={{ background: 'var(--color-bg-page)', minHeight: '100vh' }}>
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--color-bg-page)' }}>
        <Link href="/library" style={{ fontSize: '12px', color: 'var(--color-accent)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← Kho cổ thư
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', letterSpacing: '0.2em' }}>
          Kết quả tìm kiếm
        </div>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--color-accent)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          Trang chủ →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-center mb-10">
          <div style={{ fontSize: '13px', color: 'var(--color-text-muted)', letterSpacing: '0.15em', marginBottom: '4px' }}>
            Từ khóa tìm kiếm
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '0.1em' }}>
            「{q || '（trống）'}」
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
            Tìm thấy tổng cộng <strong style={{ color: 'var(--color-accent)' }}>{hits.length}</strong> kết quả khớp nguyên tác cổ thư
          </div>
        </div>

        {hits.length === 0 ? (
          <div style={{
            background: 'var(--color-bg-card)',
            padding: '40px 20px',
            borderRadius: '12px',
            textAlign: 'center',
            color: 'var(--color-text-body)',
            border: '1px solid rgba(184,146,42,0.15)',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '12px', opacity: 0.4 }}>📜</div>
            {q ? (
              <>
                <div style={{ fontSize: '14px', marginBottom: '6px' }}>Chưa tìm thấy từ khóa này trong các cổ thư đã thu thập</div>
                <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.7 }}>
                  Chúng tôi đang liên tục bổ sung nội dung. Có thể thử tìm kiếm:<br />
                  <span style={{ color: 'var(--color-accent)' }}>Thập sát triều đấu / Song lộc triều viên / Hóa kỵ / Tử Vi / Mệnh cung / Cơ nguyệt đồng lương</span>
                </div>
              </>
            ) : (
              <div style={{ fontSize: '13px' }}>Vui lòng nhập từ khóa cần tìm kiếm</div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hits.map((hit, i) => {
              const ctx = getParagraphById(hit.paragraphId);
              const chapterIdx = ctx?.chapterIdx ?? 0;
              return (
                <Link
                  key={i}
                  href={`/library/${hit.bookSlug}/${chapterIdx}#${hit.paragraphId}`}
                  style={{
                    display: 'block',
                    background: 'var(--color-bg-card)',
                    padding: '16px 20px',
                    borderRadius: '10px',
                    border: '1px solid rgba(184,146,42,0.18)',
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '11px',
                    color: 'var(--color-text-muted)',
                    marginBottom: '8px',
                    letterSpacing: '0.1em',
                  }}>
                    <span style={{ color: 'var(--color-accent)', fontWeight: 600 }}>《{hit.bookTitle}》</span>
                    <span style={{ opacity: 0.5 }}>·</span>
                    <span>{hit.chapterTitle}</span>
                  </div>
                  <div
                    style={{
                      fontSize: '14px',
                      color: 'var(--color-text-primary)',
                      lineHeight: 1.9,
                      letterSpacing: '0.02em',
                    }}
                    dangerouslySetInnerHTML={{ __html: hit.snippet }}
                  />
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        mark { background: rgba(184,146,42,0.3); color: #8b6a14; padding: 0 2px; border-radius: 2px; font-weight: 600; }
      `}</style>
    </div>
  );
}
