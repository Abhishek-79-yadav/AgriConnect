import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building2, CheckCircle2 } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import { getPendingBrandsApi, approveBrandApi } from "../../api/adminApi";

export default function PendingBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      setBrands(await getPendingBrandsApi());
    } catch {
      toast.error("Could not load pending companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    setApprovingId(id);
    try {
      await approveBrandApi(id);
      toast.success("Company approved");
      setBrands((b) => b.filter((x) => x.id !== id));
    } catch {
      toast.error("Could not approve company");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Pending company approvals"
        subtitle="Companies (fertilizer/pesticide brands) waiting to be approved before they can log in."
      />

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : brands.length === 0 ? (
        <p className="text-sm text-ink/50">No pending company registrations.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {brands.map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-8 w-8 text-ink/40" />
                <div>
                  <p className="font-medium text-ink">{b.name}</p>
                  <p className="text-xs text-ink/50">{b.email} {b.mobile ? `· ${b.mobile}` : ""}</p>
                  {(b.city || b.state) && (
                    <p className="text-xs text-ink/50">{[b.city, b.state].filter(Boolean).join(", ")}</p>
                  )}
                </div>
              </div>
              <Button loading={approvingId === b.id} onClick={() => approve(b.id)}>
                <CheckCircle2 className="h-4 w-4" /> Approve
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
