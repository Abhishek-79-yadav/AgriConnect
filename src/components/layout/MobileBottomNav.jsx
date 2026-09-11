import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Home,
  ShoppingCart,
  Package,
  User,
  LayoutDashboard,
  Building2,
  Users,
  MoreVertical,
  X,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import ROLES from "../../constants/roles";
import { logoutThunk } from "../../redux/thunks/authThunk";
import { MENUS } from "./Sidebar";
import { useTheme } from "../../context/ThemeContext";

// Quick-access row only — 3 items per role plus "More", which opens a
// sheet with the role's FULL section list (same MENUS the desktop
// sidebar uses) so every page stays reachable on mobile, not just
// whatever fit in 4 tabs.
const ROLE_LINKS = {
  [ROLES.FARMER]: [
    { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/farmer/products", label: "Products", icon: Package },
  ],
  [ROLES.ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/users", label: "Users", icon: Users },
  ],
  [ROLES.SUPER_ADMIN]: [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/manage-admins", label: "Admins", icon: Users },
  ],
  [ROLES.BRAND]: [{ to: "/brand/dashboard", label: "Dashboard", icon: Building2 }],
  [ROLES.GOVERNMENT]: [
    { to: "/government/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/government/schemes", label: "Schemes", icon: Building2 },
  ],
  [ROLES.BUYER]: [
    { to: "/", label: "Home", icon: Home },
    { to: "/products", label: "Shop", icon: Package },
    { to: "/buyer/cart", label: "Cart", icon: ShoppingCart },
  ],
};

const GUEST_LINKS = [
  { to: "/", label: "Home", icon: Home },
  { to: "/products", label: "Shop", icon: Package },
  { to: "/login", label: "Login", icon: User },
];

export default function MobileBottomNav() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [moreOpen, setMoreOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const links = ROLE_LINKS[user?.role] || GUEST_LINKS;
  const sections = MENUS[user?.role] || [];

  // While the "More" sheet is open, lock the page behind it from
  // scrolling. Without this, touch-scrolling inside the sheet can chain
  // through to the underlying page (a common mobile browser behavior),
  // so by the time the sheet closes — e.g. after tapping Log out — the
  // page underneath has silently scrolled down, making the next screen
  // look like it "jumped" lower than expected.
  useEffect(() => {
    if (!moreOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [moreOpen]);

  const closeSheetAndScrollTop = () => {
    setMoreOpen(false);
    window.scrollTo(0, 0);
  };

  const handleLogout = async () => {
    closeSheetAndScrollTop();
    // Redux state is cleared on both fulfilled AND rejected (see
    // authSlice) since local storage is wiped either way — so navigating
    // away here is always correct, regardless of whether the /auth/logout
    // network call itself succeeded.
    await dispatch(logoutThunk());
    toast.success("Signed out");
    navigate("/login");
    window.scrollTo(0, 0);
  };

  const tabClass = ({ isActive }) =>
    `flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
      isActive ? "text-gold-dark" : "text-ink/50"
    }`;

  return (
    <>
      {/* Backdrop + sheet render above the nav bar (z-40 > nav's z-30),
          anchored to the bottom so it never gets clipped by the nav or
          cut off the top of small screens. */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-ink/40" />
          <div
            className="absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-line bg-card pb-[env(safe-area-inset-bottom)] shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between border-b border-line bg-card px-4 py-3">
              <p className="font-display text-base text-ink">Menu</p>
              <button
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
                className="rounded-full p-1 text-ink/50 hover:bg-paper hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-2 py-2">
              <button
                type="button"
                onClick={toggleTheme}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink hover:bg-paper"
              >
                {theme === "dark" ? (
                  <Sun size={17} className="text-ink/50" />
                ) : (
                  <Moon size={17} className="text-ink/50" />
                )}
                {theme === "dark" ? "Light mode" : "Dark mode"}
              </button>

              {user && (
                <NavLink
                  to="/profile"
                  onClick={() => setMoreOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-paper"
                >
                  <User size={17} className="text-ink/50" /> Profile
                </NavLink>
              )}

              {sections.map(({ section, items }) => (
                <div key={section} className="mt-1">
                  <p className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                    {section}
                  </p>
                  {items.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setMoreOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm text-ink hover:bg-paper"
                    >
                      <Icon size={17} className="text-ink/50" /> {label}
                    </NavLink>
                  ))}
                </div>
              ))}

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-ink/60 hover:bg-rust-light hover:text-rust"
                >
                  <LogOut size={17} /> Log out
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-card pb-[env(safe-area-inset-bottom)] md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={tabClass}>
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}

        {(sections.length > 0 || user) && (
          <button
            onClick={() => setMoreOpen(true)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-xs ${
              moreOpen ? "text-gold-dark" : "text-ink/50"
            }`}
          >
            <MoreVertical className="h-5 w-5" />
            More
          </button>
        )}
      </nav>
    </>
  );
}
