import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { Plus, Trash2, NotebookPen, Wallet, TrendingUp, TrendingDown } from "lucide-react";

import {
  fetchMyCropHistoryThunk,
  addCropHistoryThunk,
  deleteCropHistoryThunk,
} from "../../redux/thunks/cropHistoryThunk";
import PageHeader from "../../components/common/PageHeader";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import DashboardCard from "../../components/cards/DashboardCard";

const SEASON_OPTIONS = [
  { value: "KHARIF", label: "Kharif" },
  { value: "RABI", label: "Rabi" },
  { value: "ZAID", label: "Zaid" },
];

const emptyForm = {
  cropName: "",
  season: "KHARIF",
  date: new Date().toISOString().slice(0, 10),
  quantity: "",
  yield: "",
  sellingPricePerUnit: "",
  costPricePerUnit: "",
  fertilizerUsed: "",
  fertilizerQuantityKg: "",
  pesticideUsed: "",
  pesticideQuantityL: "",
};

// A farmer's own day-to-day / season log — what was grown, how much it
// yielded, and what it cost vs sold for. Separate from the marketplace
// product listings; this is for the farmer's own record-keeping.
export default function FarmLog() {
  const dispatch = useDispatch();
  const { records, loading } = useSelector((state) => state.cropHistory);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  useEffect(() => {
    dispatch(fetchMyCropHistoryThunk());
  }, [dispatch]);

  // Cost and sell are tracked per-unit on each record — total them
  // separately (× quantity) so cost, revenue and profit each show as
  // their own number, not just a single blended "profit" figure.
  const { totalCost, totalSell, totalProfit } = useMemo(() => {
    return records.reduce(
      (acc, r) => {
        const cost = (r.costPricePerUnit || 0) * (r.quantity || 0);
        const sell = (r.sellingPricePerUnit || 0) * (r.quantity || 0);
        acc.totalCost += cost;
        acc.totalSell += sell;
        acc.totalProfit += sell - cost;
        return acc;
      },
      { totalCost: 0, totalSell: 0, totalProfit: 0 }
    );
  }, [records]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const result = await dispatch(
      addCropHistoryThunk({
        ...form,
        quantity: Number(form.quantity),
        yield: Number(form.yield),
        sellingPricePerUnit: Number(form.sellingPricePerUnit),
        costPricePerUnit: Number(form.costPricePerUnit),
        fertilizerQuantityKg: form.fertilizerQuantityKg ? Number(form.fertilizerQuantityKg) : null,
        pesticideQuantityL: form.pesticideQuantityL ? Number(form.pesticideQuantityL) : null,
      })
    );

    setSubmitting(false);

    if (addCropHistoryThunk.fulfilled.match(result)) {
      toast.success("Record added");
      setForm(emptyForm);
      setOpen(false);
    } else {
      toast.error(result.payload?.message || "Could not add record");
    }
  };

  const confirmDelete = async () => {
    const result = await dispatch(deleteCropHistoryThunk(toDelete.id));
    if (deleteCropHistoryThunk.fulfilled.match(result)) {
      toast.success("Record deleted");
    } else {
      toast.error("Could not delete record");
    }
    setToDelete(null);
  };

  return (
    <div>
      <PageHeader
        title="Farm log"
        subtitle="Keep track of what you grow, harvest, and earn — season by season."
        action={<Button onClick={() => setOpen(true)}><Plus className="h-4 w-4" /> Add record</Button>}
      />

      {loading ? (
        <Loader label="Loading your farm log..." />
      ) : !records.length ? (
        <EmptyState
          icon={NotebookPen}
          title="No records yet"
          description="Log your first crop cycle to start tracking yield and profit over time."
          action={<Button onClick={() => setOpen(true)}>Add record</Button>}
        />
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <DashboardCard title="Total cost" value={`₹${totalCost.toFixed(2)}`} icon={TrendingDown} tone="rust" />
            <DashboardCard title="Total sell (revenue)" value={`₹${totalSell.toFixed(2)}`} icon={Wallet} tone="slate" />
            <DashboardCard title="Total profit" value={`₹${totalProfit.toFixed(2)}`} icon={TrendingUp} tone="field" />
          </div>

          <div className="rounded-lg border border-line bg-card overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-paper text-left text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Season</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Quantity</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Sell</th>
                  <th className="px-4 py-3">Profit</th>
                  <th className="px-4 py-3">Fertilizer</th>
                  <th className="px-4 py-3">Pesticide</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => {
                  const cost = (r.costPricePerUnit || 0) * (r.quantity || 0);
                  const sell = (r.sellingPricePerUnit || 0) * (r.quantity || 0);
                  return (
                    <tr key={r.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-3 font-medium text-ink">{r.cropName}</td>
                      <td className="px-4 py-3 text-ink/70">{r.season}</td>
                      <td className="px-4 py-3 text-ink/70">{r.date}</td>
                      <td className="px-4 py-3 text-ink/70">{r.quantity}</td>
                      <td className="px-4 py-3 text-rust">₹{cost.toFixed(2)}</td>
                      <td className="px-4 py-3 text-slate-dark">₹{sell.toFixed(2)}</td>
                      <td className={`px-4 py-3 font-medium ${r.profit >= 0 ? "text-field-dark" : "text-rust"}`}>
                        ₹{r.profit?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-ink/70">
                        {r.fertilizerUsed ? `${r.fertilizerUsed}${r.fertilizerQuantityKg ? ` (${r.fertilizerQuantityKg}kg)` : ""}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-ink/70">
                        {r.pesticideUsed ? `${r.pesticideUsed}${r.pesticideQuantityL ? ` (${r.pesticideQuantityL}L)` : ""}` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setToDelete(r)} className="rounded p-1.5 text-rust hover:bg-rust-light">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Add farm log record">
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Input label="Crop name" required value={form.cropName} onChange={set("cropName")} />

          <div className="grid grid-cols-2 gap-4">
            <Select label="Season" options={SEASON_OPTIONS} value={form.season} onChange={set("season")} />
            <Input label="Date" type="date" value={form.date} onChange={set("date")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Quantity" type="number" min="0" step="0.01" required value={form.quantity} onChange={set("quantity")} />
            <Input label="Yield" type="number" min="0" step="0.01" value={form.yield} onChange={set("yield")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Selling price / unit (₹)" type="number" min="0" step="0.01" value={form.sellingPricePerUnit} onChange={set("sellingPricePerUnit")} />
            <Input label="Cost price / unit (₹)" type="number" min="0" step="0.01" value={form.costPricePerUnit} onChange={set("costPricePerUnit")} />
          </div>

          <p className="mt-1 text-xs font-medium uppercase tracking-wide text-ink/40">Inputs used (optional)</p>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Fertilizer used" value={form.fertilizerUsed} onChange={set("fertilizerUsed")} />
            <Input label="Fertilizer quantity (kg)" type="number" min="0" step="0.01" value={form.fertilizerQuantityKg} onChange={set("fertilizerQuantityKg")} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Pesticide used" value={form.pesticideUsed} onChange={set("pesticideUsed")} />
            <Input label="Pesticide quantity (L)" type="number" min="0" step="0.01" value={form.pesticideQuantityL} onChange={set("pesticideQuantityL")} />
          </div>

          <Button type="submit" loading={submitting} className="mt-2 self-start">Save record</Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this record?"
        message={`The log entry for "${toDelete?.cropName}" will be removed.`}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
}
