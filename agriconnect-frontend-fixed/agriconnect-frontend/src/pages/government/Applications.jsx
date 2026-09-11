import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FileCheck2, CheckCircle2, XCircle } from "lucide-react";

import { getAllApplicationsApi, verifyApplicationDocumentsApi, decideApplicationApi } from "../../api/schemeApplicationApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";

const STATUS_TONE = {
  SUBMITTED: "gold",
  UNDER_REVIEW: "slate",
  APPROVED: "field",
  REJECTED: "rust",
};

export default function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    setLoading(true);
    getAllApplicationsApi()
      .then(setApplications)
      .catch(() => toast.error("Could not load applications"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (app, verified) => {
    setBusyId(app.id);
    try {
      const updated = await verifyApplicationDocumentsApi(app.id, verified);
      setApplications((prev) => prev.map((a) => (a.id === app.id ? updated : a)));
      toast.success(verified ? "Documents marked verified" : "Documents marked unverified");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update documents");
    } finally {
      setBusyId(null);
    }
  };

  const decide = async (app, status) => {
    setBusyId(app.id);
    try {
      const updated = await decideApplicationApi(app.id, status);
      setApplications((prev) => prev.map((a) => (a.id === app.id ? updated : a)));
      toast.success(`Application ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update application");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader title="Scheme applications" subtitle="Verify documents, then approve or reject." />

      {loading ? (
        <Loader label="Loading applications..." />
      ) : !applications.length ? (
        <EmptyState title="No applications yet" description="Farmer applications to your schemes will show up here." />
      ) : (
        <div className="flex flex-col gap-3">
          {applications.map((a) => (
            <div key={a.id} className="rounded-lg border border-line bg-card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-display text-ink">{a.schemeTitle}</h4>
                    <Badge text={a.status} tone={STATUS_TONE[a.status] || "neutral"} />
                    <Badge
                      text={a.documentVerified ? "Docs verified" : "Docs unverified"}
                      tone={a.documentVerified ? "field" : "gold"}
                    />
                  </div>
                  <p className="mt-1 text-sm text-ink/60">Applicant: {a.applicantName}</p>
                  {a.documentUrl && (
                    <a href={a.documentUrl} target="_blank" rel="noreferrer" className="mt-1 inline-block text-xs text-gold-dark underline">
                      View submitted document
                    </a>
                  )}
                  <p className="mt-1 text-xs text-ink/40">
                    Applied {a.appliedAt ? new Date(a.appliedAt).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>

              {(a.status === "SUBMITTED" || a.status === "UNDER_REVIEW") && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {!a.documentVerified ? (
                    <Button size="sm" loading={busyId === a.id} onClick={() => verify(a, true)}>
                      <FileCheck2 className="h-3.5 w-3.5" /> Verify documents
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" loading={busyId === a.id} onClick={() => verify(a, false)}>
                      Mark unverified
                    </Button>
                  )}
                  <Button
                    size="sm"
                    loading={busyId === a.id}
                    disabled={!a.documentVerified}
                    onClick={() => decide(a, "APPROVED")}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                  </Button>
                  <Button size="sm" variant="ghost" loading={busyId === a.id} onClick={() => decide(a, "REJECTED")}>
                    <XCircle className="h-3.5 w-3.5" /> Reject
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
