import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Wallet, CheckCircle2, RotateCcw } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { getPayoutsApi, markPayoutPaidApi } from "../../api/adminApi";
import { getAllRefundsApi } from "../../api/refundApi";

const REFUND_TONE = {
  INITIATED: "gold",
  COMPLETED: "field",
  FAILED: "rust",
};

export default function Payouts() {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);
  const [refunds, setRefunds] = useState([]);
  const [refundsLoading, setRefundsLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setFarmers(await getPayoutsApi());
    } catch {
      toast.error("Could not load payouts");
    } finally {
      setLoading(false);
    }
  };

  const loadRefunds = async () => {
    setRefundsLoading(true);
    try {
      setRefunds(await getAllRefundsApi());
    } catch {
      toast.error("Could not load refunds");
    } finally {
      setRefundsLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadRefunds();
  }, []);

  const markPaid = async (orderItemId) => {
    setPayingId(orderItemId);
    try {
      await markPayoutPaidApi(orderItemId);
      toast.success("Marked as paid out");
      await load();
    } catch {
      toast.error("Could not update payout");
    } finally {
      setPayingId(null);
    }
  };

  const totalPending = farmers.reduce((sum, f) => sum + f.pendingAmount, 0);

  return (
    <div>
      <PageHeader
        title="Farmer payouts"
        subtitle="Money collected from buyers that still needs to be paid out to farmers."
      />

      <div className="mb-6 rounded-lg border border-line bg-card p-5">
        <p className="flex items-center gap-2 text-sm text-ink/60">
          <Wallet className="h-4 w-4" /> Total pending across all farmers
        </p>
        <p className="mt-1 font-display text-3xl text-gold-dark">₹{totalPending.toFixed(2)}</p>
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : farmers.length === 0 ? (
        <p className="text-sm text-ink/50">No paid orders yet — nothing owed to any farmer.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {farmers.map((farmer) => (
            <div key={farmer.farmerId} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-ink">{farmer.farmerName}</p>
                  <p className="text-xs text-ink/50">{farmer.farmerEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-gold-dark">₹{farmer.pendingAmount.toFixed(2)} pending</p>
                  <p className="text-xs text-ink/50">₹{farmer.paidOutAmount.toFixed(2)} already paid out</p>
                </div>
              </div>

              {farmer.pendingItems.length > 0 && (
                <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3">
                  {farmer.pendingItems.map((line) => (
                    <div
                      key={line.orderItemId}
                      className="flex flex-wrap items-center justify-between gap-2 text-sm text-ink/70"
                    >
                      <span>
                        Order #{line.orderId} · {line.productName} × {line.quantity} — ₹{line.lineTotal.toFixed(2)}
                      </span>
                      <Button
                        variant="outline"
                        className="!py-1 !px-3 text-xs"
                        loading={payingId === line.orderItemId}
                        onClick={() => markPaid(line.orderItemId)}
                      >
                        <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Mark paid
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-10">
        <h3 className="mb-3 flex items-center gap-2 font-display text-lg text-ink">
          <RotateCcw className="h-4 w-4" /> Refunds
        </h3>
        {refundsLoading ? (
          <p className="text-sm text-ink/50">Loading…</p>
        ) : refunds.length === 0 ? (
          <p className="text-sm text-ink/50">No refunds issued yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {refunds.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">
                      Order #{r.orderId} · {r.buyerName}
                    </span>
                    <Badge text={r.status} tone={REFUND_TONE[r.status] || "neutral"} />
                  </div>
                  <p className="text-xs text-ink/50">{r.reason}</p>
                </div>
                <p className="text-sm font-medium text-rust">₹{r.amount?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
