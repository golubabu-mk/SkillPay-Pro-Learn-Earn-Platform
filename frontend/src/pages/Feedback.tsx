import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Star } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Feedback() {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!rating) {
      toast.error("Pick a rating first");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/feedback", { rating, message });
      setDone(true);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't submit feedback");
    } finally {
      setSubmitting(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ledger-inkMuted text-sm">
        Connect your wallet to leave feedback.
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <p className="font-display text-xl text-ledger-ink mb-2">Thanks for the feedback</p>
        <p className="text-sm text-ledger-inkMuted">It genuinely helps us improve the platform.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">Feedback</span>
      <h1 className="font-display text-2xl text-ledger-ink mt-1 mb-8">How's SkillPay Pro working for you?</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Rating
          </label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setRating(n)}
                className="p-1"
              >
                <Star
                  size={26}
                  className={n <= rating ? "fill-ledger-seal text-ledger-seal" : "text-ledger-line"}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Comments
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none resize-none"
            placeholder="What worked well? What was confusing or slow?"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg py-3 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Sending…" : "Submit feedback"}
        </button>
      </form>
    </div>
  );
}
