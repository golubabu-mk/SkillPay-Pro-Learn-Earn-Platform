import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Challenge } from "../types/challenge";
import { ChallengeCard } from "../components/challenge/ChallengeCard";

interface MySubmission {
  _id: string;
  status: string;
  challengeId: { title: string; rewardAmount: number; deadline: string; status: string };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [orgChallenges, setOrgChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<MySubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (user.role === "organization") {
      api
        .get("/challenges", { params: { organizationId: user.id, status: "all" } })
        .then((r) => setOrgChallenges(r.data.challenges))
        .finally(() => setLoading(false));
    } else {
      api
        .get("/submissions/my")
        .then((r) => setMySubmissions(r.data.submissions))
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ledger-inkMuted text-sm">
        Connect your wallet to see your dashboard.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
            {user.role === "organization" ? "Organization Dashboard" : "Learner Dashboard"}
          </span>
          <h1 className="font-display text-3xl text-ledger-ink mt-1">Welcome back, {user.name}</h1>
        </div>
        {user.role === "organization" && (
          <Link
            to="/create-challenge"
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg px-4 py-2.5 rounded-seal hover:bg-ledger-seal/90 transition-colors"
          >
            <Plus size={14} /> New challenge
          </Link>
        )}
      </div>

      {loading && <p className="text-ledger-inkMuted text-sm">Loading…</p>}

      {!loading && user.role === "organization" && (
        <>
          {orgChallenges.length === 0 ? (
            <div className="border border-dashed border-ledger-line rounded-seal p-12 text-center">
              <p className="text-ledger-inkMuted text-sm mb-4">
                You haven't created any challenges yet.
              </p>
              <Link to="/create-challenge" className="text-ledger-seal text-sm font-mono">
                Create your first challenge →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orgChallenges.map((c) => (
                <div key={c._id} className="relative">
                  <ChallengeCard challenge={c} />
                  <Link
                    to={`/submissions/${c._id}`}
                    className="absolute top-3 right-3 font-mono text-[10px] uppercase tracking-widest bg-ledger-bg border border-ledger-seal text-ledger-seal px-2 py-1 rounded-seal"
                  >
                    Review
                  </Link>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!loading && user.role !== "organization" && (
        <>
          {mySubmissions.length === 0 ? (
            <div className="border border-dashed border-ledger-line rounded-seal p-12 text-center">
              <p className="text-ledger-inkMuted text-sm mb-4">You haven't submitted any work yet.</p>
              <Link to="/challenges" className="text-ledger-seal text-sm font-mono">
                Browse open challenges →
              </Link>
            </div>
          ) : (
            <div className="border border-ledger-line rounded-seal overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-ledger-surface font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted">
                  <tr>
                    <th className="text-left px-4 py-3">Challenge</th>
                    <th className="text-left px-4 py-3">Reward</th>
                    <th className="text-left px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mySubmissions.map((s) => (
                    <tr key={s._id} className="border-t border-ledger-line">
                      <td className="px-4 py-3 text-ledger-ink">{s.challengeId?.title}</td>
                      <td className="px-4 py-3 font-mono text-ledger-inkMuted">
                        {s.challengeId?.rewardAmount} XLM
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`font-mono text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-seal border ${
                            s.status === "approved"
                              ? "border-ledger-verify text-ledger-verify"
                              : s.status === "rejected"
                              ? "border-ledger-alert text-ledger-alert"
                              : "border-ledger-line text-ledger-inkMuted"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
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
