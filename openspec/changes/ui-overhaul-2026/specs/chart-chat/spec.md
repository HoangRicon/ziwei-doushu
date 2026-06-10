# Spec: Chart Board & Chat Panel — Comprehensive Redesign

## 1. Overview

Refactor the chart workspace (`/chart`) to match the dark cosmological aesthetic shown in the reference image. The core Tử Vi algorithm, palace data, and streaming logic remain unchanged — only the visual layer is redesigned.

**Reference**: `la-so-tu-vi-2026-06-10.jpg`

---

## 2. Design Direction

### Visual Identity: Dark Cosmic Elegance

The reference image shows a dark, premium interface with the following character:

- **Background**: Deep navy-black (`#020810`) — the cosmos
- **Palace cells**: Subtle transparency (`rgba(255,255,255,0.04)`) with faint borders
- **Selected palace**: Distinct highlight (`#1A2A3A`) making it clearly pop
- **San Fang (三方四正)**: Blue-tinted background (`rgba(59,130,246,0.08)`)
- **Accent**: Warm gold (`#D4A843`) for borders, headings, and interactive elements
- **Text**: High-contrast off-white (`#E8EEF6`) for primary, muted blue-gray (`#6A7A96`) for secondary

### Typography

- **Chinese star/palace names**: `Noto Sans SC` (Google Fonts), fall back to system fonts
- **Vietnamese labels**: System sans (`-apple-system, 'PingFang SC', ...`)
- **Monospace** (stem/branch): `'SF Mono', 'Menlo', monospace`
- **Star names in palace cells**: `text-[10px]`, color-coded by star type
- **Palace labels**: `text-[9px]` tracking-wide uppercase

---

## 3. Color System

### Dark Mode (Primary)

```css
[data-theme="dark"] {
  --color-bg-page:      #020810;  /* deep navy-black — the cosmos */
  --color-bg-surface:  rgba(255,255,255,0.04);  /* palace cell base */
  --color-bg-elevated: #0A1020;  /* cards, panels */
  --color-bg-selected: #1A2A3A;  /* selected palace cell */
  --color-bg-sf:       rgba(59,130,246,0.08);  /* san fang cells */

  --color-text-primary:   #E8EEF6;
  --color-text-secondary: #C8D8E8;
  --color-text-muted:     #6A7A96;
  --color-text-faint:     #3A4A5A;

  --color-accent:       #D4A843;
  --color-accent-dim:   #C09830;
  --color-accent-bg:    rgba(212,168,67,0.08);
  --color-accent-bdr:   rgba(212,168,67,0.20);

  --color-border:       rgba(255,255,255,0.07);
  --color-border-med:   rgba(255,255,255,0.10);
  --color-border-gold:  rgba(184,146,42,0.20);
}
```

### Light Mode (Must Maintain Parity)

```css
:root {
  --color-bg-page:      #FAFAF9;
  --color-bg-surface:   #FFFFFF;
  --color-bg-elevated:  #F4F3EF;
  --color-bg-selected:  rgba(184,146,42,0.08);
  --color-bg-sf:        rgba(59,130,246,0.05);

  --color-text-primary:   #0D0D0B;
  --color-text-secondary: #1A1A18;
  --color-text-muted:     #8A8A82;

  --color-accent:       #B8922A;
  --color-accent-dim:   #7A5F1A;
  --color-accent-bg:    rgba(184,146,42,0.07);
  --color-accent-bdr:   rgba(184,146,42,0.22);

  --color-border:       rgba(0,0,0,0.07);
  --color-border-med:   rgba(0,0,0,0.12);
  --color-border-gold:  rgba(184,146,42,0.15);
}
```

### Star Color Coding

| Star Type | Color (Dark) | Color (Light) |
|-----------|-------------|---------------|
| Tử Vi family (Tử Vi, Tử Bồng) | `#F472B6` pink | `#BE185D` |
| Thái Dương | `#FBBF24` yellow | `#D97706` |
| Vũ Khúc | `#FB923C` orange | `#EA580C` |
| Xương Khúc | `#FACC15` | `#CA8A04` |
| Liêm Trinh | `#4ADE80` green | `#16A34A` |
| Tham Lang | `#34D399` | `#059669` |
| Cự Môn | `#C084FC` purple | `#9333EA` |
| Phá Quân | `#F87171` | `#DC2626` |
| Other major | `#E8EEF6` white | `#374151` |
| Si Hua Lộc | `#2D7A4A` green | data token |
| Si Hua Quyền | `#1A56A8` blue | data token |
| Si Hua Khoa | `#8A7018` yellow | data token |
| Si Hua Kỵ | `#A83228` red | data token |

