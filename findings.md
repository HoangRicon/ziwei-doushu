# Findings & Decisions

## Requirements

Từ user request:
1. **Liên kết database PostgreSQL local** — lưu users, charts, settings
2. **Đăng nhập nhanh Google** — OAuth 1-click, không cần password
3. **Quản lý lá số** — lưu, tải, chia sẻ, xóa lá số
4. **Tính năng SaaS** — hồ sơ, cài đặt, usage tracking, gallery, sharing

## Research Findings

### NextAuth.js v5 (Auth.js) — Tháng 6/2026
- NextAuth v5 stable (>= 5.x) là bản mới nhất, dùng App Router
- Cách setup: `npx auth init` hoặc tạo tay `auth.ts`
- Database adapter: `@auth/prisma-adapter`
- Providers: `GoogleProvider()` cho Google OAuth
- Middleware: `auth.ts` as middleware export cho protected routes
- Dùng JWT strategy với Prisma adapter for account linking

### Prisma + PostgreSQL
- Schema: models cho User, UserSettings, ZiweiChart
- Migration: `npx prisma migrate dev --name init`
- Client: `new PrismaClient()` as singleton (avoid multiple connections)
- JSONB fields: `birthInfo Json`, `chartData Json` — lưu nested objects trực tiếp

### Google OAuth Setup
1. Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect: `http://localhost:3000/api/auth/callback/google`
4. Scopes: `email profile openid`
5. Env vars: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`

### PostgreSQL Connection String
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```
Ví dụ local: `postgresql://postgres:password@localhost:5432/ziwei_saas`

### Next.js App Router Auth Pattern
- Middleware exports `auth` function để protect routes
- `getServerSession(authConfig)` trong Server Components
- `useSession()` hook trong Client Components
- Route Groups `(auth)`, `(main)` cho layout separation

### NextAuth Prisma Adapter v5
```
adapter PrismaAdapter(db)
```
Tự động tạo 2 tables: Account, Session. User model cần fields: id, email, emailVerified, name, image.

### Hybrid Auth UX Pattern
1. User tạo chart anonymous
2. Click "Lưu" → LoginPrompt modal
3. Sau khi login → POST chart với session userId
4. Dùng sessionStorage để preserve form data qua redirect

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| NextAuth.js v5 | Official, maintained, best DX cho Next.js App Router |
| Prisma ORM | Type-safe, migrations, great DevX |
| JWT sessions (not DB sessions) | Stateless, scalable, less DB queries |
| JSONB for chart_data | Nested complex objects, PostgreSQL handles well |
| Zod validation | Runtime type safety, integrates với Next.js |
| Route Groups (auth/main) | Clean layout separation |
| middleware.ts for auth | Single source of truth cho protected routes |
| Share tokens (32-char hex) | Cryptographically random, collision-resistant |
| Prisma Account model | Required by NextAuth adapter for OAuth |

## Codebase Analysis

### Current Architecture
- Next.js 15 App Router với TypeScript
- Tailwind CSS + custom CSS (no shadcn/ui)
- Components trong `/components/`
- API routes trong `/app/api/`
- Libs trong `/lib/ziwei/`
- Existing `pg` package cho PostgreSQL (nhưng chưa dùng)
- No auth, no database ORM setup

### Existing Types (lib/ziwei/types.ts)
- `BirthInfo`, `LunarInfo`, `Star`, `Palace`, `ZiweiChart` — sẽ reuse trong Prisma JSONB

### Existing API Routes
- `app/api/generate/route.ts`
- `app/api/heming/route.ts`
- `app/api/interpret/route.ts`

### Existing Components
- 23 components trong `/components/`
- Header, Footer, BirthForm, ChartBoard, PalaceCell, v.v.

### Existing Chart Flow
1. User điền BirthForm → submit
2. POST /api/generate → server tính chart
3. Redirect /chart → display ChartBoard

## Issues Encountered

| Issue | Resolution |
|-------|------------|
| (none yet) | |

## Resources

- NextAuth v5: https://authjs.dev/getting-started/installation?framework=Next.js
- Prisma + NextAuth: https://authjs.dev/reference/adapters/prisma
- Google OAuth: https://console.cloud.google.com/apis/credentials
- Prisma PostgreSQL: https://www.prisma.io/docs/orm/overview/databases/postgresql

## Visual/Browser Findings

- (none yet)
