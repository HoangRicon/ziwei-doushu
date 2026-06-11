'use client';
// components/dashboard/EmptyState.tsx
import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="text-center py-20 px-6">
      {/* Illustration */}
      <div
        className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center"
        style={{ background: 'var(--accent-bg)', border: '1px solid var(--border-gold)' }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      <h2
        className="text-2xl font-bold mb-3"
        style={{ color: 'var(--text-primary)' }}
      >
        Chưa có lá số nào
      </h2>
      <p
        className="text-base mb-8 max-w-md mx-auto"
        style={{ color: 'var(--text-body)', lineHeight: 1.7 }}
      >
        Hãy tạo lá số Tử Vi đầu tiên của bạn để bắt đầu khám phá vận mệnh và lưu trữ để xem lại sau.
      </p>

      <Link
        href="/chart"
        className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-base font-semibold transition-all duration-200"
        style={{
          background: 'var(--accent)',
          color: '#fff',
          boxShadow: '0 2px 8px rgba(154,122,26,0.25)',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 5v14M5 12h14" />
        </svg>
        Tạo lá số đầu tiên
      </Link>
    </div>
  );
}
