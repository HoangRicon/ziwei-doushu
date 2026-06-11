# SPEC: Thiết kế lại giao diện Tử Vi Đẩu Số

**Change Name**: `luxury-redesign-2026`
**Date**: 2026-06-12
**Mode**: OpenSpec (Thorough)
**Status**: Draft — pending user confirmation

---

## 1. Vision & Goals

Thiết kế lại toàn bộ giao diện ứng dụng Tử Vi Đẩu Số theo phong cách **Luxury Gold** với:
- Font chữ **Be Vietnam Pro** — font lớn, dễ đọc cho tiếng Việt
- **KHÔNG** có bất kỳ từ tiếng Trung nào trong UI text (source code)
- **KHÔNG** dùng thư viện shadcn/ui — 100% custom CSS
- UI đẹp, sang trọng, chuyên nghiệp hơn phiên bản hiện tại
- Nâng cấp Next.js lên bản mới nhất (hiện tại: 15.5.15)

---

## 2. Design Language

### 2.1 Typography

| Token | Giá trị | Mô tả |
|-------|---------|--------|
| Font chính | `Be Vietnam Pro`, sans-serif | Font lớn, dễ đọc tiếng Việt |
| Font phụ | `Georgia`, serif | Dùng cho tiêu đề trang trọng |
| Font mono | `JetBrains Mono`, monospace | Dùng cho badge SiHua, dữ liệu |

| Cỡ chữ | Giá trị mới | Dùng cho |
|--------|-------------|---------|
| xs | 13px | Labels nhỏ |
| sm | 15px | Text phụ |
| base | **18px** | Body text (tăng từ 16px) |
| lg | 20px | Subheading |
| xl | 24px | Heading phụ |
| 2xl | 30px | Section heading |
| 3xl | 38px | Page heading |
| 4xl | 48px | Hero heading |
| 5xl | 60px | Display heading |

> **Nguyên tắc**: Mọi text trong ứng dụng phải dễ đọc. Không dùng font quá nhỏ dưới 13px cho nội dung tiếng Việt.

### 2.2 Color Palette (Luxury Gold)

#### Light Mode
```
Background:
  --bg-page:    #FDFCF8   (trắng ngà ấm)
  --bg-card:    #FFFFFF   (trắng tinh)
  --bg-1:       #F7F5F0   (kem nhạt)
  --bg-2:       #EFECE5   (kem)

Text:
  --text-primary:   #1A1510   (nâu đen)
  --text-secondary: #2D2820   (nâu)
  --text-body:      #5A5248   (xám nâu)
  --text-muted:     #8A8078   (xám)

Accent:
  --accent:       #9A7A1A   (vàng gold đậm)
  --accent-light: #C8A030   (vàng gold nhạt)
  --accent-bg:    rgba(154,122,26,0.08)

Border:
  --border:       rgba(26,21,16,0.08)
  --border-med:   rgba(26,21,16,0.14)
  --border-gold:  rgba(154,122,26,0.20)
```

#### Dark Mode
```
Background:
  --bg-page:    #0C0A08   (đen ấm)
  --bg-card:    rgba(255,255,255,0.04)
  --bg-1:       #141210
  --bg-2:       #1C1A16

Text:
  --text-primary:   #F0EBE0   (trắng ngà)
  --text-secondary: #D8D0C0   (kem)
  --text-body:      #A09888   (xám kem)
  --text-muted:    #6A6258   (xám)

Accent:
  --accent:       #D4A843   (vàng gold sáng)
  --accent-light: #F0C060   (vàng nhạt)
  --accent-bg:    rgba(212,168,67,0.08)

Border:
  --border:       rgba(255,255,255,0.07)
  --border-med:   rgba(255,255,255,0.12)
  --border-gold:  rgba(212,168,67,0.25)
```

### 2.3 Spacing Scale

```
--space-1: 4px
--space-2: 8px
--space-3: 12px
--space-4: 16px
--space-5: 20px
--space-6: 24px
--space-8: 32px
--space-10: 40px
--space-12: 48px
--space-16: 64px
--space-20: 80px
--space-24: 96px
```

