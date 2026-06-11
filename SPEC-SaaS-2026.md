# SPEC: Nền tảng SaaS Tử Vi Đẩu Số

**Change Name**: `saas-platform-2026`
**Date**: 2026-06-12
**Mode**: OpenSpec (Thorough)
**Status**: Draft — pending user confirmation

---

## 1. Vision & Goals

Biến ứng dụng Tử Vi Đẩu Số thành **nền tảng SaaS đa người dùng** với các tính năng:

1. **Xác thực người dùng** — Đăng nhập nhanh Google OAuth
2. **Quản lý lá số** — Lưu, tải, chia sẻ, xóa lá số
3. **Cơ sở dữ liệu PostgreSQL** — Lưu trữ users, charts, sessions
4. **Tính năng SaaS** — Hồ sơ cá nhân, cài đặt mặc định, lịch sử đầy đủ, chia sẻ công khai

**Triết lý UX**: Người dùng có thể dùng ứng dụng **không cần đăng nhập** (anonymous). Đăng nhập chỉ mở khóa tính năng lưu trữ và quản lý lá số. Mọi thao tác đều có fallback graceful nếu chưa đăng nhập.

---

## 2. Design Language (mở rộng từ SPEC.md hiện tại)

### 2.1 Thêm Auth-specific tokens

```css
/* Auth & SaaS */
--auth-bg: var(--bg-page);
--auth-card-bg: var(--bg-card);
--auth-border: var(--border);
--auth-input-focus: var(--accent);
--auth-btn-google-bg: #4285F4;
--auth-btn-google-hover: #357AE8;
--auth-success: #22C55E;
--auth-error: #EF4444;
--auth-warning: #F59E0B;
```

### 2.2 Font & Typography

Giữ nguyên từ SPEC.md hiện tại (Be Vietnam Pro). Thêm font cho icons.

---

## 3. Data Model (PostgreSQL)

### 3.1 ERD Overview

```
users ──────< user_settings
  │
  │
  └──< ziwei_charts ────< chart_shares
```

### 3.2 Table: users

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email từ Google |
| name | VARCHAR(255) | | Tên hiển thị |
| google_id | VARCHAR(255) | UNIQUE | Google OAuth subject |
| avatar_url | TEXT | | URL avatar Google |
| plan | VARCHAR(50) | DEFAULT 'free' | 'free' \| 'pro' \| 'enterprise' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### 3.3 Table: user_settings

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | uuid | PK | |
| user_id | uuid | FK → users, UNIQUE | |
| default_gender | VARCHAR(10) | DEFAULT 'male' | 'male' \| 'female' |
| default_theme | VARCHAR(10) | DEFAULT 'dark' | 'dark' \| 'light' \| 'system' |
| default_shichen | INTEGER | DEFAULT 0 | Giờ sinh mặc định (0-11) |
| share_public | BOOLEAN | DEFAULT false | Mặc định chia sẻ công khai |
| ai_interpretation | BOOLEAN | DEFAULT true | Bật/tắt AI giải đoán |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

### 3.4 Table: ziwei_charts

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | uuid | PK | |
| user_id | uuid | FK → users, NOT NULL | Chủ sở hữu |
| name | VARCHAR(255) | | Tên lá số (do user đặt) |
| birth_info | JSONB | NOT NULL | { year, month, day, hour, gender, name } |
| lunar_info | JSONB | NOT NULL | { lunarYear, lunarMonth, lunarDay, yearStem, yearBranch, isLeapMonth } |
| chart_data | JSONB | NOT NULL | Toàn bộ ZiweiChart object |
| is_public | BOOLEAN | DEFAULT false | Chia sẻ công khai |
| share_token | VARCHAR(64) | UNIQUE | Token URL chia sẻ ngắn |
| view_count | INTEGER | DEFAULT 0 | Số lượt xem (public chart) |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |
| updated_at | TIMESTAMPTZ | DEFAULT NOW() | |

