import { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";

import { getFarmerAgriInputAdsApi } from "../../api/agriInputApi";

export default function AgriInputBanner() {
  const [ads, setAds] = useState([]);

  useEffect(() => {
    getFarmerAgriInputAdsApi().then(setAds).catch(() => {});
  }, []);

  if (ads.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-line bg-card p-4">
      <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ink/40">
        <Megaphone className="h-3.5 w-3.5" /> Sponsored — fertilizers & pesticides
      </p>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {ads.map((ad) => (
          <div key={ad.id} className="min-w-[180px] flex-shrink-0 rounded border border-line bg-paper p-3">
            <p className="text-sm font-medium text-ink">{ad.name}</p>
            <p className="text-xs text-ink/50">{ad.companyName}</p>
            <p className="mt-1 text-sm text-gold-dark">₹{ad.price} / {ad.unit || "unit"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