### 2.4 Shadows (Luxury)

```
--shadow-xs:  0 1px 2px rgba(0,0,0,0.04)
--shadow-sm: 0 2px 6px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md: 0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.05)
--shadow-lg: 0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)
--shadow-xl: 0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)
--shadow-gold: 0 0 40px rgba(154,122,26,0.08), 0 4px 20px rgba(0,0,0,0.08)
--shadow-inner-gold: inset 0 0 20px rgba(154,122,26,0.06)
```

### 2.5 Border Radius

```
--radius-sm:  6px
--radius-md: 10px
--radius-lg: 14px
--radius-xl: 20px
--radius-2xl: 28px
--radius-pill: 999px
```

### 2.6 Motion

```
--transition-fast: 0.12s ease
--transition-base: 0.2s ease
--transition-slow: 0.35s ease
--transition-spring: 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 3. Layout System

### 3.1 Container
- Desktop max-width: 1280px (tăng từ 1200px)
- Padding: 24px (desktop), 16px (mobile)
- Centered with `margin: 0 auto`

### 3.2 Grid
- 12-column grid
- Card layout: gap 24px
- Responsive breakpoints: 640px / 768px / 1024px / 1280px

### 3.3 Page Structure
```
Header (fixed, height: 64px)
  └── Logo | Nav Links | Theme Toggle | CTA Button

Main Content
  └── Page-specific layout

Footer
  └── Brand | Links | Copyright
```

---

## 4. Component Redesign

### 4.1 Header

**Trước**:
- Height: 56px
- Nav: text-xs, tracking-wide
- Logo: SVG đơn giản + text "Tử Vi"

**Sau**:
- Height: 64px (tăng)
- Nav: **text-base (18px)**, font-weight 500, tracking-normal
- Logo: SVG cải tiến với glow effect + "Tử Vi Đẩu Số" (dài hơn)
- Background: glass morphism với blur 16px
- Border-bottom: gradient line vàng mỏng
- Sticky với scroll shadow
- Padding nav items tăng: 14px 18px

### 4.2 HeroSection

**Trước**:
- Font: clamp(56px, 10vw, 124px) cho title
- Text: tracking rộng, khó đọc
- Background: gradient đơn giản

**Sau**:
- Title: clamp(48px, 8vw, 96px), font-weight 700, letter-spacing 0.04em
- Subheading: 20px-24px, line-height 1.5, dễ đọc hơn
- Description: **18px**, line-height 1.8, max-width 680px
- Background: layered gradient với texture subtle (giấy dầu/cổ điển)
- CTA Button: pill shape, font 16px, padding 16px 40px
- 14 sao preview: grid 7 cột, text 13px, rounded-lg

### 4.3 Homepage (page.tsx)

**Trước**:
- Philosophy section: font nhỏ (17px-48px)
- Feature cards: compact

**Sau**:
- Philosophy quote: font 22px-40px, line-height 1.6, dễ đọc
- Quote text: 20px-28px, line-height 1.8
- Feature cards: larger padding, text 17px, icon 32px
- 14 Chính tinh section: heading 32px, card text 16px
- Footer CTA: larger, more prominent

### 4.4 Chart Page

**Trước**:
- Page heading: text-xl (24px)
- Palace cell text: nhỏ
- Description text: text-sm (14px)

**Sau**:
- Page heading: text-3xl (38px), font-weight 700
- Palace cell: min-height tăng, padding tăng
- Star names: **16px** (tăng từ ~12px)
- Palace name (Chinese): giữ nguyên vì là nội dung chiêm tinh
- Description text: **17px**, line-height 1.7
- Section labels: **14px**, uppercase, tracking-wide
- Insight panel: text 17px, better readability

### 4.5 Footer

**Trước**:
- Text: text-xs (12px)
- Compact layout

**Sau**:
- Text: **15px** body, **13px** labels
- Heading: **17px**, font-weight 600
- Section spacing tăng
- Brand text: **17px**, line-height 1.6
- Border top: gradient gold line

### 4.6 BirthForm

**Trước**:
- Labels: text-sm
- Inputs: text-base

**Sau**:
- Labels: **16px**, font-weight 500
- Inputs: **18px**, padding 14px 18px
- Button: **17px**, padding 16px 32px
- Error messages: **15px**

### 4.7 TimeNav (Tab navigation)

**Trước**:
- Tab items: text-sm
- Compact spacing

**Sau**:
- Tab items: **16px**, padding 12px 20px
- Active state: bold weight + gold underline
- Smooth transition between tabs

---

## 5. Component Specifications

### 5.1 Buttons

```css
/* Primary Button - Luxury Gold */
.btn-primary {
  padding: 14px 32px;
  border-radius: var(--radius-pill);
  background: var(--accent);
  color: white;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
  border: none;
  cursor: pointer;
  transition: all var(--transition-base);
  box-shadow: 0 2px 8px rgba(154,122,26,0.25);
}
.btn-primary:hover {
  background: var(--accent-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(154,122,26,0.35);
}
.btn-primary:active { transform: translateY(0); }

/* Secondary / Ghost Button */
.btn-ghost {
  padding: 13px 28px;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-secondary);
  font-size: 16px;
  font-weight: 500;
  border: 1.5px solid var(--border-med);
  cursor: pointer;
  transition: all var(--transition-base);
}
.btn-ghost:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-bg);
}

