import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { ShieldCheck } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

interface Stats {
  users: { total: number; learners: number; organizations: number };
  challenges: { total: number; active: number };
  submissions: { total: number; approved: number };
  achievements: { total: number };
  feedback: { count: number; averageRating: number | null };
}

interface PendingOrg {
  _id: string;
  name: string;
  username: string;
  walletAddress: string;
}

export default function Admin() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingOrgs, setPendingOrgs] = useState<PendingOrg[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "admin") return;
    Promise.all([
      api.get("/admin/stats").then((r) => r.data),
      api.get("/admin/organizations/pending").then((r) => r.data.organizations),
    ])
      .then(([s, orgs]) => {
        setStats(s);
        setPendingOrgs(orgs);
      })
      .finally(() => setLoading(false));
  }, [user]);

  async function handleVerify(orgId: string) {
    try {
      await api.patch(`/admin/organizations/${orgId}/verify`);
      setPendingOrgs((prev) => prev.filter((o) => o._id !== orgId));
      toast.success("Organization verified");
    } catch {
      toast.error("Couldn't verify organization");
    }
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ledger-inkMuted text-sm">
        Admin access required.
      </div>
    );
  }

  if (loading || !stats) {
    return <div className="max-w-5xl mx-auto px-6 py-16 text-ledger-inkMuted text-sm">Loading…</div>;
  }

  const cards = [
    { label: "Total users", value: stats.users.total },
    { label: "Learners", value: stats.users.learners },
    { label: "Organizations", value: stats.users.organizations },
    { label: "Active challenges", value: stats.challenges.active },
    { label: "Approved submissions", value: stats.submissions.approved },
    { label: "Achievements issued", value: stats.achievements.total },
    { label: "Feedback responses", value: stats.feedback.count },
    {
      label: "Avg. rating",
      value: stats.feedback.averageRating ? stats.feedback.averageRating.toFixed(1) : "—",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
        Admin
      </span>
      <h1 className="font-display text-3xl text-ledger-ink mt-1 mb-8">Platform overview</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {cards.map((c) => (
          <div key={c.label} className="border border-ledger-line rounded-seal p-4">
            <p className="font-display text-2xl text-ledger-seal">{c.value}</p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkMuted mt-1">
              {c.label}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-xl text-ledger-ink mb-4">Pending organization verifications</h2>
      {pendingOrgs.length === 0 ? (
        <p className="text-sm text-ledger-inkMuted">No pending verifications.</p>
      ) : (
        <div className="space-y-3">
          {pendingOrgs.map((o) => (
            <div
              key={o._id}
              className="flex items-center justify-between border border-ledger-line rounded-seal p-4"
            >
              <div>
                <p className="text-ledger-ink text-sm">{o.name}</p>
                <p className="font-mono text-[11px] text-ledger-inkMuted">
                  @{o.username} · {o.walletAddress.slice(0, 6)}…{o.walletAddress.slice(-4)}
                </p>
              </div>
              <button
                onClick={() => handleVerify(o._id)}
                className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest bg-ledger-verify text-ledger-bg px-3 py-2 rounded-seal hover:opacity-90 transition-opacity"
              >
                <ShieldCheck size={13} /> Verify
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
