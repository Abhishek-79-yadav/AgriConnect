import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet, TrendingUp, Package } from "lucide-react";

import { fetchOrdersThunk } from "../../redux/thunks/orderThunk";
import RevenueChart from "../../components/charts/RevenueChart";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Computed straight from this farmer's own orders — there's no separate
// backend revenue endpoint (the dashboard one only estimates from listed
// stock, not actual sales), so this is the real number.
export default function Revenue() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersThunk("farmer"));
  }, [dispatch]);

  const { chartData, totalRevenue, paidRevenue, orderCount } = useMemo(() => {
    const byMonth = {};
    let total = 0;
    let paid = 0;

    orders.forEach((order) => {
      const amount = order.totalPrice || 0;
      total += amount;
      if (order.paid) paid += amount;

      if (order.createdAt) {
        const d = new Date(order.createdAt);
        const key = `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
        byMonth[key] = (byMonth[key] || 0) + amount;
      }
    });

    return {
      chartData: Object.entries(byMonth).map(([month, revenue]) => ({ month, revenue })),
      totalRevenue: total,
      paidRevenue: paid,
      orderCount: orders.length,
    };
  }, [orders]);

  return (
    <div>
      <PageHeader title="Revenue" subtitle="Earnings from your orders." />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <DashboardCard title="Total order value" value={`₹${totalRevenue.toFixed(2)}`} icon={Wallet} tone="gold" />
        <DashboardCard title="Collected (paid)" value={`₹${paidRevenue.toFixed(2)}`} icon={TrendingUp} tone="field" />
        <DashboardCard title="Total orders" value={orderCount} icon={Package} tone="slate" />
      </div>

      <div className="rounded-lg border border-line bg-card p-5">
        {loading ? (
          <Loader label="Loading revenue..." />
        ) : !chartData.length ? (
          <EmptyState title="No revenue yet" description="Revenue from your orders will appear here over time." />
        ) : (
          <RevenueChart data={chartData} />
        )}
      </div>
    </div>
  );
}
