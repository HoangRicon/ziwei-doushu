# Proposal: Full UI Overhaul — Ziwei Dou Shu System

## 1. Problem Statement

The current UI was built incrementally and carries significant technical debt:

- **Inline style overload**: Many components use heavy `style={...}` objects instead of Tailwind utilities, making the codebase hard to maintain and theme.
- **Homepage monolith**: `app/page.tsx` is 1,192 lines — impossible to maintain as a single file.
- **Inconsistent spacing and typography**: No formal typographic scale; CSS tokens exist but aren't consistently applied.
- **Weak navigation**: No persistent header/nav bar with active state; users get lost across pages.
- **Chart board complexity**: The 4×4 palace grid works but palace cells use inconsistent layouts.
- **Library reading experience**: Classical text reader lacks comfortable reading typography.
- **Knowledge pages**: 14 stars displayed in a flat list; should use a visual card grid.
- **Insight panel**: AI chat interface feels dated compared to modern messaging UIs.

## 2. Vision

A **modern traditional-cosmological** aesthetic — where ancient Chinese astronomy meets contemporary web design. The interface should feel premium, clean, and trustworthy, while honoring the cultural heritage of Tử Vi Đẩu Số.

Key principles:
- **Cohesive design system**: Single source of truth for colors, typography, spacing, and motion.
- **Component-driven**: Every major section extracted into its own component.
- **Mobile-first**: Responsive layouts with touch-friendly tap targets (≥44px).
- **Dark mode parity**: Both light and dark modes must be fully polished.
- **Performance**: No layout shift; smooth 60fps animations via CSS transforms only.

## 3. Scope

### In Scope
1. **Design System Refinement** — expand CSS variables into a 3-layer token system; update Tailwind config; add typography scale.
2. **Persistent Navigation** — add a sticky header with logo, nav links, and theme toggle.
3. **Homepage Decomposition** — break `app/page.tsx` into: `HeroSection`, `FeatureCards`, `NiTeachingsSection`, `StarPreviewCards`, `Footer`.
4. **ChartBoard Refinement** — improve palace cell layout consistency, better SVG connection lines, enhanced current-period highlighting.
5. **InsightPanel Redesign** — modern chat bubble UI, better streaming response display.
6. **Library Pages** — comfortable reading typography, progress tracking.
7. **Knowledge Pages** — visual card grid for 14 stars, improved topic navigation.
8. **BirthForm Polish** — consistent styling, better step indicators.

### Out of Scope
- Backend / API changes
- Database schema changes
- New feature functionality (only visual/UX changes)
- Animations beyond Framer Motion CSS transforms
- Accessibility audit beyond WCAG 2.1 AA (full audit out of scope)

## 4. Affected Pages & Components

| Area | Files to Modify |
|------|----------------|
| Design System | `app/globals.css`, `tailwind.config.ts` |
| Root Layout | `app/layout.tsx` |
| Homepage | `app/page.tsx` → decomposed into smaller components |
| Chart | `app/chart/page.tsx`, `components/ChartBoard.tsx`, `components/PalaceCell.tsx`, `components/InsightPanel.tsx`, `components/TimeNav.tsx` |
| Navigation | New `components/Header.tsx`, `components/Footer.tsx` |
| Library | `app/library/page.tsx`, `app/library/[book]/page.tsx`, `app/library/[book]/[chapter]/page.tsx` |
| Knowledge | `app/knowledge/page.tsx`, `app/knowledge/[star]/[topic]/page.tsx` |
| Common | `components/BirthForm.tsx`, `components/PatternsCard.tsx`, `components/ShareModal.tsx` |

## 5. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking existing functionality | High | Test each page after changes; no logic changes to algorithm/core lib |
| Layout shift during transition | Medium | Use CSS transitions; test on slow connections |
| Dark mode inconsistency | Medium | Systematic token review per component |
| Timeline creep | High | Strict scope boundary; defer out-of-scope items |