> **Index**: `idx_charts_user_id ON ziwei_charts(user_id)`, `idx_charts_share_token ON ziwei_charts(share_token)`, `idx_charts_is_public ON ziwei_charts(is_public) WHERE is_public = true`

### 3.5 Table: chart_shares

| Column | Type | Constraints | Mô tả |
|--------|------|-------------|--------|
| id | uuid | PK | |
| chart_id | uuid | FK → ziwei_charts | |
| shared_with_user_id | uuid | FK → users, NULLABLE | NULL = chia sẻ công khai |
| share_type | VARCHAR(20) | NOT NULL | 'link' \| 'invite' |
| expires_at | TIMESTAMPTZ | | NULL = không hết hạn |
| created_at | TIMESTAMPTZ | DEFAULT NOW() | |

---

## 4. Architecture

### 4.1 Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | Hiện có |
| Database | PostgreSQL | Local / Supabase / Neon |
| ORM | Prisma | Type-safe, migrations |
| Auth | NextAuth.js v5 (Auth.js) | Google OAuth |
| API | Next.js Route Handlers | REST API |
| State | React Context + Zustand | Auth state + chart cache |
| Validation | Zod | Schema validation |
| Deployment | Vercel / Railway / Docker | Tùy user chọn |

### 4.2 Authentication Flow (Google OAuth)

```
1. User clicks "Đăng nhập Google"
2. Redirect to Google OAuth consent screen
3. Google returns code → NextAuth handles callback
4. NextAuth creates/finds user in DB
5. JWT session created (30 days)
6. User redirected back, UI updates
```

**Session Strategy**: JWT (stateless) với database adapter cho Prisma.

### 4.3 API Structure

```
app/
├── api/
│   ├── auth/[...nextauth]/route.ts    # NextAuth handlers
│   ├── charts/
│   │   ├── route.ts                   # GET (list), POST (create)
│   │   ├── [id]/route.ts              # GET, PUT, DELETE
│   │   └── [id]/share/route.ts        # POST (share), DELETE (unshare)
│   ├── settings/
│   │   └── route.ts                   # GET, PUT user settings
│   ├── share/[token]/route.ts         # GET public chart by token
│   └── usage/route.ts                  # GET usage stats
```

### 4.4 Directory Structure (Auth & SaaS modules)

```
app/
├── (auth)/
│   ├── login/page.tsx                 # Trang đăng nhập
│   └── layout.tsx                     # Auth-specific layout (no footer)
├── (main)/
│   ├── dashboard/
│   │   ├── page.tsx                   # Dashboard - danh sách lá số
│   │   └── layout.tsx                 # Auth layout
│   ├── settings/
│   │   └── page.tsx                   # Cài đặt tài khoản
│   ├── chart/[id]/page.tsx            # Xem lá số đã lưu
│   └── layout.tsx                     # Main authenticated layout
├── chart/
│   └── page.tsx                       # Existing: anonymous chart (THAY ĐỔI → authenticated)
components/
├── auth/
│   ├── GoogleSignIn.tsx               # Nút Google OAuth
│   ├── UserMenu.tsx                   # Avatar dropdown
│   └── AuthGuard.tsx                  # Redirect if not logged in
├── dashboard/
│   ├── ChartCard.tsx                  # Card lá số trong dashboard
│   ├── ChartList.tsx                  # Danh sách lá số
│   └── EmptyState.tsx                 # Trạng thái trống
├── settings/
│   └── SettingsForm.tsx               # Form cài đặt
lib/
├── auth.ts                            # NextAuth config
├── db.ts                              # Prisma client singleton
├── prisma/
│   └── schema.prisma                  # Prisma schema
└── validators/
    └── chart.ts                       # Zod schemas
```

---

## 5. Feature Specifications

### 5.1 Authentication

#### F1: Google OAuth Login

- **Trigger**: Nút "Đăng nhập Google" trên Header (khi chưa login)
- **Flow**: Redirect → Google consent → Callback → Session
- **Error handling**: Hiển thị toast error nếu Google OAuth thất bại
- **Success state**: Avatar user hiển thị trên Header, dropdown menu

#### F2: Session Persistence

