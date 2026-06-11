// app/(auth)/layout.tsx — Auth layout (no footer for focused login experience)
import Footer from '@/components/Footer';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
