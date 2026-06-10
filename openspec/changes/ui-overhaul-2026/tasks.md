# Task List: Full UI Overhaul — Ziwei Dou Shu

## How to Read This File

- `[ ]` = not started
- `[x]` = completed
- `[*]` = in progress
- Each task has: file paths, acceptance criteria trace, test strategy

---

## Phase 1: Design System Foundation

### 1.1. Refactor `globals.css` — 3-Layer Token System

**Files**: `app/globals.css` (modify)

**Acceptance Criteria**: AC-DS-1, AC-DS-2, AC-DS-4, AC-DS-5

**Tasks**:
- [ ] Add primitive token comments and grouping (`/* ─── Layer 1: Primitive ─── */`)
- [ ] Rename/add semantic token aliases: `--color-bg-page`, `--color-bg-surface`, `--color-text-primary`, `--color-text-secondary`, `--color-text-faint`, `--color-accent`, `--color-border`, `--color-shadow`
- [ ] Map existing tokens to semantic names (e.g., `--bg-0` → `--color-bg-page`)
- [ ] Ensure all semantic tokens have both light and dark mode values
- [ ] Add Si Hua semantic aliases: `--color-sihua-lu`, `--color-sihua-quan`, `--color-sihua-ke`, `--color-sihua-ji`
- [ ] Add typography scale tokens: `--text-sm` through `--text-4xl` with responsive sizes
- [ ] Document token usage at top of file

**Test**: Open site in both light/dark mode, inspect computed styles in DevTools for all semantic tokens.

---

### 1.2. Update `tailwind.config.ts` — Semantic Token Aliases

**Files**: `tailwind.config.ts` (modify)

**Acceptance Criteria**: AC-DS-2, AC-DS-3

**Tasks**:
- [ ] Add semantic color extensions referencing CSS variables
- [ ] Add typography scale to `fontSize` extend
- [ ] Verify existing `shadow` and `borderRadius` extensions work with new system
- [ ] Add responsive container class if needed

**Test**: Run `npm run build` — no Tailwind errors.

---

## Phase 2: Navigation (Global)

### 2.1. Create `components/Header.tsx`

**Files**: `components/Header.tsx` (create)

**Acceptance Criteria**: AC-NAV-1, AC-NAV-2, AC-NAV-3, AC-NAV-4, AC-NAV-5

**Tasks**:
- [ ] Create Header component with sticky positioning (`sticky top-0 z-50`)
- [ ] Add logo (SVG star motif) + "Tử Vi" brand text
- [ ] Add 5 nav links with `usePathname()` for active detection
- [ ] Style active link with gold underline
- [ ] Add ThemeToggle component (move from page.tsx)
- [ ] Implement mobile hamburger: icon button + `AnimatePresence` overlay panel
- [ ] Style hamburger panel with slide-down animation
- [ ] Add responsive breakpoint handling (hamburger < 768px, full nav ≥ 768px)
- [ ] Add backdrop blur and semi-transparent background

**Test**: Click each nav link — verify active state. Resize to mobile — verify hamburger. Toggle theme — verify header theme consistency.

---

### 2.2. Create `components/Footer.tsx`

**Files**: `components/Footer.tsx` (create)

**Acceptance Criteria**: AC-NAV-6, AC-NAV-7

**Tasks**:
- [ ] Create Footer with 4-column grid layout
- [ ] Column 1: Brand + tagline
- [ ] Column 2: "Dịch vụ" links (Lập bản đồ, Giải đoán, Hằng sao, Thư viện kinh điển)
- [ ] Column 3: "Tài nguyên" links (Kiến thức Tử Vi, 14 Chính tinh, Tứ hóa, Cổ thư)
- [ ] Column 4: Legal links (Điều khoản → `/terms`, Bảo mật → `/privacy`)
- [ ] Bottom bar: copyright + "v1.0"
- [ ] Responsive: stack to 1-column on mobile
- [ ] Style with `--color-bg-surface` and `--color-border`

**Test**: Click all footer links — verify navigation. Resize to mobile — verify single column stack.

---

### 2.3. Update `app/layout.tsx`

**Files**: `app/layout.tsx` (modify)

**Acceptance Criteria**: AC-NAV-8, AC-HP-7

