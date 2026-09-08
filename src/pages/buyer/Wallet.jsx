import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import toast from "react-hot-toast";

import { fetchWalletThunk, fetchWalletTransactionsThunk } from "../../redux/thunks/walletThunk";
import { fetchEmiPlansThunk, payEmiInstallmentThunk } from "../../redux/thunks/emiThunk";
import { getBuyerRefundsApi } from "../../api/refundApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";

const REFUND_TONE = {
  INITIATED: "gold",
  COMPLETED: "field",
  FAILED: "rust",
};

const EMI_TONE = {
  PENDING: "gold",
  PAID: "field",
  OVERDUE: "rust",
};

export default function WalletPage() {
  const dispatch = useDispatch();
  const { balance, transactions, loading } = useSelector((state) => state.wallet);
  const { plans: emiPlans, loading: emiLoading } = useSelector((state) => state.emi);

  const [refunds, setRefunds] = useState([]);
  const [refundsLoading, setRefundsLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  useEffect(() => {
    dispatch(fetchWalletThunk());
    dispatch(fetchWalletTransactionsThunk());
    dispatch(fetchEmiPlansThunk());

    getBuyerRefundsApi()
      .then(setRefunds)
      .catch(() => toast.error("Could not load refunds"))
      .finally(() => setRefundsLoading(false));
  }, [dispatch]);

  const payInstallment = async (id) => {
    setPayingId(id);
    const result = await dispatch(payEmiInstallmentThunk(id));
    setPayingId(null);

    if (payEmiInstallmentThunk.fulfilled.match(result)) {
      toast.success("Installment paid");
      dispatch(fetchWalletThunk());
    } else {
      toast.error(result.payload?.message || "Could not pay installment");
    }
  };

  return (
    <div>
      <PageHeader title="Wallet" subtitle="Your balance, refunds, and EMI plans." />

      <div className="mb-6 flex items-center gap-4 rounded-xl border border-line bg-card p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-light text-gold-dark">
          <WalletIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-ink/50">Balance</p>
          <p className="font-display text-2xl text-ink">
            {loading ? "…" : `₹${(balance ?? 0).toFixed(2)}`}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="mb-3 font-display text-lg text-ink">Transactions</h3>
        {loading ? (
          <Loader label="Loading transactions..." />
        ) : !transactions?.length ? (
          <EmptyState title="No transactions yet" description="Refunds and EMI payments will show up here." />
        ) : (
          <div className="flex flex-col gap-2">
            {transactions.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-line bg-card p-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      t.type === "CREDIT" ? "bg-field-light text-field-dark" : "bg-rust-light text-rust"
                    }`}
                  >
                    {t.type === "CREDIT" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-ink">{t.reason || t.referenceType}</p>
                    <p className="text-xs text-ink/50">
                      {t.createdAt ? new Date(t.createdAt).toLocaleString() : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${t.type === "CREDIT" ? "text-field-dark" : "text-rust"}`}>
                    {t.type === "CREDIT" ? "+" : "-"}₹{t.amount?.toFixed(2)}
                  </p>
                  <p className="text-xs text-ink/40">Bal: ₹{t.balanceAfter?.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-8">
        <h3 className="mb-3 font-display text-lg text-ink">Refunds</h3>
        {refundsLoading ? (
          <Loader label="Loading refunds..." />
        ) : !refunds.length ? (
          <EmptyState title="No refunds" description="Refunds from cancellations or returns will show up here." />
        ) : (
          <div className="flex flex-col gap-2">
            {refunds.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ink">Order #{r.orderId}</span>
                    <Badge text={r.status} tone={REFUND_TONE[r.status] || "neutral"} />
                  </div>
                  <p className="text-xs text-ink/50">{r.reason}</p>
                </div>
                <p className="text-sm font-medium text-field-dark">+₹{r.amount?.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 font-display text-lg text-ink">EMI plans</h3>
        {emiLoading ? (
          <Loader label="Loading EMI plans..." />
        ) : !emiPlans?.length ? (
          <EmptyState
            title="No EMI plans"
            description="Choose 'Pay via EMI' on an unpaid online order to split it into installments."
          />
        ) : (
          <div className="flex flex-col gap-4">
            {emiPlans.map((plan) => (
              <div key={plan.id} className="rounded-lg border border-line bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-display text-ink">
                    Order #{plan.orderId} · ₹{plan.totalAmount?.toFixed(2)}
                  </h4>
                  <span className="text-xs text-ink/50">{plan.numberOfInstallments} installments</span>
                </div>
                <div className="flex flex-col gap-2">
                  {plan.installments?.map((i) => (
                    <div key={i.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-ink/70">
                          #{i.installmentNumber} · ₹{i.amount?.toFixed(2)}
                        </span>
                        <Badge text={i.status} tone={EMI_TONE[i.status] || "neutral"} />
                        <span className="text-xs text-ink/40">
                          Due {i.dueDate ? new Date(i.dueDate).toLocaleDateString() : ""}
                        </span>
                      </div>
                      {i.status !== "PAID" && (
                        <Button size="sm" loading={payingId === i.id} onClick={() => payInstallment(i.id)}>
                          Pay from wallet
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
