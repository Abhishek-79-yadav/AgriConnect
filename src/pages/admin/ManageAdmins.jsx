import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, ShieldCheck } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { getAdminsApi, createAdminApi, deleteAdminApi } from "../../api/adminApi";

const EMPTY = { name: "", email: "", password: "" };

export default function ManageAdmins() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setAdmins(await getAdminsApi());
    } catch {
      toast.error("Could not load admins");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setSubmitting(true);
    try {
      await createAdminApi(form);
      toast.success("Admin created");
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create admin");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteAdminApi(id);
      toast.success("Admin removed");
      setAdmins((a) => a.filter((x) => x.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove admin");
    }
  };

  return (
    <div>
      <PageHeader title="Manage admins" subtitle="Create or remove admin accounts. Only you (super admin) can do this." />

      <Button onClick={() => setShowForm((v) => !v)} className="mb-4">
        <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Create admin"}
      </Button>

      {showForm && (
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-card p-4">
          <Input label="Name" required value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" required value={form.email} onChange={set("email")} />
          <Input label="Password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
          <Button type="submit" loading={submitting} className="self-start">Create</Button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <div className="flex flex-col gap-2">
          {admins.map((a) => (
            <div key={a.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className={`h-5 w-5 ${a.role === "SUPER_ADMIN" ? "text-gold-dark" : "text-ink/40"}`} />
                <div>
                  <p className="font-medium text-ink">{a.name} {a.role === "SUPER_ADMIN" && "(you)"}</p>
                  <p className="text-xs text-ink/50">{a.email}</p>
                </div>
              </div>
              {a.role === "ADMIN" && (
                <button onClick={() => remove(a.id)} aria-label="Remove admin" className="text-ink/40 hover:text-rust">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
