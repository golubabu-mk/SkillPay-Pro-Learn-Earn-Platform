import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, logout, login, connecting } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  async function handleConnect() {
    try {
      const { isNewUser } = await login();
      navigate(isNewUser ? "/settings" : "/dashboard");
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className="border-b border-ledger-line bg-ledger-bg/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-lg text-ledger-ink tracking-tight">
          SkillPay <span className="text-ledger-seal">Pro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-ledger-inkMuted">
          <Link to="/challenges" className="hover:text-ledger-ink transition-colors">
            Challenges
          </Link>
          {user && (
            <Link to="/dashboard" className="hover:text-ledger-ink transition-colors">
              Dashboard
            </Link>
          )}
          {user && (
            <Link to={`/profile/${user.username}`} className="hover:text-ledger-ink transition-colors">
              Profile
            </Link>
          )}
          {user?.role === "admin" && (
            <Link to="/admin" className="hover:text-ledger-ink transition-colors">
              Admin
            </Link>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest border border-ledger-line px-3 py-2 rounded-seal text-ledger-inkMuted hover:border-ledger-alert hover:text-ledger-alert transition-colors"
            >
              <LogOut size={13} />
              {user.walletAddress.slice(0, 4)}…{user.walletAddress.slice(-4)}
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={connecting}
              className="font-mono text-xs uppercase tracking-widest bg-ledger-seal text-ledger-bg px-4 py-2 rounded-seal hover:bg-ledger-seal/90 transition-colors disabled:opacity-50"
            >
              {connecting ? "Connecting…" : "Connect Wallet"}
            </button>
          )}
        </div>

        <button className="md:hidden text-ledger-ink" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-ledger-line px-6 py-4 flex flex-col gap-4 font-mono text-xs uppercase tracking-widest text-ledger-inkMuted">
          <Link to="/challenges" onClick={() => setMenuOpen(false)}>
            Challenges
          </Link>
          {user && (
            <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          {user ? (
            <button onClick={logout} className="text-left text-ledger-alert">
              Disconnect
            </button>
          ) : (
            <button onClick={handleConnect} className="text-left text-ledger-seal">
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </header>
  );
}
