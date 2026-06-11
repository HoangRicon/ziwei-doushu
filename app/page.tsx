'use client';
import { useLayoutEffect } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import StarPreviewCards from '@/components/StarPreviewCards';
import HomepageFooter from '@/components/HomepageFooter';

export default function HomePage() {
  const { theme } = useTheme();

  useLayoutEffect(() => {
    const bg = theme === 'dark' ? '#0C0A08' : '#FDFCF8';
    document.documentElement.style.background = bg;
    document.body.style.background = bg;
    return () => {
      document.documentElement.style.background = '';
      document.body.style.background = '';
    };
  }, [theme]);

  return (
    <div
      style={{
        background: theme === 'dark' ? '#0C0A08' : '#FDFCF8',
        transition: 'background 0.35s ease',
      }}
      className="overflow-x-hidden"
    >
      <HeroSection />
      <FeatureCards />
      <StarPreviewCards />
      <HomepageFooter />
    </div>
  );
}
