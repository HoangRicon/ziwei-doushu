'use client';
// components/dashboard/UsageBar.tsx
interface UsageBarProps {
  used: number;
  limit: number;
  plan: string;
}

export default function UsageBar({ used, limit, plan }: UsageBarProps) {
  const pct = limit === Infinity ? 0 : Math.min((used / limit) * 100, 100);
  const isWarning = pct >= 80;
  const isFull = pct >= 100;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          {used} / {limit === Infinity ? '∞' : limit} lá số đã lưu
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '999px',
            background: isFull ? 'rgba(239,68,68,0.1)' : isWarning ? 'rgba(245,158,11,0.1)' : 'var(--accent-bg)',
            color: isFull ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--accent)',
            border: `1px solid ${isFull ? 'rgba(239,68,68,0.2)' : isWarning ? 'rgba(245,158,11,0.2)' : 'var(--border-gold)'}`,
          }}
        >
          {plan === 'free' ? 'Miễn phí' : plan === 'pro' ? 'Pro' : 'Enterprise'}
        </span>
      </div>
      <div
        style={{
          height: '6px',
          borderRadius: '999px',
          background: 'var(--bg-2)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            borderRadius: '999px',
            background: isFull ? '#EF4444' : isWarning ? '#F59E0B' : 'var(--accent)',
            transition: 'width 0.4s ease',
          }}
        />
      </div>
      {isWarning && !isFull && (
        <p style={{ fontSize: '13px', color: '#F59E0B', marginTop: '6px' }}>
          Bạn đã dùng {pct.toFixed(0)}% dung lượng lưu trữ.
        </p>
      )}
      {isFull && (
        <p style={{ fontSize: '13px', color: '#EF4444', marginTop: '6px' }}>
          Bạn đã đạt giới hạn. Nâng cấp tài khoản để lưu thêm lá số.
        </p>
      )}
    </div>
  );
}
