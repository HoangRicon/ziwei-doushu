'use client';
import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress((scrolled / total) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 h-0.5 z-50 transition-all duration-100"
      style={{
        width: `${progress}%`,
        background: 'var(--color-accent)',
        boxShadow: '0 0 8px var(--color-accent)',
      }}
    />
  );
}
