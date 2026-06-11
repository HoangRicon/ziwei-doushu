'use client';
// components/auth/SessionProvider.tsx
// SessionProvider wrapper for Next.js App Router (required since NextAuth v5)
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
