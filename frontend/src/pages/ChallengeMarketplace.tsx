import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { ChallengeCard } from "../components/challenge/ChallengeCard";
import { listChallenges } from "../services/challenges";
import { Challenge } from "../types/challenge";

const CATEGORIES = ["All", "Web Development", "Smart Contracts", "Design", "Data", "Writing"];
const DIFFICULTIES = ["All", "beginner", "intermediate", "advanced"];

export default function ChallengeMarketplace() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    listChallenges({
      category: category === "All" ? undefined : category,
      difficulty: difficulty === "All" ? undefined : difficulty,
    })
      .then(setChallenges)
      .catch(() => setError("Couldn't load challenges. Try again in a moment."))
      .finally(() => setLoading(false));
  }, [category, difficulty]);

  const filteredChallenges = challenges.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="mb-8">
        <span className="font-mono text-[11px] uppercase tracking-widest text-ledger-seal">
          Challenge Ledger
        </span>
        <h1 className="font-display text-3xl text-ledger-ink mt-1">Open challenges</h1>
        <p className="text-ledger-inkMuted text-sm mt-1">
          Complete the work, submit proof, get paid on Stellar testnet.
        </p>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-2.5 text-ledger-inkMuted" size={18} />
        <input 
          type="text" 
          placeholder="Search challenges by title or description..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-ledger-surface border border-ledger-line rounded-seal py-2 pl-10 pr-4 text-sm text-ledger-ink focus:outline-none focus:border-ledger-seal transition-colors"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`font-mono text-xs px-3 py-1.5 rounded-seal border transition-colors ${
              category === c
                ? "border-ledger-seal text-ledger-seal"
                : "border-ledger-line text-ledger-inkMuted hover:border-ledger-inkMuted"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 text-ledger-line self-center">|</span>
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`font-mono text-xs px-3 py-1.5 rounded-seal border transition-colors capitalize ${
              difficulty === d
                ? "border-ledger-seal text-ledger-seal"
                : "border-ledger-line text-ledger-inkMuted hover:border-ledger-inkMuted"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 rounded-seal border border-ledger-line bg-ledger-surface animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="border border-ledger-alert/40 text-ledger-alert text-sm rounded-seal p-4">
          {error}
        </div>
      )}

      {!loading && !error && filteredChallenges.length === 0 && (
        <div className="border border-dashed border-ledger-line rounded-seal p-12 text-center">
          <p className="text-ledger-inkMuted text-sm">
            No challenges match these filters yet. Check back soon, or adjust your filters.
          </p>
        </div>
      )}

      {!loading && !error && filteredChallenges.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChallenges.map((c) => (
            <ChallengeCard key={c._id} challenge={c} />
          ))}
        </div>
      )}
    </div>
  );
}
