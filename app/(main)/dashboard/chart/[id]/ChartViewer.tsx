'use client';
// app/(main)/dashboard/chart/[id]/ChartViewer.tsx
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ZiweiChart } from '@prisma/client';

interface Props {
  chart: {
    id: string;
    name?: string | null;
    birthInfo: unknown;
    lunarInfo: unknown;
    chartData: unknown;
    isPublic: boolean;
    shareToken?: string | null;
    createdAt: Date;
  };
}

export default function ChartViewer({ chart }: Props) {
  const router = useRouter();
  const [name, setName] = useState(chart.name ?? '');
  const [isPublic, setIsPublic] = useState(chart.isPublic);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/charts/${chart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, is_public: isPublic }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleShare = async () => {
    const res = await fetch(`/api/charts/${chart.id}/share`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      await navigator.clipboard.writeText(data.share_url);
      setIsPublic(true);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Toolbar */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-page)',
        }}
      >
        <div className="max-w-page mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-1.5 text-sm transition-colors duration-150 cursor-pointer"
              style={{ color: 'var(--text-muted)' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
              Quay lại
            </button>

            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setSaved(false); }}
                placeholder="Tên lá số..."
                className="input-luxury"
                style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  maxWidth: '400px',
                  padding: '8px 14px',
                }}
              />
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer"
              style={{
                background: saved ? '#22C55E' : 'var(--accent)',
                color: '#fff',
                opacity: saving ? 0.7 : 1,
              }}
            >
              {saving ? 'Đang lưu...' : saved ? 'Đã lưu!' : 'Lưu thay đổi'}
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: 'transparent',
                color: 'var(--accent)',
                border: '1.5px solid var(--border-gold)',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
                <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="max-w-page mx-auto px-6 py-8">
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Lá số đã lưu. Dữ liệu chiêm tinh hiển thị ở đây.
          {/* TODO: integrate full ChartBoard with chart.chartData */}
        </p>
        <div
          className="mt-4 rounded-xl p-8 text-center"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="80" height="80" viewBox="0 0 60 60" fill="none" className="mx-auto mb-4">
            <circle cx="30" cy="30" r="26" stroke="var(--accent)" strokeWidth="1.5" opacity="0.4" />
            <circle cx="30" cy="30" r="16" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
            <circle cx="30" cy="30" r="6" fill="var(--accent)" opacity="0.6" />
          </svg>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {name || 'Lá số'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
            {chart.isPublic ? 'Công khai' : 'Riêng tư'} · {new Date(chart.createdAt).toLocaleDateString('vi-VN')}
          </p>
        </div>
      </div>
    </div>
  );
}
