import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ChevronDown, LifeBuoy } from "lucide-react";

import { createSupportTicketApi, getMySupportTicketsApi } from "../../api/supportApi";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const FAQS = [
  {
    category: "Orders",
    items: [
      {
        q: "How do I track my order?",
        a: "Open My Orders — once a farmer adds tracking info you'll see the carrier, tracking number, and a delivery timeline right on the order card.",
      },
      {
        q: "Can I cancel an order after placing it?",
        a: "Yes, as long as it hasn't shipped yet. Open My Orders and use Cancel — if you'd already paid, the amount is refunded to your Wallet.",
      },
      {
        q: "How do returns work?",
        a: "Once an order is marked Delivered, you can request a return from My Orders. The farmer (or an admin) reviews it, and an approved-and-completed return refunds you to your Wallet.",
      },
    ],
  },
  {
    category: "Payments & Wallet",
    items: [
      {
        q: "Where do refunds go?",
        a: "Refunds are credited to your in-app Wallet, not your original payment method — you can spend that balance on EMI installments or see the full transaction history under Wallet.",
      },
      {
        q: "What is EMI here?",
        a: "For eligible online orders (₹1000+), you can split payment into 2–12 installments from the Wallet page. The order is confirmed right away; installments come out of your wallet balance.",
      },
      {
        q: "I don't see my payment reflected — what do I do?",
        a: "Give it a few minutes for the gateway to confirm. If it still doesn't show, file a support ticket below with your order number and we'll look into it.",
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        q: "How do I deactivate or delete my account?",
        a: "Go to Profile > Account settings. Deactivating signs you out but is fully reversible — just log back in. Deleting is permanent and removes your personal details.",
      },
      {
        q: "I deactivated my account — how do I come back?",
        a: "Just log in again with your usual email and password. It reactivates automatically.",
      },
    ],
  },
];

const STATUS_TONE = { OPEN: "gold", RESOLVED: "field" };

export default function HelpCenter() {
  const isAuthenticated = useSelector((state) => !!state.auth.token);

  const [openFaq, setOpenFaq] = useState(null);
  const [form, setForm] = useState({ category: "Orders", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);

  const loadTickets = () => {
    if (!isAuthenticated) return;
    getMySupportTicketsApi().then(setTickets).catch(() => {});
  };

  useEffect(() => {
    loadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const submitTicket = async (e) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      toast.error("Please fill in a subject and message");
      return;
    }

    setSubmitting(true);
    try {
      await createSupportTicketApi(form);
      toast.success("Ticket submitted — we'll get back to you soon.");
      setForm({ category: "Orders", subject: "", message: "" });
      loadTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit ticket");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex items-center gap-2">
        <LifeBuoy className="h-7 w-7 text-gold-dark" />
        <h1 className="font-display text-3xl text-ink">Help Center</h1>
      </div>
      <p className="mt-2 text-ink/60">Answers to common questions, and a direct line to support.</p>

      <div className="mt-10 flex flex-col gap-8">
        {FAQS.map((group) => (
          <div key={group.category}>
            <h2 className="font-display text-lg text-ink">{group.category}</h2>
            <div className="mt-3 flex flex-col gap-2">
              {group.items.map((item) => {
                const key = `${group.category}-${item.q}`;
                const open = openFaq === key;
                return (
                  <div key={key} className="rounded-lg border border-line bg-card">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(open ? null : key)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-ink"
                    >
                      {item.q}
                      <ChevronDown className={`h-4 w-4 shrink-0 text-ink/40 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    {open && <p className="px-4 pb-3 text-sm text-ink/60">{item.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-xl text-ink">Still need help?</h2>

        {!isAuthenticated ? (
          <p className="mt-3 text-sm text-ink/60">
            <Link to="/login" className="font-medium text-gold-dark hover:underline">Log in</Link> to file a
            support ticket we can track and follow up on.
          </p>
        ) : (
          <>
            <form onSubmit={submitTicket} className="mt-4 flex flex-col gap-4 rounded-lg border border-line bg-card p-6">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-ink">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
                >
                  <option>Orders</option>
                  <option>Payments</option>
                  <option>Account</option>
                  <option>Other</option>
                </select>
              </div>
              <Input
                label="Subject"
                required
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
              <TextArea
                label="Message"
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <Button type="submit" loading={submitting} className="self-start">
                Submit ticket
              </Button>
            </form>

            {tickets.length > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-base text-ink">Your tickets</h3>
                <div className="mt-3 flex flex-col gap-2">
                  {tickets.map((t) => (
                    <div key={t.id} className="rounded-lg border border-line bg-card p-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ink">{t.subject}</p>
                        <Badge text={t.status} tone={STATUS_TONE[t.status] || "neutral"} />
                      </div>
                      <p className="mt-1 text-xs text-ink/50">{t.category}</p>
                      <p className="mt-2 text-sm text-ink/70">{t.message}</p>
                      {t.adminResponse && (
                        <div className="mt-2 rounded bg-paper p-2 text-xs text-ink/70">
                          <span className="font-medium text-ink">Support: </span>
                          {t.adminResponse}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
