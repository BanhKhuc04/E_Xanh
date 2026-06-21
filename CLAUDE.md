# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint check
npm run verify:community-sidebar  # Run community sidebar data integrity check
```

No test suite — verification is done via the `scripts/verify-*.mjs` utilities and manual browser testing.

## Environment Setup

Requires `.env.local` (copy from `.env.example`):
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Without these, the app runs in degraded mock mode (all Supabase calls return an error, no crash).

## Architecture

### Stack
- **React 19** + **Vite 8** SPA, deployed on Vercel
- **Supabase** for Auth, PostgreSQL database, and Storage
- **React Router DOM v6** with `createBrowserRouter`
- **Bootstrap 5** + custom CSS variables (no Tailwind)
- **No Redux** — only `AuthContext` for global auth state

### URL Structure
All routes use Vietnamese slugs: `/meo-tiet-kiem`, `/cong-dong`, `/dang-nhap`, `/kiem-tra-tien-dien`, etc. Admin routes live under `/admin/*`.

### Auth & Roles
- `AuthContext` (`src/contexts/AuthContext.jsx`) provides `{ user, profile, loading }` app-wide
- Roles: `user`, `moderator`, `admin` stored in `profiles.role`
- `isStaff()` / `isAdmin()` helpers in `src/utils/permissions.js`
- `AdminRoute` and `UserRoute` in `src/app/guards/` gate protected pages
- On sign-up, a DB trigger auto-creates a `profiles` row; `syncUserProfile()` in `authService` is the JS fallback

### Service Layer
All Supabase calls go through `src/services/`. Never call `supabase` directly in components.

| Service | Responsibility |
|---------|---------------|
| `authService.js` | Sign in/up/out, password reset, session management |
| `postService.js` | CRUD for posts, community posts, active members |
| `profileService.js` | Profile reads and updates |
| `interactionService.js` | Likes, saves |
| `commentService.js` | Comment CRUD |
| `mediaUploadService.js` | Image/video upload with optimization |
| `electricityService.js` | Electricity check persistence |
| `notificationService.js` / `adminNotificationService.js` | In-app notifications |
| `settingsService.js` | Site-wide settings (banners, announcements) |

### Media Pipeline
Images are optimized to WebP client-side before upload via `src/utils/media/imageOptimizer.js`. Presets are defined in `src/utils/media/mediaConfig.js` (`avatar`, `postCard`, `postDetail`, `bannerHero`, `thumbnail`). `uploadOptimizedImage()` in `mediaUploadService.js` generates multiple size variants and uploads them to Supabase Storage.

Use `<SmartImage>` (`src/components/media/SmartImage.jsx`) for lazy-loaded images with intersection observer. It accepts a `ratio` prop (`16/9`, `4/3`, `1/1`) and handles loading/error states with a branded fallback.

### Post Content Blocks
Community posts use a block-based content structure (`content_blocks` JSON column). The `postBlocks.js` util serializes/deserializes blocks; `PostBlockRenderer` renders them. `extractPlainTextFromBlocks()` generates the plain-text `content` field stored alongside.

### Database Schema
Core tables: `profiles`, `posts`, `categories`, `comments`, `post_likes`, `saved_posts`, `reports`, `devices`, `electricity_checks`. All have RLS enabled. Migrations live in `supabase/migrations/` (date-prefixed). The `public_profiles` view exposes privacy-filtered profile data for public display.

Post `type` values: `tip` (curated tips), `community`, `qa`, `review`.  
Post `status` values: `pending`, `approved`, `rejected`, `hidden`, `blocked`.

### Layout Structure
- `UserLayout` (`src/layouts/user/`) — navbar + footer wrapper for all user-facing pages
- `AdminLayout` (`src/layouts/admin/`) — sidebar + topbar for `/admin/*` pages
- All pages lazy-loaded via `React.lazy` + `Suspense`

### Styling Conventions
CSS custom properties defined in `src/styles/global.css`: `--color-primary-*` (green scale from `#eaf59d` to `#336a29`), `--color-surface`, `--color-border`, `--radius-*`, `--shadow-*`. Font: **Outfit** (loaded via `<link>` in `index.html`). UI language is Vietnamese throughout.
