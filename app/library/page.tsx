/**
 * /library — Trang chủ Kho cổ thư nguyên tác
 *
 * Liệt kê tất cả cổ thư đã thu thập + lối vào tìm kiếm toàn cục
 */

import Link from 'next/link';
import { ALL_BOOKS, TOTAL_PARAGRAPHS } from '@/lib/classics';
import LibrarySearch from './LibrarySearch';

export const metadata = {
  title: 'Phương pháp của Nị sư · Kho cổ thư nguyên tác · Tử Vi Đẩu Số Toàn Tập / Toàn Thư / Tủy Cốt Phú',
  description: 'Tra cứu toàn văn các cổ thư uy tín Tử Vi Đẩu Số: "Tử Vi Đẩu Số Toàn Tập", "Tử Vi Đẩu Số Toàn Thư", "Tủy Cốt Phú" Nguồn trích dẫn từ "Thiên Kỷ" của Nị Hải Hạ',
};

export default function LibraryHomePage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
      {/* Thanh trên */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--color-accent-bdr)', background: 'var(--color-bg-page)' }}>
        <Link href="/" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          ← Quay lại trang chủ
        </Link>
        <div className="text-xs tracking-widest" style={{ color: 'var(--color-text-muted)' }}>
          Kho cổ thư nguyên tác · CLASSICS
        </div>
        <Link href="/chart" className="text-xs tracking-widest no-underline transition-colors hover:opacity-80"
          style={{ color: 'var(--color-accent)' }}>
          Sắp bản đồ →
        </Link>
      </div>

      {/* Hero */}
      <div className="text-center px-6 py-16 max-w-6xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12" style={{ background: 'linear-gradient(to right, transparent, var(--color-accent-bdr))' }} />
          <span className="text-xs tracking-widest" style={{ color: 'var(--color-accent)' }}>NI HAI XIA · CURRICULUM</span>
          <div className="h-px w-12" style={{ background: 'linear-gradient(to left, transparent, var(--color-accent-bdr))' }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3 tracking-wide"
          style={{ color: 'var(--color-text-primary)', fontSize: 'clamp(28px, 4vw, 42px)' }}>
          Thư viện kinh điển
        </h1>
        <p className="text-sm tracking-wide max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--color-text-body)' }}>
          Tra cứu toàn văn các cổ thư uy tín Tử Vi Đẩu Số<br />
          Thu thập <strong style={{ color: 'var(--color-accent)' }}>{ALL_BOOKS.length}</strong> bộ cổ thư · Tổng cộng <strong style={{ color: 'var(--color-accent)' }}>{TOTAL_PARAGRAPHS}</strong> đoạn tinh hoa
        </p>
      </div>

      {/* Tìm kiếm */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <LibrarySearch />
      </div>

      {/* Danh sách cổ thư */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALL_BOOKS.map(book => (
            <Link
              key={book.slug}
              href={`/library/${book.slug}`}
              className="card p-6 block no-underline transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
              style={{
                borderColor: 'var(--color-accent-bdr)',
              }}
            >
              <div className="text-xs tracking-wider mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
                {book.dynasty} · {book.author.split(' ')[0]}
              </div>
              <div className="text-xl font-semibold mb-2.5 tracking-wide" style={{ color: 'var(--color-text-primary)' }}>
                《{book.title}》
              </div>
              <div className="text-sm leading-relaxed mb-3.5" style={{ color: 'var(--color-text-body)' }}>
                {book.intro}
              </div>
              <div className="flex gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                <span>{book.chapters.length} chương</span>
                <span style={{ color: 'var(--color-accent-bdr)' }}>·</span>
                <span>{book.chapters.reduce((s, c) => s + c.paragraphs.length, 0)} đoạn tinh hoa</span>
              </div>
              <div className="mt-3.5 text-xs font-medium tracking-wider" style={{ color: 'var(--color-accent)' }}>
                Vào tra cứu →
              </div>
            </Link>
          ))}
        </div>

        {/* Giải thích ở cuối */}
        <div className="mt-16 p-6 text-center rounded-xl" style={{ background: 'var(--color-accent-bg)' }}>
          <div className="text-xs font-semibold tracking-widest mb-2" style={{ color: 'var(--color-accent)' }}>
            Về kho này
          </div>
          <div className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--color-text-body)' }}>
            Tất cả cổ thư được thu thập đều là bản quyền công (bản in thời Minh).<br />
            Nội dung đang được hoàn thiện, trong tương lai sẽ bổ sung toàn bộ "Tử Vi Đẩu Số Toàn Tập" và mục lục trích dẫn "Thiên Kỷ" của Nị Hải Hạ.<br />
            Nếu phát hiện bất kỳ sai sót nào, xin liên hệ với chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
