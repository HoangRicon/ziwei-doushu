# Task Plan: Nền tảng SaaS Tử Vi Đẩu Số

## Goal

Biến ứng dụng Tử Vi Đẩu Số thành nền tảng SaaS đa người dùng với PostgreSQL, Google OAuth, và các tính năng quản lý lá số.

## Current Phase

Phase 2: Planning & Structure

## Spec Reference

`SPEC-SaaS-2026.md` — đã confirmed bởi user (2026-06-12)

## Phases

### Phase 1: Requirements & Discovery
- [x] Hiểu yêu cầu user
- [x] Đọc codebase hiện tại
- [x] Viết SPEC-SaaS-2026.md
- [x] User xác nhận spec
- **Status:** complete

### Phase 2: Planning & Structure
- [x] Tạo task_plan.md
- [x] Tạo findings.md
- [x] Tạo progress.md
- [ ] User xác nhận plan (Gate G2)
- **Status:** in_progress

### Phase 3: Setup Infrastructure
- [ ] Cài đặt Prisma và dependencies
- [ ] Viết Prisma schema
- [ ] Cấu hình NextAuth.js với Google OAuth
- [ ] Setup .env.local với database + auth vars
- [ ] Chạy Prisma migration
- **Status:** pending

### Phase 4: Auth Module
- [ ] Tạo app/(auth)/login/page.tsx
- [ ] Tạo components/auth/GoogleSignIn.tsx
- [ ] Tạo components/auth/UserMenu.tsx
- [ ] Tạo components/auth/AuthGuard.tsx
- [ ] Tạo components/auth/LoginPrompt.tsx
- [ ] Cập nhật Header thêm auth UI
- [ ] Tạo lib/auth.ts (NextAuth config)
- [ ] Tạo app/api/auth/[...nextauth]/route.ts
- **Status:** pending

### Phase 5: Database & API Layer
- [ ] Tạo lib/db.ts (Prisma singleton)
- [ ] Tạo app/api/charts/route.ts (GET list, POST create)
- [ ] Tạo app/api/charts/[id]/route.ts (GET, PUT, DELETE)
- [ ] Tạo app/api/charts/[id]/share/route.ts
- [ ] Tạo app/api/settings/route.ts
- [ ] Tạo app/api/share/[token]/route.ts
- [ ] Tạo app/api/gallery/route.ts
- [ ] Tạo app/api/usage/route.ts
- [ ] Tạo lib/validators/chart.ts (Zod schemas)
- **Status:** pending

### Phase 6: Dashboard & Chart Management
- [ ] Tạo app/(main)/dashboard/page.tsx
- [ ] Tạo components/dashboard/ChartCard.tsx
- [ ] Tạo components/dashboard/ChartList.tsx
- [ ] Tạo components/dashboard/EmptyState.tsx
- [ ] Tạo components/dashboard/UsageBar.tsx
- [ ] Tạo app/(main)/dashboard/chart/[id]/page.tsx
- [ ] Tạo app/(main)/layout.tsx (auth guard)
- **Status:** pending

### Phase 7: Settings Page
- [ ] Tạo app/(main)/settings/page.tsx
- [ ] Tạo components/settings/SettingsForm.tsx
- **Status:** pending

### Phase 8: Share & Gallery Pages
- [ ] Tạo app/share/[token]/page.tsx
- [ ] Tạo app/gallery/page.tsx
- **Status:** pending

### Phase 9: Integration & UX Polish
- [ ] Cập nhật app/chart/page.tsx thêm nút "Lưu lá số"
- [ ] Hybrid flow: anonymous → login → auto-save
- [ ] Cập nhật Header cho authenticated users
- [ ] Toast notifications cho auth actions
- **Status:** pending

### Phase 10: Testing & Verification
- [ ] Test Google OAuth flow end-to-end
- [ ] Test chart CRUD operations
- [ ] Test share/public access
- [ ] Verify all acceptance criteria from SPEC
- **Status:** pending

## Key Questions

1. PostgreSQL connection string là gì? (cần DATABASE_URL)
2. Google OAuth credentials đã có chưa? (cần GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET)
3. Deployment target? (Vercel / Railway / Docker / local)

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Prisma ORM | Type-safe, migrations, great DX với Next.js |
| NextAuth.js v5 (Auth.js) | Official Next.js auth solution, JWT + DB adapter |
| JWT sessions | Stateless, scalable, works well với Prisma adapter |
| Hybrid auth (anonymous-first) | Giảm friction, user có thể thử trước khi đăng ký |
| Zod validation | Runtime type safety cho API inputs |
| Chart data stored as JSONB | chart_data là complex nested object, JSONB tối ưu hơn JSON |
| Share tokens là 32-char hex | Cryptographically random, collision-resistant |

## File Structure

```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── layout.tsx
├── (main)/
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── chart/[id]/page.tsx
│   ├── settings/page.tsx
│   └── layout.tsx
├── share/[token]/page.tsx
├── gallery/page.tsx
└── api/
    ├── auth/[...nextauth]/route.ts
    ├── charts/
    │   ├── route.ts
    │   └── [id]/
    │       ├── route.ts
    │       └── share/route.ts
    ├── settings/route.ts
    ├── share/[token]/route.ts
    ├── gallery/route.ts
    └── usage/route.ts

components/
├── auth/
│   ├── GoogleSignIn.tsx
│   ├── UserMenu.tsx
│   ├── AuthGuard.tsx
│   └── LoginPrompt.tsx
├── dashboard/
│   ├── ChartCard.tsx
│   ├── ChartList.tsx
│   ├── EmptyState.tsx
│   └── UsageBar.tsx
└── settings/
    └── SettingsForm.tsx

lib/
├── auth.ts
├── db.ts
└── validators/
    └── chart.ts

prisma/
└── schema.prisma

.env.local (update)
.env.example (new)
```

## Errors Encountered

| Error | Attempt | Resolution |
|-------|---------|------------|
| (none yet) | | |
