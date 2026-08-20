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
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    if (user.role === "organization") {
      api
        .get("/challenges", { params: { organizationId: user.id, status: "all" } })
        .then(async (r) => {
          const challenges = r.data.challenges as Challenge[];
          setOrgChallenges(challenges);
          // Fetch pending submission counts for each challenge
          const counts: Record<string, number> = {};
          await Promise.all(
            challenges.map(async (c) => {
              try {
                const res = await api.get(`/submissions/challenge/${c._id}`);
                const pending = (res.data.submissions as { status: string }[]).filter(
                  (s) => s.status === "pending"
                ).length;
                counts[c._id] = pending;
              } catch {
                counts[c._id] = 0;
              }
            })
          );
          setPendingCounts(counts);
        })
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
              {orgChallenges.map((c) => {
                const pending = pendingCounts[c._id] ?? 0;
                return (
                  <div key={c._id} className="relative">
                    <ChallengeCard challenge={c} />
                    <Link
                      to={`/submissions/${c._id}`}
                      className={`absolute top-3 right-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest border px-2 py-1 rounded-seal transition-colors ${
                        pending > 0
                          ? "bg-ledger-seal text-ledger-bg border-ledger-seal"
                          : "bg-ledger-bg border-ledger-seal text-ledger-seal"
                      }`}
                    >
                      {pending > 0 && (
                        <span className="bg-white text-ledger-seal rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                          {pending}
                        </span>
                      )}
                      Review
                    </Link>
                  </div>
                );
              })}
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
                        {s.challengeId?.rewardAmount} XLM <span className="text-[10px] text-ledger-inkMuted/70 ml-1">(~${((s.challengeId?.rewardAmount || 0) * 0.12).toFixed(2)})</span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-3">
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
                        {s.status === "approved" && (
                          <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-ledger-inkMuted hover:text-[#0a66c2] transition-colors flex items-center gap-1 border border-ledger-line px-2 py-0.5 rounded-seal"
                            title="Share Credential on LinkedIn"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            Share
                          </a>
                        )}
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
