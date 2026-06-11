'use client';
// components/auth/LoginPrompt.tsx
import GoogleSignIn from './GoogleSignIn';
import { useState } from 'react';

interface LoginPromptProps {
  onClose: () => void;
}

export default function LoginPrompt({ onClose }: LoginPromptProps) {
  const [closed, setClosed] = useState(false);
  if (closed) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) { setClosed(true); onClose(); } }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8 text-center"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-gold)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
          style={{ background: 'var(--accent-bg)' }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          Đăng nhập để lưu lá số
        </h2>
        <p className="text-base mb-6" style={{ color: 'var(--text-body)', lineHeight: 1.6 }}>
          Tạo tài khoản miễn phí để lưu, quản lý và chia sẻ lá số của bạn.
        </p>

        <div className="flex flex-col gap-3">
          <GoogleSignIn size="lg" callbackUrl="/" />
          <button
            onClick={() => { setClosed(true); onClose(); }}
            className="text-sm transition-colors duration-150 cursor-pointer"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-body)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
          >
            Tiếp tục mà không đăng nhập
          </button>
        </div>
      </div>
    </div>
  );
}
