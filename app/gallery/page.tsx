'use client';
// app/gallery/page.tsx — Browse public charts (no auth required)
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface GalleryChart {
  id: string;
  name?: string | null;
  viewCount: number;
  birthInfo: { name?: string; year?: number; month?: number; day?: number; gender?: string };
  shareUrl: string;
  createdAt: string;
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function GalleryPage() {
  const [charts, setCharts] = useState<GalleryChart[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/gallery?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        setCharts(page === 1 ? data.charts : (prev) => [...prev, ...data.charts]);
        setTotal(data.total);
        setLoading(false);
      });
  }, [page]);

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-page)' }}>
        <div className="max-w-page mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            Thư viện lá số
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            Khám phá các lá số được chia sẻ công khai — {total} lá số
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-page mx-auto px-6 py-8">
        {charts.length === 0 && !loading ? (
          <div className="text-center py-20">
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>
              Chưa có lá số công khai nào.
            </p>
            <Link
              href="/chart"
              className="inline-flex items-center gap-2 mt-4 px-6 py-2.5 rounded-full text-sm font-semibold"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Tạo lá số đầu tiên
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
              }}
            >
              {charts.map((chart) => {
                const birth = chart.birthInfo;
                const displayName = chart.name || birth.name || 'Lá số công khai';
                return (
                  <a
                    key={chart.id}
                    href={chart.shareUrl}
                    className="card-hover rounded-xl p-5 block transition-all duration-200"
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border)',
                      textDecoration: 'none',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
                        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                        <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
                      </svg>
                      <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>Công khai</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                        {chart.viewCount} lượt xem
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1 truncate" style={{ color: 'var(--text-primary)', fontSize: '16px' }}>
                      {displayName}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                      {birth.year}/{String(birth.month).padStart(2, '0')}/{String(birth.day).padStart(2, '0')} · {birth.gender === 'male' ? 'Nam' : 'Nữ'}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {formatDate(chart.createdAt)}
                    </p>
                  </a>
                );
              })}
            </div>

            {charts.length < total && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'transparent',
                    color: 'var(--accent)',
                    border: '1.5px solid var(--border-gold)',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? 'Đang tải...' : 'Tải thêm'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
