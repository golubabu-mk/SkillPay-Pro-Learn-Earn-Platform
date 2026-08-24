import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShieldCheck, Award } from "lucide-react";
import { api } from "../services/api";

interface ProfileUser {
  _id: string;
  name: string;
  username: string;
  bio: string;
  skills: string[];
  role: string;
  verified: boolean;
  walletAddress: string;
}

interface AchievementRow {
  _id: string;
  title: string;
  description: string;
  issuerName: string;
  credentialHash: string;
  rewardTxHash: string;
  issuedAt: string;
  challengeId: { title: string; category: string; difficulty: string };
}

export default function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [achievements, setAchievements] = useState<AchievementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    api
      .get(`/users/profile/${username}`)
      .then((r) => {
        const u = r.data.user as ProfileUser;
        setUser(u);
        return api.get(`/achievements/user/${u._id}`);
      })
      .then((r) => setAchievements(r.data.achievements))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-16 text-ledger-inkMuted text-sm">Loading…</div>;
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 text-center text-ledger-inkMuted text-sm">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="font-display text-3xl text-ledger-ink">{user.name}</h1>
        {user.verified && <ShieldCheck size={20} className="text-ledger-verify" />}
      </div>
      <p className="font-mono text-sm text-ledger-inkMuted mb-1">@{user.username}</p>
      <p className="font-mono text-[11px] text-ledger-inkMuted mb-6">
        {user.walletAddress.slice(0, 8)}…{user.walletAddress.slice(-6)}
      </p>

      {user.bio && <p className="text-sm text-ledger-inkMuted mb-6">{user.bio}</p>}

      {user.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          {user.skills.map((s) => (
            <span
              key={s}
              className="font-mono text-[11px] uppercase tracking-widest border border-ledger-line text-ledger-inkMuted px-2 py-1 rounded-seal"
            >
              {s}
            </span>
          ))}
        </div>
      )}

      <h2 className="font-display text-xl text-ledger-ink mb-4">Verified achievements</h2>

      {achievements.length === 0 ? (
        <p className="text-sm text-ledger-inkMuted">No achievements issued yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((a) => (
            <div key={a._id} className="border border-ledger-line rounded-seal p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="credential-seal w-9 h-9 shrink-0">
                  <Award size={15} className="text-ledger-seal" />
                </div>
                <div>
                  <p className="font-display text-sm text-ledger-ink leading-tight">{a.title}</p>
                  <p className="font-mono text-[10px] text-ledger-inkMuted mt-1">
                    Issued {new Date(a.issuedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${a.rewardTxHash}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-ledger-seal hover:underline"
              >
                Verify on-chain →
                </a>
                <a
                  href={`https://www.linkedin.com/profile/add?startTask=${encodeURIComponent(a.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[11px] text-[#0077b5] hover:underline flex items-center gap-1"
                >
                  Share on LinkedIn
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