- JWT stored in HTTP-only cookie (NextAuth default)
- Session duration: 30 days (with rolling refresh)
- Sign out: clear session, redirect to homepage

#### F3: Protected Routes

- `/dashboard/*`, `/settings` → require auth
- `/chart/[id]` (saved chart) → require auth (owner) hoặc public
- `/share/[token]` → public, no auth needed
- Anonymous users: vẫn dùng được `/chart` (tạo chart tạm thời)

### 5.2 Chart Management

#### F4: Save Chart

- **Trigger**: Nút "Lưu lá số" trên `/chart` page (chỉ khi đã đăng nhập)
- **Fields**: Tên lá số (input), is_public toggle
- **Behavior**: POST to `/api/charts`, redirect to `/dashboard/[id]`
- **Anonymous fallback**: Nếu chưa đăng nhập → prompt login modal

#### F5: List Charts (Dashboard)

- **Route**: `/dashboard`
- **Display**: Grid 3 cột (desktop), 1 cột (mobile)
- **Each card**: Tên, ngày sinh, ngày tạo, thumbnail preview
- **Actions**: Xem, chỉnh sửa tên, xóa, chia sẻ
- **Empty state**: Illustration + CTA "Tạo lá số đầu tiên"

#### F6: Edit Chart

- **Route**: `/dashboard/chart/[id]`
- **Editable**: Tên lá số, is_public
- **Immutable**: birth_info, chart_data (không thể thay đổi sau khi tạo)

#### F7: Delete Chart

- **Trigger**: Confirm dialog → DELETE `/api/charts/[id]`
- **Behavior**: Soft message "Đã xóa", redirect to dashboard

#### F8: Share Chart

- **Trigger**: Nút "Chia sẻ" trên chart card hoặc chart detail
- **Options**:
  - Copy link chia sẻ (public URL với token)
  - Bật/tắt chế độ công khai
- **Public chart URL**: `/share/[token]` — xem được không cần đăng nhập
- **Token**: 32-char random string, stored in DB

### 5.3 User Settings

#### F9: Profile Settings

- **Route**: `/settings`
- **Fields**:
  - Avatar (hiển thị từ Google, không edit)
  - Name (hiển thị từ Google, không edit)
  - Email (hiển thị từ Google, không edit)
  - Plan badge (free/pro/enterprise)

#### F10: Default Preferences

- Giới tính mặc định
- Chủ đề mặc định
- Giờ sinh mặc định
- Bật AI giải đoán mặc định

#### F11: Account Management

- Đổi email (yêu cầu re-authenticate)
- Xóa tài khoản (cascade delete charts)
- Đăng xuất

### 5.4 SaaS-specific Features

#### F12: Usage Dashboard

- Số lá số đã lưu
- Giới hạn: Free (10 charts), Pro (100), Enterprise (unlimited)
- Hiển thị warning khi gần đạt limit

#### F13: Public Chart Gallery

- `/gallery` — Danh sách charts công khai
- Paginated, searchable
- Ai cũng xem được (không cần đăng nhập)

#### F14: Save Chart for Anonymous User (Hybrid)

- Khi anonymous user tạo chart và nhấn "Lưu":
  - Nếu chưa login → hiện login modal
  - Sau khi login thành công → auto-save chart vừa tạo
  - Dùng session storage để preserve form data

---

## 6. API Specifications

### 6.1 Auth Endpoints (NextAuth handled)

```
POST /api/auth/signin/google    → redirect to Google
POST /api/auth/callback/google  → Google callback
GET  /api/auth/session          → { user, expires }
POST /api/auth/signout          → clear session
```

### 6.2 Chart Endpoints

#### `GET /api/charts`
**Auth**: Required
**Query**: `?page=1&limit=12&search=`
**Response**:
```json
{
  "charts": [...],
  "total": 42,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
```

