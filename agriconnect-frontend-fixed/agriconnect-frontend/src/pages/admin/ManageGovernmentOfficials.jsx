import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Landmark } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import PasswordStrengthHint, { isStrongPassword } from "../../components/common/PasswordStrengthHint";
import {
  getGovernmentOfficialsApi,
  createGovernmentOfficialApi,
  deleteGovernmentOfficialApi,
} from "../../api/governmentOfficialApi";

const EMPTY = { name: "", email: "", password: "" };

export default function ManageGovernmentOfficials() {
  const [officials, setOfficials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setOfficials(await getGovernmentOfficialsApi());
    } catch {
      toast.error("Could not load government officials");
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
    if (!isStrongPassword(form.password)) {
      toast.error("Password must be at least 8 characters and include a letter, a number, and a special character");
      return;
    }
    setSubmitting(true);
    try {
      await createGovernmentOfficialApi(form);
      toast.success("Government official account created");
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create account");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteGovernmentOfficialApi(id);
      toast.success("Account removed");
      setOfficials((prev) => prev.filter((x) => x.id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not remove account");
    }
  };

  return (
    <div>
      <PageHeader
        title="Government officials"
        subtitle="Accounts that can manage schemes, warehouse licenses, and tax records."
      />

      <Button onClick={() => setShowForm((v) => !v)} className="mb-4">
        <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Create official account"}
      </Button>

      {showForm && (
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-card p-4">
          <Input label="Name" required value={form.name} onChange={set("name")} />
          <Input label="Email" type="email" required value={form.email} onChange={set("email")} />
          <div>
            <Input label="Password" type="password" required minLength={8} value={form.password} onChange={set("password")} />
            <PasswordStrengthHint password={form.password} />
          </div>
          <Button type="submit" loading={submitting} className="self-start">Create</Button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : !officials.length ? (
        <p className="text-sm text-ink/50">No government official accounts yet.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {officials.map((o) => (
            <div key={o.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-4">
              <div className="flex items-center gap-3">
                <Landmark className="h-5 w-5 text-gold-dark" />
                <div>
                  <p className="font-medium text-ink">{o.name}</p>
                  <p className="text-xs text-ink/50">{o.email}</p>
                </div>
              </div>
              <button onClick={() => remove(o.id)} aria-label="Remove official" className="text-ink/40 hover:text-rust">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
