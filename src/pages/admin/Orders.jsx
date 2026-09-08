import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAdminOrdersThunk } from "../../redux/thunks/adminThunk";
import OrderCard from "../../components/cards/OrderCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function Orders() {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.admin.orders);
  const loading = false;

  useEffect(() => {
    dispatch(fetchAdminOrdersThunk());
  }, [dispatch]);

  return (
    <div>
      <PageHeader title="All orders" subtitle={`${orders.length} total`} />

      {loading ? (
        <Loader label="Loading orders..." />
      ) : !orders.length ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
