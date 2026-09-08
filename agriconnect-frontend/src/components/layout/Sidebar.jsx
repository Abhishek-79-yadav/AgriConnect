import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Sprout,
  CloudSun,
  BarChart3,
  Wallet,
  Video,
  Users,
  Tag,
  Landmark,
  Building2,
  ShieldCheck,
  FileText,
  Heart,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  Store,
  Bot,
  Settings,
  NotebookPen,
  Star,
  Megaphone,
  ClipboardCheck,
  Warehouse,
  Receipt,
  Bell as BellIcon,
  Percent,
  ScrollText,
  LogOut,
} from "lucide-react";

import ROLES from "../../constants/roles";
import { logoutThunk } from "../../redux/thunks/authThunk";

// Grouped into sections (like "OVERVIEW" / "FLEET" / "PEOPLE") so the
// sidebar reads as a structured admin panel rather than one flat list.
// Exported so the mobile nav (Navbar.jsx) can render the same full menu —
// previously the mobile menu had its own short hardcoded list and most
// role-specific pages (Orders, Revenue, Weather, Smart Crop, etc.) were
// completely unreachable on mobile since Sidebar itself is desktop-only.
export const MENUS = {
  [ROLES.BUYER]: [
    {
      section: "Overview",
      items: [{ to: "/buyer/dashboard", label: "Dashboard", icon: LayoutDashboard }],
    },
    {
      section: "Shopping",
      items: [
        { to: "/products", label: "Shop", icon: Store },
        { to: "/buyer/cart", label: "Cart", icon: ShoppingCart },
        { to: "/buyer/orders", label: "Orders", icon: Package },
        { to: "/buyer/wallet", label: "Wallet", icon: Wallet },
        { to: "/buyer/wishlist", label: "Wishlist", icon: Heart },
        { to: "/buyer/coupons", label: "Coupons", icon: Tag },
        { to: "/buyer/agri-inputs", label: "Agri-Inputs", icon: Sprout },
        { to: "/buyer/plans", label: "Plans", icon: Wallet },
      ],
    },
    {
      section: "Account",
      items: [{ to: "/buyer/notifications", label: "Notifications", icon: Bell }],
    },
  ],
  [ROLES.FARMER]: [
    {
      section: "Overview",
      items: [
        { to: "/farmer/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/farmer/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      section: "Farm",
      items: [
        { to: "/farmer/products", label: "My Products", icon: Package },
        { to: "/farmer/orders", label: "Orders", icon: ShoppingCart },
        { to: "/farmer/reviews", label: "Reviews", icon: Star },
        { to: "/farmer/farm-log", label: "Farm Log", icon: NotebookPen },
        { to: "/farmer/revenue", label: "Revenue", icon: Wallet },
        { to: "/farmer/weather", label: "Weather", icon: CloudSun },
        { to: "/farmer/smart-crop", label: "Smart Crop", icon: Sprout },
        { to: "/farmer/ai-recommendation", label: "AI Recommendation", icon: Bot },
        { to: "/farmer/upload-video", label: "Upload Video", icon: Video },
      ],
    },
    {
      section: "Account",
      items: [
        { to: "/farmer/schemes", label: "Govt Schemes", icon: Landmark },
        { to: "/farmer/warehouse-licenses", label: "Warehouse Licenses", icon: Warehouse },
        { to: "/farmer/notifications", label: "Notifications", icon: Bell },
      ],
    },
  ],
  [ROLES.BRAND]: [
    {
      section: "Overview",
      items: [
        { to: "/brand/dashboard", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      section: "Marketplace",
      items: [
        { to: "/brand/agri-inputs", label: "My Listings", icon: Package },
        { to: "/brand/plans", label: "Plans", icon: Wallet },
      ],
    },
  ],
  [ROLES.GOVERNMENT]: [
    {
      section: "Overview",
      items: [
        { to: "/government/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/government/reports", label: "Reports", icon: BarChart3 },
      ],
    },
    {
      section: "Schemes",
      items: [
        { to: "/government/schemes", label: "Schemes", icon: Landmark },
        { to: "/government/applications", label: "Applications", icon: ClipboardCheck },
        { to: "/government/departments", label: "Departments", icon: Building2 },
      ],
    },
    {
      section: "Licensing",
      items: [
        { to: "/government/licenses", label: "Warehouse Licenses", icon: Warehouse },
      ],
    },
    {
      section: "Revenue",
      items: [
        { to: "/government/tax-records", label: "Tax Records", icon: Receipt },
        { to: "/government/tax-config", label: "Tax Configuration", icon: Percent },
      ],
    },
    {
      section: "Communication",
      items: [
        { to: "/government/notices", label: "Notices", icon: BellIcon },
      ],
    },
    {
      section: "Governance",
      items: [
        { to: "/government/audit-trail", label: "Audit Trail", icon: ScrollText },
      ],
    },
  ],
  [ROLES.ADMIN]: [
    {
      section: "Overview",
      items: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/reports", label: "Reports", icon: FileText },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      section: "Management",
      items: [
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/products", label: "Products", icon: Package },
        { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { to: "/admin/payouts", label: "Farmer Payouts", icon: Wallet },
        { to: "/admin/pending-brands", label: "Company Approvals", icon: Building2 },
        { to: "/admin/governance", label: "Governance", icon: ShieldCheck },
        { to: "/admin/coupons", label: "Coupons", icon: Tag },
        { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
        { to: "/admin/schemes", label: "Schemes", icon: Landmark },
      ],
    },
    {
      section: "System",
      items: [
        { to: "/admin/notifications", label: "Notifications", icon: Bell },
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ],
  [ROLES.SUPER_ADMIN]: [
    {
      section: "Overview",
      items: [
        { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { to: "/admin/reports", label: "Reports", icon: FileText },
        { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
      ],
    },
    {
      section: "Management",
      items: [
        { to: "/admin/users", label: "Users", icon: Users },
        { to: "/admin/products", label: "Products", icon: Package },
        { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
        { to: "/admin/payouts", label: "Farmer Payouts", icon: Wallet },
        { to: "/admin/pending-brands", label: "Company Approvals", icon: Building2 },
        { to: "/admin/governance", label: "Governance", icon: ShieldCheck },
        { to: "/admin/coupons", label: "Coupons", icon: Tag },
        { to: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
        { to: "/admin/schemes", label: "Schemes", icon: Landmark },
      ],
    },
    {
      // Super-admin-only: this section doesn't appear for regular ADMIN.
      section: "Super Admin",
      items: [
        { to: "/admin/manage-admins", label: "Manage Admins", icon: ShieldCheck },
        { to: "/admin/government-officials", label: "Government Officials", icon: Landmark },
      ],
    },
    {
      section: "System",
      items: [
        { to: "/admin/notifications", label: "Notifications", icon: Bell },
        { to: "/admin/settings", label: "Settings", icon: Settings },
      ],
    },
  ],
};

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const sections = MENUS[user?.role] || [];
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar_collapsed") === "true");

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      localStorage.setItem("sidebar_collapsed", String(!v));
      return !v;
    });
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <aside
      className={`hidden shrink-0 flex-col border-r border-line bg-card transition-all duration-200 md:flex ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <nav className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col justify-between overflow-y-auto py-4">
        <div className="flex flex-col gap-5 px-3">
          {sections.map(({ section, items }) => (
            <div key={section}>
              {!collapsed && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-ink/40">
                  {section}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${
                        collapsed ? "justify-center" : ""
                      } ${
                        isActive
                          ? "bg-gold font-medium text-white shadow-sm"
                          : "text-ink/60 hover:bg-paper hover:text-ink"
                      }`
                    }
                  >
                    <Icon size={17} className="shrink-0" />
                    {!collapsed && label}
                    {collapsed && (
                      <span className="pointer-events-none absolute left-full z-50 ml-2 whitespace-nowrap rounded bg-ink px-2 py-1 text-xs text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        {label}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User card pinned to the bottom, matching a typical admin-panel sidebar. */}
        <div className="border-t border-line px-3 pt-3">
          <button
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="mb-2 flex w-full items-center justify-center gap-2 rounded-lg py-1.5 text-xs text-ink/40 transition hover:bg-paper hover:text-ink"
          >
            {collapsed ? (
              <ChevronsRight size={16} />
            ) : (
              <>
                <ChevronsLeft size={16} /> Collapse
              </>
            )}
          </button>

          <div className={`flex items-center gap-2.5 rounded-lg px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gold-light text-sm font-semibold text-gold-dark">
              {user?.email?.[0]?.toUpperCase() || "?"}
            </span>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">{user?.name || user?.email}</p>
                <p className="truncate text-xs text-ink/50">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            title={collapsed ? "Log out" : undefined}
            className={`mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-ink/60 transition hover:bg-rust-light hover:text-rust ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={16} /> {!collapsed && "Log out"}
          </button>
        </div>
      </nav>
    </aside>
  );
}
