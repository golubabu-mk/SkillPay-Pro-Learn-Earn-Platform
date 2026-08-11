import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { createAndFundChallenge } from "../services/challenges";
import { ChallengeDifficulty } from "../types/challenge";

export default function CreateChallenge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"idle" | "saving" | "onchain-create" | "onchain-fund" | "confirming">(
    "idle"
  );

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Web Development",
    difficulty: "intermediate" as ChallengeDifficulty,
    rewardAmount: 50,
    maxWinners: 5,
    deadline: "",
    requirements: "",
  });

  const totalRewardPool = form.rewardAmount * form.maxWinners;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (user.role !== "organization") {
      toast.error("Only organization accounts can create challenges");
      return;
    }

    setSubmitting(true);
    setStep("saving");
    try {
      setStep("onchain-create");
      const challenge = await createAndFundChallenge(
        { ...form, totalRewardPool },
        user.walletAddress
      );
      toast.success("Challenge created and funded on-chain");
      navigate(`/challenge/${challenge._id}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || err?.message || "Failed to create challenge");
    } finally {
      setSubmitting(false);
      setStep("idle");
    }
  }

  if (!user || user.role !== "organization") {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ledger-inkMuted text-sm">
        Only organization accounts can create challenges. Set your role in Settings.
      </div>
    );
  }

  const STEP_LABEL: Record<string, string> = {
    saving: "Saving draft…",
    "onchain-create": "Waiting for Freighter — creating challenge on-chain…",
    "onchain-fund": "Waiting for Freighter — funding reward pool…",
    confirming: "Confirming with server…",
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
        New Challenge
      </span>
      <h1 className="font-display text-3xl text-ledger-ink mt-1 mb-8">Create a challenge</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Title
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
            placeholder="Build a Soroban token contract"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
              Category
            </label>
            <input
              required
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
              Difficulty
            </label>
            <select
              value={form.difficulty}
              onChange={(e) =>
                setForm({ ...form, difficulty: e.target.value as ChallengeDifficulty })
              }
              className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
              Reward per winner (XLM)
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.rewardAmount}
              onChange={(e) => setForm({ ...form, rewardAmount: Number(e.target.value) })}
              className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
            />
          </div>
          <div>
            <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
              Max winners
            </label>
            <input
              type="number"
              min={1}
              required
              value={form.maxWinners}
              onChange={(e) => setForm({ ...form, maxWinners: Number(e.target.value) })}
              className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
            />
          </div>
        </div>

        <p className="font-mono text-xs text-ledger-inkMuted">
          Total reward pool: <span className="text-ledger-seal">{totalRewardPool} XLM</span>
        </p>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Deadline
          </label>
          <input
            type="date"
            required
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Requirements
          </label>
          <textarea
            required
            rows={3}
            value={form.requirements}
            onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none resize-none"
            placeholder="What must a submission include to qualify?"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg py-3.5 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? STEP_LABEL[step] || "Working…" : "Create & fund challenge"}
        </button>
        <p className="text-center font-mono text-[11px] text-ledger-inkMuted">
          This will prompt two Freighter signatures: one to create the challenge on-chain, one to
          fund the reward pool.
        </p>
      </form>
    </div>
  );
}