#### `POST /api/charts`
**Auth**: Required
**Body**:
```json
{
  "name": "Lá số của Minh",
  "birth_info": { "year": 1990, "month": 1, "day": 1, "hour": 0, "gender": "male" },
  "lunar_info": { "lunarYear": 1989, "lunarMonth": 12, "lunarDay": 1, "yearStem": 0, "yearBranch": 0, "isLeapMonth": false },
  "chart_data": { /* full ZiweiChart object */ },
  "is_public": false
}
```
**Response**: `201 Created` with created chart

#### `GET /api/charts/[id]`
**Auth**: Required (owner only)
**Response**: Full chart object

#### `PUT /api/charts/[id]`
**Auth**: Required (owner only)
**Body**: `{ "name": "...", "is_public": true }`

#### `DELETE /api/charts/[id]`
**Auth**: Required (owner only)
**Response**: `204 No Content`

#### `POST /api/charts/[id]/share`
**Auth**: Required (owner only)
**Response**: `{ "share_url": "/share/abc123...", "share_token": "abc123..." }`

#### `DELETE /api/charts/[id]/share`
**Auth**: Required (owner only)
**Response**: `204 No Content`

### 6.3 Settings Endpoints

#### `GET /api/settings`
**Auth**: Required
**Response**: User settings object

#### `PUT /api/settings`
**Auth**: Required
**Body**: Partial user settings

### 6.4 Public Endpoints

#### `GET /api/share/[token]`
**Auth**: None
**Response**: Public chart data (name, birth_info, chart_data only — no user info)

#### `GET /api/gallery`
**Auth**: None
**Query**: `?page=1&limit=12`
**Response**: Paginated list of public charts (limited data)

### 6.5 Usage Endpoint

#### `GET /api/usage`
**Auth**: Required
**Response**:
```json
{
  "charts_count": 7,
  "charts_limit": 10,
  "plan": "free"
}
```

---

## 7. Pages

### 7.1 Auth Pages

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Login | `/login` | Guest only | Google OAuth button, tagline |
| Signup | `/login` | Guest only | Same as login (Google OAuth) |

### 7.2 Protected Pages

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Dashboard | `/dashboard` | Required | Grid lá số đã lưu |
| Chart Detail | `/dashboard/chart/[id]` | Owner | Xem/chỉnh sửa lá số |
| Settings | `/settings` | Required | Cài đặt tài khoản |

### 7.3 Public Pages

| Page | Route | Auth | Description |
|------|-------|------|-------------|
| Share | `/share/[token]` | None | Xem lá số chia sẻ |
| Gallery | `/gallery` | None | Browse public charts |

### 7.4 Modified Existing Pages

| Page | Route | Change |
|------|-------|--------|
| Chart Builder | `/chart` | Thêm nút "Lưu lá số" + "Đăng nhập" prompt |

---

## 8. Component Specifications

### 8.1 Auth Components

#### `components/auth/GoogleSignIn.tsx`
- Button style: Google branding guidelines
- States: default, loading (spinner), error
- Size variants: sm, md, lg

#### `components/auth/UserMenu.tsx`
- Avatar + name dropdown
- Items: Dashboard, Settings, Divider, Sign out
- Click outside to close

#### `components/auth/AuthGuard.tsx`
- HOC or client component wrapper
- Shows loading spinner during session check
- Redirects to `/login?callbackUrl=...` if unauthenticated

#### `components/auth/LoginPrompt.tsx`
- Modal overlay when anonymous user tries to save
- "Đăng nhập để lưu lá số của bạn"
- Google sign-in button inline

### 8.2 Dashboard Components

#### `components/dashboard/ChartCard.tsx`
- Preview thumbnail (mini chart board)
- Title, birth date, created date
- Action menu: View, Share, Delete
- Hover: shadow lift + border glow

#### `components/dashboard/ChartList.tsx`
- Responsive grid
- Pagination controls
- Search bar + filter (all / shared / public)

#### `components/dashboard/EmptyState.tsx`
- Illustration (CSS/SVG)
- Headline: "Chưa có lá số nào"
- CTA: "Tạo lá số đầu tiên" → `/chart`

#### `components/dashboard/UsageBar.tsx`
- Progress bar showing chart count vs limit
- Warning at 80%, error at 100%
- Upgrade CTA if limit reached

