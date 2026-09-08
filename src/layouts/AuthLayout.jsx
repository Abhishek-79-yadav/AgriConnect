import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper p-5">
      <Outlet />
    </div>
  );
}
