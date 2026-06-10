/**
 * /knowledge — Trang chủ Cơ sở tri thức
 * Liệt kê 14 Chính tinh, mỗi tinh có thể xem giải đoán tại 13 cung
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

// Filter categories
const CATEGORIES = [
  { key: 'all', label: 'Tất cả' },
  { key: 'beidao', label: 'Bắc Đẩu' },
  { key: 'nandao', label: 'Nam Đẩu' },
  { key: 'zhong', label: 'Trung Thiên' },
];

// Group stars by category
const STAR_GROUPS: Record<string, string[]> = {
  beidao: ['Tử Vi', 'Thiên Phủ', 'Thái Dương', 'Vũ Khúc', 'Thiên Tướng', 'Thiên Lương', 'Cự Môn'],
  nandao: ['Tham Lang', 'Các Đẩu', 'Phá Quân', 'Liêm Trinh', 'Thất Xíu', 'Trực Phù'],
  zhong: ['Văn Khúc'],
};

function getStarCategory(star: string): string {
  for (const [cat, stars] of Object.entries(STAR_GROUPS)) {
    if (stars.includes(star)) return cat;
  }
  return 'all';
}

export default function KnowledgeHomePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStars = ALL_STARS.filter(star => {
    const matchCategory = activeCategory === 'all' || getStarCategory(star) === activeCategory;
    const matchSearch = !searchQuery || star.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-accent-bdr)', background: 'var(--color-bg-page)' }}>
        <Link href="/" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          ← Trang chủ
        </Link>
        <div className="text-xs tracking-wider hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
          Phương pháp của Nị sư · Cơ sở tri thức
        </div>
        <Link href="/library" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          Cổ thư →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-14 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent-bdr))' }} />
          <span className="text-xs tracking-widest" style={{ color: 'var(--color-accent)' }}>KNOWLEDGE BASE</span>
          <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, var(--color-accent-bdr))' }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-wide"
          style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(28px, 4vw, 42px)' }}>
          Kiến thức Tử Vi
        </h1>
        <p className="text-sm tracking-wide max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
          14 Chính tinh × 13 Cung = <strong style={{ color: 'var(--color-accent)' }}>{ALL_STARS.length * ALL_TOPICS.length}</strong> chủ đề<br />
          Biên soạn dựa trên hệ thống "Thiên Kỷ" của Nị Hải Hạ · Có chứng cứ cổ thư
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Search & Filter */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="max-w-md mx-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm Tinh, ví dụ: Tử Vi, Thái Dương..."
              className="input-base"
            />
          </div>

          {/* Category tabs */}
          <div className="flex justify-center">
            <div className="tab-container">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={`tab-item ${activeCategory === cat.key ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section label */}
        <div className="text-xs tracking-widest text-center mb-6" style={{ color: 'var(--color-text-muted)' }}>
          Thập tứ Chính tinh
        </div>

        {/* Star Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-14">
          {filteredStars.map(star => (
            <Link
              key={star}
              href={`/knowledge/${STAR_TO_SLUG[star]}/overview`}
              className="card p-5 block no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{ borderColor: 'var(--color-accent-bdr)' }}
            >
              <div className="text-2xl font-bold tracking-wide mb-1" style={{ color: 'var(--color-accent)' }}>
                {star}
              </div>
              <div className="text-xs tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                tinh · ZI WEI
              </div>
            </Link>
          ))}
        </div>

        {/* Danh sách chi tiết (mỗi Chính tinh + giới thiệu + nút vào) */}
        <div className="space-y-4">
          {filteredStars.map(star => (
            <div key={star} className="card p-5 md:p-6"
              style={{ borderColor: 'var(--color-accent-bdr)' }}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-xl font-bold tracking-wide" style={{ color: 'var(--color-accent)' }}>
                  {star} tinh
                </span>
                <span className="text-xs tracking-widest hidden sm:inline" style={{ color: 'var(--color-text-muted)' }}>
                  ZI WEI · 14 STARS
                </span>
              </div>
              <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-body)' }}>
                {STAR_BRIEF_SEO[star] || ''}
              </p>
              <div className="flex flex-wrap gap-2">
                {ALL_TOPICS.map(t => {
                  const k = getKnowledge(star, t);
                  if (!k.exists) return null;
                  return (
                    <Link
                      key={t}
                      href={`/knowledge/${STAR_TO_SLUG[star]}/${t}`}
                      className="text-xs px-3 py-1.5 no-underline transition-all hover:shadow-sm"
                      style={{
                        background: 'var(--color-accent-bg)',
                        border: '1px solid var(--color-accent-bdr)',
                        borderRadius: 'var(--radius-pill)',
                        color: 'var(--color-text-body)',
                      }}
                    >
                      Vào {k.palaceName} · {TOPIC_LABEL[t]}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
