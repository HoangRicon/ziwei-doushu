# Task Plan: Full UI Overhaul — Ziwei Dou Shu

**Change**: `openspec/changes/ui-overhaul-2026`
**Status**: In Progress
**Created**: 2026-06-10
**Last Updated**: 2026-06-10

## User Decisions (Open Questions)

- **Font**: Keep system font (no Google Font)
- **Mobile chart**: Accept horizontal scroll (no pinch-zoom)
- **Star colors**: Keep amber spectrum (no per-star colors)
- **Animation intensity**: Keep current Framer Motion (reduce only if performance issues)

---

## Checklist

### Phase 1 — Design System Foundation

- [ ] 1.1 Refactor `app/globals.css` — 3-layer token system
  - **Files**: `app/globals.css` (modify)
  - **AC**: AC-DS-1, AC-DS-4, AC-DS-5
  - **Test**: Inspect computed styles in DevTools, light/dark mode

- [ ] 1.2 Update `tailwind.config.ts` — Semantic token aliases
  - **Files**: `tailwind.config.ts` (modify)
  - **AC**: AC-DS-2, AC-DS-3
  - **Test**: `npm run build` — no Tailwind errors

### Phase 2 — Navigation (Global)

- [ ] 2.1 Create `components/Header.tsx`
  - **Files**: `components/Header.tsx` (create)
  - **AC**: AC-NAV-1, AC-NAV-2, AC-NAV-3, AC-NAV-4, AC-NAV-5
  - **Test**: Nav links, active state, mobile hamburger

- [ ] 2.2 Create `components/Footer.tsx`
  - **Files**: `components/Footer.tsx` (create)
  - **AC**: AC-NAV-6, AC-NAV-7
  - **Test**: Footer links, responsive stack

- [ ] 2.3 Update `app/layout.tsx`
  - **Files**: `app/layout.tsx` (modify)
  - **AC**: AC-NAV-8
  - **Test**: Header/footer on all pages, no overlap

### Phase 3 — Homepage Decomposition

- [ ] 3.1 Extract `components/FadeIn.tsx`
  - **Files**: `components/FadeIn.tsx` (create)
  - **AC**: AC-HP-3
  - **Test**: Reusable animation wrapper

- [ ] 3.2 Extract `components/HeroSection.tsx`
  - **Files**: `components/HeroSection.tsx` (create), `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6, AC-HP-8
  - **Test**: Hero renders, announcement modal works

- [ ] 3.3 Extract `components/FeatureCards.tsx`
  - **Files**: `components/FeatureCards.tsx` (create), `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6
  - **Test**: 3 cards, hover states, links work

- [ ] 3.4 Extract `components/NiTeachingsSection.tsx`
  - **Files**: `components/NiTeachingsSection.tsx` (create), `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-4, AC-HP-6
  - **Test**: 3 pillars, responsive grid

- [ ] 3.5 Extract `components/StarPreviewCards.tsx`
  - **Files**: `components/StarPreviewCards.tsx` (create), `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6
  - **Test**: 14 star cards, hover, links

