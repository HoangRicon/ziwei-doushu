// app/(auth)/login/page.tsx — Login page
import { Metadata } from 'next';
import GoogleSignIn from '@/components/auth/GoogleSignIn';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Đăng nhập — Tử Vi Đẩu Số',
  description: 'Đăng nhập để lưu và quản lý lá số của bạn',
};

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Logo */}
        <div className={styles.logo}>
          <svg width="48" height="48" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <circle cx="14" cy="14" r="12" stroke="#9A7A1A" strokeWidth="1.5" />
            <circle cx="14" cy="14" r="5" fill="#9A7A1A" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <circle
                key={deg}
                cx={14 + 8 * Math.cos((deg - 90) * Math.PI / 180)}
                cy={14 + 8 * Math.sin((deg - 90) * Math.PI / 180)}
                r="1.4"
                fill="#9A7A1A"
              />
            ))}
          </svg>
        </div>

        <h1 className={styles.title}>Chào mừng bạn trở lại</h1>
        <p className={styles.subtitle}>
          Đăng nhập để lưu, quản lý và chia sẻ lá số Tử Vi của bạn
        </p>

        <div className={styles.divider} />

        <div className={styles.actions}>
          <GoogleSignIn size="lg" callbackUrl="/" />
        </div>

        <p className={styles.terms}>
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <a href="/terms" className={styles.link}>Điều khoản sử dụng</a>
          {' '}và{' '}
          <a href="/privacy" className={styles.link}>Chính sách bảo mật</a>
        </p>
      </div>

      {/* Background decoration */}
      <div className={styles.bgGlow} />
    </div>
  );
}