/* Icon Button */
.btn-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all var(--transition-fast);
}
.btn-icon:hover {
  background: var(--accent-bg);
  border-color: var(--accent);
}
```

### 5.2 Cards

```css
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-base);
}
.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--border-gold);
}
.card-luxury {
  background: linear-gradient(135deg, var(--bg-card) 0%, rgba(154,122,26,0.03) 100%);
  border: 1px solid var(--border-gold);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-gold);
}
```

### 5.3 Inputs

```css
.input-luxury {
  width: 100%;
  background: var(--bg-card);
  border: 1.5px solid var(--border-med);
  border-radius: var(--radius-md);
  padding: 14px 18px;
  font-size: 17px;
  color: var(--text-primary);
  font-family: 'Be Vietnam Pro', sans-serif;
  outline: none;
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}
.input-luxury:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}
.input-luxury::placeholder { color: var(--text-muted); }
```

### 5.4 Tabs

```css
.tab-luxury {
  display: inline-flex;
  background: var(--bg-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 4px;
  gap: 4px;
}
.tab-luxury-item {
  padding: 10px 20px;
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 500;
  color: var(--text-muted);
  cursor: pointer;
  border: none;
  background: transparent;
  transition: all var(--transition-base);
  white-space: nowrap;
}
.tab-luxury-item.active {
  background: var(--bg-card);
  color: var(--accent);
  font-weight: 600;
  box-shadow: var(--shadow-xs);
}
```

### 5.5 Badges

```css
.badge-luxury {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: var(--radius-pill);
  font-size: 13px;
  font-weight: 600;
  background: var(--accent-bg);
  color: var(--accent);
  border: 1px solid var(--border-gold);
}
```

---

## 6. Typography Styles

### 6.1 Heading Styles

```css
.heading-display {
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--text-primary);
}
.heading-1 {
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  color: var(--text-primary);
}
.heading-2 {
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 600;
  line-height: 1.3;
  color: var(--text-primary);
}
.heading-3 {
  font-size: clamp(20px, 2vw, 28px);
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-secondary);
}
```

### 6.2 Body Text

```css
.body-large {
  font-size: 19px;
  line-height: 1.8;
  color: var(--text-body);
}
.body {
  font-size: 17px;
  line-height: 1.75;
  color: var(--text-body);
}
.body-small {
  font-size: 15px;
  line-height: 1.65;
  color: var(--text-muted);
}
.caption {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-muted);
  letter-spacing: 0.02em;
}
```

---

## 7. Pages to Redesign

| Trang | File | Mức ưu tiên |
|-------|------|-------------|
| Global CSS | `app/globals.css` | Cao nhất |
| Layout | `app/layout.tsx` | Cao |
| Header | `components/Header.tsx` | Cao |
| Footer | `components/Footer.tsx` | Cao |
| HeroSection | `components/HeroSection.tsx` | Cao |
| Homepage | `app/page.tsx` | Cao |
| Chart page | `app/chart/page.tsx` | Cao |
| ChartBoard | `components/ChartBoard.tsx` | Cao |
| PalaceCell | `components/PalaceCell.tsx` | Cao |
| BirthForm | `components/BirthForm.tsx` | Cao |
| InsightPanel | `components/InsightPanel.tsx` | Cao |
| TimeNav | `components/TimeNav.tsx` | Trung bình |
| Knowledge page | `app/knowledge/page.tsx` | Trung bình |
| Library page | `app/library/page.tsx` | Trung bình |
| Heming page | `app/heming/page.tsx` | Trung bình |
| FeatureCards | `components/FeatureCards.tsx` | Trung bình |
| StarPreviewCards | `components/StarPreviewCards.tsx` | Trung bình |
| HomepageFooter | `components/HomepageFooter.tsx` | Trung bình |

---

## 8. Chinese Text Audit

### Giữ nguyên (Nội dung chiêm tinh - KHÔNG thay đổi):
- Tên 14 Chính tinh: 紫微, 天机, 太阳, 武帝, 天同, 廉贞, 天府, 太阴, 贪狼, 巨门, 天相, 天梁, 七杀, 破军
- Tên 12 Cung: 命宫, 兄弟宫, 夫妻宫, 子女宫, 财帛宫, 疾厄宫, 迁移宫, 交友宫, 官禄宫, 田宅宫, 福德宫, 父母宫
- Tên 12 Địa chi: 子, 丑, 寅, 卯, 辰, 巳, 午, 未, 申, 酉, 戌, 亥
- Tên 10 Thiên can: 甲, 乙, 丙, 丁, 戊, 己, 庚, 辛, 壬, 癸
- SiHua: 禄, 权, 科, 忌
- Tên an sao: 擎羊, 陀罗, 火星, 铃星, 地空, 地劫, etc.
- Tên cổ thư, thuật ngữ chuyên môn trong library

### Cần thay đổi (UI text có tiếng Trung):
Kiểm tra và thay thế tất cả UI labels, buttons, navigation text, tooltips, comments trong source code bằng tiếng Việt.

---

## 9. Technical Approach

### 9.1 Font Loading
```tsx
// app/layout.tsx - Thêm vào head
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
```

### 9.2 CSS Variables (globals.css)
- Thay thế hoàn toàn design token system với Luxury Gold palette
- Tăng font-size base từ 16px lên 18px
- Cập nhật spacing scale
- Cập nhật shadow scale
- Cập nhật border-radius scale

### 9.3 Tailwind Config (tailwind.config.ts)
- Thêm font: Be Vietnam Pro
- Thêm font: JetBrains Mono
- Cập nhật fontSize scale
- Thêm spacing scale
- Thêm animation scale

### 9.4 Component Updates
- Mỗi component: thay hardcoded colors bằng CSS variables
- Thay font-size hardcoded bằng typography classes
- Thêm hover/focus states với transitions
- Cải thiện accessibility (contrast, focus rings)

---

## 10. Acceptance Criteria

1. ✅ Font Be Vietnam Pro được load và sử dụng cho toàn bộ UI text
2. ✅ Font size base tối thiểu 17px cho body text
3. ✅ Không có từ tiếng Trung nào trong UI labels, navigation, buttons, tooltips
4. ✅ Không sử dụng bất kỳ component nào của shadcn/ui
5. ✅ Tất cả components sử dụng CSS variables từ design system
6. ✅ Light mode và dark mode đều đẹp và dễ đọc
7. ✅ Responsive trên mobile, tablet, desktop
8. ✅ Animation mượt, transitions hợp lý
9. ✅ Next.js version mới nhất
10. ✅ Lighthouse score tốt (performance, accessibility, best practices)

---

## 11. Out of Scope

- Thay đổi logic nghiệp vụ (business logic trong lib/ziwei)
- Thay đổi API routes
- Thêm tính năng mới
- Thay đổi nội dung chiêm tinh (tên sao bằng tiếng Trung)
- Thay đổi font cho tên sao (giữ nguyên font Trung Quốc)