**Tasks**:
- [ ] Import `Header` and `Footer` components
- [ ] Add `Header` as first child inside `<ThemeProvider>` (above `{children}`)
- [ ] Add `Footer` as last child (below `{children}`)
- [ ] Add body padding/margin to prevent header overlap (e.g., `pt-16` on `<body>` or layout wrapper)
- [ ] Verify `ThemeProvider` still wraps both Header and Footer correctly
- [ ] Ensure metadata and Analytics/SpeedInsights remain intact

**Test**: Visit every page — header visible, no content overlap. Footer visible on all pages.

---

## Phase 3: Homepage Decomposition

### 3.1. Extract `components/FadeIn.tsx`

**Files**: `components/FadeIn.tsx` (create)

**Acceptance Criteria**: AC-HP-3

**Tasks**:
- [ ] Extract the `FadeIn` wrapper function from `app/page.tsx` into its own file
- [ ] Make it a proper exported component with TypeScript props interface
- [ ] Verify Framer Motion import is correct
- [ ] Test: Use in any component — should animate on scroll into view

**Test**: Scroll homepage — FadeIn sections animate. Import into a new component — works.

---

### 3.2. Extract `components/HeroSection.tsx`

**Files**: `components/HeroSection.tsx` (create), `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6, AC-HP-8

**Tasks**:
- [ ] Extract hero content from `page.tsx` into `HeroSection.tsx`
- [ ] Include: headline, subheadline, CTA buttons, StarField background, AnnouncementModal
- [ ] Include: ThemeToggle (now imported from Header context or kept inline for hero)
- [ ] Style with `--color-bg-page` background
- [ ] Verify responsive text sizes

**Test**: Homepage hero section identical to before. Announcement modal still triggers.

---

### 3.3. Extract `components/FeatureCards.tsx`

**Files**: `components/FeatureCards.tsx` (create), `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6

**Tasks**:
- [ ] Extract feature cards section from `page.tsx`
- [ ] Create 3-card responsive grid (3-col desktop, 2-col tablet, 1-col mobile)
- [ ] Add hover: `shadow-lg` lift + subtle scale transform
- [ ] Style card backgrounds with `--color-bg-surface`
- [ ] Add links to `/chart`, `/heming`, `/library`

**Test**: Cards visible, links work, hover state animates.

---

### 3.4. Extract `components/NiTeachingsSection.tsx`

**Files**: `components/NiTeachingsSection.tsx` (create), `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-4, AC-HP-6

**Tasks**:
- [ ] Extract Ni teachings section from `page.tsx`
- [ ] Display 3 teaching pillars (Thiên Kí, Địa Kí, Nhân Kí) in card/timeline layout
- [ ] Style with consistent card components
- [ ] Responsive grid (3-col → 1-col)

**Test**: 3 teaching pillars visible, layout responsive.

---

### 3.5. Extract `components/StarPreviewCards.tsx`

**Files**: `components/StarPreviewCards.tsx` (create), `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-4, AC-HP-5, AC-HP-6

**Tasks**:
- [ ] Extract 14-star preview section from `page.tsx`
- [ ] Grid: 4-col desktop, 2-col tablet, 1-col mobile
- [ ] Each card: star name, brief description, "Tìm hiểu" link
- [ ] Hover: gold border highlight
- [ ] Links → `/knowledge/[star]/mang-menh`

**Test**: 14 star cards visible, hover states work, links navigate correctly.

---

### 3.6. Extract `components/HomepageFooter.tsx`

