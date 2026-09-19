import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "../utils/jwt";

/**
 * Shared guard for authenticated (optionally role-restricted) routes.
 *
 * - No token, or an expired token -> /login (and remember where they were
 *   headed, via `state.from`, so Login can send them back after signing in).
 * - Token present but role not in `allowedRoles` -> /unauthorized.
 * - Otherwise renders `children`.
 *
 * A single implementation here (instead of one copy per role) keeps the
 * expiry check and the "read from Redux, not raw localStorage" rule
 * consistent everywhere, rather than risking the checks drifting apart.
 */
export default function RoleRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { token, user } = useSelector((state) => state.auth);

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
