import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import RequireSubscription from "../../components/common/RequireSubscription";
import { browseAgriInputsApi } from "../../api/agriInputApi";

function AgriInputsBrowseContent() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    browseAgriInputsApi()
      .then(setItems)
      .catch(() => toast.error("Could not load marketplace"))
      .finally(() => setLoading(false));
  }, []);

  return loading ? (
    <p className="text-sm text-ink/50">Loading…</p>
  ) : items.length === 0 ? (
    <p className="text-sm text-ink/50">No listings available yet.</p>
  ) : (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="rounded-lg border border-line bg-card p-4">
          <p className="font-medium text-ink">{item.name}</p>
          <p className="text-xs text-ink/50">{item.category} · {item.companyName}</p>
          {item.description && <p className="mt-1 text-sm text-ink/60">{item.description}</p>}
          <p className="mt-2 font-display text-lg text-gold-dark">₹{item.price} / {item.unit || "unit"}</p>
        </div>
      ))}
    </div>
  );
}

export default function AgriInputsBrowse() {
  return (
    <div>
      <PageHeader title="Agri-input marketplace" subtitle="Fertilizers and pesticides from AgriConnect partner companies." />
      <RequireSubscription
        plansPath="/buyer/plans"
        title="Subscribe to browse the marketplace"
        description="An active plan is needed to browse fertilizers and pesticides from partner companies."
      >
        <AgriInputsBrowseContent />
      </RequireSubscription>
    </div>
  );
}
