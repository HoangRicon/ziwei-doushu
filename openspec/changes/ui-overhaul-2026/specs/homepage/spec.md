# Spec: Homepage — Decomposition

## 1. Overview

Decompose the 1,192-line `app/page.tsx` into **5 focused sub-components**. The homepage should remain visually similar but be architecturally decomposed for maintainability.

## 2. Component Breakdown

### `components/HeroSection.tsx`
The hero at the top — full-width, centered, with animated background.

**Content**:
- Headline: "Bản đồ Tử Vi · Hệ thống chính thống"
- Subheadline: "Dựa trên hệ thống Nị Hải Hạ, AI giải đoán sâu bản đồ cục diện"
- CTA button: "Lập bản đồ ngay" → `/chart`
- Secondary link: "Khám phá kiến thức" → `/knowledge`
- Background: `StarField` canvas component

**States**: Default only (no loading state needed)

### `components/FeatureCards.tsx`
Three feature cards in a responsive grid.

**Content** (3 cards):
1. "Lập bản đồ" — Input birth data → AI analysis
2. "Hằng sao" — Compare two charts side-by-side
3. "Thư viện kinh điển" — Classical texts database

**States**: Default, hover (card lifts with shadow)

### `components/NiTeachingsSection.tsx`
Section introducing the Ni Hai Xia system.

**Content**:
- Heading: "Hệ thống Nị Hải Hạ"
- Three teaching pillars in a timeline/card layout:
  - Thiên Kí (天纪) — Tianji
  - Địa Kí (地纪) — Diji
  - Nhân Kí (人纪) — Renji
- Brief description of each

**States**: Default, hover on cards

### `components/StarPreviewCards.tsx`
Preview grid of the 14 main stars.

**Content**:
- Heading: "14 Chính Tinh"
- Grid of 14 cards, each showing: star name, brief description, "Tìm hiểu" link → `/knowledge/[star]/[topic]`
- 4 cards per row (desktop), 2 per row (tablet), 1 per row (mobile)

**States**: Default, hover (gold border), click navigates

### `components/HomepageFooter.tsx`
The bottom section of the homepage (above global Footer).

**Content**:
- "Bắt đầu khám phá" headline
- "Lập bản đồ miễn phí" CTA button
- Brief trust indicators (e.g., "518,000+ mẫu dữ liệu", "Hệ thống Nị Hải Hạ")

## 3. Shared Animation Wrapper

Extract the existing `FadeIn` component from `app/page.tsx` into `components/ui/FadeIn.tsx` (or `components/FadeIn.tsx`). This becomes a reusable animation primitive.

```tsx
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}
```

## 4. Page Composition

`app/page.tsx` becomes a thin orchestrator:

```tsx
import HeroSection from '@/components/HeroSection';
import FeatureCards from '@/components/FeatureCards';
import NiTeachingsSection from '@/components/NiTeachingsSection';
import StarPreviewCards from '@/components/StarPreviewCards';
import HomepageFooter from '@/components/HomepageFooter';
import FadeIn from '@/components/FadeIn';

export default function HomePage() {
  return (
    <main>
      <FadeIn><HeroSection /></FadeIn>
      <FadeIn delay={0.1}><FeatureCards /></FadeIn>
      <FadeIn delay={0.2}><NiTeachingsSection /></FadeIn>
      <FadeIn delay={0.3}><StarPreviewCards /></FadeIn>
      <FadeIn delay={0.4}><HomepageFooter /></FadeIn>
    </main>
  );
}
```

## 5. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-HP-1 | `app/page.tsx` reduced to < 100 lines |
| AC-HP-2 | All 5 sub-components created: HeroSection, FeatureCards, NiTeachingsSection, StarPreviewCards, HomepageFooter |
| AC-HP-3 | `FadeIn` extracted as reusable component |
| AC-HP-4 | Homepage visually identical to current version |
| AC-HP-5 | All navigation links and CTAs work correctly |
| AC-HP-6 | Responsive layout maintained (mobile, tablet, desktop) |
| AC-HP-7 | Theme toggle works within new component structure |
| AC-HP-8 | `AnnouncementModal` still renders correctly |
