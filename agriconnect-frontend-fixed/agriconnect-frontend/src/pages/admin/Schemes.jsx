import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

import { fetchSchemesThunk } from "../../redux/thunks/schemeThunk";
import { addSchemeApi, deleteSchemeApi } from "../../api/schemeApi";
import SchemeCard from "../../components/cards/SchemeCard";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const EMPTY = { title: "", description: "", state: "", category: "", applyLink: "" };

export default function Schemes() {
  const dispatch = useDispatch();
  const schemes = useSelector((state) => state.scheme.schemes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchSchemesThunk());
  }, [dispatch]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addSchemeApi(form);
      toast.success("Scheme added");
      setForm(EMPTY);
      setShowForm(false);
      dispatch(fetchSchemesThunk());
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not add scheme");
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (id) => {
    try {
      await deleteSchemeApi(id);
      toast.success("Scheme removed");
      dispatch(fetchSchemesThunk());
    } catch {
      toast.error("Could not remove scheme");
    }
  };

  return (
    <div>
      <PageHeader title="Government schemes" />

      <Button onClick={() => setShowForm((v) => !v)} className="mb-4">
        <Plus className="h-4 w-4" /> {showForm ? "Cancel" : "Add scheme"}
      </Button>

      {showForm && (
        <form onSubmit={submit} className="mb-6 flex flex-col gap-3 rounded-lg border border-line bg-card p-4">
          <Input label="Title" required value={form.title} onChange={set("title")} />
          <Input label="Description" value={form.description} onChange={set("description")} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input label="State (leave blank for all-India)" value={form.state} onChange={set("state")} />
            <Input label="Category" value={form.category} onChange={set("category")} />
          </div>
          <Input label="Apply link (URL)" value={form.applyLink} onChange={set("applyLink")} />
          <Button type="submit" loading={submitting} className="self-start">Save scheme</Button>
        </form>
      )}

      {!schemes?.length ? (
        <EmptyState title="No schemes listed" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="relative">
              <SchemeCard scheme={scheme} />
              <button
                onClick={() => remove(scheme.id)}
                aria-label="Delete scheme"
                className="absolute right-3 top-3 rounded-full bg-card p-1.5 text-ink/40 shadow-sm hover:text-rust"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
