import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Eye, MousePointerClick, Pencil, Trash2, Play, Pause, Square } from "lucide-react";

import {
  getAllCampaignsApi,
  createCampaignApi,
  updateCampaignApi,
  setCampaignStatusApi,
  deleteCampaignApi,
} from "../../api/campaignApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import TextArea from "../../components/ui/TextArea";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";
import ConfirmDialog from "../../components/ui/ConfirmDialog";

const STATUS_TONE = {
  DRAFT: "neutral",
  SCHEDULED: "slate",
  ACTIVE: "field",
  PAUSED: "gold",
  ENDED: "rust",
};

const EMPTY_FORM = {
  name: "",
  description: "",
  type: "BANNER",
  bannerImageUrl: "",
  linkUrl: "",
  couponCode: "",
  targetRole: "ALL",
  startDate: "",
  endDate: "",
};

// <input type="datetime-local"> needs "YYYY-MM-DDTHH:mm"; the API returns
// full ISO with seconds — trim rather than reparse with a Date object,
// which would silently shift the value by the browser's timezone offset.
const toLocalInput = (iso) => (iso ? iso.slice(0, 16) : "");

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getAllCampaignsApi()
      .then(setCampaigns)
      .catch(() => toast.error("Could not load campaigns"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (c) => {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description || "",
      type: c.type,
      bannerImageUrl: c.bannerImageUrl || "",
      linkUrl: c.linkUrl || "",
      couponCode: c.couponCode || "",
      targetRole: c.targetRole,
      startDate: toLocalInput(c.startDate),
      endDate: toLocalInput(c.endDate),
    });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.startDate || !form.endDate) {
      toast.error("Name, start date, and end date are required");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCampaignApi(editingId, form);
        setCampaigns((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
        toast.success("Campaign updated");
      } else {
        const created = await createCampaignApi(form);
        setCampaigns((prev) => [created, ...prev]);
        toast.success("Campaign created as draft");
      }
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not save campaign");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (id, status) => {
    setBusyId(id);
    try {
      const updated = await setCampaignStatusApi(id, status);
      setCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update status");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    try {
      await deleteCampaignApi(deletingId);
      setCampaigns((prev) => prev.filter((c) => c.id !== deletingId));
      toast.success("Campaign deleted");
    } catch {
      toast.error("Could not delete campaign");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Marketing campaigns"
        subtitle="Homepage banners, promotions, and announcements."
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New campaign
          </Button>
        }
      />

      {loading ? (
        <Loader label="Loading campaigns..." />
      ) : !campaigns.length ? (
        <EmptyState title="No campaigns yet" description="Create one to promote it on the homepage." />
      ) : (
        <div className="flex flex-col gap-3">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{c.name}</h4>
                    <Badge text={c.status} tone={STATUS_TONE[c.status] || "neutral"} />
                    <Badge text={c.type.replace("_", " ")} tone="neutral" />
                  </div>
                  {c.description && <p className="mt-1 text-sm text-ink/60">{c.description}</p>}
                  <p className="mt-1 text-xs text-ink/40">
                    {new Date(c.startDate).toLocaleString()} → {new Date(c.endDate).toLocaleString()} · {c.targetRole}
                    {c.couponCode && ` · coupon: ${c.couponCode}`}
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-ink/60">
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {c.impressions}</span>
                  <span className="flex items-center gap-1"><MousePointerClick className="h-3.5 w-3.5" /> {c.clicks}</span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(c.status === "DRAFT" || c.status === "PAUSED" || c.status === "ENDED") && (
                  <Button size="sm" loading={busyId === c.id} onClick={() => changeStatus(c.id, "ACTIVE")}>
                    <Play className="h-3.5 w-3.5" /> {c.status === "DRAFT" ? "Publish" : "Resume"}
                  </Button>
                )}
                {(c.status === "ACTIVE" || c.status === "SCHEDULED") && (
                  <Button size="sm" variant="ghost" loading={busyId === c.id} onClick={() => changeStatus(c.id, "PAUSED")}>
                    <Pause className="h-3.5 w-3.5" /> Pause
                  </Button>
                )}
                {c.status !== "ENDED" && (
                  <Button size="sm" variant="ghost" loading={busyId === c.id} onClick={() => changeStatus(c.id, "ENDED")}>
                    <Square className="h-3.5 w-3.5" /> End now
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => openEdit(c)}>
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setDeletingId(c.id)}>
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit campaign" : "New campaign"}>
        <form onSubmit={submit} className="flex flex-col gap-3">
          <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <TextArea
            label="Description"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-ink">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink"
              >
                <option value="BANNER">Banner</option>
                <option value="DISCOUNT">Discount</option>
                <option value="PRODUCT_PROMOTION">Product promotion</option>
                <option value="ANNOUNCEMENT">Announcement</option>
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
                <option value="BUYER">Buyers</option>
                <option value="FARMER">Farmers</option>
              </select>
            </div>
          </div>

          <Input
            label="Banner image URL"
            value={form.bannerImageUrl}
            onChange={(e) => setForm({ ...form, bannerImageUrl: e.target.value })}
          />
          <Input
            label="Link URL (where clicking it goes)"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
          />
          <Input
            label="Coupon code (optional)"
            value={form.couponCode}
            onChange={(e) => setForm({ ...form, couponCode: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              required
            />
            <Input
              label="End"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              required
            />
          </div>

          <Button type="submit" loading={saving} className="self-start">
            {editingId ? "Save changes" : "Create as draft"}
          </Button>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deletingId}
        title="Delete this campaign?"
        message="This can't be undone."
        danger
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