- [ ] 3.6 Extract `components/HomepageFooter.tsx`
  - **Files**: `components/HomepageFooter.tsx` (create), `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-4, AC-HP-5
  - **Test**: CTA section renders, button works

- [ ] 3.7 Simplify `app/page.tsx`
  - **Files**: `app/page.tsx` (modify)
  - **AC**: AC-HP-1, AC-HP-8
  - **Test**: File < 100 lines, homepage renders identically

### Phase 4 — Chart Board Refinements

- [ ] 4.1 Refactor `components/PalaceCell.tsx` — Style cleanup
  - **Files**: `components/PalaceCell.tsx` (modify)
  - **AC**: AC-CB-1, AC-CB-2, AC-CB-3, AC-CB-9
  - **Test**: Palace cells look same, theme toggle works

- [ ] 4.2 Refactor `components/ChartBoard.tsx` — Container + SVG
  - **Files**: `components/ChartBoard.tsx` (modify)
  - **AC**: AC-CB-4, AC-CB-5, AC-CB-6, AC-CB-7, AC-CB-9
  - **Test**: Chart responsive, SVG lines correct, no overflow

- [ ] 4.3 Redesign `components/InsightPanel.tsx` — Chat UI
  - **Files**: `components/InsightPanel.tsx` (modify)
  - **AC**: AC-IP-1 through AC-IP-9
  - **Test**: Chat bubbles, streaming, tabs, empty state

- [ ] 4.4 Style `components/TimeNav.tsx`
  - **Files**: `components/TimeNav.tsx` (modify)
  - **AC**: AC-CB-8
  - **Test**: Properly spaced above chart

- [ ] 4.5 Style `components/BirthForm.tsx`
  - **Files**: `components/BirthForm.tsx` (modify)
  - **AC**: Consistent styling
  - **Test**: Form styled consistently

### Phase 5 — Library & Knowledge Pages

- [ ] 5.1 Style `app/library/page.tsx` — Book grid
  - **Files**: `app/library/page.tsx` (modify)
  - **AC**: AC-LIB-1, AC-LIB-7
  - **Test**: Book grid, search, hover

- [ ] 5.2 Style `app/library/[book]/page.tsx` — Book detail
  - **Files**: `app/library/[book]/page.tsx` (modify)
  - **AC**: AC-LIB-2
  - **Test**: Breadcrumb, chapter nav, active highlight

- [ ] 5.3 Style `app/library/[book]/[chapter]/page.tsx` — Chapter reader
  - **Files**: `app/library/[book]/[chapter]/page.tsx` (modify)
  - **AC**: AC-LIB-3, AC-LIB-4, AC-LIB-5, AC-LIB-6
  - **Test**: Progress bar, comfortable reading, mobile

- [ ] 5.4 Redesign `app/knowledge/page.tsx` — Star card grid
  - **Files**: `app/knowledge/page.tsx` (modify)
  - **AC**: AC-KNOW-1, AC-KNOW-2, AC-KNOW-3, AC-KNOW-4, AC-KNOW-7
  - **Test**: 14 cards, filters, search, hover

- [ ] 5.5 Style `app/knowledge/[star]/[topic]/page.tsx` — Star detail
  - **Files**: `app/knowledge/[star]/[topic]/page.tsx` (modify)
  - **AC**: AC-KNOW-5, AC-KNOW-6, AC-KNOW-8
  - **Test**: Breadcrumb, sidebar, matrix table

### Phase 6 — Polish & Verification

- [ ] 6.1 Global polish — inline styles, dark mode, responsive
  - **Test**: All pages, `npm run build`

- [ ] 6.2 Accessibility check — contrast, keyboard nav, ARIA
  - **Test**: Manual testing + DevTools audit

- [ ] 6.3 Performance check — no layout shift, 60fps
  - **Test**: DevTools Performance panel

---

## File Structure Map

### New Files
- `components/Header.tsx`
- `components/Footer.tsx`
- `components/FadeIn.tsx`
- `components/HeroSection.tsx`
- `components/FeatureCards.tsx`
- `components/NiTeachingsSection.tsx`
- `components/StarPreviewCards.tsx`
- `components/HomepageFooter.tsx`

### Modified Files
- `app/globals.css` — token system
- `tailwind.config.ts` — semantic aliases
- `app/layout.tsx` — header + footer
- `app/page.tsx` — decomposition
- `components/PalaceCell.tsx` — style refactor
- `components/ChartBoard.tsx` — container + SVG
- `components/InsightPanel.tsx` — chat redesign
- `components/TimeNav.tsx` — polish
- `components/BirthForm.tsx` — style polish
- `app/library/page.tsx`
- `app/library/[book]/page.tsx`
- `app/library/[book]/[chapter]/page.tsx`
- `app/knowledge/page.tsx`
- `app/knowledge/[star]/[topic]/page.tsx`

**Total**: 8 new files, 14 modified files, 25 tasks across 6 phases.
