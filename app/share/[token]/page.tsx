// app/share/[token]/page.tsx — View a shared chart (public, no auth required)
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const chart = await db.ziweiChart.findUnique({
    where: { shareToken: token, isPublic: true },
    select: { name: true, birthInfo: true },
  });

  if (!chart) return { title: 'Không tìm thấy — Tử Vi Đẩu Số' };

  const birth = chart.birthInfo as { name?: string; year?: number; month?: number; day?: number };
  const displayName = chart.name || birth.name || 'Lá số chia sẻ';
  return {
    title: `${displayName} — Tử Vi Đẩu Số`,
    description: `Lá số Tử Vi ngày ${birth.day}/${birth.month}/${birth.year}`,
  };
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;

  const chart = await db.ziweiChart.findUnique({
    where: { shareToken: token, isPublic: true },
    select: {
      id: true,
      name: true,
      birthInfo: true,
      lunarInfo: true,
      chartData: true,
      viewCount: true,
      createdAt: true,
    },
  });

  if (!chart) {
    return notFound();
  }

  // Increment view count
  db.ziweiChart.update({
    where: { id: chart.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  const birth = chart.birthInfo as { name?: string; year?: number; month?: number; day?: number; gender?: string; hour?: number };
  const displayName = chart.name || birth.name || 'Lá số';

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-page)',
        }}
      >
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-3"
            style={{
              background: 'var(--accent-bg)',
              border: '1px solid var(--border-gold)',
              fontSize: '13px',
              color: 'var(--accent)',
              fontWeight: 600,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Lá số chia sẻ công khai
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {displayName}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
            {birth.year}/{String(birth.month).padStart(2, '0')}/{String(birth.day).padStart(2, '0')} · {birth.gender === 'male' ? 'Nam' : 'Nữ'}
          </p>
        </div>
      </div>

      {/* Chart content placeholder */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div
          className="rounded-xl p-12 text-center"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="120" height="120" viewBox="0 0 60 60" fill="none" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="26" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
            <circle cx="30" cy="30" r="16" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
            <circle cx="30" cy="30" r="6" fill="var(--accent)" opacity="0.6" />
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <circle
                key={deg}
                cx={30 + 20 * Math.cos((deg - 90) * Math.PI / 180)}
                cy={30 + 20 * Math.sin((deg - 90) * Math.PI / 180)}
                r="1.5"
                fill="var(--accent)"
                opacity="0.5"
              />
            ))}
          </svg>
          <p style={{ color: 'var(--text-body)', fontSize: '16px', lineHeight: 1.7 }}>
            Nội dung chiêm tinh chi tiết sẽ được hiển thị tại đây.
          </p>
          <a
            href="/chart"
            className="inline-flex items-center gap-2 mt-6 px-6 py-2.5 rounded-full text-sm font-semibold"
            style={{
              background: 'var(--accent)',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(154,122,26,0.25)',
            }}
          >
            Tạo lá số của bạn
          </a>
        </div>
      </div>
    </div>
  );
}
