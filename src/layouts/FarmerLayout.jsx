import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import MobileBottomNav from "../components/layout/MobileBottomNav";

export default function FarmerLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <div className="mx-auto flex w-full max-w-6xl flex-1">
        <Sidebar />

        <main className="flex-1 animate-fade-in p-4 pb-20 sm:p-6 sm:pb-6">
          <Outlet />
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
