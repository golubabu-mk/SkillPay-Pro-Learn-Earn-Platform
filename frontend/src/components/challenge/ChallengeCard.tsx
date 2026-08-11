import { Link } from "react-router-dom";
import { Users, Clock, ShieldCheck } from "lucide-react";
import { Challenge, OrganizationSummary } from "../../types/challenge";

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner: "Entry",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

function daysRemaining(deadline: string): number {
  const ms = new Date(deadline).getTime() - Date.now();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const org = challenge.organizationId as OrganizationSummary;
  const orgName = typeof org === "object" ? org.name : "Organization";
  const orgVerified = typeof org === "object" ? org.verified : false;
  const poolUsedPct = Math.round(
    ((challenge.totalRewardPool - challenge.remainingRewardPool) / challenge.totalRewardPool) * 100
  );
  const days = daysRemaining(challenge.deadline);

  return (
    <Link
      to={`/challenge/${challenge._id}`}
      className="group block border border-ledger-line bg-ledger-surface hover:border-ledger-seal/60 transition-colors duration-150 rounded-seal p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted">
          {challenge.category} · {DIFFICULTY_LABEL[challenge.difficulty]}
        </span>
        <span
          className={`font-mono text-[11px] uppercase tracking-widest px-2 py-0.5 rounded-seal border ${
            days === 0
              ? "border-ledger-alert/50 text-ledger-alert"
              : "border-ledger-line text-ledger-inkMuted"
          }`}
        >
          {days === 0 ? "Closing" : `${days}d left`}
        </span>
      </div>

      <h3 className="font-display text-xl text-ledger-ink mb-1.5 group-hover:text-ledger-seal transition-colors">
        {challenge.title}
      </h3>

      <p className="text-sm text-ledger-inkMuted mb-4 line-clamp-2">{challenge.description}</p>

      <div className="flex items-center gap-1.5 text-xs text-ledger-inkMuted mb-4">
        {orgVerified && <ShieldCheck size={13} className="text-ledger-verify" />}
        <span>{orgName}</span>
      </div>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="font-mono text-sm text-ledger-ink">
            {challenge.rewardAmount.toLocaleString()} XLM
            <span className="text-ledger-inkMuted"> / winner</span>
          </span>
          <span className="font-mono text-[11px] text-ledger-inkMuted">{poolUsedPct}% allocated</span>
        </div>
        <div className="h-1 w-full bg-ledger-line rounded-full overflow-hidden">
          <div
            className="h-full bg-ledger-seal rounded-full transition-all"
            style={{ width: `${poolUsedPct}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-ledger-inkMuted">
        <Users size={13} />
        <span>
          {challenge.approvedCount} / {challenge.maxWinners} spots filled
        </span>
        <span className="mx-1.5 text-ledger-line">·</span>
        <Clock size={13} />
        <span>{new Date(challenge.deadline).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
