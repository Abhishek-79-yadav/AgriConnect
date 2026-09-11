import { useState } from "react";
import { CheckCircle2, Circle, Truck, ChevronDown, ChevronUp } from "lucide-react";
import Badge from "../ui/Badge";

const STATUS_TONE = {
  PENDING: "gold",
  CONFIRMED: "slate",
  SHIPPED: "slate",
  OUT_FOR_DELIVERY: "slate",
  DELIVERED: "field",
  CANCELLED: "rust",
};

// Buyer-facing tracking steps — PENDING is folded into CONFIRMED (an
// unpaid ONLINE order hasn't reached the farmer yet, so there's nothing
// to visually track before that point).
const TRACK_STEPS = [
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out for delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

function OrderTracker({ status }) {
  if (status === "CANCELLED") {
    return <p className="text-sm text-rust">This order was cancelled.</p>;
  }

  const currentIndex = TRACK_STEPS.findIndex((s) => s.key === status);
  // PENDING (unpaid ONLINE order) hasn't reached step 0 yet.
  const reachedIndex = currentIndex === -1 ? -1 : currentIndex;

  return (
    <div className="flex items-center">
      {TRACK_STEPS.map((step, i) => {
        const done = i <= reachedIndex;
        return (
          <div key={step.key} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-1">
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-field-dark" />
              ) : (
                <Circle className="h-5 w-5 text-line" />
              )}
              <span className={`text-[11px] ${done ? "text-ink" : "text-ink/40"}`}>{step.label}</span>
            </div>
            {i < TRACK_STEPS.length - 1 && (
              <div className={`mx-1 h-0.5 flex-1 ${i < reachedIndex ? "bg-field-dark" : "bg-line"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OrderCard({ order, action, onReviewItem, reviewedItemIds = [] }) {
  const [showTimeline, setShowTimeline] = useState(false);
  const total = order.totalPrice ?? order.totalAmount ?? 0;
  const items = order.items || [];
  const history = order.statusHistory || [];
  const hasTracking = order.carrier || order.trackingNumber || order.trackingUrl;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-line bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-display text-ink">Order #{order.id}</h4>
            <Badge text={order.status} tone={STATUS_TONE[order.status] || "neutral"} />
          </div>
          <p className="mt-1 text-sm text-ink/60">
            {items.length ? `${items.length} item${items.length > 1 ? "s" : ""} · ` : ""}
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
            {order.paymentMethod ? ` · ${order.paymentMethod === "COD" ? "Cash on delivery" : "Paid online"}` : ""}
            {order.paymentMethod === "ONLINE" && (order.paid ? " (paid)" : " (unpaid)")}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="font-display text-lg text-ink">₹{total}</span>
          {action}
        </div>
      </div>

      <div className="border-t border-line pt-3">
        <OrderTracker status={order.status} />
      </div>

      {hasTracking && (
        <div className="flex flex-col gap-1 rounded border border-line bg-paper/60 p-3 text-sm">
          <div className="flex items-center gap-2 text-ink">
            <Truck className="h-4 w-4 text-field-dark" />
            <span className="font-medium">
              {order.carrier || "Carrier"}
              {order.trackingNumber ? ` · ${order.trackingNumber}` : ""}
            </span>
          </div>
          {order.expectedDeliveryDate && (
            <p className="text-xs text-ink/60">
              Expected delivery: {new Date(order.expectedDeliveryDate).toLocaleDateString()}
            </p>
          )}
          {order.trackingUrl && (
            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-field-dark underline"
            >
              Track shipment
            </a>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div className="border-t border-line pt-3">
          <button
            type="button"
            onClick={() => setShowTimeline((v) => !v)}
            className="flex items-center gap-1 text-xs font-medium text-ink/70"
          >
            {showTimeline ? "Hide" : "Show"} delivery timeline
            {showTimeline ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>

          {showTimeline && (
            <ul className="mt-2 flex flex-col gap-2">
              {history.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-ink/70">
                  <Circle className="mt-0.5 h-2.5 w-2.5 shrink-0 text-field-dark" />
                  <div>
                    <span className="font-medium text-ink">{h.status.replace(/_/g, " ")}</span>
                    {" · "}
                    {h.createdAt ? new Date(h.createdAt).toLocaleString() : ""}
                    {h.note && <p className="text-ink/50">{h.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {items.length > 0 && (
        <div className="flex flex-col gap-1 border-t border-line pt-3">
          {items.map((item) => (
            <div key={item.productId} className="flex items-center justify-between text-sm text-ink/70">
              <span>{item.productName} × {item.quantity}</span>
              <div className="flex items-center gap-2">
                <span>₹{item.price}</span>
                {order.status === "DELIVERED" && onReviewItem && (
                  reviewedItemIds.includes(item.id) ? (
                    <span className="text-xs text-field-dark">Reviewed</span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onReviewItem(item)}
                      className="text-xs font-medium text-gold-dark hover:underline"
                    >
                      Write a review
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {order.deliveryAddressLine && (
        <div className="border-t border-line pt-3 text-sm text-ink/70">
          <p className="font-medium text-ink">{order.deliveryName} · {order.deliveryPhone}</p>
          <p>{order.deliveryAddressLine}, {order.deliveryCity}, {order.deliveryState} - {order.deliveryPincode}</p>
        </div>
      )}

      {order.couponCode && (
        <p className="text-xs text-ink/50">Coupon applied: {order.couponCode} (−₹{order.discount ?? 0})</p>
      )}
    </div>
  );
}
