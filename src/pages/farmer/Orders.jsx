import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Truck } from "lucide-react";

import { fetchOrdersThunk, updateOrderStatusThunk, updateOrderShipmentThunk } from "../../redux/thunks/orderThunk";
import { fetchReturnsThunk, updateReturnStatusThunk } from "../../redux/thunks/returnThunk";
import OrderCard from "../../components/cards/OrderCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

// What a farmer can move an order to, given its current status. Terminal
// states (DELIVERED / CANCELLED) show no actions — the backend rejects
// changes to those anyway.
const NEXT_ACTIONS = {
  PENDING: [{ status: "CONFIRMED", label: "Confirm order", variant: "primary" }],
  CONFIRMED: [{ status: "SHIPPED", label: "Mark shipped", variant: "primary" }],
  SHIPPED: [{ status: "OUT_FOR_DELIVERY", label: "Out for delivery", variant: "primary" }],
  OUT_FOR_DELIVERY: [{ status: "DELIVERED", label: "Mark delivered", variant: "primary" }],
};

const RETURN_TONE = {
  REQUESTED: "gold",
  APPROVED: "slate",
  REJECTED: "rust",
  COMPLETED: "field",
};

export default function Orders() {
  const dispatch = useDispatch();
  const { orders: rawOrders, loading } = useSelector((state) => state.orders);
  const { returns: rawReturns, loading: returnsLoading } = useSelector((state) => state.returns);
  const orders = Array.isArray(rawOrders) ? rawOrders : [];
  const returns = Array.isArray(rawReturns) ? rawReturns : [];

  const [updatingId, setUpdatingId] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [trackingUrl, setTrackingUrl] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [savingTracking, setSavingTracking] = useState(false);
  const [updatingReturnId, setUpdatingReturnId] = useState(null);

  useEffect(() => {
    dispatch(fetchOrdersThunk("farmer"));
    dispatch(fetchReturnsThunk("farmer"));
  }, [dispatch]);

  const changeStatus = async (id, status) => {
    setUpdatingId(id);
    const result = await dispatch(updateOrderStatusThunk({ id, status }));
    setUpdatingId(null);

    if (updateOrderStatusThunk.fulfilled.match(result)) {
      toast.success(`Order marked ${status.replace(/_/g, " ").toLowerCase()}`);
    } else {
      toast.error(result.payload?.message || "Could not update order");
    }
  };

  const openTracking = (order) => {
    setTrackingOrder(order);
    setCarrier(order.carrier || "");
    setTrackingNumber(order.trackingNumber || "");
    setTrackingUrl(order.trackingUrl || "");
    setExpectedDeliveryDate(order.expectedDeliveryDate || "");
  };

  const saveTracking = async () => {
    setSavingTracking(true);
    const result = await dispatch(
      updateOrderShipmentThunk({
        id: trackingOrder.id,
        shipmentData: {
          carrier: carrier.trim() || null,
          trackingNumber: trackingNumber.trim() || null,
          trackingUrl: trackingUrl.trim() || null,
          expectedDeliveryDate: expectedDeliveryDate || null,
        },
      })
    );
    setSavingTracking(false);

    if (updateOrderShipmentThunk.fulfilled.match(result)) {
      toast.success("Tracking info saved");
      setTrackingOrder(null);
    } else {
      toast.error(result.payload?.message || "Could not save tracking info");
    }
  };

  const changeReturnStatus = async (id, status) => {
    setUpdatingReturnId(id);
    const result = await dispatch(updateReturnStatusThunk({ id, status }));
    setUpdatingReturnId(null);

    if (updateReturnStatusThunk.fulfilled.match(result)) {
      toast.success(`Return ${status.toLowerCase()}`);
    } else {
      toast.error(result.payload?.message || "Could not update return");
    }
  };

  return (
    <div>
      <PageHeader title="Orders" subtitle="Orders placed for your products." />

      {loading ? (
        <Loader label="Loading orders..." />
      ) : !orders?.length ? (
        <EmptyState title="No orders yet" description="Orders from buyers will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            const actions = NEXT_ACTIONS[order.status] || [];
            const canCancel = order.status !== "DELIVERED" && order.status !== "CANCELLED";
            const canTrack = order.status !== "DELIVERED" && order.status !== "CANCELLED" && order.status !== "PENDING";

            return (
              <OrderCard
                key={order.id}
                order={order}
                action={
                  <div className="flex flex-wrap items-center gap-2">
                    {actions.map((a) => (
                      <Button
                        key={a.status}
                        size="sm"
                        loading={updatingId === order.id}
                        onClick={() => changeStatus(order.id, a.status)}
                      >
                        {a.label}
                      </Button>
                    ))}
                    {canTrack && (
                      <Button size="sm" variant="ghost" onClick={() => openTracking(order)}>
                        <Truck className="h-3.5 w-3.5" /> Tracking
                      </Button>
                    )}
                    {canCancel && (
                      <Button
                        size="sm"
                        variant="ghost"
                        loading={updatingId === order.id}
                        onClick={() => changeStatus(order.id, "CANCELLED")}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      <div className="mt-8">
        <PageHeader title="Returns" subtitle="Return requests on your orders." />

        {returnsLoading ? (
          <Loader label="Loading returns..." />
        ) : !returns.length ? (
          <EmptyState title="No returns" description="Return requests from buyers will show up here." />
        ) : (
          <div className="flex flex-col gap-3">
            {returns.map((r) => (
              <div key={r.id} className="flex flex-col gap-2 rounded-lg border border-line bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">
                      Order #{r.orderId}
                      {r.productName ? ` · ${r.productName}` : ""}
                    </h4>
                    <Badge text={r.status} tone={RETURN_TONE[r.status] || "neutral"} />
                  </div>
                  <span className="text-xs text-ink/50">
                    {r.requestedAt ? new Date(r.requestedAt).toLocaleDateString() : ""}
                  </span>
                </div>
                <p className="text-sm text-ink/70">
                  <span className="font-medium text-ink">{r.buyerName}: </span>
                  {r.reason}
                </p>
                {r.status === "REQUESTED" && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      loading={updatingReturnId === r.id}
                      onClick={() => changeReturnStatus(r.id, "APPROVED")}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      loading={updatingReturnId === r.id}
                      onClick={() => changeReturnStatus(r.id, "REJECTED")}
                    >
                      Reject
                    </Button>
                  </div>
                )}
                {r.status === "APPROVED" && (
                  <Button
                    size="sm"
                    loading={updatingReturnId === r.id}
                    className="self-start"
                    onClick={() => changeReturnStatus(r.id, "COMPLETED")}
                  >
                    Mark received (restock)
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={!!trackingOrder} onClose={() => setTrackingOrder(null)} title={`Tracking — Order #${trackingOrder?.id}`}>
        <div className="flex flex-col gap-3">
          <Input label="Carrier" placeholder="e.g. Delhivery, India Post" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
          <Input label="Tracking number" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} />
          <Input label="Tracking URL (optional)" value={trackingUrl} onChange={(e) => setTrackingUrl(e.target.value)} />
          <Input
            label="Expected delivery date"
            type="date"
            value={expectedDeliveryDate}
            onChange={(e) => setExpectedDeliveryDate(e.target.value)}
          />
          <Button onClick={saveTracking} loading={savingTracking} className="self-start">
            Save tracking info
          </Button>
        </div>
      </Modal>
    </div>
  );
}
