/**
 * /knowledge — Trang Kiến thức Tử Vi
 * Hiển thị hệ thống 14 Chính tinh với danh sách chi tiết
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ALL_STARS, ALL_TOPICS, getKnowledge, STAR_BRIEF_SEO, STAR_TO_SLUG } from '@/lib/seo/knowledge';
import { TOPIC_LABEL } from '@/lib/ziwei/db-analysis';
import { useTheme } from '@/components/ThemeProvider';
import FadeIn from '@/components/FadeIn';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả' },
  { key: 'beidao', label: 'Bắc Đẩu' },
  { key: 'nandao', label: 'Nam Đẩu' },
  { key: 'zhong', label: 'Trung Thiên' },
];

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
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const bgPage = isDark ? '#0C0A08' : '#FDFCF8';
  const bgCard = isDark ? 'rgba(255,255,255,0.04)' : '#FFFFFF';
  const bg1 = isDark ? '#141210' : '#F7F5F0';
  const textPrimary = isDark ? '#F0EBE0' : '#1A1510';
  const textSecondary = isDark ? '#D8D0C0' : '#2D2820';
  const textBody = isDark ? '#A09888' : '#5A5248';
  const textMuted = isDark ? '#6A6258' : '#8A8078';
  const accent = isDark ? '#D4A843' : '#9A7A1A';
  const borderColor = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(26,21,16,0.08)';
  const borderGold = isDark ? 'rgba(212,168,67,0.25)' : 'rgba(154,122,26,0.20)';

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStars = ALL_STARS.filter(star => {
    const matchCategory = activeCategory === 'all' || getStarCategory(star) === activeCategory;
    const matchSearch = !searchQuery || star.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div style={{ minHeight: '100vh', background: bgPage }}>
      {/* Header Bar */}
      <div className="container-page">
        <div className="flex items-center justify-between py-5"
          style={{ borderBottom: `1px solid ${borderColor}` }}>
          <Link href="/" className="text-sm tracking-widest no-underline transition-all hover:opacity-70"
            style={{ color: accent }}>
            ← Trang chủ
          </Link>
          <div className="text-xs tracking-wider hidden sm:block" style={{ color: textMuted }}>
            Phương pháp của Nị sư · Kiến thức Tử Vi
          </div>
          <Link href="/library" className="text-sm tracking-widest no-underline transition-all hover:opacity-70"
            style={{ color: accent }}>
            Thư viện →
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container-page">
        <FadeIn>
          <div className="text-center pt-16 pb-14">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-px w-16" style={{ background: `linear-gradient(to right, transparent, ${borderGold})` }} />
              <span className="text-xs tracking-widest font-medium" style={{ color: accent }}>KIẾN THỨC TỬ VI</span>
              <div className="h-px w-16" style={{ background: `linear-gradient(to left, transparent, ${borderGold})` }} />
            </div>

            <h1 className="heading-1 mb-4" style={{ color: textPrimary }}>
              Kiến thức Tử Vi
            </h1>

            <p className="body max-w-2xl mx-auto" style={{ color: textBody }}>
              Tìm hiểu hệ thống tri thức bài bản về Tử Vi Đẩu Số. 14 Chính tinh × 13 Cung = {ALL_STARS.length * ALL_TOPICS.length} chủ đề giải đoán chuyên sâu.
            </p>

            <div className="flex items-center justify-center gap-6 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{ALL_STARS.length}</span>
                <span className="text-sm" style={{ color: textMuted }}>Chính tinh</span>
              </div>
              <div className="w-px h-4" style={{ background: borderColor }} />
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{ALL_TOPICS.length}</span>
                <span className="text-sm" style={{ color: textMuted }}>Cung</span>
              </div>
              <div className="w-px h-4" style={{ background: borderColor }} />
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: accent }}>{ALL_STARS.length * ALL_TOPICS.length}</span>
                <span className="text-sm" style={{ color: textMuted }}>Chủ đề</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      <div className="container-page pb-20">
        {/* Search & Filter */}
        <FadeIn delay={0.1}>
          <div className="mb-10 space-y-4">
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm Tinh, ví dụ: Tử Vi, Thái Dương..."
                className="input-base"
              />
            </div>

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
        </FadeIn>

        {/* Star Cards Grid */}
        <FadeIn delay={0.15}>
          <div className="mb-12">
            <div className="label-section text-center mb-6">
              Thập tứ Chính tinh
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-3">
              {filteredStars.map((star, idx) => (
                <motion.div
                  key={star}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.4 }}
                >
                  <Link
                    href={`/knowledge/${STAR_TO_SLUG[star]}/overview`}
                    className="block no-underline transition-all duration-200 group"
                    style={{
                      background: bgCard,
                      border: `1px solid ${borderColor}`,
                      borderRadius: '12px',
                      padding: '20px 16px',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = borderGold;
                      el.style.transform = 'translateY(-2px)';
                      el.style.boxShadow = isDark
                        ? '0 8px 24px rgba(0,0,0,0.4), 0 0 20px rgba(212,168,67,0.1)'
                        : '0 8px 24px rgba(0,0,0,0.1), 0 0 20px rgba(154,122,26,0.08)';
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = borderColor;
                      el.style.transform = 'translateY(0)';
                      el.style.boxShadow = 'none';
                    }}
                  >
                    <div className="text-xl font-bold tracking-wide mb-1" style={{ color: accent }}>
                      {star}
                    </div>
                    <div className="text-xs tracking-wider" style={{ color: textMuted }}>
                      tinh
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Detailed Star List */}
        <div className="space-y-5">
          {filteredStars.map((star, idx) => (
            <FadeIn key={star} delay={idx * 0.05}>
              <motion.div
                className="p-6 md:p-8 transition-all duration-200"
                style={{
                  background: bgCard,
                  border: `1px solid ${borderColor}`,
                  borderRadius: '16px',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = borderGold;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = borderColor;
                }}
              >
                <div className="flex items-baseline gap-4 mb-3">
                  <span className="text-2xl font-bold tracking-wide" style={{ color: accent }}>
                    {star}
                  </span>
                  <span className="text-sm tracking-widest hidden sm:inline" style={{ color: textMuted }}>
                    CHÍNH TINH
                  </span>
                </div>

                <p className="body-small mb-5 max-w-3xl" style={{ color: textBody }}>
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
                        className="text-sm px-4 py-2 no-underline transition-all"
                        style={{
                          background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)',
                          border: `1px solid ${borderGold}`,
                          borderRadius: '20px',
                          color: textBody,
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = isDark ? 'rgba(212,168,67,0.15)' : 'rgba(154,122,26,0.12)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = isDark ? 'rgba(212,168,67,0.08)' : 'rgba(154,122,26,0.06)';
                        }}
                      >
                        {k.palaceName} · {TOPIC_LABEL[t]}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        {/* Footer Info */}
        <FadeIn delay={0.3}>
          <div className="mt-16 p-6 text-center rounded-xl" style={{ background: bg1, border: `1px solid ${borderColor}` }}>
            <div className="text-xs font-semibold tracking-widest mb-3" style={{ color: accent }}>
              Về hệ thống kiến thức
            </div>
            <div className="body-small max-w-xl mx-auto" style={{ color: textBody }}>
              Biên soạn dựa trên hệ thống &quot;Thiên Kỷ&quot; của Nị Hải Hạ. Tất cả nội dung có chứng cứ từ cổ thư Tử Vi Đẩu Số chính thống.
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
