import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart, Heart } from "lucide-react";

import { buyerDashboardThunk } from "../../redux/thunks/dashboardThunk";
import PageHeader from "../../components/common/PageHeader";
import DashboardCard from "../../components/cards/DashboardCard";
import CampaignBanner from "../../components/common/CampaignBanner";

export default function Dashboard() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const dashboard = useSelector((state) => state.dashboard.buyer);
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);

  useEffect(() => {
    dispatch(buyerDashboardThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title={`Welcome back${user?.name ? `, ${user.name}` : ""}`} subtitle="Here's what's happening with your account." />

      <CampaignBanner role="BUYER" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link to="/buyer/orders">
          <DashboardCard title="Orders" value={dashboard?.orders ?? "—"} icon={ShoppingBag} tone="gold" />
        </Link>
        <Link to="/buyer/cart">
          <DashboardCard title="Cart items" value={dashboard?.cartItems ?? cartItems.length} icon={ShoppingCart} tone="slate" />
        </Link>
        <Link to="/buyer/wishlist">
          <DashboardCard title="Wishlist" value={dashboard?.wishlist ?? wishlistItems.length} icon={Heart} tone="rust" />
        </Link>
      </div>
    </div>
  );
}
