import { useSelector } from "react-redux";

/** Renders children only if the logged-in user's role is in `roles`. */
export default function ProtectedComponent({ roles = [], children, fallback = null }) {
  const user = useSelector((state) => state.auth.user);

  if (!user || (roles.length && !roles.includes(user.role))) {
    return fallback;
  }

  return children;
}
