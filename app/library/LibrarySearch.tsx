'use client';

/**
 * Ô tìm kiếm kho cổ thư — client component
 *
 * Nhập liệu → Tìm kiếm thời gian thực → Chuyển hướng /library/search?q=xxx
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

export default function LibrarySearch() {
  const [q, setQ] = useState('');
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const submit = () => {
    const query = q.trim();
    if (!query) return;
    startTransition(() => {
      router.push(`/library/search?q=${encodeURIComponent(query)}`);
    });
  };

  return (
    <div className="flex gap-2 p-1.5 rounded-xl transition-all"
      style={{
        background: 'var(--color-bg-card)',
        border: '1px solid var(--color-accent-bdr)',
        boxShadow: 'var(--shadow-sm)',
      }}>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder="Tìm kiếm nguyên tác cổ thư, ví dụ: Thập sát triều đấu / Song lộc triều viên / Hóa kỵ"
        className="flex-1 px-4 py-2.5 text-sm outline-none bg-transparent"
        style={{ color: 'var(--color-text-primary)' }}
      />
      <button
        onClick={submit}
        disabled={isPending || !q.trim()}
        className="px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: 'var(--color-accent)',
          color: 'white',
          cursor: q.trim() ? 'pointer' : 'not-allowed',
        }}
      >
        {isPending ? '…' : 'Tìm kiếm'}
      </button>
    </div>
  );
}
