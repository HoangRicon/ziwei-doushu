'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';

const NAV_LINKS = [
  { href: '/',              label: 'Trang chủ' },
  { href: '/chart',         label: 'Lập chart' },
  { href: '/library',       label: 'Thư viện' },
  { href: '/knowledge',     label: 'Kiến thức' },
  { href: '/heming',        label: 'Hằng sao' },
];

export default function Header() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const isDark = theme === 'dark';
  const [mobileOpen, setMobileOpen] = useState(false);

  const goldSolid = isDark ? '#d4a843' : '#8b6410';
  const goldLine  = isDark ? 'rgba(212,168,67,0.4)' : 'rgba(140,100,20,0.4)';
  const textMuted = isDark ? '#9db0d0' : '#5a6275';
  const navBg     = isDark ? '#020810' : '#f5efe0';

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: navBg,
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(160,120,30,0.12)'}`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'background 0.3s ease, border-color 0.3s ease',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="10" stroke={goldSolid} strokeWidth="1.5" />
              <circle cx="12" cy="12" r="4" fill={goldSolid} />
              {[0,60,120,180,240,300].map((deg) => (
                <circle
                  key={deg}
                  cx={12 + 6.5 * Math.cos((deg - 90) * Math.PI / 180)}
                  cy={12 + 6.5 * Math.sin((deg - 90) * Math.PI / 180)}
                  r="1.2"
                  fill={goldSolid}
                />
              ))}
            </svg>
            <span
              className="text-sm font-semibold tracking-[0.25em] hidden sm:inline"
              style={{ color: goldSolid }}
            >
              Tử Vi
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
                  className="relative px-3 py-1.5 text-xs tracking-wide transition-colors duration-200 rounded-md"
                  style={{
                    color: active ? goldSolid : textMuted,
                    fontWeight: active ? 600 : 400,
                    background: active ? (isDark ? 'rgba(212,168,67,0.08)' : 'rgba(184,146,42,0.08)') : 'transparent',
                  }}
                >
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-3 right-3 h-px rounded-full"
                      style={{ background: goldSolid }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <motion.button
              onClick={toggle}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.93 }}
              aria-label={isDark ? 'Chuyển sang theme sáng' : 'Chuyển sang theme tối'}
              className="flex items-center gap-1.5 px-2 py-1 rounded-full border text-xs transition-all duration-200"
              style={{
                borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
                background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,252,242,0.85)',
                color: isDark ? 'rgba(212,180,100,0.85)' : 'rgba(110,72,8,0.8)',
              }}
            >
              <div className="relative w-8 h-4 rounded-full"
                style={{
                  background: isDark ? 'rgba(12,24,64,0.95)' : 'rgba(230,195,80,0.55)',
                  transition: 'background 0.35s ease',
                }}>
                <motion.div
                  animate={{ x: isDark ? 1 : 17 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  className="absolute top-0.5 w-3 h-3 rounded-full"
                  style={{
                    background: isDark
                      ? 'linear-gradient(135deg, #b8a050, #e8d090)'
                      : 'linear-gradient(135deg, #e89010, #f8d050)',
                  }}
                />
              </div>
              <span className="hidden sm:inline">{isDark ? 'Tối' : 'Sáng'}</span>
            </motion.button>

            {/* CTA */}
            <Link
              href="/chart"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
              style={{
                border: `1px solid ${goldLine}`,
                color: goldSolid,
                background: isDark ? 'rgba(212,168,67,0.08)' : 'rgba(212,168,67,0.06)',
              }}
            >
              Lập bản đồ
            </Link>

            {/* Hamburger (mobile) */}
            <button
              className="md:hidden p-1.5 rounded-md transition-colors duration-150"
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
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
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
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
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
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: 'rgba(0,0,0,0.4)' }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed top-14 left-0 right-0 z-40 md:hidden"
              style={{
                background: navBg,
                borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(160,120,30,0.12)'}`,
              }}
            >
              <nav className="flex flex-col px-4 py-3 gap-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ href, label }) => {
                  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileOpen(false)}
                      className="px-4 py-3 text-sm rounded-lg transition-colors duration-150"
                      style={{
                        color: active ? goldSolid : textMuted,
                        fontWeight: active ? 600 : 400,
                        background: active ? (isDark ? 'rgba(212,168,67,0.08)' : 'rgba(184,146,42,0.08)') : 'transparent',
                      }}
                    >
                      {label}
                    </Link>
                  );
                })}
                <div className="h-px my-2" style={{ background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(160,120,30,0.12)' }} />
                <Link
                  href="/chart"
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-sm font-semibold rounded-lg text-center"
                  style={{
                    color: '#fff',
                    background: `linear-gradient(135deg, ${isDark ? '#b8892a,#f0d070' : '#6a4206,#9a6810'})`,
                  }}
                >
                  Lập bản đồ ngay
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
