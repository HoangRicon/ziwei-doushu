import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Bản đồ Tử Vi — Hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ',
  description: 'Dựa trên hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ, AI giải đoán sâu bản đồ cục diện, Đại hạn Lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện',
  keywords: 'Tu Vi Dau So, Ni Hai Ha, Tu Vi Dau So Toan Tap, Tuy Cot Phu, ban do, menh ly, 14 Chinh tinh, 12 Cung',
  metadataBase: new URL('https://wdyziweidoushu666.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bản đồ Tử Vi — Hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ',
    description: 'Dựa trên hệ thống chính thống Tử Vi Đẩu Số Ni Hải Hạ, AI giải đoán sâu bản đồ cục diện, Đại hạn Lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện',
    url: 'https://wdyziweidoushu666.com',
    siteName: 'Nghiên cứu Tử Vi',
    locale: 'vi_VN',
    type: 'website',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
