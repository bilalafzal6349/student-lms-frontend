import axios from "axios";

/**
 * Pre-configured Axios instance.
 * Attaches JWT from localStorage on every request.
 * On 401, attempts a silent token refresh before retrying once.
 * Falls back to logout if refresh also fails.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const is401 = error.response?.status === 401;
    const isAuthRoute = original?.url?.includes("/auth/");
    const isLoggedIn = !!localStorage.getItem("token");

    // Attempt silent refresh once — skip if already retried or on auth routes
    if (is401 && isLoggedIn && !isAuthRoute && !original._retry) {
      original._retry = true;
      try {
        const { data } = await api.post("/auth/refresh");
        localStorage.setItem("token", data.token);
        original.headers.Authorization = `Bearer ${data.token}`;
        return api(original); // retry original request with new token
      } catch {
        // Refresh failed — clear session and redirect to login
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
