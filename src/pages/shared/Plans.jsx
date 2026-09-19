import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Sparkles, ShieldCheck, CreditCard } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Skeleton from "../../components/ui/Skeleton";
import EmptyState from "../../components/ui/EmptyState";
import { getPlansApi, subscribeApi, getMySubscriptionsApi } from "../../api/agriInputApi";

// Breaks a plan's description into a clean bullet list. Falls back to a
// single paragraph when it's just plain prose with no natural separators.
function parseFeatures(description) {
  if (!description) return [];
  const parts = description
    .split(/\r?\n|•|·|(?<=[a-z0-9%])\s*,\s*(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [description];
}

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [mySubs, setMySubs] = useState([]);
  const [subscribingId, setSubscribingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [planData, subData] = await Promise.all([getPlansApi(), getMySubscriptionsApi()]);
      setPlans(planData);
      setMySubs(subData);
    } catch {
      toast.error("Could not load plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeSub = mySubs.find((s) => s.currentlyValid);

  const subscribe = async (planId) => {
    setSubscribingId(planId);
    try {
      await subscribeApi(planId);
      toast.success("Subscribed! You now have marketplace access.");
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not subscribe");
    } finally {
      setSubscribingId(null);
    }
  };

  const sortedPlans = [...plans].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const premiumId = sortedPlans.find((p) => p.tier === "PREMIUM")?.id;

  return (
    <div>
      <PageHeader
        title="Agri-input marketplace plans"
        subtitle="Subscribe to list or buy fertilizers and pesticides on AgriConnect."
      />

      {activeSub && (
        <div className="mb-6 flex flex-wrap items-center gap-2 rounded-lg border border-field bg-field-light p-4 text-sm text-field-dark">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>
            You're on the <strong>{activeSub.planName}</strong> plan until{" "}
            {new Date(activeSub.endDate).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            .
          </span>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="rounded-xl border border-line bg-card p-6">
              <Skeleton height={20} width="40%" className="mb-3" />
              <Skeleton height={32} width="55%" className="mb-4" />
              <Skeleton height={12} width="90%" className="mb-2" />
              <Skeleton height={12} width="75%" className="mb-5" />
              <Skeleton height={40} width="100%" rounded="rounded-lg" />
            </div>
          ))}
        </div>
      ) : sortedPlans.length === 0 ? (
        <EmptyState
          icon={CreditCard}
          title="No plans available right now"
          description="Check back soon, or contact support if you think this is a mistake."
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:gap-6">
            {sortedPlans.map((plan) => {
              const isPremium = plan.id === premiumId;
              const isCurrent = activeSub?.planTier === plan.tier;
              const perDay = plan.durationDays ? (plan.price / plan.durationDays).toFixed(2) : null;

              return (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-xl border bg-card p-6 transition hover:shadow-lg ${
                    isPremium
                      ? "border-gold shadow-md shadow-gold/10 sm:scale-[1.02]"
                      : "border-line"
                  }`}
                >
                  {isPremium && (
                    <span className="absolute -top-3 left-6 inline-flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white shadow">
                      <Sparkles className="h-3.5 w-3.5" /> Most popular
                    </span>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-xl text-ink">{plan.name}</h3>
                    {isCurrent && <Badge text="Current plan" tone="field" />}
                  </div>

                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="font-display text-4xl text-ink">₹{plan.price}</span>
                    <span className="text-sm text-ink/50">/ {plan.durationDays} days</span>
                  </div>
                  {perDay && (
                    <p className="mt-1 text-xs text-ink/40">
                      Works out to ₹{perDay} per day
                    </p>
                  )}

                  <ul className="mt-5 flex-1 space-y-2.5">
                    {parseFeatures(plan.description).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-ink/70">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-field-dark" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => subscribe(plan.id)}
                    loading={subscribingId === plan.id}
                    disabled={isCurrent}
                    variant={isPremium ? "primary" : "outline"}
                    size="lg"
                    className="mt-6 w-full"
                  >
                    {isCurrent ? "Currently active" : activeSub ? "Switch to this plan" : "Subscribe"}
                  </Button>
                </div>
              );
            })}
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-center text-xs text-ink/40">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure checkout · Cancel or switch plans anytime
          </p>
        </>
      )}
    </div>
  );
}
