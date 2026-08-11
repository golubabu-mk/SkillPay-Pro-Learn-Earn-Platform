import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { ExternalLink } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { getChallenge } from "../services/challenges";
import { Challenge } from "../types/challenge";
import { approveSubmissionOnChain, issueAchievementOnChain, xlmToStroops } from "../services/stellar";

interface SubmissionRow {
  _id: string;
  githubLink?: string;
  liveDemoLink?: string;
  videoLink?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  learnerId: { _id: string; name: string; username: string; walletAddress: string };
  submittedAt: string;
}

/** Browser-native SHA-256 hex digest, used to derive the on-chain credential hash. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function SubmissionsReview() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    if (!challengeId) return;
    Promise.all([
      getChallenge(challengeId),
      api.get(`/submissions/challenge/${challengeId}`).then((r) => r.data.submissions),
    ])
      .then(([c, s]) => {
        setChallenge(c);
        setSubmissions(s);
      })
      .finally(() => setLoading(false));
  }, [challengeId]);

  async function handleApprove(submission: SubmissionRow) {
    if (!challenge || !user) return;
    setProcessingId(submission._id);
    try {
      // 1. On-chain: approve + reward the learner
      const rewardTxHash = await approveSubmissionOnChain(
        challenge.contractChallengeId,
        user.walletAddress,
        submission.learnerId.walletAddress,
        xlmToStroops(challenge.rewardAmount)
      );

      // 2. Backend: persist approval + tx hash
      await api.patch(`/submissions/${submission._id}/approve`, { rewardTxHash });

      // 3. On-chain: issue the achievement credential
      const credentialHash = await sha256Hex(
        `${challenge.contractChallengeId}:${submission.learnerId.walletAddress}:${Date.now()}`
      );

      await issueAchievementOnChain(
        challenge.contractChallengeId,
        user.walletAddress,
        submission.learnerId.walletAddress,
        credentialHash,
        xlmToStroops(challenge.rewardAmount)
      );

      // 4. Backend: persist the achievement record
      await api.post("/achievements", {
        submissionId: submission._id,
        credentialHash,
        rewardTxHash,
      });

      toast.success(`Reward sent to ${submission.learnerId.name} and achievement issued`);
      setSubmissions((prev) =>
        prev.map((s) => (s._id === submission._id ? { ...s, status: "approved" } : s))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Approval failed");
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(submission: SubmissionRow) {
    setProcessingId(submission._id);
    try {
      await api.patch(`/submissions/${submission._id}/reject`, {});
      setSubmissions((prev) =>
        prev.map((s) => (s._id === submission._id ? { ...s, status: "rejected" } : s))
      );
      toast.success("Submission rejected");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't reject submission");
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-16 text-ledger-inkMuted text-sm">Loading…</div>;
  }

  if (!challenge) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center text-ledger-inkMuted text-sm">
        Challenge not found.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
        Review Submissions
      </span>
      <h1 className="font-display text-3xl text-ledger-ink mt-1 mb-8">{challenge.title}</h1>

      {submissions.length === 0 ? (
        <div className="border border-dashed border-ledger-line rounded-seal p-12 text-center">
          <p className="text-ledger-inkMuted text-sm">No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {submissions.map((s) => (
            <div key={s._id} className="border border-ledger-line rounded-seal p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-display text-ledger-ink">{s.learnerId.name}</p>
                  <p className="font-mono text-[11px] text-ledger-inkMuted">
                    @{s.learnerId.username} · {s.learnerId.walletAddress.slice(0, 6)}…
                    {s.learnerId.walletAddress.slice(-4)}
                  </p>
                </div>
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
              </div>

              <div className="flex flex-wrap gap-3 mb-3">
                {s.githubLink && (
                  <a
                    href={s.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-ledger-seal hover:underline"
                  >
                    GitHub <ExternalLink size={11} />
                  </a>
                )}
                {s.liveDemoLink && (
                  <a
                    href={s.liveDemoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-ledger-seal hover:underline"
                  >
                    Live demo <ExternalLink size={11} />
                  </a>
                )}
                {s.videoLink && (
                  <a
                    href={s.videoLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs text-ledger-seal hover:underline"
                  >
                    Video <ExternalLink size={11} />
                  </a>
                )}
              </div>

              {s.notes && <p className="text-sm text-ledger-inkMuted mb-4">{s.notes}</p>}

              {s.status === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(s)}
                    disabled={processingId === s._id}
                    className="font-mono text-xs uppercase tracking-widest bg-ledger-verify text-ledger-bg px-4 py-2 rounded-seal hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {processingId === s._id ? "Processing…" : "Approve & pay"}
                  </button>
                  <button
                    onClick={() => handleReject(s)}
                    disabled={processingId === s._id}
                    className="font-mono text-xs uppercase tracking-widest border border-ledger-line text-ledger-inkMuted px-4 py-2 rounded-seal hover:border-ledger-alert hover:text-ledger-alert transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
