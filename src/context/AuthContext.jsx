import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axios";
import { STORAGE_KEYS, API_ROUTES } from "../constants";

const AuthContext = createContext(null);

/**
 * Provides authentication state and actions to the entire app.
 * Persists token + user to localStorage so sessions survive page refresh.
 */
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.TOKEN),
  );
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return null;
    }
  });

  const login = useCallback(async (email, password) => {
    const { data } = await api.post(API_ROUTES.LOGIN, { email, password });
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (name, email, password, role) => {
    await api.post(API_ROUTES.REGISTER, { name, email, password, role });
  }, []);

  const logout = useCallback(async () => {
    await api.post(API_ROUTES.LOGOUT).catch(() => {});
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setToken(null);
    setUser(null);
  }, []);

  /** Merge partial updates into the current user object in both state and localStorage. */
  const updateUser = useCallback((partial) => {
    setUser((prev) => {
      const updated = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
