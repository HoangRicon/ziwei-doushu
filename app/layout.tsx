import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'Bản đồ Tử Vi · Hệ thống chính thống Tử Vi Đẩu Số Nị Hải Hạ',
  description: 'Dựa trên hệ thống chính thống Tử Vi Đẩu Số Nị Hải Hạ, AI giải đoán sâu bản đồ cục diện, Đại hạn Lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện',
  keywords: 'Tử Vi Đẩu Số, Nị Hải Hạ, Nị Hải Hạ, Tử Vi Đẩu Số Toàn Tập, Tử Vi Đẩu Số Toàn Thư, Tủy Cốt Phú, bản đồ, mệnh lý, 14 Chính tinh, 12 Cung',
  metadataBase: new URL('https://wdyziweidoushu666.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Bản đồ Tử Vi · Hệ thống chính thống Tử Vi Đẩu Số Nị Hải Hạ',
    description: 'Dựa trên hệ thống chính thống Tử Vi Đẩu Số Nị Hải Hạ, AI giải đoán sâu bản đồ cục diện, Đại hạn Lưu niên, tình cảm sự nghiệp tài vận sức khỏe toàn diện',
    url: 'https://wdyziweidoushu666.com',
    siteName: 'Nghiên cứu Tử Vi',
    locale: 'vi_VN',
    type: 'website',
  },
  // Xác minh nền tảng quản trị (sau khi có mã xác minh, điền vào trường tương ứng, triển khai lại)
  verification: {
    // Google Search Console: Sau khi thêm trang web tại https://search.google.com/search-console, lấy mã
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || undefined,
    // Bing Webmaster Tools: Sau khi thêm trang web tại https://www.bing.com/webmasters, lấy mã
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION || '808FFC6023A2C359B375DD860FEDA856',
      // Baidu zhanzhang (sau khi có giấy phép)
      'baidu-site-verification': process.env.NEXT_PUBLIC_BAIDU_VERIFICATION || '',
      // 360 zhanzhang (sau khi có giấy phép)
      '360-site-verification': process.env.NEXT_PUBLIC_360_VERIFICATION || '',
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('ziwei-theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);else document.documentElement.setAttribute('data-theme','dark');}catch(e){}})();` }} />
      </head>
      <body className="min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
