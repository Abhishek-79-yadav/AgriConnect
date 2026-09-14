import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CheckCircle2, XCircle, Ban, Pause, Play, RefreshCw } from "lucide-react";

import {
  getAllLicensesApi,
  approveLicenseApi,
  rejectLicenseApi,
  cancelLicenseApi,
  suspendLicenseApi,
  resumeLicenseApi,
  renewLicenseApi,
} from "../../api/warehouseLicenseApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";

const STATUS_TONE = {
  PENDING: "gold",
  ACTIVE: "field",
  REJECTED: "rust",
  SUSPENDED: "slate",
  CANCELLED: "rust",
  EXPIRED: "neutral",
};

export default function Licenses() {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [dateModal, setDateModal] = useState(null); // { license, mode: "approve" | "renew" }
  const [dateValue, setDateValue] = useState("");

  const load = () => {
    setLoading(true);
    getAllLicensesApi()
      .then(setLicenses)
      .catch(() => toast.error("Could not load licenses"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const updateInList = (updated) => {
    setLicenses((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const run = async (id, fn, successMsg) => {
    setBusyId(id);
    try {
      const updated = await fn();
      updateInList(updated);
      toast.success(successMsg);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update license");
    } finally {
      setBusyId(null);
    }
  };

  const submitDateModal = async () => {
    if (!dateValue) {
      toast.error("Pick a date");
      return;
    }
    const { license, mode } = dateModal;
    setDateModal(null);
    if (mode === "approve") {
      await run(license.id, () => approveLicenseApi(license.id, dateValue), "License approved");
    } else {
      await run(license.id, () => renewLicenseApi(license.id, dateValue), "License renewed");
    }
    setDateValue("");
  };

  return (
    <div>
      <PageHeader title="Warehouse licenses" subtitle="Review, approve, renew, suspend, or cancel farmer warehouse licenses." />

      {loading ? (
        <Loader label="Loading licenses..." />
      ) : !licenses.length ? (
        <EmptyState title="No applications yet" description="Farmer warehouse license applications will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {licenses.map((l) => (
            <div key={l.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{l.warehouseName}</h4>
                    <Badge text={l.status} tone={STATUS_TONE[l.status] || "neutral"} />
                  </div>
                  <p className="mt-1 text-sm text-ink/60">Farmer: {l.farmerName}</p>
                  {l.location && <p className="text-xs text-ink/50">{l.location}{l.capacityTonnes ? ` · ${l.capacityTonnes}t capacity` : ""}</p>}
                  {l.licenseNumber && <p className="mt-1 text-xs text-ink/50">License #{l.licenseNumber}</p>}
                  {l.expiryDate && <p className="text-xs text-ink/50">Expires {l.expiryDate}</p>}
                  {l.documentUrl && (
                    <a href={l.documentUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-gold-dark underline">
                      View document
                    </a>
                  )}
                  {l.remarks && <p className="mt-1 text-xs text-ink/50">Remarks: {l.remarks}</p>}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {l.status === "PENDING" && (
                  <>
                    <Button size="sm" loading={busyId === l.id} onClick={() => { setDateValue(""); setDateModal({ license: l, mode: "approve" }); }}>
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                    </Button>
                    <Button size="sm" variant="ghost" loading={busyId === l.id} onClick={() => run(l.id, () => rejectLicenseApi(l.id), "Application rejected")}>
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </>
                )}
                {l.status === "ACTIVE" && (
                  <>
                    <Button size="sm" variant="ghost" loading={busyId === l.id} onClick={() => run(l.id, () => suspendLicenseApi(l.id), "License suspended")}>
                      <Pause className="h-3.5 w-3.5" /> Suspend
                    </Button>
                    <Button size="sm" variant="ghost" loading={busyId === l.id} onClick={() => { setDateValue(l.expiryDate || ""); setDateModal({ license: l, mode: "renew" }); }}>
                      <RefreshCw className="h-3.5 w-3.5" /> Renew
                    </Button>
                    <Button size="sm" variant="ghost" loading={busyId === l.id} onClick={() => run(l.id, () => cancelLicenseApi(l.id), "License cancelled")}>
                      <Ban className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  </>
                )}
                {l.status === "SUSPENDED" && (
                  <>
                    <Button size="sm" loading={busyId === l.id} onClick={() => run(l.id, () => resumeLicenseApi(l.id), "License resumed")}>
                      <Play className="h-3.5 w-3.5" /> Resume
                    </Button>
                    <Button size="sm" variant="ghost" loading={busyId === l.id} onClick={() => run(l.id, () => cancelLicenseApi(l.id), "License cancelled")}>
                      <Ban className="h-3.5 w-3.5" /> Cancel
                    </Button>
                  </>
                )}
                {l.status === "EXPIRED" && (
                  <Button size="sm" loading={busyId === l.id} onClick={() => { setDateValue(""); setDateModal({ license: l, mode: "renew" }); }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Renew
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!dateModal} onClose={() => setDateModal(null)} title={dateModal?.mode === "approve" ? "Approve license" : "Renew license"}>
        <div className="flex flex-col gap-3">
          <Input label="Expiry date" type="date" value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
          <Button onClick={submitDateModal} className="self-start">
            {dateModal?.mode === "approve" ? "Approve" : "Renew"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
