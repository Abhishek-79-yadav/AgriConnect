import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Warehouse } from "lucide-react";

import { applyForLicenseApi, getMyLicensesApi } from "../../api/warehouseLicenseApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const STATUS_TONE = {
  PENDING: "gold",
  ACTIVE: "field",
  REJECTED: "rust",
  SUSPENDED: "slate",
  CANCELLED: "rust",
  EXPIRED: "neutral",
};

const EMPTY = { warehouseName: "", location: "", capacityTonnes: "", documentUrl: "" };

export default function WarehouseLicenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    getMyLicensesApi()
      .then(setLicenses)
      .catch(() => toast.error("Could not load your license applications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.warehouseName.trim()) {
      toast.error("Warehouse name is required");
      return;
    }
    setSubmitting(true);
    try {
      const created = await applyForLicenseApi({
        ...form,
        capacityTonnes: form.capacityTonnes ? Number(form.capacityTonnes) : undefined,
      });
      setLicenses((prev) => [created, ...prev]);
      toast.success("License application submitted");
      setForm(EMPTY);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Warehouse licenses"
        subtitle="Apply for and track your warehouse storage licenses."
        action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> Apply for license</Button>}
      />

      {loading ? (
        <Loader label="Loading your licenses..." />
      ) : !licenses.length ? (
        <EmptyState title="No license applications yet" description="Apply for a warehouse license to get started." />
      ) : (
        <div className="flex flex-col gap-3">
          {licenses.map((l) => (
            <div key={l.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-2">
                <Warehouse className="h-4 w-4 text-slate" />
                <h4 className="font-display text-ink">{l.warehouseName}</h4>
                <Badge text={l.status} tone={STATUS_TONE[l.status] || "neutral"} />
              </div>
              {l.location && <p className="mt-1 text-sm text-ink/60">{l.location}{l.capacityTonnes ? ` · ${l.capacityTonnes}t capacity` : ""}</p>}
              {l.licenseNumber && <p className="mt-1 text-xs text-ink/50">License #{l.licenseNumber}</p>}
              {l.expiryDate && <p className="text-xs text-ink/50">Valid until {l.expiryDate}</p>}
              {l.remarks && <p className="mt-1 text-xs text-ink/50">Note from reviewer: {l.remarks}</p>}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Apply for a warehouse license">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Warehouse name" required value={form.warehouseName} onChange={(e) => setForm({ ...form, warehouseName: e.target.value })} />
          <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input label="Capacity (tonnes)" type="number" value={form.capacityTonnes} onChange={(e) => setForm({ ...form, capacityTonnes: e.target.value })} />
          <Input label="Document URL (proof/certificate)" value={form.documentUrl} onChange={(e) => setForm({ ...form, documentUrl: e.target.value })} />
          <Button type="submit" loading={submitting} className="self-start">Submit application</Button>
        </form>
      </Modal>
    </div>
  );
}