**Files**: `components/HomepageFooter.tsx` (create), `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-4, AC-HP-5

**Tasks**:
- [ ] Extract bottom CTA section from `page.tsx`
- [ ] "Bắt đầu khám phá" heading
- [ ] "Lập bản đồ miễn phí" CTA → `/chart`
- [ ] Trust indicators text

**Test**: CTA section visible, button navigates to `/chart`.

---

### 3.7. Simplify `app/page.tsx`

**Files**: `app/page.tsx` (modify)

**Acceptance Criteria**: AC-HP-1, AC-HP-8

**Tasks**:
- [ ] Replace all extracted content with imports of new components
- [ ] Wrap each with `FadeIn` and appropriate delay
- [ ] File should be < 100 lines
- [ ] Remove duplicate imports
- [ ] Keep all necessary imports (components, types)

**Test**: Homepage renders identically with all sections. File size < 100 lines.

---

## Phase 4: Chart Board Refinements

### 4.1. Refactor `components/PalaceCell.tsx` — Style Cleanup

**Files**: `components/PalaceCell.tsx` (modify)

**Acceptance Criteria**: AC-CB-1, AC-CB-2, AC-CB-3, AC-CB-9

**Tasks**:
- [ ] Replace `style={...}` objects with Tailwind `className` using semantic tokens
- [ ] Replace `var(--t-bg)` references with `--color-bg-surface` semantic token
- [ ] Replace `var(--t-faint)` with `--color-text-faint`
- [ ] Ensure all state backgrounds use CSS variables or Tailwind utilities
- [ ] Keep Framer Motion animations (they're fine)
- [ ] Keep all data logic (stars, Si Hua, brightness) unchanged

**Test**: Palace cells look identical. Theme toggle works on chart page.

---

### 4.2. Refactor `components/ChartBoard.tsx` — Container & SVG

**Files**: `components/ChartBoard.tsx` (modify)

**Acceptance Criteria**: AC-CB-4, AC-CB-5, AC-CB-6, AC-CB-7, AC-CB-9

**Tasks**:
- [ ] Update container: max-width `520px`, centered, proper padding
- [ ] Style grid borders with CSS variables
- [ ] Update SVG line colors to use CSS variables
- [ ] Add `overflow-hidden` + border-radius on container
- [ ] Add responsive width (`w-full max-w-[520px]`)
- [ ] Keep all chart logic (palace mapping, san fang, time view) unchanged

**Test**: Chart board renders correctly on desktop and mobile. SVG lines visible. No horizontal scroll on mobile.

---

### 4.3. Redesign `components/InsightPanel.tsx` — Chat UI

**Files**: `components/InsightPanel.tsx` (modify)

**Acceptance Criteria**: AC-IP-1, AC-IP-2, AC-IP-3, AC-IP-4, AC-IP-5, AC-IP-6, AC-IP-7, AC-IP-8, AC-IP-9

**Tasks**:
- [ ] Restructure layout: topic tabs at top, messages in middle, input at bottom
- [ ] Create assistant message component: left-aligned, avatar, bubble
- [ ] Create user message component: right-aligned, no avatar, accent-tinted bubble
- [ ] Add streaming text rendering (keep existing streaming logic)
- [ ] Style topic tabs with active state (gold underline)
- [ ] Add empty state: centered text + icon
- [ ] Style input: auto-grow textarea, send button
- [ ] Add loading state: animated dots
- [ ] Responsive: `w-[380px]` desktop, `w-full` mobile
- [ ] Ensure keyboard navigation works

**Test**: Send a message — renders as user bubble. Get AI response — renders as assistant bubble with streaming. Topic tabs switch. Theme toggle works. Responsive on mobile.

---

### 4.4. Style `components/TimeNav.tsx` — Container Polish

**Files**: `components/TimeNav.tsx` (modify)

**Acceptance Criteria**: AC-CB-8

**Tasks**:
- [ ] Wrap TimeNav in container with proper spacing above ChartBoard
- [ ] Add border-bottom separator
- [ ] Ensure year picker input uses consistent design system styling

**Test**: TimeNav properly spaced above chart. Tabs switch correctly.

---

### 4.5. Style `components/BirthForm.tsx`

**Files**: `components/BirthForm.tsx` (modify)

**Acceptance Criteria**: Consistent styling across all form elements

**Tasks**:
- [ ] Review BirthForm for inline styles — replace with Tailwind/semantic tokens
- [ ] Ensure step indicator styling consistent with design system
- [ ] Style inputs and buttons with semantic tokens

**Test**: BirthForm looks consistent with other pages. All inputs styled.

---

## Phase 5: Library & Knowledge Pages

### 5.1. Style `app/library/page.tsx` — Book Grid

**Files**: `app/library/page.tsx` (modify)

**Acceptance Criteria**: AC-LIB-1, AC-LIB-7

**Tasks**:
- [ ] Add page heading with book count
- [ ] Style book cards in responsive grid (3-col → 1-col)
- [ ] Add hover lift shadow to cards
- [ ] Style search input with semantic tokens
- [ ] Ensure consistent spacing and typography

**Test**: Book grid displays correctly. Search works. Hover states work.

---

### 5.2. Style `app/library/[book]/page.tsx` — Book Detail

**Files**: `app/library/[book]/page.tsx` (modify)

**Acceptance Criteria**: AC-LIB-2

**Tasks**:
- [ ] Add breadcrumb navigation
- [ ] Style chapter list as sidebar (desktop) or collapsible (mobile)
- [ ] Active chapter highlighted with accent color
- [ ] Consistent typography

**Test**: Breadcrumb navigates correctly. Chapter navigation works. Active chapter highlighted.

---

### 5.3. Style `app/library/[book]/[chapter]/page.tsx` — Chapter Reader

**Files**: `app/library/[book]/[chapter]/page.tsx` (modify)

**Acceptance Criteria**: AC-LIB-3, AC-LIB-4, AC-LIB-5, AC-LIB-6

**Tasks**:
- [ ] Add reading progress bar (scroll-driven, accent color)
- [ ] Constrain content width to `680px`, centered
- [ ] Set body text: `17px`, line-height `1.85`
- [ ] Set proper heading hierarchy (h1: 24px, h2: 18px)
- [ ] Style blockquotes with left border + italic
- [ ] Ensure mobile readability (`padding ≥ 16px`, `font-size ≥ 15px`)
- [ ] Responsive font sizes

**Test**: Open any chapter — reading progress bar visible. Text comfortable to read. Responsive on mobile.

---

### 5.4. Redesign `app/knowledge/page.tsx` — Star Card Grid

**Files**: `app/knowledge/page.tsx` (modify)

**Acceptance Criteria**: AC-KNOW-1, AC-KNOW-2, AC-KNOW-3, AC-KNOW-4, AC-KNOW-7

**Tasks**:
- [ ] Replace flat list with visual card grid (4×4 → 2× → 1×)
- [ ] Add filter tabs: "Tất cả" | "Bắc Đẩu" | "Nam Đẩu" | "Trung Thiên"
- [ ] Add star name search input
- [ ] Add hover state: gold border + subtle scale
- [ ] Each card: star name, nature label, brief description, "Khám phá" button
- [ ] Color accent per star category (blue/purple/gold)
- [ ] Responsive card grid

**Test**: 14 star cards display in grid. Filter tabs work. Search filters cards. Hover states work.

---

### 5.5. Style `app/knowledge/[star]/[topic]/page.tsx` — Star Detail

**Files**: `app/knowledge/[star]/[topic]/page.tsx` (modify)

**Acceptance Criteria**: AC-KNOW-5, AC-KNOW-6, AC-KNOW-8

**Tasks**:
- [ ] Add breadcrumb navigation
- [ ] Add sidebar topic navigation (desktop) → tabs (mobile)
- [ ] Style main content with proper heading hierarchy
- [ ] Add Palace × Star matrix table
- [ ] Style table with alternating row colors and semantic tokens

**Test**: Breadcrumb navigates. Sidebar topics switch content. Matrix table displays correctly. Links work.

---

## Phase 6: Polish & Verification

### 6.1. Global Polish

**Files**: Various

**Tasks**:
- [ ] Run through all pages — check for any remaining inline styles that should be migrated
- [ ] Verify dark mode works on all pages
- [ ] Check mobile responsiveness on all routes
- [ ] Run `npm run build` — fix any TypeScript errors
- [ ] Verify no console errors

### 6.2. Accessibility Check

**Files**: All components

**Tasks**:
- [ ] Check color contrast (≥4.5:1) on all key text
- [ ] Verify all interactive elements have focus styles
- [ ] Check keyboard navigation on header, modals, forms
- [ ] Ensure ARIA labels on icon-only buttons

### 6.3. Performance Check

**Tasks**:
- [ ] Verify no layout shift on page load
- [ ] Check Framer Motion animations are 60fps (transform-only)
- [ ] Verify no unnecessary re-renders

---

## Summary

| Phase | Tasks | Files Modified/Created |
|-------|-------|----------------------|
| 1 — Design System | 2 | `globals.css`, `tailwind.config.ts` |
| 2 — Navigation | 3 | `Header.tsx`, `Footer.tsx`, `layout.tsx` |
| 3 — Homepage | 7 | 5 new components + `page.tsx` + `FadeIn.tsx` |
| 4 — Chart Board | 5 | `PalaceCell.tsx`, `ChartBoard.tsx`, `InsightPanel.tsx`, `TimeNav.tsx`, `BirthForm.tsx` |
| 5 — Library/Knowledge | 5 | `library/page.tsx`, `library/[book]/page.tsx`, `library/[book]/[chapter]/page.tsx`, `knowledge/page.tsx`, `knowledge/[star]/[topic]/page.tsx` |
| 6 — Polish | 3 | All |

**Total**: 25 tasks across 6 phases.
