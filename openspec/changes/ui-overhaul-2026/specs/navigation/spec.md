# Spec: Navigation — Header & Footer

## 1. Overview

Add a **persistent sticky header** and a **footer** to all pages. Currently there is no navigation component — users have no persistent way to know where they are or navigate between sections.

## 2. Header Component (`components/Header.tsx`)

### Layout
- **Sticky** at top, `z-50`
- Height: `64px` (desktop), `56px` (mobile)
- Background: `var(--color-bg-surface)` with `backdrop-filter: blur(12px)` and semi-transparency
- Border bottom: `1px solid var(--color-border)`

### Content
```
[Logo/Brand] ——————————— [Nav Links] ——————————— [ThemeToggle] [Chart CTA]
```

**Logo/Brand** (left):
- SVG icon: stylized Ziwei star motif (minimal, ~32px)
- Text: "Tử Vi" in accent gold color, font weight 700

**Nav Links** (center):
- `Trang chủ` → `/`
- `Lập chart` → `/chart`
- `Thư viện` → `/library`
- `Kiến thức` → `/knowledge`
- `Hằng sao` → `/heming`
- Active link: accent gold underline + text color
- Hover: subtle gold text color transition
- Mobile: hamburger menu → slide-down panel

**Right side**:
- `ThemeToggle` (existing component, relocate here)
- Optional: `Lập bản đồ` CTA button → `/chart`

### Responsive
- Desktop (≥768px): all links visible, horizontal
- Mobile (<768px): hamburger icon → overlay drawer with all links

## 3. Footer Component (`components/Footer.tsx`)

### Layout
- Full-width, background: `var(--color-bg-surface)`
- Padding: `48px` top/bottom, responsive
- Top border: `1px solid var(--color-border)`

### Content
```
[Brand + tagline]    [Links column]    [Links column]    [Legal column]
```

**Column 1 — Brand**:
- Logo + "Hệ thống chính thống Tử Vi Đẩu Số Nị Hải Hạ"
- Brief tagline: "Khoa học cổ đại, hiểu biết hiện đại"

**Column 2 — Dịch vụ**:
- Lập bản đồ
- Giải đoán
- Hằng sao
- Thư viện kinh điển

**Column 3 — Tài nguyên**:
- Kiến thức Tử Vi
- 14 Chính tinh
- Tứ hóa ngũ hành
- Cổ thư học thuật

**Column 4 — Pháp lý**:
- Điều khoản sử dụng → `/terms`
- Chính sách bảo mật → `/privacy`

**Bottom bar**: Copyright line + version

## 4. Integration

- Add `Header` to `app/layout.tsx` above `{children}`
- Add `Footer` to `app/layout.tsx` below `{children}`
- Ensure header doesn't overlap content (body padding-top or layout padding)

## 5. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-NAV-1 | Header is sticky at top on all pages |
| AC-NAV-2 | All 5 nav links present with correct hrefs |
| AC-NAV-3 | Active link highlighted (current route) |
| AC-NAV-4 | Mobile hamburger menu opens slide-down panel |
| AC-NAV-5 | ThemeToggle moved into header, works correctly |
| AC-NAV-6 | Footer displays on all pages with 4 columns |
| AC-NAV-7 | Footer links navigate to correct pages |
| AC-NAV-8 | No layout overlap between header and page content |
