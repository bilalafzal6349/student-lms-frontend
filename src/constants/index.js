/** User roles */
export const ROLES = Object.freeze({
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
});

/** Badge variant per role — used in Navbar, ProfilePage, AdminDashboard */
export const ROLE_BADGE_VARIANT = Object.freeze({
  admin: "destructive",
  instructor: "info",
  student: "success",
});

/** Course categories — shared between CoursesPage and CourseFormPage */
export const COURSE_CATEGORIES = Object.freeze([
  "Math",
  "Science",
  "Programming",
  "Design",
  "Business",
  "Language",
  "Other",
]);

/** localStorage keys */
export const STORAGE_KEYS = Object.freeze({
  TOKEN: "token",
  USER: "user",
});

/** API route segments used in axios interceptor checks */
export const API_ROUTES = Object.freeze({
  AUTH_PREFIX: "/auth/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
});

/** Admin dashboard tab labels */
export const ADMIN_TABS = Object.freeze(["Users", "Courses", "Analytics"]);

/** Roles available for admin role-change select */
export const ALL_ROLES = Object.freeze([
  ROLES.STUDENT,
  ROLES.INSTRUCTOR,
  ROLES.ADMIN,
]);

/** Registration role options */
export const REGISTER_ROLE_OPTIONS = Object.freeze([
  ROLES.STUDENT,
  ROLES.INSTRUCTOR,
]);

/** Minimum password length */
export const MIN_PASSWORD_LENGTH = 6;

/** Default pagination limit for admin users table */
export const ADMIN_USERS_PAGE_LIMIT = 15;

/** Default pagination limit for courses catalog */
export const COURSES_PAGE_LIMIT = 12;
