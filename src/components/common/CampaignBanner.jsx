import { useEffect, useRef, useState } from "react";
import { Megaphone, X } from "lucide-react";

import { getLiveCampaignsApi, recordCampaignImpressionApi, recordCampaignClickApi } from "../../api/campaignApi";

// Shows live marketing campaigns for a given audience (ALL on the public
// homepage, BUYER/FARMER on their dashboards). Each campaign fires one
// impression ping the first time it's actually rendered — not on every
// re-render — and a click ping when followed.
export default function CampaignBanner({ role = "ALL" }) {
  const [campaigns, setCampaigns] = useState([]);
  const [dismissed, setDismissed] = useState([]);
  const trackedImpressions = useRef(new Set());

  useEffect(() => {
    getLiveCampaignsApi(role).then(setCampaigns).catch(() => {});
  }, [role]);

  useEffect(() => {
    campaigns.forEach((c) => {
      if (!trackedImpressions.current.has(c.id)) {
        trackedImpressions.current.add(c.id);
        recordCampaignImpressionApi(c.id);
      }
    });
  }, [campaigns]);

  const visible = campaigns.filter((c) => !dismissed.includes(c.id));
  if (visible.length === 0) return null;

  const handleClick = (c) => {
    recordCampaignClickApi(c.id);
    if (c.linkUrl) {
      const isExternal = /^https?:\/\//.test(c.linkUrl);
      if (isExternal) window.open(c.linkUrl, "_blank", "noopener,noreferrer");
      else window.location.href = c.linkUrl;
    }
  };

  return (
    <div className="mb-6 flex flex-col gap-3">
      {visible.map((c) => (
        <div
          key={c.id}
          className="relative overflow-hidden rounded-xl border border-line bg-card"
        >
          <button
            onClick={() => setDismissed((prev) => [...prev, c.id])}
            aria-label="Dismiss"
            className="absolute right-2 top-2 z-10 rounded-full bg-ink/40 p-1 text-white hover:bg-ink/60"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {c.bannerImageUrl ? (
            <button onClick={() => handleClick(c)} className="block w-full text-left">
              <img src={c.bannerImageUrl} alt={c.name} className="max-h-64 w-full object-cover" />
            </button>
          ) : null}

          <div className="flex items-center justify-between gap-3 p-4">
            <div>
              <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold-dark">
                <Megaphone className="h-3.5 w-3.5" /> {c.type.replace("_", " ")}
              </p>
              <p className="mt-1 font-display text-lg text-ink">{c.name}</p>
              {c.description && <p className="text-sm text-ink/60">{c.description}</p>}
              {c.couponCode && (
                <p className="mt-1 text-sm text-field-dark">
                  Use code <span className="font-mono font-semibold">{c.couponCode}</span>
                </p>
              )}
            </div>
            {c.linkUrl && (
              <button
                onClick={() => handleClick(c)}
                className="shrink-0 rounded-lg bg-gold px-4 py-2 text-sm font-medium text-white hover:bg-gold-dark"
              >
                View
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
