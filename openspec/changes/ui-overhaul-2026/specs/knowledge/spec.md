# Spec: Knowledge Pages

## 1. Overview

Improve the knowledge base homepage to use a **visual card grid** for the 14 stars, replacing the current flat list layout. Detail pages get refined typography and navigation.

## 2. Knowledge Home (`app/knowledge/page.tsx`)

### Current State
Flat list of 14 stars with basic info.

### Redesign
**Visual Card Grid** (4×4 on desktop, 2× on tablet, 1× on mobile):

Each star card:
- Star name in large text (e.g., "Tử Vi", "Thiên Phủ")
- Star nature label (e.g., "Nam Mệnh", "Bắc Đẩu")
- Brief 1-line description
- "Khám phá" button → `/knowledge/[star]/mang-menh`
- Hover: gold border highlight, subtle scale-up

Color coding per star category:
- 北斗 (Big Dipper): blue accent
- 南斗 (Southern Dipper): purple accent
- 中天 (Central Sky): gold accent
- Other: neutral

### Navigation
- Filter tabs: "Tất cả" | "Bắc Đẩu" | "Nam Đẩu" | "Trung Thiên"
- Search input for star name

## 3. Star Detail (`app/knowledge/[star]/[topic]/page.tsx`)

### Layout
- Breadcrumb: Kiến thức → [Star Name] → [Topic]
- Page heading: star name + nature classification
- Sidebar (desktop): topic navigation (mệnh, quan, tài, tình, sức khỏe, etc.)
- Main content: rich text with proper heading hierarchy

### Typography
- Heading 1 (star name): 30px, weight 700
- Heading 2 (topic sections): 20px, weight 600
- Body: 16px, line-height 1.7
- Lists: proper indentation, bullet styling

### Palace × Star Matrix
- Grid showing this star's meaning in each of 12 palaces
- Compact table with alternating row colors

## 4. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-KNOW-1 | Knowledge home shows 14 star cards in visual grid |
| AC-KNOW-2 | Star cards have hover state with gold border |
| AC-KNOW-3 | Filter tabs work (All / Bắc Đẩu / Nam Đẩu / Trung Thiên) |
| AC-KNOW-4 | Search input filters star cards by name |
| AC-KNOW-5 | Star detail page has sidebar topic navigation |
| AC-KNOW-6 | Palace × star matrix displayed on detail page |
| AC-KNOW-7 | Responsive: cards stack on mobile, sidebar becomes top tabs |
| AC-KNOW-8 | All internal links navigate correctly |
