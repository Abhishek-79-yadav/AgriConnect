import { useSelector } from "react-redux";
import { FileText } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/cards/DashboardCard";

export default function Reports() {
  const orders = useSelector((state) => state.admin.orders);
  const users = useSelector((state) => state.admin.users);
  const products = useSelector((state) => state.admin.products);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  return (
    <div>
      <PageHeader title="Reports" subtitle="Platform-wide summary." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard title="Total orders" value={orders.length} icon={FileText} tone="gold" />
        <DashboardCard title="Total revenue" value={`₹${totalRevenue}`} icon={FileText} tone="field" />
        <DashboardCard title="Total users" value={users.length} icon={FileText} tone="slate" />
        <DashboardCard title="Total products" value={products.length} icon={FileText} tone="rust" />
      </div>
    </div>
  );
}
