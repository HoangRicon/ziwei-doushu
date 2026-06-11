// app/(main)/layout.tsx — Authenticated layout
// All pages under (main)/ require authentication (middleware already protects them)
import { AuthGuard } from '@/components/auth/AuthGuard';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard>{children}</AuthGuard>;
}
