import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Settings() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState<"learner" | "organization">(
    (user?.role as "learner" | "organization") || "learner"
  );
  const [username, setUsername] = useState(user?.username || "");
  const [name, setName] = useState(user?.name === "New User" ? "" : user?.name || "");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await api.patch("/users/profile", { role, username, name, bio });
      await refreshUser();
      toast.success("Profile saved");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Couldn't save profile");
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center text-ledger-inkMuted text-sm">
        Connect your wallet first to set up your profile.
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
        Profile Setup
      </span>
      <h1 className="font-display text-2xl text-ledger-ink mt-1 mb-8">Complete your profile</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            I am a…
          </label>
          <div className="flex gap-2">
            {(["learner", "organization"] as const).map((r) => (
              <button
                type="button"
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-seal border font-mono text-xs uppercase tracking-widest capitalize transition-colors ${
                  role === r
                    ? "border-ledger-seal text-ledger-seal"
                    : "border-ledger-line text-ledger-inkMuted"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            {role === "organization" ? "Organization name" : "Full name"}
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
            required
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none"
          />
        </div>

        <div>
          <label className="block font-mono text-[11px] uppercase tracking-widest text-ledger-inkMuted mb-2">
            Bio
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full bg-ledger-surface border border-ledger-line rounded-seal px-3 py-2.5 text-sm text-ledger-ink focus:border-ledger-seal outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg py-3 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
}
