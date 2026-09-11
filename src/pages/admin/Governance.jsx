import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldAlert, CheckCircle2, AlertTriangle, ScrollText, MessageSquareWarning, Ban, Undo2, LifeBuoy } from "lucide-react";

import PageHeader from "../../components/common/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import {
  getSuspendedUsersApi,
  unsuspendUserApi,
  getPendingProductsApi,
  approveProductApi,
  getPendingAgriInputsApi,
  approveAgriInputApi,
  getRiskFlagsApi,
  getAuditLogsApi,
  getAllDisputesApi,
  resolveDisputeApi,
  getSupportTicketsApi,
  resolveSupportTicketApi,
} from "../../api/adminApi";

const TABS = [
  { key: "moderation", label: "Moderation queue", icon: CheckCircle2 },
  { key: "suspended", label: "Suspended users", icon: Ban },
  { key: "risk", label: "Risk flags", icon: AlertTriangle },
  { key: "disputes", label: "Disputes", icon: MessageSquareWarning },
  { key: "support", label: "Support tickets", icon: LifeBuoy },
  { key: "audit", label: "Audit log", icon: ScrollText },
];

export default function Governance() {
  const [tab, setTab] = useState("moderation");
  const [loading, setLoading] = useState(true);

  const [pendingProducts, setPendingProducts] = useState([]);
  const [pendingAgriInputs, setPendingAgriInputs] = useState([]);
  const [suspended, setSuspended] = useState([]);
  const [riskFlags, setRiskFlags] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [products, inputs, susp, risk, disp, logs, tickets] = await Promise.all([
        getPendingProductsApi(),
        getPendingAgriInputsApi(),
        getSuspendedUsersApi(),
        getRiskFlagsApi(),
        getAllDisputesApi(),
        getAuditLogsApi(),
        getSupportTicketsApi(),
      ]);
      setPendingProducts(products);
      setPendingAgriInputs(inputs);
      setSuspended(susp);
      setRiskFlags(risk);
      setDisputes(disp);
      setAuditLogs(logs);
      setSupportTickets(tickets);
    } catch {
      toast.error("Could not load governance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const approveProduct = async (id) => {
    try {
      await approveProductApi(id);
      toast.success("Product approved");
      setPendingProducts((p) => p.filter((x) => x.id !== id));
    } catch {
      toast.error("Could not approve");
    }
  };

  const approveAgriInput = async (id) => {
    try {
      await approveAgriInputApi(id);
      toast.success("Listing approved");
      setPendingAgriInputs((p) => p.filter((x) => x.id !== id));
    } catch {
      toast.error("Could not approve");
    }
  };

  const unsuspend = async (id) => {
    try {
      await unsuspendUserApi(id);
      toast.success("User unsuspended");
      setSuspended((s) => s.filter((x) => x.id !== id));
    } catch {
      toast.error("Could not unsuspend");
    }
  };

  const resolveDispute = async (id, status) => {
    const response = window.prompt(`Response to buyer for ${status === "RESOLVED" ? "resolving" : "rejecting"} this dispute:`);
    if (response === null) return;
    try {
      const updated = await resolveDisputeApi(id, status, response);
      toast.success("Dispute updated");
      setDisputes((d) => d.map((x) => (x.id === id ? updated : x)));
    } catch {
      toast.error("Could not update dispute");
    }
  };

  const resolveTicket = async (id) => {
    const response = window.prompt("Reply to send this user:");
    if (response === null || !response.trim()) return;
    try {
      const updated = await resolveSupportTicketApi(id, response);
      toast.success("Ticket resolved");
      setSupportTickets((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch {
      toast.error("Could not resolve ticket");
    }
  };

  return (
    <div>
      <PageHeader title="Governance & security" subtitle="Moderation, suspensions, risk flags, disputes, and the audit trail." />

      <div className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium transition ${
              tab === t.key ? "border-gold text-gold-dark" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink/50">Loading…</p>
      ) : (
        <>
          {tab === "moderation" && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="mb-2 font-medium text-ink">Pending products ({pendingProducts.length})</h3>
                {pendingProducts.length === 0 ? (
                  <p className="text-sm text-ink/50">Nothing pending.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pendingProducts.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                        <span className="text-sm text-ink">{p.productName} — ₹{p.price}</span>
                        <Button className="!py-1 !px-3 text-xs" onClick={() => approveProduct(p.id)}>Approve</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-2 font-medium text-ink">Pending agri-input listings ({pendingAgriInputs.length})</h3>
                {pendingAgriInputs.length === 0 ? (
                  <p className="text-sm text-ink/50">Nothing pending.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {pendingAgriInputs.map((p) => (
                      <div key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                        <span className="text-sm text-ink">{p.name} — ₹{p.price}</span>
                        <Button className="!py-1 !px-3 text-xs" onClick={() => approveAgriInput(p.id)}>Approve</Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "suspended" && (
            <div className="flex flex-col gap-2">
              {suspended.length === 0 ? (
                <p className="text-sm text-ink/50">No suspended accounts.</p>
              ) : (
                suspended.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border border-line bg-card p-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{u.name} ({u.role})</p>
                      <p className="text-xs text-rust">{u.suspensionReason}</p>
                    </div>
                    <Button variant="outline" className="!py-1 !px-3 text-xs" onClick={() => unsuspend(u.id)}>
                      <Undo2 className="h-3.5 w-3.5" /> Unsuspend
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "risk" && (
            <div className="flex flex-col gap-2">
              {riskFlags.length === 0 ? (
                <p className="text-sm text-ink/50">No risk flags right now.</p>
              ) : (
                riskFlags.map((r, idx) => (
                  <div key={`${r.userId}-${r.flagReason}-${idx}`} className="flex items-center gap-3 rounded-lg border border-rust/30 bg-rust-light p-3">
                    <ShieldAlert className="h-5 w-5 text-rust" />
                    <div>
                      <p className="text-sm font-medium text-ink">{r.name} — {r.email}</p>
                      <p className="text-xs text-rust">{r.flagReason} ({r.metricValue})</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "disputes" && (
            <div className="flex flex-col gap-2">
              {disputes.length === 0 ? (
                <p className="text-sm text-ink/50">No disputes filed.</p>
              ) : (
                disputes.map((d) => (
                  <div key={d.id} className="rounded-lg border border-line bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-ink">Order #{d.orderId} — {d.reason}</p>
                        <p className="text-xs text-ink/50">{d.buyerName} ({d.buyerEmail}) · {d.status}</p>
                      </div>
                      {d.status === "OPEN" && (
                        <div className="flex gap-2">
                          <Button className="!py-1 !px-3 text-xs" onClick={() => resolveDispute(d.id, "RESOLVED")}>Resolve</Button>
                          <Button variant="outline" className="!py-1 !px-3 text-xs" onClick={() => resolveDispute(d.id, "REJECTED")}>Reject</Button>
                        </div>
                      )}
                    </div>
                    {d.description && <p className="mt-1 text-sm text-ink/70">{d.description}</p>}
                    {d.adminResponse && <p className="mt-1 text-xs text-field-dark">Response: {d.adminResponse}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "support" && (
            <div className="flex flex-col gap-2">
              {supportTickets.length === 0 ? (
                <p className="text-sm text-ink/50">No support tickets.</p>
              ) : (
                supportTickets.map((t) => (
                  <div key={t.id} className="rounded-lg border border-line bg-card p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-ink">{t.subject}</p>
                          <Badge text={t.status} tone={t.status === "OPEN" ? "gold" : "field"} />
                        </div>
                        <p className="text-xs text-ink/50">{t.userName} ({t.userEmail}) · {t.category}</p>
                      </div>
                      {t.status === "OPEN" && (
                        <Button className="!py-1 !px-3 text-xs" onClick={() => resolveTicket(t.id)}>
                          Reply & resolve
                        </Button>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-ink/70">{t.message}</p>
                    {t.adminResponse && <p className="mt-1 text-xs text-field-dark">Response: {t.adminResponse}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "audit" && (
            <div className="overflow-x-auto rounded-lg border border-line bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-line text-left text-xs uppercase text-ink/40">
                  <tr>
                    <th className="px-4 py-2">User</th>
                    <th className="px-4 py-2">Action</th>
                    <th className="px-4 py-2">Endpoint</th>
                    <th className="px-4 py-2">IP</th>
                    <th className="px-4 py-2">When</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="border-b border-line last:border-0">
                      <td className="px-4 py-2 text-ink/70">{log.username}</td>
                      <td className="px-4 py-2 text-ink">{log.action}</td>
                      <td className="px-4 py-2 text-ink/50">{log.endpoint}</td>
                      <td className="px-4 py-2 text-ink/50">{log.ipAddress}</td>
                      <td className="px-4 py-2 text-ink/50">{log.createdAt ? new Date(log.createdAt).toLocaleString() : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
