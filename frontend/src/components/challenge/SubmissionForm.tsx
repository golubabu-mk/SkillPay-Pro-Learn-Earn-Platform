import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { api } from "../../services/api";

export function SubmissionForm({
  challengeId,
  onSubmitted,
}: {
  challengeId: string;
  onSubmitted: () => void;
}) {
  const [githubLink, setGithubLink] = useState("");
  const [liveDemoLink, setLiveDemoLink] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!githubLink && !liveDemoLink && !videoLink) {
      toast.error("Provide at least one proof link (GitHub, live demo, or video)");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/submissions", {
        challengeId,
        githubLink: githubLink || undefined,
        liveDemoLink: liveDemoLink || undefined,
        videoLink: videoLink || undefined,
        notes: notes || undefined,
      });
      toast.success("Submission sent for review");
      onSubmitted();
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't submit your work");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-ledger-line rounded-seal p-5">
      <h3 className="font-display text-lg text-ledger-ink">Submit your work</h3>
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
          GitHub link
        </label>
        <input
          value={githubLink}
          onChange={(e) => setGithubLink(e.target.value)}
          placeholder="https://github.com/you/project"
          className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
          Live demo link
        </label>
        <input
          value={liveDemoLink}
          onChange={(e) => setLiveDemoLink(e.target.value)}
          placeholder="https://your-demo.vercel.app"
          className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
          Video walkthrough
        </label>
        <input
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          placeholder="https://youtube.com/..."
          className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
        />
      </div>
      <div>
        <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
          Notes for the reviewer
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg py-3 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit for review"}
      </button>
    </form>
  );
}
