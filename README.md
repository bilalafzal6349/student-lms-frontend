# LearnHub — Frontend

React SPA for the LearnHub LMS platform. Supports three roles — **student**, **instructor**, and **admin** — each with their own protected views and workflows.

---

## Project Overview

LearnHub is a full-stack Learning Management System. This repository is the **frontend only**. It communicates with the [LearnHub Backend](../backend/README.md) via a REST API.

### How it works

1. A visitor can browse courses and view course details without logging in.
2. On registration the user picks a role (student or instructor). Email verification is required before login.
3. After login, a JWT access token is stored in `localStorage`. A `HttpOnly` refresh cookie is set by the backend. The Axios interceptor silently refreshes the access token on 401 responses so the session stays alive without re-login.
4. `ProtectedRoute` checks the token and the user's role before rendering any private page. Unauthenticated users are redirected to `/login`; wrong-role users are redirected to `/`.
5. `AuthContext` holds the current user object in React state and keeps it in sync with `localStorage`. The `updateUser()` helper lets any page merge partial updates (e.g. new avatar URL) into both state and storage without a full re-login.

### Role workflows

| Role       | What they can do                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------- |
| Student    | Browse & search courses, enroll, track progress, leave reviews, manage profile                  |
| Instructor | Create / edit / delete their own courses, manage lessons, upload thumbnails, manage profile     |
| Admin      | View all users & courses, change user roles, delete any user or course, view platform analytics |

---

## Technologies Used

| Technology               | Version      | Purpose                                                                      |
| ------------------------ | ------------ | ---------------------------------------------------------------------------- |
| React                    | 19           | UI library                                                                   |
| Vite                     | 8            | Build tool & dev server                                                      |
| React Router             | v7           | Client-side routing                                                          |
| Axios                    | ^1.13        | HTTP client with JWT interceptor & silent refresh                            |
| Tailwind CSS             | v4           | Utility-first styling via `@tailwindcss/vite` plugin (no config file needed) |
| shadcn/ui                | hand-written | UI primitives (Button, Card, Badge, Input, Avatar, etc.)                     |
| Radix UI                 | various      | Headless primitives for Dropdown, Label, Separator, Slot                     |
| Lucide React             | ^0.577       | Icon set                                                                     |
| class-variance-authority | ^0.7         | Variant-based component styling                                              |
| clsx + tailwind-merge    | latest       | Conditional class merging (`cn()` helper)                                    |



---

## Project Structure

```
frontend/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── api/
│   │   └── axios.js              # Axios instance — attaches Bearer token, handles silent refresh
│   ├── components/
│   │   ├── CourseCard.jsx        # Reusable course card for listings
│   │   ├── Navbar.jsx            # Responsive navbar with role-based links, mobile Sheet
│   │   ├── ProtectedRoute.jsx    # Role-aware route guard
│   │   ├── Spinner.jsx           # Loading indicator
│   │   └── ui/                   # shadcn/ui primitives (hand-written)
│   │       ├── avatar.jsx        # Plain React avatar (no Radix)
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── confirm-dialog.jsx # Portal-based confirm dialog + useConfirm hook
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       ├── separator.jsx
│   │       └── sheet.jsx         # Plain React portal slide-over (no Radix)
│   ├── constants/
│   │   └── index.js              # ROLES, COURSE_CATEGORIES, STORAGE_KEYS, API_ROUTES, etc.
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state — user, token, login, logout, updateUser
│   ├── lib/
│   │   └── utils.js              # cn() — clsx + tailwind-merge
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── CourseDetailPage.jsx  # Course info, enroll button, lessons list, reviews
│   │   ├── CoursesPage.jsx       # Public catalog — search, category filter, pagination
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyCoursesPage.jsx     # Student enrolled courses with progress bars
│   │   ├── ProfilePage.jsx       # Avatar upload, name/bio edit, password change
│   │   ├── RegisterPage.jsx      # Role picker + registration form
│   │   ├── VerifyEmailPage.jsx   # Handles email verification token from URL
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx  # Users table, courses table, analytics
│   │   └── instructor/
│   │       ├── CourseFormPage.jsx  # Create / edit course with thumbnail upload
│   │       ├── InstructorCoursesPage.jsx
│   │       └── LessonsPage.jsx     # Add / delete lessons per course
│   ├── App.jsx                   # BrowserRouter + all route definitions
│   ├── App.css
│   ├── index.css                 # Tailwind v4 base import
│   └── main.jsx                  # React DOM entry point
├── .env                          # Local env vars (gitignored)
├── .env.example                  # Template for env vars
├── .gitignore
├── components.json               # shadcn/ui config
├── index.html
├── jsconfig.json                 # Path alias @ → src/
├── package.json
├── vercel.json                   # SPA rewrite rule for React Router
└── vite.config.js
```

