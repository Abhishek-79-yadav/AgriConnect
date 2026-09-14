import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Power } from "lucide-react";

import { getAllDepartmentsApi, createDepartmentApi, updateDepartmentApi, setDepartmentStatusApi } from "../../api/departmentApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const EMPTY = { name: "", description: "" };

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    getAllDepartmentsApi()
      .then(setDepartments)
      .catch(() => toast.error("Could not load departments"))
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

  const openEdit = (d) => {
    setEditingId(d.id);
    setForm({ name: d.name, description: d.description || "" });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateDepartmentApi(editingId, form);
        setDepartments((prev) => prev.map((d) => (d.id === editingId ? updated : d)));
        toast.success("Department updated");
      } else {
        const created = await createDepartmentApi(form);
        setDepartments((prev) => [...prev, created]);
        toast.success("Department created");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save department");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (d) => {
    try {
      await setDepartmentStatusApi(d.id, !d.active);
      setDepartments((prev) => prev.map((x) => (x.id === d.id ? { ...x, active: !x.active } : x)));
    } catch {
      toast.error("Could not update department");
    }
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        subtitle="Organize schemes and notices by department."
        action={<Button onClick={openCreate}><Plus className="h-4 w-4" /> New department</Button>}
      />

      {loading ? (
        <Loader label="Loading departments..." />
      ) : !departments.length ? (
        <EmptyState title="No departments yet" description="Create one to organize schemes and notices." />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {departments.map((d) => (
            <div key={d.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-display text-ink">{d.name}</h4>
                  <Badge text={d.active ? "Active" : "Inactive"} tone={d.active ? "field" : "neutral"} />
                </div>
              </div>
              {d.description && <p className="mt-1 text-sm text-ink/60">{d.description}</p>}
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => openEdit(d)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => toggleActive(d)}>
                  <Power className="h-3.5 w-3.5" /> {d.active ? "Deactivate" : "Activate"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit department" : "New department"}>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button type="submit" loading={saving} className="self-start">Save</Button>
        </form>
      </Modal>
    </div>
  );
}
