import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Power } from "lucide-react";

import { getManagedSchemesApi, createSchemeApi, updateSchemeApi, reactivateSchemeApi, deactivateSchemeApi } from "../../api/schemeApi";
import { getActiveDepartmentsApi } from "../../api/departmentApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const EMPTY = { title: "", description: "", state: "", category: "", applyLink: "", departmentId: "", eligibilityCriteria: "" };

export default function GovernmentSchemes() {
  const [schemes, setSchemes] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getManagedSchemesApi(), getActiveDepartmentsApi()])
      .then(([s, d]) => {
        setSchemes(s);
        setDepartments(d);
      })
      .catch(() => toast.error("Could not load schemes"))
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

  const openEdit = (s) => {
    setEditingId(s.id);
    setForm({
      title: s.title,
      description: s.description || "",
      state: s.state || "",
      category: s.category || "",
      applyLink: s.applyLink || "",
      departmentId: s.departmentId || "",
      eligibilityCriteria: s.eligibilityCriteria || "",
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    setSaving(true);
    const payload = { ...form, departmentId: form.departmentId || null };
    try {
      if (editingId) {
        const updated = await updateSchemeApi(editingId, payload);
        setSchemes((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
        toast.success("Scheme updated");
      } else {
        const created = await createSchemeApi(payload);
        setSchemes((prev) => [created, ...prev]);
        toast.success("Scheme created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save scheme");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (s) => {
    try {
      if (s.active) {
        await deactivateSchemeApi(s.id);
      } else {
        await reactivateSchemeApi(s.id);
      }
      setSchemes((prev) => prev.map((x) => (x.id === s.id ? { ...x, active: !x.active } : x)));
    } catch {
      toast.error("Could not update scheme");
    }
  };

  return (
    <div>
      <PageHeader
        title="Government schemes"
        subtitle="Create and manage schemes, eligibility, and departments."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> New scheme</Button>}
      />

      {loading ? (
        <Loader label="Loading schemes..." />
      ) : !schemes.length ? (
        <EmptyState title="No schemes yet" description="Create one to make it visible to farmers." />
      ) : (
        <div className="flex flex-col gap-3">
          {schemes.map((s) => (
            <div key={s.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{s.title}</h4>
                    <Badge text={s.active ? "Active" : "Inactive"} tone={s.active ? "field" : "neutral"} />
                    {s.departmentName && <Badge text={s.departmentName} tone="slate" />}
                  </div>
                  {s.description && <p className="mt-1 text-sm text-ink/60">{s.description}</p>}
                  {s.eligibilityCriteria && (
                    <p className="mt-1 text-xs text-ink/50"><span className="font-medium">Eligibility:</span> {s.eligibilityCriteria}</p>
                  )}
                  <p className="mt-1 text-xs text-ink/40">
                    {s.state || "All India"} {s.category ? `· ${s.category}` : ""}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(s)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(s)}>
                  <Power className="h-3.5 w-3.5" /> {s.active ? "Deactivate" : "Reactivate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit scheme" : "New scheme"}>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextArea label="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextArea
            label="Eligibility criteria"
            rows={2}
            placeholder="e.g. Small/marginal farmers with land holding under 2 hectares"
            value={form.eligibilityCriteria}
            onChange={(e) => setForm({ ...form, eligibilityCriteria: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input label="State (blank = All India)" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            <Input label="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-ink">Department</label>
            <select
              value={form.departmentId}
              onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
              className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
            >
              <option value="">None</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>
          <Input label="Apply link (URL)" value={form.applyLink} onChange={(e) => setForm({ ...form, applyLink: e.target.value })} />
          <Button type="submit" loading={saving} className="self-start">Save scheme</Button>
        </form>
      </Modal>
    </div>
  );
}