---

## Routes

| Path                              | Access     | Page                                  |
| --------------------------------- | ---------- | ------------------------------------- |
| `/`                               | Public     | Home                                  |
| `/about`                          | Public     | About                                 |
| `/courses`                        | Public     | Course catalog                        |
| `/courses/:id`                    | Public     | Course detail                         |
| `/login`                          | Public     | Login                                 |
| `/register`                       | Public     | Register                              |
| `/forgot-password`                | Public     | Password reset                        |
| `/profile`                        | All roles  | Profile — avatar, name, bio, password |
| `/my-courses`                     | Student    | Enrolled courses + progress           |
| `/instructor/courses`             | Instructor | My courses list                       |
| `/instructor/courses/new`         | Instructor | Create course                         |
| `/instructor/courses/:id/edit`    | Instructor | Edit course                           |
| `/instructor/courses/:id/lessons` | Instructor | Manage lessons                        |
| `/admin`                          | Admin      | Dashboard — users, courses, analytics |

---

## Key Patterns

**Auth flow**

- `login()` stores `token` + `user` in `localStorage` and React state.
- Axios request interceptor attaches `Authorization: Bearer <token>` to every request.
- On 401, the response interceptor calls `POST /auth/refresh` (uses the `HttpOnly` cookie), stores the new token, and retries the original request once.
- `logout()` clears both `localStorage` and React state, then calls `POST /auth/logout` to clear the cookie.

**Avatar / thumbnail uploads**

- Files are sent as `multipart/form-data` to `POST /api/upload/avatar` or `POST /api/upload/thumbnail`.
- The backend uploads to Cloudinary and returns a `secure_url`.
- `updateUser({ avatar: url })` in `AuthContext` merges the new URL into React state and `localStorage` so the Navbar reflects the change immediately without a page reload.

**Confirm dialogs**

- `ConfirmProvider` wraps the app in `App.jsx`.
- Any component calls `const confirm = useConfirm()` then `await confirm({ title, description })` — returns `true` / `false`.
- Implemented as a plain React portal to avoid Radix Dialog's `react-remove-scroll` dependency.

---

## Installation

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000` (see [backend README](../backend/README.md))

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — set VITE_API_URL if your backend runs on a different port

# 3. Start dev server
npm run dev
```

App runs at `http://localhost:5173`.

### Other commands

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
npm run lint     # ESLint
```

---

## Environment Variables

| Variable       | Description          | Default                     |
| -------------- | -------------------- | --------------------------- |
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## Deployment (Vercel)

1. Push the `frontend/` folder as its own GitHub repository.
2. Create a new project on [vercel.com](https://vercel.com) and import the repo.
3. Framework preset: **Vite**. Root directory: `/`.
4. Add environment variable: `VITE_API_URL = https://your-backend.up.railway.app/api`
5. Deploy.

`vercel.json` contains a catch-all rewrite (`/* → /index.html`) so React Router works on direct URL visits and page refreshes.
