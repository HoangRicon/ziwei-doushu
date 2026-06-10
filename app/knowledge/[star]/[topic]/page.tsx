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

  // JSON-LD
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
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← Trang chủ
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          Phương pháp của Nị sư · Cơ sở tri thức
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          Sắp bản đồ →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* Đường dẫn bánh mì */}
        <nav style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Trang chủ</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/knowledge" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>Cơ sở tri thức</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{star}</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <span style={{ color: 'var(--ac)' }}>Cung {data.palaceName}</span>
        </nav>

        {/* Tiêu đề */}
        <header style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.25em', marginBottom: '8px' }}>
            {data.topicLabel} · Giải thích chi tiết hệ thống Nị Hải Hạ
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em', lineHeight: 1.2 }}>
            {star} nhập {data.palaceName} cung
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {STAR_BRIEF_SEO[star]}
            </p>
          )}
        </header>

        {/* Nội dung 4 đoạn */}
        {data.parsed.dingdiao && (
          <Section title="Định điệu một câu" gradient>
            <p style={{ fontSize: '17px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, letterSpacing: '0.04em' }}>
              {data.parsed.dingdiao}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="Luận đoán cốt lõi">
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.lundian}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="Căn cứ bản đồ">
            <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.yiju}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="Nguồn cổ điển" minimal>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {data.parsed.chuchu}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(212,169,72,0.15) 0%, rgba(184,146,42,0.06) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(184,146,42,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--tx-0)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
            Muốn xem {data.topicLabel} trong bản đồ của bạn?
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            Nhập ngày sinh để sắp bản đồ · Giải đoán chính thống của Nị sư · AI trả lời đồng hành
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
          }}>
            Sắp xếp bản đồ ngay →
          </Link>
        </div>

        {/* Liên kết nội bộ: topic khác cùng Chính tinh */}
        <Section title={`Giải đoán cung khác của ${star} tinh`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(184,146,42,0.25)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.25)',
                  borderRadius: '999px',
                  color: 'var(--tx-2)',
                  textDecoration: 'none',
                }}
              >
                {s} nhập {data.palaceName}
              </Link>
            ))}
          </div>
        </Section>

        {/* Liên kết cổ thư */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'rgba(184,146,42,0.04)',
          border: '1px dashed rgba(184,146,42,0.25)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', letterSpacing: '0.15em', marginBottom: '6px' }}>
            Muốn đọc nguyên tác?
          </div>
          <Link href="/library" style={{ fontSize: '13px', color: 'var(--ac)', fontWeight: 500, letterSpacing: '0.1em', textDecoration: 'none' }}>
            📜 Tra cứu kho cổ thư nguyên tác — Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Tủy Cốt Phú →
          </Link>
        </div>
      </article>

      {/* Chân trang */}
      <footer style={{ borderTop: '1px solid rgba(184,146,42,0.15)', padding: '20px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
        <div style={{ marginBottom: '6px' }}>Nghiên cứu Tử Vi · Dựa trên hệ thống chính thống Nị Hải Hạ · Chỉ để tham khảo học tập</div>
        <div style={{ opacity: 0.85 }}>Nền tảng này không đưa ra bất kỳ lời khuyên y tế, đầu tư, pháp lý hoặc quyết định quan trọng nào</div>
      </footer>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--ac)',
        fontWeight: 600,
        letterSpacing: '0.2em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(212,169,72,0.12) 0%, rgba(184,146,42,0.04) 100%)'
          : 'white',
        border: '1px solid rgba(184,146,42,0.15)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}
