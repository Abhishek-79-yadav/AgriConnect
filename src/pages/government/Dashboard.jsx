import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Landmark, ClipboardCheck, Warehouse, Receipt, Bell, Building2 } from "lucide-react";

import { getGovernmentReportSummaryApi } from "../../api/governmentReportApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";

const CARDS = [
  { key: "schemes", label: "Active schemes", icon: Landmark, to: "/government/schemes", tone: "text-gold-dark" },
  { key: "applications", label: "Pending applications", icon: ClipboardCheck, to: "/government/applications", tone: "text-slate-dark" },
  { key: "licenses", label: "Active licenses", icon: Warehouse, to: "/government/licenses", tone: "text-field-dark" },
  { key: "tax", label: "Tax pending (₹)", icon: Receipt, to: "/government/tax-records", tone: "text-rust" },
  { key: "notices", label: "Active notices", icon: Bell, to: "/government/notices", tone: "text-gold-dark" },
  { key: "departments", label: "Departments", icon: Building2, to: "/government/departments", tone: "text-slate-dark" },
];

export default function GovernmentDashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGovernmentReportSummaryApi()
      .then(setSummary)
      .catch(() => toast.error("Could not load report summary"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard..." />;

  const values = {
    schemes: summary?.activeSchemes ?? 0,
    applications: summary?.submittedApplications + summary?.underReviewApplications || 0,
    licenses: summary?.activeLicenses ?? 0,
    tax: (summary?.totalTaxPending ?? 0).toFixed(0),
    notices: summary?.activeNotices ?? 0,
    departments: summary?.activeDepartments ?? 0,
  };

  return (
    <div>
      <PageHeader title="Government dashboard" subtitle="Schemes, licensing, and tax at a glance." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Link
            key={c.key}
            to={c.to}
            className="flex items-center gap-4 rounded-lg border border-line bg-card p-5 transition hover:border-gold/40"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-full bg-paper ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-2xl text-ink">{values[c.key]}</p>
              <p className="text-sm text-ink/60">{c.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {summary && (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-card p-5">
            <h3 className="font-display text-ink">Applications</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/70">
              <li>Submitted: {summary.submittedApplications}</li>
              <li>Under review: {summary.underReviewApplications}</li>
              <li>Approved: {summary.approvedApplications}</li>
              <li>Rejected: {summary.rejectedApplications}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-card p-5">
            <h3 className="font-display text-ink">Warehouse licenses</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/70">
              <li>Pending: {summary.pendingLicenses}</li>
              <li>Active: {summary.activeLicenses}</li>
              <li>Suspended: {summary.suspendedLicenses}</li>
              <li>Cancelled: {summary.cancelledLicenses}</li>
            </ul>
          </div>
          <div className="rounded-lg border border-line bg-card p-5">
            <h3 className="font-display text-ink">Tax records</h3>
            <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/70">
              <li>Pending: {summary.pendingTaxRecords}</li>
              <li>Paid: {summary.paidTaxRecords}</li>
              <li>Overdue: {summary.overdueTaxRecords}</li>
              <li>Collected: ₹{summary.totalTaxCollected?.toFixed(2)}</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
