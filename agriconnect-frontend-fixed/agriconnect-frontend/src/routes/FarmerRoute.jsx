import { Navigate } from "react-router-dom";

export default function FarmerRoute({
  children,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "FARMER") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}