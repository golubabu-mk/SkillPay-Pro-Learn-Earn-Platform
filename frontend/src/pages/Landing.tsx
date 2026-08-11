import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Zap, Award } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { user, login, connecting } = useAuth();
  const navigate = useNavigate();

  async function handleStart() {
    if (user) {
      navigate("/challenges");
      return;
    }
    try {
      const { isNewUser } = await login();
      navigate(isNewUser ? "/settings" : "/challenges");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-24 text-center">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
          Learn & Earn on Stellar
        </span>
        <h1 className="font-display text-5xl md:text-6xl text-ledger-ink mt-4 leading-[1.1]">
          Learn skills. Earn instant
          <br />
          Stellar rewards.
        </h1>
        <p className="text-ledger-inkMuted text-base md:text-lg mt-6 max-w-2xl mx-auto">
          Organizations publish learning challenges. You submit real proof of work — code, demos,
          projects — and get paid on Stellar testnet the moment it's approved, with a verifiable
          on-chain credential to show for it.
        </p>
        <button
          onClick={handleStart}
          disabled={connecting}
          className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg px-6 py-3.5 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
        >
          {connecting ? "Connecting…" : "Browse challenges"}
          <ArrowRight size={14} />
        </button>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ledger-line">
        <h2 className="font-display text-2xl text-ledger-ink mb-10 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="credential-seal w-12 h-12 mx-auto mb-4">
              <Zap size={18} className="text-ledger-seal" />
            </div>
            <h3 className="font-display text-lg text-ledger-ink mb-1.5">Join a challenge</h3>
            <p className="text-sm text-ledger-inkMuted">
              Browse open challenges from verified organizations and connect your Freighter wallet.
            </p>
          </div>
          <div className="text-center">
            <div className="credential-seal w-12 h-12 mx-auto mb-4">
              <ShieldCheck size={18} className="text-ledger-seal" />
            </div>
            <h3 className="font-display text-lg text-ledger-ink mb-1.5">Submit proof</h3>
            <p className="text-sm text-ledger-inkMuted">
              Share your GitHub repo, live demo, or video walkthrough for the organization to review.
            </p>
          </div>
          <div className="text-center">
            <div className="credential-seal w-12 h-12 mx-auto mb-4">
              <Award size={18} className="text-ledger-seal" />
            </div>
            <h3 className="font-display text-lg text-ledger-ink mb-1.5">Get paid & verified</h3>
            <p className="text-sm text-ledger-inkMuted">
              Approved work triggers an instant Stellar reward and a verifiable achievement credential.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ledger-line grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted">
            For learners
          </span>
          <h3 className="font-display text-xl text-ledger-ink mt-2 mb-2">Build a verified transcript</h3>
          <p className="text-sm text-ledger-inkMuted">
            Every approved challenge becomes a permanent, on-chain credential on your public profile —
            something an employer can actually verify, not just take your word for.
          </p>
        </div>
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted">
            For organizations
          </span>
          <h3 className="font-display text-xl text-ledger-ink mt-2 mb-2">Reward real work, transparently</h3>
          <p className="text-sm text-ledger-inkMuted">
            Fund a reward pool once, review submissions on your dashboard, and approvals trigger
            payment and credential issuance automatically — no manual payouts.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-16 border-t border-ledger-line text-center">
        <h2 className="font-display text-2xl text-ledger-ink mb-4">Ready to start?</h2>
        <Link
          to="/challenges"
          className="font-mono text-xs uppercase tracking-widest text-ledger-seal hover:underline"
        >
          View open challenges →
        </Link>
      </section>
    </div>
  );
}