### 8.3 Settings Components

#### `components/settings/SettingsForm.tsx`
- Section: Hồ sơ (read-only from Google)
- Section: Cài đặt mặc định (editable)
- Section: Quản lý tài khoản (danger zone)

---

## 9. Security & Privacy

### 9.1 Authorization Rules

| Resource | Owner | Authenticated (not owner) | Anonymous |
|----------|-------|---------------------------|-----------|
| Own charts | CRUD | — | — |
| Public charts | CRUD | Read | Read |
| Private charts | CRUD | 404 | 404 |
| Settings | CRUD | 404 | 404 |

### 9.2 Data Protection

- Chart data: encrypted at rest (Prisma + PostgreSQL)
- Share tokens: cryptographically random (32 bytes hex)
- Rate limiting: 100 requests/minute per IP on API routes
- CORS: restrict to app domain only

### 9.3 Privacy

- Không lưu mật khẩu (Google OAuth only)
- Email không hiển thị công khai
- Public charts: chỉ hiển thị tên + ngày sinh + chart, không user info

---

## 10. Technical Implementation Details

### 10.1 Prisma Schema (summary)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  name         String?
  googleId     String    @unique
  avatarUrl    String?
  plan         String    @default("free")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  settings     UserSettings?
  charts       ZiweiChart[]
}

model UserSettings {
  id               String   @id @default(uuid())
  userId           String   @unique
  user             User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  defaultGender    String   @default("male")
  defaultTheme     String   @default("dark")
  defaultShichen   Int      @default(0)
  sharePublic      Boolean  @default(false)
  aiInterpretation Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

model ZiweiChart {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String?
  birthInfo   Json
  lunarInfo   Json
  chartData   Json
  isPublic    Boolean  @default(false)
  shareToken  String?  @unique
  viewCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 10.2 Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/ziwei_saas?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional
UPGRADE_API_KEY="optional-for-future-payment"
```

### 10.3 Google OAuth Setup

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create OAuth 2.0 Client ID
3. Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID & Secret to `.env.local`

---

## 11. Plan Tiers (for future monetization)

| Feature | Free | Pro | Enterprise |
|---------|------|-----|-----------|
| Charts saved | 10 | 100 | Unlimited |
| Public charts | 3 | 50 | Unlimited |
| Share links | Yes | Yes | Yes |
| AI interpretations | Limited | Unlimited | Unlimited |
| Export PDF | No | Yes | Yes |
| API access | No | No | Yes |

> **Out of scope for v1**: actual payment processing, Stripe integration. Chỉ setup data model và UI.

---

## 12. Out of Scope for v1

- Payment / Stripe / Subscription billing
- Email/password login (Google OAuth only)
- Multi-factor authentication
- Team/Organization accounts
- Charts import/export (PDF, JSON)
- Real-time collaboration
- Push notifications
- Email notifications

---

## 13. Acceptance Criteria

### Auth
- [ ] Google OAuth login flow completes successfully
- [ ] Session persists across page reloads and browser restarts
- [ ] Sign out clears all session data
- [ ] Protected routes redirect to login when unauthenticated

### Chart Management
- [ ] Authenticated users can create, read, update, delete charts
- [ ] Chart data (birth_info, chart_data) saved correctly to PostgreSQL
- [ ] Anonymous users can still use chart builder without login
- [ ] "Save" prompts login modal for anonymous users

### Sharing
- [ ] Share link grants read access to public charts
- [ ] Private charts return 404 for non-owners
- [ ] Toggle public/private works correctly

### Settings
- [ ] User settings persist across sessions
- [ ] Default preferences applied to new charts

### Performance
- [ ] Chart list loads within 500ms (up to 100 charts)
- [ ] Share pages load within 300ms
- [ ] Database queries use proper indexes

### Security
- [ ] No SQL injection vulnerabilities
- [ ] Proper authorization checks on all API routes
- [ ] Rate limiting on API endpoints
- [ ] No sensitive data exposed in public responses
