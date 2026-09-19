import { Navigate } from "react-router-dom";

export default function AdminRoute({
  children,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}