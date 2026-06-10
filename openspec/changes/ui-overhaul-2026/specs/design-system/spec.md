# Spec: Design System

## 1. Overview

Establish a **3-layer token system** as the single source of truth for all styling, replacing the current mixed approach of inline styles + CSS variables + Tailwind utilities.

## 2. Token Architecture

### Layer 1 — Primitive Tokens (CSS Variables in `globals.css`)

These are raw values. No component should reference these directly.

```
--primitive-gold-50: #FEF9E7
--primitive-gold-100: #FCF0C0
--primitive-gold-200: #F8DF80
--primitive-gold-300: #EDC840
--primitive-gold-400: #D4A843
--primitive-gold-500: #B8922A
--primitive-gold-600: #8A6D1A
--primitive-gold-700: #5C4810

--primitive-bg-dark: #020810
--primitive-bg-dark-1: #0A1020
--primitive-bg-dark-2: #141E30

--primitive-text-dark: #E8EEF6
--primitive-text-dark-2: #9DB0D0
--primitive-text-dark-3: #6A7A96
```

### Layer 2 — Semantic Tokens (CSS Variables in `globals.css`)

Component-agnostic roles. References primitive tokens.

```
--color-bg-page: var(--primitive-bg-page)
--color-bg-surface: var(--primitive-bg-surface)
--color-text-primary: var(--primitive-text-primary)
--color-accent: var(--primitive-gold-500)
--color-border: var(--primitive-border)
--space-component-gap: 16px
--radius-card: 12px
```

### Layer 3 — Component Tokens (via Tailwind `extend` + CSS variables)

Component-specific roles. References semantic tokens.

```
.bg-surface { background: var(--color-bg-surface); }
.text-heading { color: var(--color-text-primary); }
.border-card { border-color: var(--color-border); }
```

## 3. Typography Scale

| Token | Size | Weight | Usage | Tailwind class |
|-------|------|--------|-------|---------------|
| `--text-xs` | 12px | 400 | Labels, captions | `text-xs` |
| `--text-sm` | 14px | 400 | Body small, metadata | `text-sm` |
| `--text-base` | 16px | 400 | Body text | `text-base` |
| `--text-lg` | 18px | 500 | Subheadings | `text-lg` |
| `--text-xl` | 20px | 600 | Section headings | `text-xl` |
| `--text-2xl` | 24px | 700 | Page headings | `text-2xl` |
| `--text-3xl` | 30px | 700 | Hero subheadings | `text-3xl` |
| `--text-4xl` | 36px | 800 | Hero headings | `text-4xl` |
| `--text-5xl` | 48px | 800 | Display | `text-5xl` |

Line height: `1.2` for headings, `1.6` for body.
Letter spacing: `-0.02em` for large headings, `0.05em` for all-caps labels.

## 4. Si Hua Color Tokens

Keep existing `--lu`, `--quan`, `--ke`, `--ji` but document them as **data tokens** (not UI tokens). Add semantic aliases:

```
--color-sihua-lu: var(--lu);     /* 化禄 green */
--color-sihua-quan: var(--quan);  /* 化权 blue */
--color-sihua-ke: var(--ke);     /* 化科 yellow */
--color-sihua-ji: var(--ji);     /* 化忌 red */
```

## 5. Dark Mode Tokens

All semantic tokens must have both light and dark values under `:root` and `[data-theme="dark"]`. No hardcoded colors in component files.

## 6. Migration Rules

1. All inline `style={...}` objects must be replaced with Tailwind classes or CSS variable references.
2. CSS variables like `var(--t-bg)`, `var(--t-faint)` (if they exist in globals.css) must be renamed to semantic names.
3. Tailwind color utilities (`text-amber-500`, `bg-slate-900`) must not appear in component files — use semantic token classes instead.
4. Star brightness colors (amber-300, amber-700/80) are **data colors** — allowed to stay as-is since they represent star brightness data.

## 7. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-DS-1 | `globals.css` defines 3-layer token system with clear comments |
| AC-DS-2 | `tailwind.config.ts` extends with semantic token aliases |
| AC-DS-3 | All inline `style` props in components migrated to Tailwind or CSS variable references |
| AC-DS-4 | Dark mode fully defined for all semantic tokens |
| AC-DS-5 | No hardcoded hex colors in component files (data colors excluded) |
| AC-DS-6 | Typography scale documented and consistent across all pages |
