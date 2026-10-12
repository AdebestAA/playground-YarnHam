# YarnHam

YarnHam is a full-stack blogging platform — write posts with images, like and comment, and manage your profile. Monorepo with an Express + PostgreSQL + Redis API and a React + Vite + Tailwind single-page app.

## Tech stack

| Layer | Technologies |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, TanStack React Query 5, Zustand, React Router 6, react-hot-toast, lucide-react, Zod |
| **Backend** | Node.js, Express 5, TypeScript, Zod validation, Helmet, rate limiting |
| **Data** | PostgreSQL (raw SQL with a repository layer), Redis (sessions, caching) |
| **Integrations** | JWT auth (access token + Redis-backed refresh sessions), Cloudflare R2 / S3-compatible image storage, Cloudinary, Brevo transactional email, BullMQ scaffolding |

## Features

- **Authentication** — register with email OTP verification, sign-in, silent token refresh, multi-device refresh sessions stored in Redis, logout / logout-all, forgot & reset password with 6-digit codes.
- **Posts** — create posts with up to 4 images (uploaded to R2), feed with like/comment counts, edit and delete your own posts, like toggle.
- **Comments** — comment on any post from the post detail page.
- **Profile** — update nickname / first / last name and upload a validated avatar.
- **Security** — Helmet, rate limiting on auth-sensitive endpoints, Zod body/query validation, CORS locked to the frontend origin.
- **UX** — responsive marketing page, protected/guest routes, mobile bottom tab bar, skeletons, toasts.

## Project structure

```
.
├── backend/
│   ├── src/
│   │   ├── config/           # DB, Redis, R2/Cloudinary, environment config
│   │   ├── db/               # connection pool + SQL migrations
│   │   ├── middlewares/      # auth, validation, rate limit, error handler
│   │   ├── modules/
│   │   │   ├── auth-module/  # register/verify/refresh/password controllers + routes
│   │   │   ├── post-module/  # posts, likes
│   │   │   ├── comment-module/
│   │   │   └── account/      # profile reads/updates, avatar upload
│   │   ├── queues/           # BullMQ email queue scaffolding
│   │   └── workers/          # BullMQ worker scaffolding
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/       # layout + ui primitives (Button, Input, Spinner…)
    │   ├── hooks/            # React Query hooks (auth, posts, comments, account)
    │   ├── lib/              # axios instance w/ token refresh interceptor
    │   ├── pages/            # Home, auth, blog, account
    │   └── stores/           # Zustand auth store
    └── package.json
```

## Getting started

### Prerequisites

Node.js 20+, PostgreSQL, Redis.

### 1. Backend

```bash
cd backend
npm install
```

Create a `.env` (see `.env.example`):

```ini
DATABASE_URL=postgres://user:password@localhost:5432/yarnham
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
BREVO_API_KEY=...
FRONTEND_URL=http://localhost:5179
NODE_ENV=development

# Image uploads (Cloudflare R2)
R2_ENDPOINT=...
R2_BUCKET=...
R2_PUBLIC_URL=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...

# Optional — Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

Then run migrations and start the API:

```bash
npm run migrate   # applies SQL files in src/db/migrations
npm run dev       # http://localhost:8000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev       # http://localhost:5179
```

The API base URL is currently hardcoded to `http://localhost:8000/api` in `frontend/src/lib/api.ts`.

## Scripts

| Where | Command | Description |
| --- | --- | --- |
| backend | `npm run dev` | Start API with nodemon |
| backend | `npm run build` | Compile TypeScript and copy migrations to `dist` |
| backend | `npm start` | Run compiled build |
| backend | `npm run migrate` | Apply database migrations |
| frontend | `npm run dev` | Start Vite dev server on port 5179 |
| frontend | `npm run build` | Type-check (`tsc -b`) + production build |
| frontend | `npm run lint` | ESLint |

## API overview

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/auth/register` | Create account (sends email verification code) |
| POST | `/auth/signin` | Sign in (returns access token; sets refresh cookie) |
| POST | `/auth/email-verify` | Verify email with 6-digit code |
| POST | `/auth/resend-verification` | Resend verification code |
| POST | `/auth/refresh` | Rotate refresh session, new access token |
| POST | `/auth/logout` | Revoke current refresh session |
| POST | `/auth/forgot-password` | Send password reset code |
| POST | `/auth/reset-password` | Reset password with code |
| POST | `/auth/google` | Google OAuth sign-in |
| GET | `/posts` | Feed with like/comment counts |
| POST | `/posts` | Create post (multipart, up to 4 images) |
| GET | `/posts/:id` | Single post |
| PATCH | `/posts/:id` | Edit own post |
| POST | `/posts/likes/:id` | Toggle like |
| POST | `/comments` | Create comment |
| GET | `/comments/:id` | Comments for a post |
| GET | `/accounts` | Current user profile |
| PATCH | `/accounts` | Update profile fields |
| POST | `/accounts/profile-pic` | Upload avatar (multipart) |

## Notes

- Access tokens are JWTs stored in `localStorage`; refresh sessions live in Redis and are sent as http-only cookies.
- BullMQ queue/worker files exist under `backend/src/queues` and `backend/src/workers` as scaffolding for background email jobs.
- Google OAuth endpoints exist on the backend, but the Google buttons in the frontend UI are currently disabled.
- Frontend icons come exclusively from [lucide-react](https://lucide.dev).
