'use client';
// components/auth/AuthGuard.tsx
// Client-side auth guard — shows loading, then redirects if not authenticated
import { useSession, signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (status === 'unauthenticated') {
      const callbackUrl = encodeURIComponent(pathname);
      signIn('google', { callbackUrl });
    }
  }, [status, mounted, pathname]);

  if (!mounted || status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full mx-auto mb-4 animate-pulse"
            style={{ background: 'var(--accent-bg)' }}
          />
          <p style={{ color: 'var(--text-muted)', fontSize: '15px' }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') return null;

  return <>{children}</>;
}
