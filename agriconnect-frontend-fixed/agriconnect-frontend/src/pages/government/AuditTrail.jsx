import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getGovernmentAuditLogsApi } from "../../api/governmentReportApi";
import PageHeader from "../../components/common/PageHeader";
import Loader from "../../components/ui/Loader";
import EmptyState from "../../components/ui/EmptyState";

export default function AuditTrail() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGovernmentAuditLogsApi()
      .then(setLogs)
      .catch(() => toast.error("Could not load audit trail"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <PageHeader title="Audit trail" subtitle="A record of administrative and government actions across the platform." />

      {loading ? (
        <Loader label="Loading audit trail..." />
      ) : !logs.length ? (
        <EmptyState title="No activity yet" description="Actions taken by admins and government officials will show up here." />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-line bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-line text-left text-xs uppercase text-ink/40">
              <tr>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Action</th>
                <th className="px-4 py-2">Endpoint</th>
                <th className="px-4 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-2 text-ink/70">{log.username}</td>
                  <td className="px-4 py-2 text-ink">{log.action}</td>
                  <td className="px-4 py-2 text-ink/50">{log.endpoint}</td>
                  <td className="px-4 py-2 text-ink/50">{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
