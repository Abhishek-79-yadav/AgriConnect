import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { getMyAgriInputsApi, createAgriInputApi, deleteAgriInputApi } from "../../api/agriInputApi";

const EMPTY = { name: "", description: "", category: "", price: "", stock: "", unit: "", imageUrl: "" };

export default function AgriInputs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [needsPlan, setNeedsPlan] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await getMyAgriInputsApi());
      setNeedsPlan(false);
    } catch (err) {
      if (err.response?.status === 400 || err.response?.status === 403) {
        setNeedsPlan(true);
      } else {
        toast.error("Could not load your listings");
      }
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
    setSubmitting(true);
    try {
      await createAgriInputApi({ ...form, price: Number(form.price), stock: Number(form.stock) });
      toast.success("Listing added");
      setForm(EMPTY);
      setShowForm(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add listing");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteAgriInputApi(id);
      toast.success("Listing removed");
      setItems((its) => its.filter((i) => i.id !== id));
    } catch {
      toast.error("Could not remove listing");
    }
  };

  if (needsPlan) {
    return (
      <div>
        <PageHeader title="My agri-input listings" />
        <div className="rounded-lg border border-line bg-card p-6 text-center">
          <p className="text-sm text-ink/70">You need an active plan to list products on the marketplace.</p>
          <Link to="/brand/plans">
            <Button className="mt-4">View plans</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="My agri-input listings" subtitle="Fertilizers and pesticides you're selling on AgriConnect." />

      <Button onClick={() => setShowForm((v) => !v)} className="mb-4">
        <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add listing"}
      </Button>

      {showForm && (
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-card p-4">
          <Input label="Product name" required value={form.name} onChange={set("name")} />
          <Input label="Description" value={form.description} onChange={set("description")} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Category" placeholder="Fertilizer / Pesticide" required value={form.category} onChange={set("category")} />
            <Input label="Unit" placeholder="kg / L" value={form.unit} onChange={set("unit")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Price (₹)" type="number" min="0" required value={form.price} onChange={set("price")} />
            <Input label="Stock" type="number" min="0" required value={form.stock} onChange={set("stock")} />
          </div>
          <Input label="Image URL (optional)" value={form.imageUrl} onChange={set("imageUrl")} />
          <Button type="submit" loading={submitting} className="self-start">Save listing</Button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-ink/50">No listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink/50">{item.category}</p>
                </div>
                <button onClick={() => remove(item.id)} aria-label="Delete" className="text-ink/40 hover:text-rust">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-2 font-display text-lg text-gold-dark">₹{item.price} / {item.unit || "unit"}</p>
              <p className="text-xs text-ink/50">Stock: {item.stock}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
