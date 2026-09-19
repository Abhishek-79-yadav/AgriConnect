import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Lock, Sparkles } from "lucide-react";

import Button from "../ui/Button";
import Skeleton from "../ui/Skeleton";
import { getMySubscriptionsApi } from "../../api/agriInputApi";

/**
 * Gates its children behind an active subscription. Checks subscription
 * status up front (instead of waiting for a protected API call to fail),
 * so the user sees the correct screen immediately and no wasted requests
 * are made for features they can't use yet.
 *
 * Usage:
 *   <RequireSubscription plansPath="/brand/plans" title="Subscribe to start listing products">
 *     <ActualPageContent />
 *   </RequireSubscription>
 */
export default function RequireSubscription({
  children,
  plansPath = "plans",
  title = "This feature needs an active plan",
  description = "Subscribe to a plan to unlock this — it only takes a minute.",
}) {
  const [status, setStatus] = useState("checking"); // checking | active | none

  useEffect(() => {
    let cancelled = false;
    getMySubscriptionsApi()
      .then((subs) => {
        if (cancelled) return;
        const active = Array.isArray(subs) && subs.some((s) => s.currentlyValid);
        setStatus(active ? "active" : "none");
      })
      .catch(() => {
        // If we can't confirm subscription status, fail closed rather than
        // silently letting an unsubscribed user through.
        if (!cancelled) setStatus("none");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "checking") {
    return (
      <div className="rounded-lg border border-line bg-card p-6">
        <Skeleton height={16} width="50%" className="mb-3" />
        <Skeleton height={12} width="85%" className="mb-2" />
        <Skeleton height={12} width="65%" />
      </div>
    );
  }

  if (status === "none") {
    return (
      <div className="rounded-lg border border-dashed border-gold/50 bg-gold-light/30 p-8 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold-light text-gold-dark">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-display text-lg text-ink">{title}</h3>
        <p className="mx-auto mt-1 max-w-sm text-sm text-ink/60">{description}</p>
        <Link to={plansPath}>
          <Button className="mt-4">
            <Sparkles className="h-4 w-4" /> View plans
          </Button>
        </Link>
      </div>
    );
  }

  return children;
}
