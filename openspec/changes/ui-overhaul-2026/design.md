# Technical Design: Full UI Overhaul

## 1. Design Principles

1. **CSS Variables first** — All colors/spacing reference CSS variables, never raw hex codes.
2. **Tailwind for layout, CSS vars for theming** — Tailwind handles layout/spacing utilities; CSS variables handle theming.
3. **Mobile-first responsive** — Build from smallest screen up.
4. **No layout shift** — All animated elements use `transform` and `opacity` only.
5. **Component isolation** — Each sub-component owns its own styles; no global style leaks.

## 2. File Structure (After Overhaul)

```
app/
  layout.tsx              ← Add Header + Footer wrappers
  page.tsx                ← Thin composition (< 100 lines)
  globals.css             ← 3-layer token system
  chart/page.tsx          ← Chart workspace
  heming/page.tsx         ← Chart comparison
  library/
    page.tsx              ← Library home (styled)
    [book]/page.tsx       ← Book detail (styled)
    [book]/[chapter]/page.tsx ← Chapter reader (typography)
    LibrarySearch.tsx      ← Keep as-is
  knowledge/
    page.tsx              ← 14-star card grid
    [star]/[topic]/page.tsx ← Star detail + matrix
  preview/page.tsx
  privacy/page.tsx
  terms/page.tsx

components/
  # NEW — Navigation
  Header.tsx              ← Sticky header
  Footer.tsx              ← Footer

  # EXTRACTED — Homepage decomposition
  HeroSection.tsx         ← Extracted from page.tsx
  FeatureCards.tsx        ← Extracted from page.tsx
  NiTeachingsSection.tsx  ← Extracted from page.tsx
  StarPreviewCards.tsx    ← Extracted from page.tsx
  HomepageFooter.tsx      ← Extracted from page.tsx
  FadeIn.tsx              ← Extracted as reusable

  # REFINED — Existing components
  ChartBoard.tsx          ← Refine palace cell layout, SVG vars
  PalaceCell.tsx          ← Refine zone layout, CSS var refs
  InsightPanel.tsx        ← Modern chat bubble UI
  TimeNav.tsx             ← Keep, minor style tweaks

  # EXISTING — Keep as-is
  BirthForm.tsx
  StarDetailPanel.tsx
  StarField.tsx
  PatternsCard.tsx
  ShareModal.tsx
  ShareCardCanvas.tsx
  AnnouncementModal.tsx
  FamousPersonCard.tsx
  ThemeProvider.tsx

tailwind.config.ts        ← Add semantic token aliases
```

## 3. 3-Layer Token System in `globals.css`

### Approach

Rename existing `:root` variables to be semantic. Replace all `--t-*` references (if any exist) with semantic names.

```css
/* Layer 1: Primitives */
:root {
  --primitive-gold-500: #B8922A;
  --primitive-gold-400: #d4a843;
  --primitive-bg-light: #FAFAF9;
  --primitive-bg-dark: #020810;
  /* ... */
}

/* Layer 2: Semantic */
:root {
  --color-bg-page: var(--primitive-bg-light);
  --color-bg-surface: #FFFFFF;
  --color-accent: var(--primitive-gold-500);
  --color-text-primary: #0D0D0B;
  --color-text-secondary: #4A4A45;
  --color-border: rgba(0,0,0,0.07);
  --radius-card: 12px;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.08);
  /* ... */
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg-page: var(--primitive-bg-dark);
  --color-bg-surface: rgba(255,255,255,0.04);
  --color-accent: var(--primitive-gold-400);
  --color-text-primary: #E8EEF6;
  --color-text-secondary: #9DB0D0;
  --color-border: rgba(255,255,255,0.07);
  /* ... */
}
```

### Tailwind Extension

```ts
// tailwind.config.ts
extend: {
  colors: {
    bg: {
      page: 'var(--color-bg-page)',
      surface: 'var(--color-bg-surface)',
    },
    tx: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
    },
    accent: {
      DEFAULT: 'var(--color-accent)',
      dim: 'var(--color-accent-dim)',
    },
    border: {
      DEFAULT: 'var(--color-border)',
    },
  },
}
```

## 4. Component Migration Strategy

### Inline Style → Tailwind

Example before/after:

**Before** (PalaceCell):
```tsx
style={{
  background: isCurrentDaXian
    ? 'rgba(147,51,234,0.08)'
    : isSelected
    ? 'rgba(37,99,235,0.18)'
    : 'var(--t-bg)',
}}
```

**After**:
```tsx
className={clsx(
  'p-2',
  isCurrentDaXian && 'bg-purple-500/8',
  isSelected && 'bg-blue-500/18',
  isSanFang && 'bg-blue-500/9',
  isMingGong && 'bg-amber-500/4',
)}
```

### CSS Variable Migration

Replace `var(--t-bg)` → `var(--color-bg-surface)`
Replace `var(--t-faint)` → `var(--color-text-faint)` (new semantic token)
Replace hardcoded hex in components → CSS variable or Tailwind semantic class

## 5. Animation Strategy

- **Framer Motion** for page-level transitions and entrance animations (keep existing)
- **CSS transitions** for hover/active states (`:hover`, `transition-all duration-200`)
- **Transform-only animations** — no `top/left` changes for performance
- **Entrance stagger**: each homepage section has a `delay` prop on `FadeIn` component

## 6. Mobile Navigation Design

### Hamburger Implementation
- Icon button in header (3-line → X animated on open)
- Slide-down overlay panel (full-width, below header)
- Links stacked vertically, each `py-3` padding
- Close on link click or backdrop tap
- `AnimatePresence` for smooth open/close

### Breakpoints
- Mobile: `< 768px` — hamburger + drawer
- Tablet: `768px–1024px` — horizontal nav, compact
- Desktop: `> 1024px` — full horizontal nav

## 7. Responsive Chart Board

- Desktop: Chart board `520px` centered
- Tablet: Chart board `90vw` max
- Mobile: Chart board full-width with horizontal scroll or zoom

## 8. Reading Progress Bar

Implementation: `<progress>` element or `div` with `width` driven by scroll position.

```tsx
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
```

## 9. Rollback Plan

If any component breaks during migration:

1. **Per-file rollback**: `git checkout HEAD -- <file>` restores specific files
2. **Full rollback**: `git checkout HEAD -- .` (revert all uncommitted changes to last commit)
3. **Feature flag**: All changes are in untracked files; git status shows clear diff

## 10. Implementation Order

```
Phase 1: Design System (foundation — must be done first)
  → globals.css tokens
  → tailwind.config.ts

Phase 2: Navigation (global — needed before everything else)
  → Header.tsx
  → Footer.tsx
  → layout.tsx update

Phase 3: Homepage Decomposition
  → Extract FadeIn
  → Extract each section
  → Simplify page.tsx

Phase 4: Chart Board Refinements
  → PalaceCell style refactor
  → ChartBoard container refinement
  → InsightPanel redesign

Phase 5: Library & Knowledge Pages
  → Library home styling
  → Chapter reader typography
  → Knowledge card grid
```

## 11. Open Questions for User

1. **Typography font choice**: Keep current system font (`-apple-system, 'PingFang SC', ...`) or add a Google Font for a more distinctive look?
2. **Mobile chart experience**: Current 520px chart on mobile — acceptable or need to implement pinch-zoom?
3. **Star color coding**: Should the 14 stars have distinct color accents beyond the current amber spectrum?
4. **Animation intensity**: Current Framer Motion animations — keep as-is, or reduce for performance?
