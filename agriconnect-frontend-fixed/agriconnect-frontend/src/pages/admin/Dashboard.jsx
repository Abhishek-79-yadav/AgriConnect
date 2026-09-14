import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Users, Package, ShoppingBag, Sprout, Wallet, Plus } from "lucide-react";

import { fetchUsersThunk, fetchAdminProductsThunk, fetchAdminOrdersThunk } from "../../redux/thunks/adminThunk";
import DashboardCard from "../../components/cards/DashboardCard";
import ROLES from "../../constants/roles";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { users, products, orders } = useSelector((state) => state.admin);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchUsersThunk());
    dispatch(fetchAdminProductsThunk());
    dispatch(fetchAdminOrdersThunk());
  }, [dispatch]);

  const farmerCount = useMemo(
    () => users.filter((u) => u.role === ROLES.FARMER).length,
    [users]
  );

  const revenueThisMonth = useMemo(() => {
    const now = new Date();
    return orders
      .filter((o) => {
        if (!o.createdAt) return true; // no date on the record — count it rather than silently drop it
        const d = new Date(o.createdAt);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  }, [orders]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 5),
    [orders]
  );

  const topFarmers = useMemo(() => {
    const counts = {};
    products.forEach((p) => {
      const name = p.farmerName || "Unknown";
      counts[name] = (counts[name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [products]);

  return (
    <div>
      {/* Welcome banner */}
      <div className="mb-6 rounded-xl border border-line bg-gradient-to-br from-gold-light/60 to-card p-6">
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome back, {currentUser?.name || currentUser?.email?.split("@")[0] || "Admin"}!
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-ink/60">
          Your platform has <span className="font-semibold text-ink">{users.length} users</span>,{" "}
          <span className="font-semibold text-ink">{products.length} products</span> listed across{" "}
          <span className="font-semibold text-ink">{farmerCount} farmers</span>.
        </p>
        <Link
          to="/admin/schemes"
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
        >
          <Plus className="h-4 w-4" /> Add Government Scheme
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Link to="/admin/users">
          <DashboardCard title="Total Users" value={users.length} icon={Users} tone="slate" />
        </Link>
        <Link to="/admin/users">
          <DashboardCard title="Total Farmers" value={farmerCount} icon={Sprout} tone="field" />
        </Link>
        <Link to="/admin/products">
          <DashboardCard title="Total Products" value={products.length} icon={Package} tone="gold" />
        </Link>
        <Link to="/admin/orders">
          <DashboardCard title="Total Orders" value={orders.length} icon={ShoppingBag} tone="rust" />
        </Link>
        <Link to="/admin/reports">
          <DashboardCard title="Revenue (This Month)" value={`₹${revenueThisMonth.toLocaleString()}`} icon={Wallet} tone="gold" />
        </Link>
      </div>

      {/* Recent activity + top farmers */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-line bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Recent Activities</h2>
            <Link to="/admin/orders" className="text-sm font-medium text-gold hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-3 flex flex-col divide-y divide-line">
            {!recentOrders.length ? (
              <p className="py-6 text-center text-sm text-ink/40">No recent activity yet.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p className="font-medium text-ink">Order #{order.id}</p>
                    <p className="text-ink/50">{order.buyerName || "Buyer"} · {order.status}</p>
                  </div>
                  <p className="font-medium text-ink">₹{order.totalPrice}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-line bg-card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-base font-semibold text-ink">Top Farmers</h2>
          </div>

          <div className="mt-3">
            <div className="flex justify-between pb-2 text-xs font-medium uppercase tracking-wide text-ink/40">
              <span>Farmer name</span>
              <span>Products listed</span>
            </div>
            <div className="flex flex-col divide-y divide-line">
              {!topFarmers.length ? (
                <p className="py-6 text-center text-sm text-ink/40">No farmers with listed products yet.</p>
              ) : (
                topFarmers.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between py-2.5 text-sm">
                    <span className="font-medium text-ink">{name}</span>
                    <span className="text-ink/60">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
