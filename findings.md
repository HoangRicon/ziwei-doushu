# Findings: Full UI Overhaul — Ziwei Dou Shu

## What We Know

1. **Tech stack**: Next.js 14 App Router, React 19, TypeScript, Tailwind CSS 3.4 + CSS Variables, Framer Motion 11
2. **Current design system**: Partial CSS variable system — `globals.css` has `:root` and `[data-theme="dark"]` tokens for colors, shadows, borders, radii. Tailwind extends these partially.
3. **Main debt**: Heavy inline `style={...}` in components instead of Tailwind utilities
4. **Homepage**: 1,192-line monolith — needs decomposition
5. **No navigation**: No persistent header/footer — all pages are full-width without nav context
6. **Pages needing work**: Homepage, Chart, Library (3 pages), Knowledge (2 pages)
7. **Dark mode**: Managed via `data-theme` attribute on `<html>` + `ThemeProvider` context

## Key Decisions Made

| Decision | Choice | Reason |
|----------|--------|--------|
| Font | Keep system font | No user request for change |
| Mobile chart | Horizontal scroll OK | Simpler, no new interaction needed |
| Star colors | Amber spectrum | Consistency with data |
| Animation | Keep as-is | User approved |
| Token approach | 3-layer semantic | Incremental improvement, not full rewrite |

## Potential Pitfalls

1. **Inline style migration**: ~50+ `style={...}` props across components — must be done carefully to preserve exact visual output
2. **Framer Motion**: All animations use `transform`/`opacity` — safe for performance
3. **ThemeProvider scope**: Need to ensure Header/ThemeToggle works inside ThemeProvider
4. **Chart algorithm**: No touch — only visual refactoring of PalaceCell, ChartBoard, InsightPanel
5. **Library/knowledge data**: Static data — no backend changes needed

## Migration Priority

1. Design System (globals.css) first — foundation for everything
2. Navigation second — all pages need it
3. Homepage third — highest impact, most complex decomposition
4. Chart components fourth — core functionality, most critical
5. Library/Knowledge last — content pages, least complex
