import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { CreditCard, MessageSquareWarning, RotateCcw, Layers, Star } from "lucide-react";

import { fetchOrdersThunk, updateOrderStatusThunk } from "../../redux/thunks/orderThunk";
import { fetchReturnsThunk, requestReturnThunk } from "../../redux/thunks/returnThunk";
import { createEmiPlanThunk } from "../../redux/thunks/emiThunk";
import { fileDisputeApi } from "../../api/orderApi";
import { createReviewApi, getMyReviewsApi } from "../../api/reviewApi";
import OrderCard from "../../components/cards/OrderCard";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import Payment from "./Payment";

// A buyer can only cancel — and only before the farmer has shipped it.
const CANCELLABLE = ["PENDING", "CONFIRMED"];

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
  const [toCancel, setToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [payingOrderId, setPayingOrderId] = useState(null);
  const [disputingOrder, setDisputingOrder] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [filingDispute, setFilingDispute] = useState(false);
  const [returningOrder, setReturningOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [submittingReturn, setSubmittingReturn] = useState(false);
  const [emiOrder, setEmiOrder] = useState(null);
  const [numberOfInstallments, setNumberOfInstallments] = useState(3);
  const [settingUpEmi, setSettingUpEmi] = useState(false);
  const [reviewedItemIds, setReviewedItemIds] = useState([]);
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingProductReview, setSubmittingProductReview] = useState(false);

  const loadMyReviews = () => {
    getMyReviewsApi()
      .then((reviews) => setReviewedItemIds(reviews.map((r) => r.orderItemId).filter(Boolean)))
      .catch(() => {});
  };

  useEffect(() => {
    dispatch(fetchOrdersThunk("buyer"));
    dispatch(fetchReturnsThunk("buyer"));
    loadMyReviews();
  }, [dispatch]);

  const confirmCancel = async () => {
    setCancelling(true);
    const result = await dispatch(updateOrderStatusThunk({ id: toCancel.id, status: "CANCELLED" }));
    setCancelling(false);
    setToCancel(null);

    if (updateOrderStatusThunk.fulfilled.match(result)) {
      toast.success("Order cancelled");
    } else {
      toast.error(result.payload?.message || "Could not cancel order");
    }
  };

  const submitDispute = async () => {
    if (!disputeReason.trim()) {
      toast.error("Please give a reason");
      return;
    }
    setFilingDispute(true);
    try {
      await fileDisputeApi({
        orderId: disputingOrder.id,
        reason: disputeReason.trim(),
        description: disputeDescription.trim(),
      });
      toast.success("Dispute filed — our team will review it");
      setDisputingOrder(null);
      setDisputeReason("");
      setDisputeDescription("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not file dispute");
    } finally {
      setFilingDispute(false);
    }
  };

  const submitReturn = async () => {
    if (!returnReason.trim()) {
      toast.error("Please give a reason");
      return;
    }
    setSubmittingReturn(true);
    const result = await dispatch(
      requestReturnThunk({ orderId: returningOrder.id, reason: returnReason.trim() })
    );
    setSubmittingReturn(false);

    if (requestReturnThunk.fulfilled.match(result)) {
      toast.success("Return requested");
      setReturningOrder(null);
      setReturnReason("");
    } else {
      toast.error(result.payload?.message || "Could not request return");
    }
  };

  const submitEmiPlan = async () => {
    setSettingUpEmi(true);
    const result = await dispatch(
      createEmiPlanThunk({ orderId: emiOrder.id, numberOfInstallments })
    );
    setSettingUpEmi(false);

    if (createEmiPlanThunk.fulfilled.match(result)) {
      toast.success("EMI plan created — manage it from your Wallet");
      setEmiOrder(null);
      dispatch(fetchOrdersThunk("buyer"));
    } else {
      toast.error(result.payload?.message || "Could not set up EMI");
    }
  };

  const submitProductReview = async () => {
    if (!reviewingItem) return;

    setSubmittingProductReview(true);
    try {
      await createReviewApi({
        orderItemId: reviewingItem.id,
        rating: reviewRating,
        comment: reviewComment.trim() || undefined,
      });
      toast.success("Review submitted");
      setReviewedItemIds((prev) => [...prev, reviewingItem.id]);
      setReviewingItem(null);
      setReviewRating(5);
      setReviewComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit review");
    } finally {
      setSubmittingProductReview(false);
    }
  };

  return (
    <div>
      <PageHeader title="My orders" />

      {loading ? (
        <Loader label="Loading orders..." />
      ) : !orders?.length ? (
        <EmptyState title="No orders yet" description="Orders you place will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => {
            // An ONLINE order that's still PENDING and unpaid means the
            // buyer either backed out of the Razorpay modal or the payment
            // failed — without this, there was no way back into payment
            // for that order once it left the checkout page.
            const needsPayment = order.paymentMethod === "ONLINE" && order.status === "PENDING" && !order.paid;

            return (
              <OrderCard
                key={order.id}
                order={order}
                reviewedItemIds={reviewedItemIds}
                onReviewItem={(item) => setReviewingItem(item)}
                action={
                  <div className="flex items-center gap-2">
                    {needsPayment && (
                      <Button size="sm" onClick={() => setPayingOrderId(order.id)}>
                        <CreditCard className="h-3.5 w-3.5" /> Pay now
                      </Button>
                    )}
                    {needsPayment && order.totalPrice >= 1000 && (
                      <Button variant="ghost" size="sm" onClick={() => setEmiOrder(order)}>
                        <Layers className="h-3.5 w-3.5" /> Pay via EMI
                      </Button>
                    )}
                    {CANCELLABLE.includes(order.status) && (
                      <Button variant="ghost" size="sm" onClick={() => setToCancel(order)}>
                        Cancel order
                      </Button>
                    )}
                    {order.status === "DELIVERED" && (
                      <Button variant="ghost" size="sm" onClick={() => setDisputingOrder(order)}>
                        <MessageSquareWarning className="h-3.5 w-3.5" /> Report an issue
                      </Button>
                    )}
                    {order.status === "DELIVERED" && (
                      <Button variant="ghost" size="sm" onClick={() => setReturningOrder(order)}>
                        <RotateCcw className="h-3.5 w-3.5" /> Request return
                      </Button>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!toCancel}
        title="Cancel this order?"
        message={`Order #${toCancel?.id} will be cancelled — this can't be undone.`}
        danger
        confirmLabel="Cancel order"
        cancelLabel="Keep order"
        loading={cancelling}
        onConfirm={confirmCancel}
        onCancel={() => setToCancel(null)}
      />

      {returns.length > 0 && (
        <div className="mt-8">
          <PageHeader title="My returns" />

          {returnsLoading ? (
            <Loader label="Loading returns..." />
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
                  <p className="text-sm text-ink/70">{r.reason}</p>
                  {r.adminNote && <p className="text-xs text-ink/50">Note: {r.adminNote}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal open={!!returningOrder} onClose={() => setReturningOrder(null)} title={`Request return — Order #${returningOrder?.id}`}>
        <div className="flex flex-col gap-3">
          <Input
            label="Reason"
            placeholder="e.g. Item damaged, wrong item, quality issue"
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
          <Button onClick={submitReturn} loading={submittingReturn} className="self-start">
            Submit return request
          </Button>
        </div>
      </Modal>

      <Modal open={!!emiOrder} onClose={() => setEmiOrder(null)} title={`Pay via EMI — Order #${emiOrder?.id}`}>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink/60">
            Split ₹{emiOrder?.totalPrice?.toFixed(2)} into equal monthly installments, paid from your wallet.
          </p>
          <label className="text-sm font-medium text-ink">Number of installments</label>
          <select
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm"
            value={numberOfInstallments}
            onChange={(e) => setNumberOfInstallments(Number(e.target.value))}
          >
            {[2, 3, 6, 12].map((n) => (
              <option key={n} value={n}>
                {n} installments
              </option>
            ))}
          </select>
          <Button onClick={submitEmiPlan} loading={settingUpEmi} className="self-start">
            Set up EMI plan
          </Button>
        </div>
      </Modal>

      <Modal
        open={!!reviewingItem}
        onClose={() => setReviewingItem(null)}
        title={`Write a review — ${reviewingItem?.productName || ""}`}
      >
        <div className="flex flex-col gap-3">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setReviewRating(n)} aria-label={`${n} stars`}>
                <Star className={`h-7 w-7 ${n <= reviewRating ? "fill-gold text-gold" : "text-line"}`} />
              </button>
            ))}
          </div>
          <textarea
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            placeholder="How was this product?"
            rows={3}
            className="w-full rounded border border-line bg-paper p-2 text-sm text-ink outline-none focus:border-gold"
          />
          <Button onClick={submitProductReview} loading={submittingProductReview} className="self-start">
            Submit review
          </Button>
        </div>
      </Modal>

      <Modal open={!!payingOrderId} onClose={() => setPayingOrderId(null)} title="Complete payment">
        {payingOrderId && <Payment orderId={payingOrderId} />}
      </Modal>

      <Modal open={!!disputingOrder} onClose={() => setDisputingOrder(null)} title={`Report an issue — Order #${disputingOrder?.id}`}>
        <div className="flex flex-col gap-3">
          <Input label="Reason" placeholder="e.g. Item damaged, wrong item, quality issue" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} />
          <textarea
            value={disputeDescription}
            onChange={(e) => setDisputeDescription(e.target.value)}
            placeholder="Tell us more (optional)"
            rows={3}
            className="w-full rounded border border-line bg-paper p-2 text-sm text-ink outline-none focus:border-gold"
          />
          <Button onClick={submitDispute} loading={filingDispute} className="self-start">Submit</Button>
        </div>
      </Modal>
    </div>
  );
}
