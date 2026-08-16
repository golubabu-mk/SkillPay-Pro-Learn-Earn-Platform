import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Users, Clock, Wallet } from "lucide-react";
import { getChallenge } from "../services/challenges";
import { Challenge, OrganizationSummary } from "../types/challenge";
import { useAuth } from "../context/AuthContext";
import { SubmissionForm } from "../components/challenge/SubmissionForm";

export default function ChallengeDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!id) return;
    getChallenge(id)
      .then(setChallenge)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-ledger-inkMuted text-sm">Loading…</div>;
  }

  if (!challenge) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-ledger-inkMuted text-sm">
        Challenge not found.
      </div>
    );
  }

  const org = challenge.organizationId as OrganizationSummary;
  const orgName = org && typeof org === "object" ? org.name : "Organization";
  const orgVerified = org && typeof org === "object" ? org.verified : false;
  const canSubmit = user?.role === "learner" && challenge.status === "active" && !submitted;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
        {challenge.category} · {challenge.difficulty}
      </span>
      <h1 className="font-display text-3xl md:text-4xl text-ledger-ink mt-2 mb-3">{challenge.title}</h1>

      <div className="flex items-center gap-1.5 text-sm text-ledger-inkMuted mb-6">
        {orgVerified && <ShieldCheck size={15} className="text-ledger-verify" />}
        <span>{orgName}</span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 border border-ledger-line rounded-seal p-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkMuted mb-1">
            Reward
          </p>
          <p className="font-display text-lg text-ledger-seal">{challenge.rewardAmount} XLM</p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkMuted mb-1 flex items-center gap-1">
            <Users size={11} /> Winners
          </p>
          <p className="font-display text-lg text-ledger-ink">
            {challenge.approvedCount}/{challenge.maxWinners}
          </p>
        </div>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-ledger-inkMuted mb-1 flex items-center gap-1">
            <Clock size={11} /> Deadline
          </p>
          <p className="font-display text-lg text-ledger-ink">
            {new Date(challenge.deadline).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="prose-none mb-8">
        <h2 className="font-display text-lg text-ledger-ink mb-2">Description</h2>
        <p className="text-sm text-ledger-inkMuted whitespace-pre-line">{challenge.description}</p>
      </div>

      <div className="mb-8">
        <h2 className="font-display text-lg text-ledger-ink mb-2">Requirements</h2>
        <p className="text-sm text-ledger-inkMuted whitespace-pre-line">{challenge.requirements}</p>
      </div>

      {challenge.fundingTxHash && (
        <div className="flex items-center gap-1.5 text-xs text-ledger-inkMuted mb-8 font-mono">
          <Wallet size={13} />
          Funded on-chain:{" "}
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${challenge.fundingTxHash}`}
            target="_blank"
            rel="noreferrer"
            className="text-ledger-seal hover:underline"
          >
            {challenge.fundingTxHash.slice(0, 10)}…
          </a>
        </div>
      )}

      {canSubmit && (
        <SubmissionForm challengeId={challenge._id} onSubmitted={() => setSubmitted(true)} />
      )}

      {submitted && (
        <div className="border border-ledger-verify/40 text-ledger-verify text-sm rounded-seal p-4">
          Your submission is in review. You'll see the result on your dashboard.
        </div>
      )}

      {!user && (
        <p className="text-center text-sm text-ledger-inkMuted">
          Connect your wallet to submit work for this challenge.
        </p>
      )}
    </div>
  );
}
