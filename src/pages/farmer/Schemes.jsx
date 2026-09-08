import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { fetchSchemesThunk } from "../../redux/thunks/schemeThunk";
import { applyToSchemeApi, getMyApplicationsApi } from "../../api/schemeApplicationApi";
import SchemeCard from "../../components/cards/SchemeCard";
import PageHeader from "../../components/common/PageHeader";
import Select from "../../components/ui/Select";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Modal from "../../components/ui/Modal";
import Badge from "../../components/ui/Badge";

const STATUS_TONE = { SUBMITTED: "gold", UNDER_REVIEW: "slate", APPROVED: "field", REJECTED: "rust" };

export default function Schemes() {
  const dispatch = useDispatch();
  const { schemes, loading } = useSelector((state) => state.scheme);
  const [stateFilter, setStateFilter] = useState("");

  const [myApplications, setMyApplications] = useState([]);
  const [applyingScheme, setApplyingScheme] = useState(null);
  const [documentUrl, setDocumentUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadApplications = () => {
    getMyApplicationsApi().then(setMyApplications).catch(() => {});
  };

  useEffect(() => {
    dispatch(fetchSchemesThunk());
    loadApplications();
  }, [dispatch]);

  const states = [...new Set(schemes.map((s) => s.state).filter(Boolean))];
  const visible = stateFilter ? schemes.filter((s) => s.state === stateFilter) : schemes;

  const appliedSchemeIds = new Set(myApplications.map((a) => a.schemeId));

  const submitApplication = async () => {
    setSubmitting(true);
    try {
      await applyToSchemeApi({ schemeId: applyingScheme.id, documentUrl: documentUrl.trim() || undefined });
      toast.success("Application submitted");
      setApplyingScheme(null);
      setDocumentUrl("");
      loadApplications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not submit application");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Government schemes" subtitle="Subsidies and support programs you may be eligible for." />

      {states.length > 0 && (
        <Select
          placeholder="All states"
          options={states.map((s) => ({ value: s, label: s }))}
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="mb-6 max-w-xs"
        />
      )}

      {loading ? (
        <Loader label="Loading schemes..." />
      ) : !visible.length ? (
        <EmptyState title="No schemes available" description="Check back later, or try a different state." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              applied={appliedSchemeIds.has(scheme.id)}
              onApply={(s) => setApplyingScheme(s)}
            />
          ))}
        </div>
      )}

      {myApplications.length > 0 && (
        <div className="mt-10">
          <h3 className="mb-3 font-display text-lg text-ink">My applications</h3>
          <div className="flex flex-col gap-2">
            {myApplications.map((a) => (
              <div key={a.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                <div>
                  <p className="text-sm font-medium text-ink">{a.schemeTitle}</p>
                  {a.decisionRemarks && <p className="text-xs text-ink/50">{a.decisionRemarks}</p>}
                </div>
                <Badge text={a.status} tone={STATUS_TONE[a.status] || "neutral"} />
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal open={!!applyingScheme} onClose={() => setApplyingScheme(null)} title={`Apply — ${applyingScheme?.title || ""}`}>
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink/60">
            Optionally attach a link to your supporting document (land record, ID proof, etc.) for the government reviewer.
          </p>
          <Input label="Document URL (optional)" value={documentUrl} onChange={(e) => setDocumentUrl(e.target.value)} />
          <Button onClick={submitApplication} loading={submitting} className="self-start">
            Submit application
          </Button>
        </div>
      </Modal>
    </div>
  );
}
