# LearnHub — Frontend

React frontend for the LearnHub LMS. Built with Vite, React Router, Axios, Tailwind CSS v4, and shadcn/ui.

---

## Tech Stack

- React 19 + Vite 8
- React Router v7
- Axios (with JWT interceptor + silent refresh)
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- shadcn/ui components (hand-written, no Radix Dialog/Toast to avoid Vite 8 build issues)
- Lucide React (icons)

---

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── axios.js            # Axios instance with auth interceptor
│   ├── components/
│   │   ├── CourseCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── Spinner.jsx
│   │   └── ui/                 # shadcn/ui primitives
│   │       ├── avatar.jsx
│   │       ├── badge.jsx
│   │       ├── button.jsx
│   │       ├── card.jsx
│   │       ├── confirm-dialog.jsx
│   │       ├── dropdown-menu.jsx
│   │       ├── input.jsx
│   │       ├── label.jsx
│   │       └── separator.jsx
│   ├── context/
│   │   └── AuthContext.jsx     # global auth state
│   ├── lib/
│   │   └── utils.js            # cn() helper
│   ├── pages/
│   │   ├── AboutPage.jsx
│   │   ├── CourseDetailPage.jsx
│   │   ├── CoursesPage.jsx
│   │   ├── ForgotPasswordPage.jsx
│   │   ├── HomePage.jsx
│   │   ├── LoginPage.jsx
│   │   ├── MyCoursesPage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── VerifyEmailPage.jsx
│   │   ├── admin/
│   │   │   └── AdminDashboard.jsx
│   │   └── instructor/
│   │       ├── CourseFormPage.jsx
│   │       ├── InstructorCoursesPage.jsx
│   │       └── LessonsPage.jsx
│   ├── App.jsx                 # route definitions
│   ├── App.css
│   ├── index.css               # Tailwind base styles
│   └── main.jsx
├── .env
├── .env.example
├── .gitignore
├── components.json
├── index.html
├── package.json
├── vercel.json                 # Vercel SPA routing config
└── vite.config.js
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- Backend running at `http://localhost:5000`

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Set environment variable
# .env is already configured for local dev:
# VITE_API_URL=http://localhost:5000/api

# 3. Start dev server
npm run dev
```

App runs at `http://localhost:5173`

---

## Environment Variables

| Variable       | Description          | Example                                   |
| -------------- | -------------------- | ----------------------------------------- |
| `VITE_API_URL` | Backend API base URL | `https://your-backend.up.railway.app/api` |

---

## Deploy to Vercel

1. Push the `frontend/` folder as its own GitHub repo
2. New project on [vercel.com](https://vercel.com) → Import repo
3. Framework preset: **Vite**
4. Root directory: `/` (since this repo IS the frontend)
5. Add env var: `VITE_API_URL = https://your-backend.up.railway.app/api`
6. Deploy

`vercel.json` handles SPA routing so React Router works on direct URL visits.
