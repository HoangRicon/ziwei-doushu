'use client';
// components/dashboard/ChartList.tsx
import ChartCard from './ChartCard';
import EmptyState from './EmptyState';
import { useState } from 'react';
import type { BirthInfo } from '@/lib/ziwei/types';

interface ChartSummary {
  id: string;
  name?: string | null;
  birthInfo: BirthInfo;
  isPublic: boolean;
  viewCount: number;
  shareToken?: string | null;
  createdAt: string;
}

interface ChartListProps {
  charts: ChartSummary[];
  onRefresh: () => void;
}

export default function ChartList({ charts, onRefresh }: ChartListProps) {
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/charts/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleShare = async (id: string) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/charts/${id}/share`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await navigator.clipboard.writeText(data.share_url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
        onRefresh();
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (charts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
      }}
    >
      {charts.map((chart) => (
        <div key={chart.id} style={{ opacity: loadingId === chart.id ? 0.6 : 1 }}>
          <ChartCard
            {...chart}
            onDelete={handleDelete}
            onShare={handleShare}
          />
          {copiedId === chart.id && (
            <p
              style={{
                fontSize: '12px',
                color: '#22C55E',
                textAlign: 'center',
                marginTop: '4px',
              }}
            >
              Đã copy link!
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
