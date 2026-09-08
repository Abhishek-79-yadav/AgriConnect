import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchOrdersThunk } from "../../redux/thunks/orderThunk";
import SalesChart from "../../components/charts/SalesChart";
import PageHeader from "../../components/common/PageHeader";
import SectionTitle from "../../components/common/SectionTitle";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Built from this farmer's own order history — order count per month, and
// which of their products are actually selling.
export default function Analytics() {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersThunk("farmer"));
  }, [dispatch]);

  const { salesData, topProducts } = useMemo(() => {
    const byMonth = {};
    const byProduct = {};

    orders.forEach((order) => {
      if (order.createdAt) {
        const d = new Date(order.createdAt);
        const key = `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
        byMonth[key] = (byMonth[key] || 0) + 1;
      }

      (order.items || []).forEach((item) => {
        const name = item.productName || "Unknown";
        byProduct[name] = (byProduct[name] || 0) + (item.quantity || 0);
      });
    });

    return {
      salesData: Object.entries(byMonth).map(([month, sales]) => ({ month, sales })),
      topProducts: Object.entries(byProduct)
        .map(([name, qty]) => ({ name, qty }))
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5),
    };
  }, [orders]);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="How your products are performing." />

      {loading ? (
        <Loader label="Loading analytics..." />
      ) : !orders.length ? (
        <EmptyState title="No orders yet" description="Analytics will show up once you receive orders." />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-card p-5">
            <SectionTitle title="Orders per month" />
            <SalesChart data={salesData} />
          </div>

          <div className="rounded-lg border border-line bg-card p-5">
            <SectionTitle title="Best-selling products" />
            {!topProducts.length ? (
              <p className="py-8 text-center text-sm text-ink/50">No product sales yet</p>
            ) : (
              <div className="flex flex-col gap-3">
                {topProducts.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold-light text-xs font-semibold text-gold-dark">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm text-ink">{p.name}</span>
                    <span className="text-sm font-medium text-ink/60">{p.qty} sold</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
