import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Power } from "lucide-react";

import { getAllNoticesApi, createNoticeApi, setNoticeStatusApi } from "../../api/noticeApi";
import { getActiveDepartmentsApi } from "../../api/departmentApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const EMPTY = { title: "", content: "", departmentId: "", targetRole: "ALL" };

export default function Notices() {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([getAllNoticesApi(), getActiveDepartmentsApi()])
      .then(([n, d]) => {
        setNotices(n);
        setDepartments(d);
      })
      .catch(() => toast.error("Could not load notices"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const created = await createNoticeApi({ ...form, departmentId: form.departmentId || null });
      setNotices((prev) => [created, ...prev]);
      toast.success("Notice published");
      setForm(EMPTY);
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not publish notice");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (n) => {
    try {
      await setNoticeStatusApi(n.id, !n.active);
      setNotices((prev) => prev.map((x) => (x.id === n.id ? { ...x, active: !x.active } : x)));
    } catch {
      toast.error("Could not update notice");
    }
  };

  return (
    <div>
      <PageHeader
        title="Government notices"
        subtitle="Announcements shown to farmers and buyers."
        action={<Button onClick={() => setModalOpen(true)}><Plus className="h-4 w-4" /> New notice</Button>}
      />

      {loading ? (
        <Loader label="Loading notices..." />
      ) : !notices.length ? (
        <EmptyState title="No notices yet" description="Publish one to reach farmers and buyers." />
      ) : (
        <div className="flex flex-col gap-3">
          {notices.map((n) => (
            <div key={n.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{n.title}</h4>
                    <Badge text={n.active ? "Active" : "Inactive"} tone={n.active ? "field" : "neutral"} />
                    <Badge text={n.targetRole} tone="slate" />
                    {n.departmentName && <Badge text={n.departmentName} tone="gold" />}
                  </div>
                  <p className="mt-1 text-sm text-ink/70">{n.content}</p>
                  <p className="mt-1 text-xs text-ink/40">
                    {n.createdByName} · {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="mt-3" onClick={() => toggleActive(n)}>
                <Power className="h-3.5 w-3.5" /> {n.active ? "Deactivate" : "Reactivate"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New notice">
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <TextArea label="Content" rows={4} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
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
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Audience</label>
              <select
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                <option value="ALL">Everyone</option>
                <option value="FARMER">Farmers</option>
                <option value="BUYER">Buyers</option>
              </select>
            </div>
          </div>
          <Button type="submit" loading={saving} className="self-start">Publish notice</Button>
        </form>
      </Modal>
    </div>
  );
}
