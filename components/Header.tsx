'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import UserMenu from './auth/UserMenu';
import GoogleSignIn from './auth/GoogleSignIn';

const NAV_LINKS = [
  { href: '/',         label: 'Trang chủ' },
  { href: '/chart',    label: 'Lập lá số' },
  { href: '/library',  label: 'Thư viện' },
  { href: '/gallery',  label: 'Thư viện công khai' },
  { href: '/knowledge',label: 'Kiến thức' },
  { href: '/heming',   label: 'Hằng sao' },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { data: session } = useSession();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const accent       = isDark ? '#D4A843' : '#9A7A1A';
  const accentLight  = isDark ? '#F0C060' : '#C8A030';
  const textPrimary  = isDark ? '#D8D0C0' : '#2D2820';
  const textMuted     = isDark ? '#6A6258' : '#8A8078';
  const navBg        = isDark ? 'rgba(12,10,8,0.85)' : 'rgba(253,252,248,0.85)';
  const borderColor  = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(154,122,26,0.12)';
  const borderGold   = isDark ? 'rgba(212,168,67,0.3)' : 'rgba(154,122,26,0.3)';
  const bgCard       = isDark ? '#141210' : '#FFFFFF';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-200"
        style={{
          background: navBg,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          height: '64px',
        }}
      >
        <div className="max-w-page mx-auto px-6 flex items-center justify-between h-full gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="12" stroke={accent} strokeWidth="1.5" className="transition-colors duration-200" />
              <circle cx="14" cy="14" r="5" fill={accent} className="transition-colors duration-200" />
              {[0,60,120,180,240,300].map((deg) => (
                <circle
                  key={deg}
                  cx={14 + 8 * Math.cos((deg - 90) * Math.PI / 180)}
                  cy={14 + 8 * Math.sin((deg - 90) * Math.PI / 180)}
                  r="1.4"
                  fill={accent}
                />
              ))}
            </svg>
            <span
              className="text-lg font-semibold tracking-[0.15em] transition-colors duration-200 hidden sm:inline"
              style={{ color: accent }}
            >
              Tử Vi Đẩu Số
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href || (href !== '/' && pathname.startsWith(href));
              return (
                <Link
                  key={href}
                  href={href}
                  className="relative px-4 py-2 text-base font-medium rounded-lg transition-all duration-200"
                  style={{
                    color: active ? accent : textMuted,
                    fontWeight: active ? 600 : 500,
                    background: active
                      ? (isDark ? 'rgba(212,168,67,0.10)' : 'rgba(154,122,26,0.08)')
                      : 'transparent',
                  }}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0.5 left-3 right-3 h-0.5 rounded-full"
                      style={{ background: accent }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">

            {/* Theme toggle */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              aria-label={isDark ? 'Chuyển sang theme sáng' : 'Chuyển sang theme tối'}
              className="flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium transition-all duration-200"
              style={{
                borderColor: borderGold,
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,252,242,0.9)',
                color: accent,
              }}
            >
              <div className="relative w-9 h-5 rounded-full transition-all duration-300"
                style={{
                  background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.5)',
                }}>
                <motion.div
                  animate={{ x: isDark ? 2 : 20 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute top-0.5 w-4 h-4 rounded-full"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, #b8a050, #e8d090)'
                      : 'linear-gradient(135deg, #e89010, #f8d050)',
                  }}
                />
              </div>
              <span className="hidden sm:inline text-sm">{isDark ? 'Tối' : 'Sáng'}</span>
            </motion.button>

            {/* CTA */}
            <Link
              href="/chart"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                border: `1.5px solid ${borderGold}`,
                color: accent,
                background: isDark ? 'rgba(212,168,67,0.10)' : 'rgba(212,168,67,0.06)',
              }}
            >
              Lập lá số
            </Link>

            {/* Auth: UserMenu or SignIn */}
            {session?.user ? (
              <UserMenu
                accent={accent}
                borderGold={borderGold}
                textMuted={textMuted}
                bgCard={bgCard}
              />
            ) : (
              <GoogleSignIn size="sm" callbackUrl="/" />
            )}

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-2 rounded-lg transition-colors duration-150"
              style={{ color: textMuted }}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait">
                {mobileOpen ? (
                  <motion.svg
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.15 }}
                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="menu"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  >
                    <path d="M4 6h16M4 12h16M4 18h16" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-16 left-0 right-0 z-40 md:hidden"
              style={{
                background: navBg,
                borderBottom: `1px solid ${borderColor}`,
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}
            >
              <nav className="flex flex-col px-4 py-4 gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="px-5 py-3 text-base font-medium rounded-lg transition-colors duration-150"
                      style={{
                        color: active ? accent : textMuted,
                        fontWeight: active ? 600 : 500,
                        background: active
                          ? (isDark ? 'rgba(212,168,67,0.10)' : 'rgba(154,122,26,0.08)')
                          : 'transparent',
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="h-px my-2" style={{ background: borderColor }} />
                <Link
                  href="/chart"
                  onClick={() => setMobileOpen(false)}
                  className="px-5 py-3 text-base font-semibold rounded-lg text-center"
                  style={{
                    color: '#FFFFFF',
                    background: `linear-gradient(135deg, ${isDark ? '#b8892a,#f0d070' : '#6a4206,#9a6810'})`,
                  }}
                >
                  Lập lá số ngay
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
