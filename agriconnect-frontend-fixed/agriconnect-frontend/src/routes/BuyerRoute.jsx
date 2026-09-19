import { Navigate } from "react-router-dom";

export default function BuyerRoute({
  children,
}) {
  const user = JSON.parse(
    localStorage.getItem("user")
  );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== "BUYER") {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}