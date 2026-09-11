import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import MobileBottomNav from "../components/layout/MobileBottomNav";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <Navbar />

      <main className="flex-1 animate-fade-in pb-16 md:pb-0">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
