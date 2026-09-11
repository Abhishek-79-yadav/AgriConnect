import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import { browseAgriInputsApi } from "../../api/agriInputApi";

export default function AgriInputsBrowse() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsPlan, setNeedsPlan] = useState(false);

  useEffect(() => {
    browseAgriInputsApi()
      .then(setItems)
      .catch((err) => {
        if (err.response?.status === 400 || err.response?.status === 403) {
          setNeedsPlan(true);
        } else {
          toast.error("Could not load marketplace");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  if (needsPlan) {
    return (
      <div>
        <PageHeader title="Agri-input marketplace" />
        <div className="rounded-lg border border-line bg-card p-6 text-center">
          <p className="text-sm text-ink/70">You need an active plan to browse fertilizers and pesticides.</p>
          <Link to="/buyer/plans">
            <Button className="mt-4">View plans</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Agri-input marketplace" subtitle="Fertilizers and pesticides from AgriConnect partner companies." />

      {loading ? (
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
      )}
    </div>
  );
}
