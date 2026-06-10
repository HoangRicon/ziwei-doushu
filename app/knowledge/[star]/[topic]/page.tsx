/**
 * /knowledge/[star]/[topic] — Trang đích SEO
 *
 * 14 Chính tinh × 13 topic = 182 URL độc lập
 * Mỗi trang chứa 4 đoạn luận đoán STAR_DB đầy đủ (định điệu một câu / luận đoán cốt lõi / căn cứ bản đồ / nguồn cổ điển)
 *
 * Điểm SEO:
 *  - title chứa từ khóa chính (ví dụ: "Tử Vi nhập Mệnh cung·Giải thích chi tiết hệ thống Nị Hải Hạ")
 *  - description dùng dingdiao (định điệu một câu)
 *  - Dữ liệu có cấu trúc JSON-LD Article
 *  - Liên kết nội bộ: 12 cung khác cùng Chính tinh + 13 Chính tinh khác cùng cung
 *  - generateStaticParams tạo tĩnh, không có chi phí runtime
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  STAR_BRIEF_SEO,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';

// Cho phép tham số động: nếu tổ hợp star/topic không có trong danh sách generateStaticParams
// thì cho phép render theo yêu cầu, tránh lỗi 404 do vấn đề mã hóa URL tiếng Trung
export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  // URL dùng slug pinyin thay cho tiếng Trung, tránh vấn đề ranh giới route tiếng Trung của Vercel/CDN
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) return {};

  const title = `${star} nhập ${data.palaceName} cung · ${data.topicLabel} · Giải thích chi tiết hệ thống Nị Hải Hạ`;
  const description = data.parsed.dingdiao
    || `Giải đoán Tử Vi Đẩu Số ${star} nhập ${data.palaceName} cung — Dựa trên hệ thống "Thiên Kỷ" của Nị Hải Hạ và cổ thư "Tử Vi Đẩu Số Toàn Tập", "Tủy Cốt Phú".`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    alternates: {
      canonical: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    keywords: [
      'Tử Vi Đẩu Số', 'Nị Hải Hạ', star, data.palaceName, data.topicLabel,
      `${star}${data.palaceName}`, `${star} nhập ${data.palaceName}`,
      `Tử Vi Đẩu Số ${star}`, 'Nị Hải Hạ Tử Vi Đẩu Số', 'Tử Vi Đẩu Số Toàn Tập',
    ],
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) notFound();

  // Các topic khác cùng Chính tinh
  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic && getKnowledge(star, t).exists);
  // Các Chính tinh khác cùng topic
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star && getKnowledge(s, topic as TopicKey).exists);

  // JSON-Ld
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${star} nhập ${data.palaceName} cung · ${data.topicLabel}`,
    description: data.parsed.dingdiao,
    author: { '@type': 'Organization', name: 'Nghiên cứu Tử Vi · Chính thống Nị Hải Hạ' },
    publisher: {
      '@type': 'Organization',
      name: 'Nghiên cứu Tử Vi',
      url: 'https://wdyziweidoushu666.com',
    },
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    mainEntityOfPage: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    articleSection: 'Tử Vi Đẩu Số · Hệ thống Nị Hải Hạ',
    keywords: ['Tử Vi Đẩu Số', star, data.palaceName, data.topicLabel].join(', '),
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md"
        style={{ borderBottom: '1px solid var(--color-accent-bdr)', background: 'color-mix(in srgb, var(--color-bg-page) 92%, transparent)' }}>
        <Link href="/" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          ← Trang chủ
        </Link>
        <div className="text-xs tracking-wider hidden sm:block" style={{ color: 'var(--color-text-muted)' }}>
          Kiến thức Tử Vi
        </div>
        <Link href="/chart" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          Sắp bản đồ →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-10">
        {/* Breadcrumb */}
        <nav className="text-xs tracking-wider mb-6" style={{ color: 'var(--color-text-muted)' }}>
          <Link href="/" className="no-underline hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>Trang chủ</Link>
          <span className="mx-2">›</span>
          <Link href="/knowledge" className="no-underline hover:opacity-80" style={{ color: 'var(--color-text-muted)' }}>Kiến thức</Link>
          <span className="mx-2">›</span>
          <span style={{ color: 'var(--color-text-primary)' }}>{star}</span>
          <span className="mx-2">·</span>
          <span style={{ color: 'var(--color-accent)' }}>Cung {data.palaceName}</span>
        </nav>

        {/* Tiêu đề */}
        <header className="mb-10">
          <div className="text-xs tracking-widest mb-2" style={{ color: 'var(--color-text-muted)' }}>
            {data.topicLabel} · Giải thích chi tiết hệ thống Nị Hải Hạ
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-wide leading-tight"
            style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(28px, 5vw, 44px)' }}>
            {star} nhập {data.palaceName} cung
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
              {STAR_BRIEF_SEO[star]}
            </p>
          )}
        </header>

        {/* Nội dung 4 đoạn */}
        {data.parsed.dingdiao && (
          <Section title="Định điệu một câu" gradient>
            <p className="text-lg font-medium leading-relaxed tracking-wide" style={{ color: 'var(--color-text-primary)', letterSpacing: '0.04em' }}>
              {data.parsed.dingdiao}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="Luận đoán cốt lõi">
            <div className="text-base leading-relaxed tracking-wide whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>
              {data.parsed.lundian}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="Căn cứ bản đồ">
            <div className="text-sm leading-relaxed tracking-wide whitespace-pre-wrap" style={{ color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>
              {data.parsed.yiju}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="Nguồn cổ điển" minimal>
            <div className="text-sm leading-relaxed tracking-wide whitespace-pre-wrap" style={{ color: 'var(--color-text-body)', letterSpacing: '0.02em' }}>
              {data.parsed.chuchu}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div className="my-10 p-6 md:p-8 rounded-xl text-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-accent-bg) 0%, rgba(184,146,42,0.03) 100%)',
            border: '1px solid var(--color-accent-bdr)',
          }}>
          <div className="text-sm font-semibold tracking-wide mb-1.5" style={{ color: 'var(--color-text-primary)' }}>
            Muốn xem {data.topicLabel} trong bản đồ của bạn?
          </div>
          <div className="text-xs mb-4" style={{ color: 'var(--color-text-body)' }}>
            Nhập ngày sinh để sắp bản đồ · Giải đoán chính thống của Nị sư · AI trả lời đồng hành
          </div>
          <Link href="/chart" className="btn-accent inline-block">
            Sắp xếp bản đồ ngay →
          </Link>
        </div>

        {/* Liên kết nội bộ: topic khác cùng Chính tinh */}
        <Section title={`Giải đoán cung khác của ${star} tinh`} minimal>
          <div className="flex flex-wrap gap-2">
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  className="text-xs px-3 py-2 no-underline transition-all hover:shadow-sm"
                  style={{
                    background: 'var(--color-bg-card)',
                    border: '1px solid var(--color-accent-bdr)',
                    borderRadius: 'var(--radius-pill)',
                    color: 'var(--color-text-body)',
                  }}
                >
                  {star} nhập {d.palaceName}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* Liên kết nội bộ: Chính tinh khác cùng topic */}
        <Section title={`Giải đoán Chính tinh khác nhập Cung ${data.palaceName}`} minimal>
          <div className="flex flex-wrap gap-2">
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                className="text-xs px-3 py-2 no-underline transition-all hover:shadow-sm"
                style={{
                  background: 'var(--color-bg-card)',
                  border: '1px solid var(--color-accent-bdr)',
                  borderRadius: 'var(--radius-pill)',
                  color: 'var(--color-text-body)',
                }}
              >
                {s} nhập {data.palaceName}
              </Link>
            ))}
          </div>
        </Section>

        {/* Liên kết cổ thư */}
        <div className="mt-10 p-5 rounded-xl text-center border border-dashed"
          style={{ borderColor: 'var(--color-accent-bdr)', background: 'var(--color-accent-bg)' }}>
          <div className="text-xs tracking-widest mb-1.5" style={{ color: 'var(--color-accent)' }}>
            Muốn đọc nguyên tác?
          </div>
          <Link href="/library" className="text-sm font-medium tracking-wider no-underline transition-opacity hover:opacity-80"
            style={{ color: 'var(--color-accent)' }}>
            📜 Tra cứu kho cổ thư nguyên tác — Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Tủy Cốt Phú →
          </Link>
        </div>
      </article>

      {/* Chân trang */}
      <footer className="border-t py-5 px-6 text-center text-xs tracking-wider"
        style={{ borderColor: 'var(--color-accent-bdr)', color: 'var(--color-text-muted)' }}>
        <div className="mb-1.5">Nghiên cứu Tử Vi · Dựa trên hệ thống chính thống Nị Hải Hạ · Chỉ để tham khảo học tập</div>
        <div style={{ opacity: 0.85 }}>Nền tảng này không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý hoặc quyết định quan trọng nào</div>
      </footer>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section className="mb-6 md:mb-8">
      <h2 className="inline-flex items-center gap-2 text-sm font-semibold tracking-widest mb-3">
        <span className="w-1 h-3.5 rounded-sm" style={{ background: 'var(--color-accent)' }} />
        {title}
      </h2>
      <div className="rounded-xl p-5 md:p-6"
        style={{
          background: gradient ? 'linear-gradient(135deg, var(--color-accent-bg) 0%, rgba(184,146,42,0.02) 100%)' : 'var(--color-bg-card)',
          border: '1px solid var(--color-accent-bdr)',
        }}>
        {children}
      </div>
    </section>
  );
}
