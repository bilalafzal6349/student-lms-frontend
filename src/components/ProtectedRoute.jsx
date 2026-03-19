import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps a route to require authentication.
 * Optionally restricts to specific roles.
 * @param {string[]} roles - allowed roles; if empty, any authenticated user passes
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user?.role))
    return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
