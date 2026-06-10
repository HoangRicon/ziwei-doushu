# Spec: Insight Panel — AI Chat Redesign

## 1. Overview

Redesign the AI chat panel (`InsightPanel.tsx`) with a modern messaging UI. The core streaming logic remains unchanged; only the visual presentation is refreshed.

## 2. Layout

```
┌──────────────────────────────────────────────────────────┐
│ [Topic Tabs]                                    [Close] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐                                        │
│  │ Assistant   │  Message bubbles (alternating)         │
│  │ Avatar      │                                        │
│  └─────────────┘                                        │
│                        ┌────────────────────────────┐   │
│                        │ User message bubble (right) │   │
│                        └────────────────────────────┘   │
│                                                          │
├──────────────────────────────────────────────────────────┤
│ [Auto-scroll textarea]                     [Send Button] │
└──────────────────────────────────────────────────────────┘
```

### Dimensions
- Panel width: fixed `380px` (desktop), full-width sheet (mobile)
- Panel height: `calc(100vh - header - footer)` — full remaining height
- Message area: scrollable, `flex-1`

## 3. Topic Tabs

- Horizontal scrollable tab bar (6 topics)
- Active tab: gold underline + accent text color
- Inactive: muted text color
- Tab bar has bottom border separator

## 4. Message Bubbles

### Assistant Messages (left-aligned)
- Avatar: small circle with star icon
- Bubble: `--color-bg-surface`, left-aligned, max-width `80%`
- Text: `var(--color-text-primary)`
- Streaming: render text as it arrives (keep current streaming logic)
- Markdown: support bold, lists, headers (keep current rendering)

### User Messages (right-aligned)
- No avatar
- Bubble: `--color-ac` tinted background, right-aligned, max-width `70%`
- Text: `var(--color-text-primary)`, white-ish on accent bg

### Empty State
- When no messages: centered illustration + "Chọn một chủ đề và bắt đầu trò chuyện"

### Loading State
- Assistant bubble with animated dots while awaiting response

## 5. Input Area

- Multi-line textarea (auto-grows to max 3 lines)
- Placeholder: "Hỏi về bản đồ của bạn..."
- Send button: gold accent, icon-only or "Gửi" text
- Enter to send (Shift+Enter for newline)
- Disabled state when empty or during streaming

## 6. Accessibility

- All interactive elements keyboard-navigable
- Focus management: focus input after sending
- Screen reader announcements for new messages
- Sufficient color contrast (≥4.5:1)

## 7. Acceptance Criteria

| # | Criterion |
|---|-----------|
| AC-IP-1 | Chat bubble UI with left (assistant) and right (user) alignment |
| AC-IP-2 | 6 topic tabs with active state indicator |
| AC-IPP-3 | Streaming text renders as it arrives |
| AC-IP-4 | Markdown formatting preserved (bold, lists) |
| AC-IP-5 | Empty state displays when no messages |
| AC-IP-6 | Input auto-grows, Enter sends, Shift+Enter newline |
| AC-IP-7 | Panel responsive: fixed width desktop, full-width mobile |
| AC-IP-8 | Keyboard navigation works throughout |
| AC-IP-9 | Color contrast meets WCAG 2.1 AA |
