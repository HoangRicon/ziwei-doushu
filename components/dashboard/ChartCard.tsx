'use client';
// components/dashboard/ChartCard.tsx
import Link from 'next/link';
import { useState } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';

interface ChartCardProps {
  id: string;
  name?: string | null;
  birthInfo: BirthInfo;
  isPublic: boolean;
  viewCount: number;
  createdAt: string;
  shareToken?: string | null;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getGenderLabel(g: string) {
  return g === 'male' ? 'Nam' : 'Nữ';
}

export default function ChartCard({
  id,
  name,
  birthInfo,
  isPublic,
  viewCount,
  createdAt,
  onDelete,
  onShare,
}: ChartCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const displayName = name || birthInfo.name || `Lá số ${formatDate(createdAt)}`;

  return (
    <div
      className="card-hover rounded-xl p-5 transition-all duration-200"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        position: 'relative',
      }}
    >
      {/* Public badge */}
      {isPublic && (
        <div
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: '11px',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--border-gold)',
          }}
        >
          Công khai
        </div>
      )}

      {/* Thumbnail placeholder — mini zodiac circle */}
      <Link href={`/dashboard/chart/${id}`} className="block mb-4">
        <div
          className="w-full aspect-square rounded-lg flex items-center justify-center mb-3"
          style={{
            background: 'var(--bg-1)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
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
        </div>
      </Link>

      {/* Info */}
      <Link href={`/dashboard/chart/${id}`}>
        <h3
          className="font-semibold mb-1 truncate"
          style={{ fontSize: '16px', color: 'var(--text-primary)' }}
          title={displayName}
        >
          {displayName}
        </h3>
      </Link>
      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        {birthInfo.year}/{String(birthInfo.month).padStart(2, '0')}/{String(birthInfo.day).padStart(2, '0')} · {getGenderLabel(birthInfo.gender)}
      </p>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
        {formatDate(createdAt)}
        {isPublic && <span> · {viewCount} lượt xem</span>}
      </p>

      {/* Actions */}
      <div className="flex gap-2 mt-4">
        <Link
          href={`/dashboard/chart/${id}`}
          className="flex-1 text-center py-2 rounded-lg text-sm font-medium transition-all duration-150"
          style={{
            background: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--border-gold)',
          }}
        >
          Xem
        </Link>
        <button
          onClick={() => onShare(id)}
          className="flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
          style={{
            background: 'transparent',
            color: 'var(--text-body)',
            border: '1px solid var(--border-med)',
          }}
        >
          Chia sẻ
        </button>
        <button
          onClick={() => setConfirmDelete(true)}
          className="px-3 py-2 rounded-lg transition-all duration-150 cursor-pointer"
          style={{
            background: 'transparent',
            color: '#EF4444',
            border: '1px solid rgba(239,68,68,0.2)',
          }}
          title="Xóa"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
          </svg>
        </button>
      </div>

      {/* Delete confirm */}
      {confirmDelete && (
        <div
          className="mt-3 p-3 rounded-lg"
          style={{
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
          }}
        >
          <p style={{ fontSize: '13px', color: 'var(--text-body)', marginBottom: '10px' }}>
            Xóa vĩnh viễn lá số này?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => { onDelete(id); setConfirmDelete(false); }}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{ background: '#EF4444', color: '#fff' }}
            >
              Xóa
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="flex-1 py-1.5 rounded-lg text-sm font-medium cursor-pointer"
              style={{
                background: 'transparent',
                color: 'var(--text-body)',
                border: '1px solid var(--border-med)',
              }}
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
