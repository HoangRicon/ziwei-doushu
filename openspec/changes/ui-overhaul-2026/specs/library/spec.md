# Spec: Library Pages

## 1. Overview

Improve the reading experience for classical text pages. Current implementation is functional but lacks comfortable typography for long-form reading.

## 2. Library Home (`app/library/page.tsx`)

### Current State
Book listing page with search.

### Refinements
- Page heading: "Thư viện kinh điển" with book count
- Book cards in responsive grid (3 col desktop, 2 tablet, 1 mobile)
- Each card: book title, author/source, chapter count, brief description
- Search input: styled consistently with design system
- Hover state: card lifts with shadow

## 3. Book Detail (`app/library/[book]/page.tsx`)

### Refinements
- Breadcrumb: Thư viện → [Book Name]
- Book title as page heading with source attribution
- Chapter list as navigation sidebar (desktop) or collapsible (mobile)
- Active chapter highlighted

## 4. Chapter Reader (`app/library/[book]/[chapter]/page.tsx`)

### Typography System
This is the most important refinement.

| Element | Size | Weight | Line Height | Notes |
|---------|------|--------|-------------|-------|
| Chapter title | 24px | 700 | 1.3 | Display heading |
| Section heading | 18px | 600 | 1.4 | Within chapter |
| Body text | 17px | 400 | 1.85 | Comfortable reading |
| Blockquote | 16px | 400 italic | 1.8 | Classic citations |
| Footnotes | 13px | 400 | 1.6 | Bottom of page |

### Reading Layout
- Max content width: `680px` (optimal for reading)
- Horizontally centered
- Generous vertical spacing between paragraphs: `1.5em`
- No full-width text blocks

### Reading Aids
- Reading progress bar at top (thin, accent color)
- Font size adjustment (increase/decrease)
- Optional: dark mode reading toggle (override site theme for reading comfort)

## 5. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-LIB-1 | Library home shows book grid with consistent card styling |
| AC-LIB-2 | Book detail page has working chapter navigation |
| AC-LIB-3 | Chapter reader has max-width 680px for comfortable reading |
| AC-LIB-4 | Body text line-height 1.85, font-size 17px |
| AC-LIB-5 | Reading progress bar visible at top of chapter pages |
| AC-LIB-6 | Responsive: readable on mobile (font-size ≥15px, padding ≥16px) |
| AC-LIB-7 | Search in library home styled consistently |
