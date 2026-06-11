'use client';
// app/(main)/dashboard/page.tsx — User's chart dashboard
import { useSession } from 'next-auth/react';
import { useEffect, useState, useCallback } from 'react';
import ChartList from '@/components/dashboard/ChartList';
import UsageBar from '@/components/dashboard/UsageBar';
import Link from 'next/link';
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

interface UsageData {
  charts_count: number;
  charts_limit: number;
  plan: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [charts, setCharts] = useState<ChartSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [chartsRes, usageRes] = await Promise.all([
        fetch('/api/charts?limit=50'),
        fetch('/api/usage'),
      ]);
      if (chartsRes.ok) {
        const data = await chartsRes.json();
        setCharts(data.charts);
        setTotal(data.total);
      }
      if (usageRes.ok) {
        setUsage(await usageRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredCharts = search
    ? charts.filter((c) =>
        (c.name ?? '').toLowerCase().includes(search.toLowerCase())
      )
    : charts;

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)' }}>
      {/* Page header */}
      <div
        style={{
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-page)',
        }}
      >
        <div className="max-w-page mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1
                className="text-3xl font-bold mb-1"
                style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
              >
                Bảng lá số
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>
                {total === 0
                  ? 'Chào mừng! Bắt đầu tạo lá số đầu tiên.'
                  : `Bạn có ${total} lá số`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {usage && <UsageBar used={usage.charts_count} limit={usage.charts_limit} plan={usage.plan} />}
              <Link
                href="/chart"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap"
                style={{
                  background: 'var(--accent)',
                  color: '#fff',
                  boxShadow: '0 2px 8px rgba(154,122,26,0.25)',
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Tạo lá số mới
              </Link>
            </div>
          </div>

          {/* Search */}
          {charts.length > 0 && (
            <div className="mt-5 max-w-md">
              <div style={{ position: 'relative' }}>
                <svg
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
                >
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm lá số..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-luxury"
                  style={{ paddingLeft: '42px', fontSize: '15px' }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-page mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div
              className="w-10 h-10 rounded-full animate-spin"
              style={{ border: '2px solid var(--border)', borderTopColor: 'var(--accent)' }}
            />
          </div>
        ) : (
          <ChartList charts={filteredCharts} onRefresh={fetchData} />
        )}
      </div>
    </div>
  );
}
