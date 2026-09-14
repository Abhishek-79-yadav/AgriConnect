import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, Plus } from "lucide-react";

import { fetchMyProductsThunk } from "../../redux/thunks/farmerThunk";
import { fetchOrdersThunk } from "../../redux/thunks/orderThunk";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import AgriInputBanner from "../../components/common/AgriInputBanner";
import Button from "../../components/ui/Button";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const products = useSelector((state) => state.farmer.products);
  const orders = useSelector((state) => state.orders.orders);

  useEffect(() => {
    dispatch(fetchMyProductsThunk());
    dispatch(fetchOrdersThunk("farmer"));
  }, [dispatch]);

  return (
    <div>
      <AgriInputBanner />
      <PageHeader
        title={`Welcome back${user?.name ? `, ${user.name}` : ""}`}
        subtitle="Manage your listings and track your orders."
        action={
          <Link to="/farmer/products/add">
            <Button><Plus className="h-4 w-4" /> Add product</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link to="/farmer/products">
          <DashboardCard title="Products" value={products.length} icon={Package} tone="field" />
        </Link>
        <Link to="/farmer/orders">
          <DashboardCard title="Orders" value={orders.length} icon={ShoppingBag} tone="gold" />
        </Link>
      </div>
    </div>
  );
}
