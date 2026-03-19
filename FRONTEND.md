# Frontend Architecture — LearnHub LMS

Detailed technical reference for the frontend codebase.

---

## How Data is Fetched from the Backend

All API communication goes through a single Axios instance at `src/api/axios.js`.

### Axios Instance (`src/api/axios.js`)

```js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // sends HttpOnly refresh token cookie automatically
});
```

**Request interceptor** — attaches the JWT access token from `localStorage` to every request:

```
Authorization: Bearer <token>
```

**Response interceptor** — on 401 (token expired):

1. Calls `POST /api/auth/refresh` silently (browser sends the HttpOnly cookie automatically)
2. Stores the new access token in `localStorage`
3. Retries the original failed request once
4. If refresh also fails → clears localStorage and redirects to `/login`

This means the user never sees a login prompt unless their session has fully expired.

---

## Auth State (`src/context/AuthContext.jsx`)

Wraps the entire app. Provides:

| Value / Function                        | Description                                                |
| --------------------------------------- | ---------------------------------------------------------- |
| `user`                                  | Current user object `{ _id, name, email, role }` or `null` |
| `isAuthenticated`                       | Boolean                                                    |
| `loading`                               | True while checking localStorage on first load             |
| `login(email, password)`                | Calls `POST /api/auth/login`, stores token + user          |
| `register(name, email, password, role)` | Calls `POST /api/auth/register`                            |
| `logout()`                              | Calls `POST /api/auth/logout`, clears localStorage         |

On app load, `AuthContext` reads `token` and `user` from `localStorage` to restore session without a network call.

---

## Route Protection (`src/components/ProtectedRoute.jsx`)

```jsx
<ProtectedRoute roles={["instructor"]}>
  <InstructorCoursesPage />
</ProtectedRoute>
```

- If not authenticated → redirects to `/login`
- If authenticated but wrong role → redirects to `/`
- Accepts an array of allowed roles

---

## Pages and What They Fetch

### Public Pages

| Page                 | API Calls                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `HomePage`           | `GET /courses` (featured courses)                                |
| `CoursesPage`        | `GET /courses?search=&category=&page=`                           |
| `CourseDetailPage`   | `GET /courses/:id`, `GET /courses/:id/reviews`                   |
| `AboutPage`          | None                                                             |
| `LoginPage`          | `POST /auth/login`                                               |
| `RegisterPage`       | `POST /auth/register`                                            |
| `VerifyEmailPage`    | `GET /auth/verify-email?token=`                                  |
| `ForgotPasswordPage` | `POST /auth/password-reset`, `POST /auth/password-reset/confirm` |

### Student Pages

| Page               | API Calls                                                          |
| ------------------ | ------------------------------------------------------------------ |
| `MyCoursesPage`    | `GET /my-courses`                                                  |
| `ProfilePage`      | `GET /users/:id`, `PUT /users/:id`, `PUT /users/:id/password`      |
| `CourseDetailPage` | `POST /enroll`, `POST /courses/:id/reviews`, `DELETE /reviews/:id` |

### Instructor Pages

| Page                    | API Calls                                                                      |
| ----------------------- | ------------------------------------------------------------------------------ |
| `InstructorCoursesPage` | `GET /courses/my`, `DELETE /courses/:id`                                       |
| `CourseFormPage`        | `POST /courses` (create), `GET /courses/:id` + `PUT /courses/:id` (edit)       |
| `LessonsPage`           | `GET /courses/:id`, `POST /lessons`, `PUT /lessons/:id`, `DELETE /lessons/:id` |

### Admin Pages

| Page                             | API Calls                                                        |
| -------------------------------- | ---------------------------------------------------------------- |
| `AdminDashboard` (Users tab)     | `GET /users?page=`, `PATCH /users/:id/role`, `DELETE /users/:id` |
| `AdminDashboard` (Courses tab)   | `GET /courses?page=`, `DELETE /courses/:id`                      |
| `AdminDashboard` (Analytics tab) | `GET /courses/analytics`                                         |

---

## Component Library (`src/components/ui/`)

Hand-written shadcn/ui-style components. No `@radix-ui/react-dialog` or `@radix-ui/react-toast` — those pull in `react-remove-scroll` which breaks the Vite 8 / Rolldown build.

| Component            | Description                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------ |
| `button.jsx`         | Variants: default, destructive, outline, ghost, link. Sizes: default, sm, lg, icon         |
| `card.jsx`           | Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter                      |
| `badge.jsx`          | Variants: default, secondary, destructive, success, info                                   |
| `input.jsx`          | Styled text input                                                                          |
| `label.jsx`          | Form label                                                                                 |
| `avatar.jsx`         | Avatar + AvatarFallback (initials)                                                         |
| `dropdown-menu.jsx`  | DropdownMenu, Trigger, Content, Item, Separator                                            |
| `separator.jsx`      | Horizontal/vertical divider                                                                |
| `confirm-dialog.jsx` | `ConfirmProvider` + `useConfirm()` hook — replaces browser `confirm()` with a styled modal |

### Using `useConfirm`

```jsx
// Wrap app in ConfirmProvider (done in App.jsx)
const confirm = useConfirm();

const handleDelete = async () => {
  const ok = await confirm({
    title: 'Delete "My Course"?',
    description: "This cannot be undone.",
  });
  if (!ok) return;
  await api.delete(`/courses/${id}`);
};
```

---

## Styling

Tailwind CSS v4 loaded via the `@tailwindcss/vite` Vite plugin — no `tailwind.config.js` needed.

Path alias `@` maps to `src/` — configured in `vite.config.js` and `jsconfig.json`:

```js
import { Button } from "@/components/ui/button";
```

---

## Key Design Decisions

- **No Radix Dialog/Toast** — avoided due to Vite 8 / Rolldown `tslib` build issue
- **`tslib` in dependencies** (not devDependencies) — required for Rolldown compatibility
- **HttpOnly cookie for refresh token** — never accessible to JS, prevents XSS token theft
- **Access token in localStorage** — short-lived (15min), acceptable tradeoff for simplicity
- **Silent token refresh** — handled in Axios interceptor, transparent to all pages
