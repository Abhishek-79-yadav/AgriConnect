import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { isTokenExpired } from "../utils/jwt";

/**
 * For routes like /login and /register: if the user already has a valid
 * session, send them straight to their role's dashboard instead of
 * showing the login form again.
 *
 * Previously this checked `state.auth.isAuthenticated`, a field the auth
 * slice never actually sets — so the check was always false and this
 * route never redirected anyone. Deriving from token + expiry (the same
 * check RoleRoute uses) fixes that.
 */
export default function PublicRoute() {
  const { token, user } = useSelector((state) => state.auth);

  const isAuthenticated = !!token && !isTokenExpired(token);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  switch (user?.role) {
    case "ADMIN":
      return <Navigate to="/admin/dashboard" replace />;
    case "FARMER":
      return <Navigate to="/farmer/dashboard" replace />;
    case "BUYER":
      return <Navigate to="/buyer/dashboard" replace />;
    default:
      return <Outlet />;
  }
}
