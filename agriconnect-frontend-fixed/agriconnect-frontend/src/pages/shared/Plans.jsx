import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, Sparkles } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import { getPlansApi, subscribeApi, getMySubscriptionsApi } from "../../api/agriInputApi";

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

  return (
    <div>
      <PageHeader
        title="Agri-input marketplace plans"
        subtitle="Subscribe to list or buy fertilizers and pesticides on AgriConnect."
      />

      {activeSub && (
        <div className="mb-6 flex items-center gap-2 rounded-lg border border-field bg-field-light p-4 text-sm text-field-dark">
          <CheckCircle2 className="h-5 w-5" />
          You're on the <strong>{activeSub.planName}</strong> plan until{" "}
          {new Date(activeSub.endDate).toLocaleDateString()}.
        </div>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {plans.map((plan) => (
            <div key={plan.id} className="flex flex-col rounded-lg border border-line bg-card p-6">
              <div className="flex items-center gap-2">
                {plan.tier === "PREMIUM" && <Sparkles className="h-5 w-5 text-gold-dark" />}
                <h3 className="font-display text-xl text-ink">{plan.name}</h3>
              </div>
              <p className="mt-2 font-display text-3xl text-gold-dark">
                ₹{plan.price}
                <span className="text-sm font-normal text-ink/50"> / {plan.durationDays} days</span>
              </p>
              <p className="mt-2 flex-1 text-sm text-ink/60">{plan.description}</p>
              <Button
                onClick={() => subscribe(plan.id)}
                loading={subscribingId === plan.id}
                variant={plan.tier === "PREMIUM" ? "primary" : "outline"}
                className="mt-4"
              >
                {activeSub?.planTier === plan.tier ? "Renew" : "Subscribe"}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
