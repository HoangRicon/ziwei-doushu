'use client';
// components/auth/UserMenu.tsx
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

interface UserMenuProps {
  accent: string;
  borderGold: string;
  textMuted: string;
  bgCard: string;
}

export default function UserMenu({ accent, borderGold, textMuted, bgCard }: UserMenuProps) {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const user = session?.user;
  if (!user) return null;

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const menuItems = [
    { label: 'Bảng lá số', href: '/dashboard', icon: '📊' },
    { label: 'Cài đặt', href: '/settings', icon: '⚙️' },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full transition-all duration-200 cursor-pointer"
        style={{
          padding: '4px 4px 4px 4px',
          background: 'transparent',
          border: `1px solid ${borderGold}`,
        }}
        aria-label="Tài khoản"
        aria-expanded={open}
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name ?? 'Avatar'}
            width={32}
            height={32}
            className="rounded-full"
            style={{ display: 'block' }}
          />
        ) : (
          <div
            className="flex items-center justify-center rounded-full text-sm font-semibold"
            style={{
              width: 32,
              height: 32,
              background: `linear-gradient(135deg, ${accent}, ${accent}99)`,
              color: '#ffffff',
              fontSize: '13px',
            }}
          >
            {initials}
          </div>
        )}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2.5"
          className="mr-2 transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden z-50"
          style={{
            background: bgCard,
            border: `1px solid ${borderGold}`,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b" style={{ borderColor: `${accent}20` }}>
            <p className="text-sm font-semibold truncate" style={{ color: accent }}>{user.name ?? 'Người dùng'}</p>
            <p className="text-xs truncate mt-0.5" style={{ color: textMuted }}>{user.email ?? ''}</p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            {menuItems.map(({ label, href, icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150"
                style={{ color: textMuted }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = `${accent}10`;
                  (e.target as HTMLElement).style.color = accent;
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = 'transparent';
                  (e.target as HTMLElement).style.color = textMuted;
                }}
              >
                <span style={{ fontSize: '14px' }}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Divider + Sign out */}
          <div className="border-t py-1" style={{ borderColor: `${accent}20` }}>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 cursor-pointer"
              style={{ color: '#EF4444' }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = 'rgba(239,68,68,0.08)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = 'transparent';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              Đăng xuất
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
