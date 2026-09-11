import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Heart, LogOut, LayoutDashboard, Search as SearchIcon, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";

import { logoutThunk } from "../../redux/thunks/authThunk";
import ROLES from "../../constants/roles";
import Logo from "../common/Logo";
import NotificationBell from "./NotificationBell";
import { useTheme } from "../../context/ThemeContext";

const ROLE_BADGE = {
  [ROLES.FARMER]: "bg-field-light text-field-dark",
  [ROLES.BUYER]: "bg-slate-light text-slate-dark",
  [ROLES.ADMIN]: "bg-gold-light text-gold-dark",
  [ROLES.SUPER_ADMIN]: "bg-gold-light text-gold-dark",
  [ROLES.BRAND]: "bg-slate-light text-slate-dark",
};

const ROLE_DASHBOARD_PATH = {
  [ROLES.FARMER]: "/farmer/dashboard",
  [ROLES.BUYER]: "/buyer/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
  [ROLES.SUPER_ADMIN]: "/admin/dashboard",
  [ROLES.BRAND]: "/brand/dashboard",
};

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items?.length ?? 0);
  const { theme, toggleTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const isAuthenticated = !!token;

  const handleLogout = async () => {
    setMenuOpen(false);
    await dispatch(logoutThunk());
    toast.success("Signed out");
    navigate("/");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchValue.trim();
    navigate(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6">
        <Logo className="shrink-0" />

        {/* Always-visible search — Amazon/Blinkit pattern, not buried behind a nav link */}
        <form onSubmit={handleSearchSubmit} className="relative hidden max-w-md flex-1 md:block">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-full border border-line bg-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
        </form>

        {/* Desktop nav */}
        <nav className="hidden shrink-0 items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm text-ink/70 transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden shrink-0 items-center gap-4 md:flex">
          {!isAuthenticated ? (
            <>
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="text-ink/70 transition hover:text-ink"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-ink">
                Log in
              </Link>
              <Link
                to="/register"
                className="rounded bg-gold px-4 py-2 text-sm font-medium text-white transition hover:bg-gold-dark"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user?.role === ROLES.BUYER && (
                <>
                  <Link
                    to="/buyer/wishlist"
                    aria-label="Wishlist"
                    className="text-ink/70 transition hover:text-ink"
                  >
                    <Heart size={20} />
                  </Link>
                  <Link
                    to="/buyer/cart"
                    aria-label="Cart"
                    className="relative text-ink/70 transition hover:text-ink"
                  >
                    <ShoppingCart size={20} />
                    {cartCount > 0 && (
                      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="text-ink/70 transition hover:text-ink"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <NotificationBell />

              <div className="relative">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex items-center gap-2 rounded-full py-1 pl-1 pr-3 text-sm font-medium transition ${ROLE_BADGE[user?.role] || "bg-line text-ink"}`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-xs font-semibold">
                    {user?.email?.[0]?.toUpperCase() || "?"}
                  </span>
                  {user?.role}
                </button>

                {menuOpen && (
                  <div
                    onMouseLeave={() => setMenuOpen(false)}
                    className="absolute right-0 mt-2 w-48 overflow-hidden rounded border border-line bg-card shadow-md"
                  >
                    <Link
                      to={ROLE_DASHBOARD_PATH[user?.role] || "/"}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-paper"
                    >
                      <LayoutDashboard size={16} /> Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-paper"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-rust hover:bg-rust-light"
                    >
                      <LogOut size={16} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Mobile: cart + theme toggle, pinned to the far right corner.
            Navigation itself lives in MobileBottomNav (Home/Shop/Login
            plus a "More" sheet with Dashboard/Profile/Logout), so no
            hamburger menu is needed here. */}
        <div className="ml-auto flex items-center gap-3 md:hidden">
          {isAuthenticated && user?.role === ROLES.BUYER && (
            <Link to="/buyer/cart" aria-label="Cart" className="relative text-ink/70">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-medium text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="text-ink/70 transition hover:text-ink"
          >
            {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile search — always visible below the compact header, not hidden behind a toggle */}
      <form onSubmit={handleSearchSubmit} className="relative border-t border-line px-4 py-2.5 md:hidden">
        <SearchIcon className="pointer-events-none absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-full border border-line bg-card py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </form>
    </header>
  );
}
