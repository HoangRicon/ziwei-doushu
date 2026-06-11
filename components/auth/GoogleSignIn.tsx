'use client';
// components/auth/GoogleSignIn.tsx
import { signIn } from 'next-auth/react';
import { useState } from 'react';

interface GoogleSignInProps {
  callbackUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeConfig = {
  sm: { padding: '10px 20px', fontSize: '14px', gap: '8px', iconSize: 18 },
  md: { padding: '12px 28px', fontSize: '15px', gap: '10px', iconSize: 20 },
  lg: { padding: '14px 36px', fontSize: '16px', gap: '12px', iconSize: 22 },
};

export default function GoogleSignIn({ callbackUrl = '/', size = 'md', className = '' }: GoogleSignInProps) {
  const [loading, setLoading] = useState(false);
  const cfg = sizeConfig[size];

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl });
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-full font-semibold transition-all duration-200 cursor-pointer ${className}`}
      style={{
        padding: cfg.padding,
        fontSize: cfg.fontSize,
        gap: cfg.gap,
        background: '#4285F4',
        color: '#ffffff',
        border: 'none',
        letterSpacing: '0.01em',
        opacity: loading ? 0.7 : 1,
        cursor: loading ? 'wait' : 'pointer',
        boxShadow: '0 2px 8px rgba(66,133,244,0.3)',
      }}
    >
      {loading ? (
        <svg className="animate-spin" width={cfg.iconSize} height={cfg.iconSize} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width={cfg.iconSize} height={cfg.iconSize} viewBox="0 0 24 24" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      )}
      {loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google'}
    </button>
  );
}