---

## 4. Palace Cell Component (`PalaceCell.tsx`)

### Layout

```
┌────────────────────────────┐
│ [Branch name]   [StemGan] │  ← Header: palace name + heavenly stem
│ [Major Stars row]          │  ← Stars: icon + name, colored
│ [Minor stars + Si Hua]     │  ← Auxiliary: smaller, muted
└────────────────────────────┘
```

- **Cell padding**: `p-2` (8px)
- **Cell min-height**: `90px`
- **Branch name**: top-left, `text-[9px]` tracking-widest uppercase, muted color
- **Stem Gan**: top-right, `text-[9px]`, monospace font, accent color
- **Stars zone**: flowing wrap, `text-[10px]`, each star: small colored dot + name
- **Si Hua badge**: inline with star, uses sihua semantic colors

### State Styles

| State | Background | Border |
|-------|-----------|--------|
| Default | `--color-bg-surface` | none |
| Selected | `--color-bg-selected` | `1px solid var(--color-accent)` |
| San Fang | `--color-bg-sf` | none |
| Ming Gong | `--color-bg-selected` | `2px solid var(--color-accent)` left |
| Shen Gong | same as ming | `2px solid #3B82F6` left |
| Current DaXian | `rgba(147,51,234,0.08)` | `1px solid rgba(147,51,234,0.3)` |

### Interactions

- **Hover**: `--color-bg-surface` → `--color-bg-elevated`, `transition-colors duration-150`
- **Click**: triggers selection, triggers palace analysis in InsightPanel
- **Star click**: expands star detail panel

---

## 5. Chart Board Container (`ChartBoard.tsx`)

### Grid

- **Outer border**: `1px solid var(--color-border-gold)`, `rounded-2xl`
- **Grid gap**: `1px` (creates thin borders between cells)
- **Grid background**: `var(--color-border)` (the gap shows as border color)
- **Max-width**: `520px`, centered
- **Box shadow**: `0 0 40px rgba(184,146,42,0.06), var(--shadow-md)`

### Center Area

The 2×2 center area (between rows 2-3, cols 2-3) displays:

- ☯ symbol: large, `opacity: 0.08`, accent color, decorative
- Mệnh Cung + Thân Cung: small labels
- Ngũ hành cục name
- Current DaXian box (purple tint): age range + palace name

### SVG Overlay (San Fang Connections)

- **Line color**: `rgba(59,130,246,0.5)` (blue, semi-transparent)
- **Line style**: dashed (`6,4`), `strokeWidth: 1.5`
- **Line cap**: round
- **Dots at corners**: `r=3`, filled circles
- **Animate**: fade in on palace select, `duration: 0.3s`

### Time Navigation (`TimeNav`)

- **Container**: full width, `border-bottom: 1px solid var(--color-border)`, `pb-3 mb-3`
- **Tabs**: pill-style, active tab has gold underline + text color change
- **Year input**: compact, `w-16`, border matches design system

---

## 6. Chat Panel (`InsightPanel.tsx`)

### Layout

```
┌─────────────────────────────────┐
│ [Star icon] Giải Đoán AI       │  ← Header: icon + title
├─────────────────────────────────┤
│ [Topic Tabs row]               │  ← 6 tabs, horizontal scroll
├─────────────────────────────────┤
│                                 │
│  [Avatar] [Message bubble]       │  ← Assistant (left)
│                                 │
│         [Message bubble]        │  ← User (right, gold tint)
│                                 │
│  [Avatar] [streaming bubble]    │  ← Assistant streaming
│                                 │
├─────────────────────────────────┤
│ [Textarea............] [Send]  │  ← Input row
└─────────────────────────────────┘
```

### Header

- **Height**: `52px`, `border-bottom: 1px solid var(--color-border)`
- **Icon**: small star SVG in gold circle
- **Title**: "Giải Đoán AI", `text-sm font-medium`, accent color
- **Style**: glass effect (`backdrop-blur`) for light mode, solid dark for dark mode

### Topic Tabs

- **Container**: `border-bottom: 1px solid var(--color-border)`, horizontal scroll
- **Active tab**: `text-sm font-medium`, accent color, gold underline `2px`
- **Inactive tab**: `text-sm`, muted color
- **Scrollbar**: hidden (`scrollbar-hide`)

### Message List

- **Container**: `flex-1 overflow-y-auto p-4`, space-y-3 between messages
- **Auto-scroll**: scroll to bottom on new message

### Message Bubbles

