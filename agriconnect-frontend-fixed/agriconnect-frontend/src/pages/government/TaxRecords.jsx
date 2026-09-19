import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, CheckCircle2 } from "lucide-react";

import { getAllTaxRecordsApi, createTaxRecordApi, updateTaxRecordStatusApi } from "../../api/taxRecordApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const STATUS_TONE = { PENDING: "gold", PAID: "field", OVERDUE: "rust", WAIVED: "neutral" };

const EMPTY = { userId: "", period: "", taxableAmount: "", taxAmount: "", taxType: "GST", dueDate: "", remarks: "" };

export default function TaxRecords() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getAllTaxRecordsApi()
      .then(setRecords)
      .catch(() => toast.error("Could not load tax records"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.userId || !form.period.trim() || !form.taxableAmount || !form.taxAmount) {
      toast.error("User ID, period, taxable amount, and tax amount are required");
      return;
    }
    setSaving(true);
    try {
      const created = await createTaxRecordApi({
        ...form,
        userId: Number(form.userId),
        taxableAmount: Number(form.taxableAmount),
        taxAmount: Number(form.taxAmount),
      });
      setRecords((prev) => [created, ...prev]);
      toast.success("Tax record created");
      setForm(EMPTY);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create tax record");
    } finally {
      setSaving(false);
    }
  };

  const markPaid = async (r) => {
    setBusyId(r.id);
    try {
      const updated = await updateTaxRecordStatusApi(r.id, "PAID");
      setRecords((prev) => prev.map((x) => (x.id === r.id ? updated : x)));
      toast.success("Marked paid");
    } catch {
      toast.error("Could not update record");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tax records"
        subtitle="Track GST/tax filings and dues for farmers and brands."
        action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New record</Button>}
      />

      {loading ? (
        <Loader label="Loading tax records..." />
      ) : !records.length ? (
        <EmptyState title="No tax records yet" description="Create a record against a farmer or brand's user ID." />
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((r) => (
            <div key={r.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{r.userName} <span className="text-xs text-ink/40">({r.userRole})</span></h4>
                    <Badge text={r.status} tone={STATUS_TONE[r.status] || "neutral"} />
                  </div>
                  <p className="mt-1 text-sm text-ink/60">
                    {r.taxType} · {r.period} · Taxable ₹{r.taxableAmount} · Tax ₹{r.taxAmount}
                  </p>
                  {r.dueDate && <p className="text-xs text-ink/50">Due {r.dueDate}</p>}
                  {r.remarks && <p className="text-xs text-ink/50">{r.remarks}</p>}
                </div>
              </div>
              {r.status === "PENDING" || r.status === "OVERDUE" ? (
                <Button size="sm" className="mt-3" loading={busyId === r.id} onClick={() => markPaid(r)}>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Mark paid
                </Button>
              ) : null}
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New tax record">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input
            label="User ID (farmer/brand)"
            type="number"
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            required
          />
          <Input label="Period (e.g. 2026-Q1)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Taxable amount (₹)" type="number" value={form.taxableAmount} onChange={(e) => setForm({ ...form, taxableAmount: e.target.value })} required />
            <Input label="Tax amount (₹)" type="number" value={form.taxAmount} onChange={(e) => setForm({ ...form, taxAmount: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Tax type" value={form.taxType} onChange={(e) => setForm({ ...form, taxType: e.target.value })} />
            <Input label="Due date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
          </div>
          <Input label="Remarks" value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} />
          <Button type="submit" loading={saving} className="self-start">Create record</Button>
        </form>
      </Modal>
    </div>
  );
}
