import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Power } from "lucide-react";

import { getAllTaxConfigApi, createTaxConfigApi, updateTaxConfigApi, setTaxConfigStatusApi } from "../../api/taxConfigApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const EMPTY = { taxType: "", category: "", ratePercent: "", description: "", effectiveFrom: "" };

export default function TaxConfig() {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllTaxConfigApi()
      .then(setConfigs)
      .catch(() => toast.error("Could not load tax configuration"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      taxType: c.taxType,
      category: c.category || "",
      ratePercent: c.ratePercent,
      description: c.description || "",
      effectiveFrom: c.effectiveFrom || "",
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.taxType.trim() || form.ratePercent === "") {
      toast.error("Tax type and rate are required");
      return;
    }
    setSaving(true);
    const payload = { ...form, ratePercent: Number(form.ratePercent) };
    try {
      if (editingId) {
        const updated = await updateTaxConfigApi(editingId, payload);
        setConfigs((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Tax config updated");
      } else {
        const created = await createTaxConfigApi(payload);
        setConfigs((prev) => [created, ...prev]);
        toast.success("Tax config created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save tax config");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (c) => {
    try {
      await setTaxConfigStatusApi(c.id, !c.active);
      setConfigs((prev) => prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)));
    } catch {
      toast.error("Could not update tax config");
    }
  };

  return (
    <div>
      <PageHeader
        title="Tax configuration"
        subtitle="Reference tax rates by type and category."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> New rate</Button>}
      />

      {loading ? (
        <Loader label="Loading tax configuration..." />
      ) : !configs.length ? (
        <EmptyState title="No tax rates configured" description="Add reference rates for GST, mandi tax, cess, etc." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {configs.map((c) => (
            <div key={c.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-ink">{c.taxType}</h4>
                  <Badge text={c.active ? "Active" : "Inactive"} tone={c.active ? "field" : "neutral"} />
                </div>
                <span className="font-display text-lg text-gold-dark">{c.ratePercent}%</span>
              </div>
              {c.category && <p className="mt-1 text-sm text-ink/60">Category: {c.category}</p>}
              {c.description && <p className="text-xs text-ink/50">{c.description}</p>}
              {c.effectiveFrom && <p className="text-xs text-ink/40">Effective from {c.effectiveFrom}</p>}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(c)}>
                  <Power className="h-3.5 w-3.5" /> {c.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit tax rate" : "New tax rate"}>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Tax type (e.g. GST, Mandi Tax, Cess)" value={form.taxType} onChange={(e) => setForm({ ...form, taxType: e.target.value })} required />
          <Input label="Category (optional)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input label="Rate (%)" type="number" step="0.01" value={form.ratePercent} onChange={(e) => setForm({ ...form, ratePercent: e.target.value })} required />
          <Input label="Effective from" type="date" value={form.effectiveFrom} onChange={(e) => setForm({ ...form, effectiveFrom: e.target.value })} />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button type="submit" loading={saving} className="self-start">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