**Assistant (left-aligned)**:
- Avatar: `w-8 h-8` circle, `--color-bg-elevated`, star icon inside, accent color
- Bubble: `max-w-[80%]`, `--color-bg-elevated`, `rounded-2xl rounded-tl-sm`, subtle border
- Text: `text-[11px]`, primary text color, `leading-relaxed`
- **Section headers** (【】): accent color, `text-[11px] font-semibold tracking-wide`
- **Bold**: slightly brighter text

**User (right-aligned)**:
- No avatar
- Bubble: `max-w-[75%]`, `--color-accent-bg`, `rounded-2xl rounded-tr-sm`, `border: 1px solid var(--color-accent-bdr)`
- Text: `text-[11px]`, `--color-text-primary`, `leading-relaxed`

### Streaming State

- Blinking cursor (`w-1.5 h-3`) in accent color at end of streaming text
- Smooth text appearance as chunks arrive

### Empty State

- Centered vertically in message area
- Star SVG icon, `opacity: 0.2`, accent color
- Text: "Chọn một chủ đề và bắt đầu trò chuyện", muted color

### Input Area

- **Container**: `border-top: 1px solid var(--color-border)`, `px-3 py-2`
- **Textarea**: `flex-1`, `rounded-xl`, `--color-bg-surface`, `--color-border`, `text-sm`
  - Auto-grow: `min-h: 44px`, `max-h: 120px`
  - Placeholder: "Hỏi về bản đồ của bạn..."
- **Send button**: `w-10 h-10`, `rounded-xl`, accent background, white icon (paper plane)
  - Disabled: opacity 30%, cursor-not-allowed
- **Keyboard**: Enter sends, Shift+Enter newline

---

## 7. Page Layout (`app/chart/page.tsx`)

### Desktop (≥ 768px)

```
┌─────────────────────────────────────────────────────┐
│ Header                                               │
├─────────────────────────────────────────────────────┤
│ TimeNav                                              │
│ ┌───────────────────────┬───────────────────┐       │
│ │                       │                   │       │
│ │   ChartBoard (520px)  │  InsightPanel     │       │
│ │                       │  (380px)          │       │
│ │                       │                   │       │
│ └───────────────────────┴───────────────────┘       │
└─────────────────────────────────────────────────────┘
```

- **Grid**: `lg:grid-cols-[minmax(0,520px)_380px]`, gap-5
- **ChartBoard**: `max-w-[520px]` centered in its column
- **InsightPanel**: `w-full`, full height of container
- **Background**: `--color-bg-page`

### Mobile (< 768px)

- **Layout**: single column, stacked
- **ChartBoard**: full width, scrollable horizontally if needed
- **InsightPanel**: full width below chart, `min-h-[400px]`
- **Padding**: `px-3`

---

## 8. Animation

| Element | Animation |
|---------|-----------|
| Palace entrance | Stagger `i * 0.04s`, fade + scale |
| Selected palace | Border + background color transition `0.15s ease` |
| San fang lines | Fade in `0.3s` on select, fade out `0.2s` |
| Message appear | Fade + slide up `opacity: 0, y: 8` → `opacity: 1, y: 0` |
| Streaming cursor | `animate-pulse` |
| Tab underline | `transition-all duration-200` |

---

## 9. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-CC-1 | Dark mode matches reference image aesthetic (deep navy, gold accents) |
| AC-CC-2 | Light mode fully functional with semantic tokens |
| AC-CC-3 | Palace cells have colored star names per star type |
| AC-CC-4 | Selected palace has distinct visual state |
| AC-CC-5 | San fang cells highlighted with blue tint |
| AC-CC-6 | Chart board grid uses gold-tinted borders |
| AC-CC-7 | Chat panel: user bubble right, assistant left with avatar |
| AC-CC-8 | Chat panel: topic tabs with active state |
| AC-CC-9 | Streaming text renders smoothly with blinking cursor |
| AC-CC-10 | Page responsive: desktop side-by-side, mobile stacked |
| AC-CC-11 | No layout shift during theme toggle |
| AC-CC-12 | All transitions smooth (≥60fps via transform-only) |

---

## 10. Implementation Order

1. **`globals.css`** — Update semantic tokens to match reference color palette
2. **`PalaceCell.tsx`** — Add star color coding + state styles
3. **`ChartBoard.tsx`** — Grid border polish + center area refinement
4. **`InsightPanel.tsx`** — Full redesign: header, bubbles, input
5. **`app/chart/page.tsx`** — Layout refinement
6. **Polish** — Theme toggle verification, mobile testing
