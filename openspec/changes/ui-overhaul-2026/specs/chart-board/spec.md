# Spec: Chart Board & Palace Cells

## 1. Overview

Refine the 4×4 natal chart grid for improved readability, consistent palace cell layout, and cleaner SVG connection lines. The core algorithm and data display logic remain unchanged.

## 2. Palace Cell Refinement

### Layout Structure
Each palace cell is divided into **4 zones** (top-to-bottom):

```
┌─────────────────────┐
│  [大限年龄]  [宫名]  │  ← Zone 1: Header (宫名 + 年龄标签)
│       [干支]        │  ← Zone 2: Gan Zhi
│  [主星列表]         │  ← Zone 3: Stars (main → lucky → sha)
│  [吉星+煞星]        │  ← Zone 4: Auxiliary stars
└─────────────────────┘
```

### Size & Spacing
- Min height: `90px` (keep existing)
- Cell padding: `8px` (current `p-1.5` ≈ 6px → increase slightly)
- Font sizes: Zone 1: 10px, Zone 2: 9px, Zone 3: 13px, Zone 4: 9px (keep existing)
- Gap between zones: `2px`

### State Styling (keep current logic, refine CSS)

| State | Background | Border/Indicator |
|-------|-----------|-----------------|
| Default | `--color-bg-surface` | none |
| Ming Gong (命宫) | gold tint | left border `3px solid --color-ac` |
| Shen Gong (身宫) | sky tint | left border `3px solid sky-500` |
| Selected | blue tint | full border `1.5px solid --color-ac` |
| San Fang (三方四正) | subtle blue tint | full border `1px solid blue-400/40` |
| Current Da Xian | purple tint | left border `3px solid purple-500` |

### Star Rendering
- **Brightness colors** are data colors (amber spectrum) — keep as-is
- **Si Hua badges** use semantic colors (`--color-sihua-*`) — update CSS variable references
- Stars grouped: major → lucky → sha (keep current sorting)
- "Không cung" placeholder text when no stars

## 3. Chart Board Grid

### Container
- Max width: `520px` (desktop), full-width with padding (mobile)
- Aspect ratio: roughly square
- Background: `--color-bg-surface`
- Border radius: `--radius-xl`
- Box shadow: `--shadow-lg`

### Grid Layout
- CSS Grid: 4 columns × 4 rows
- Cell borders: `1px solid var(--color-border)` (internal), thicker outer border
- No gutters between cells (adjacent cells share borders)

### SVG Overlay (三方四正 Connections)
- SVG positioned absolute over the grid
- **Ming Gong connections**: gold lines (`--color-ac`)
- **San Fang highlight**: blue dashed lines
- **Current Da Xian indicator**: purple glow
- Update line colors to use CSS variables instead of hardcoded values
- Animate line drawing on palace select (optional enhancement)

## 4. Time Navigation Integration

The `TimeNav` component sits above the chart board. Refinement:
- Move the existing `TimeNav` into a cleaner container with proper spacing
- Ensure tab underline animation is smooth
- Year picker (for 流年) uses consistent input styling

## 5. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-CB-1 | Palace cell 4-zone layout clearly delineated |
| AC-CB-2 | All state styles (default, ming gong, shen gong, selected, san fang, current daxian) visually distinct |
| AC-CB-3 | Si Hua badges use semantic CSS variable references |
| AC-CB-4 | Chart board max-width 520px, responsive on mobile |
| AC-CB-5 | SVG connection lines use CSS variables |
| AC-CB-6 | Grid borders consistent (shared borders, no double-width) |
| AC-CB-7 | Click on palace cell triggers selection animation |
| AC-CB-8 | TimeNav properly spaced above chart board |
| AC-CB-9 | No layout shift during time view switching |
