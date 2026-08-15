import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, loginWithWallet, logout as logoutService, fetchCurrentUser } from "../services/auth";
import { getWalletBalance } from "../services/stellar";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  connecting: boolean;
  login: () => Promise<{ isNewUser: boolean }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  balance: string;
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState("0.00");

  async function refreshBalance(walletAddress?: string) {
    const addr = walletAddress || user?.walletAddress;
    if (!addr) {
      setBalance("0.00");
      return;
    }
    const bal = await getWalletBalance(addr);
    setBalance(bal);
  }

  useEffect(() => {
    fetchCurrentUser()
      .then((u) => {
        setUser(u);
        if (u) refreshBalance(u.walletAddress);
      })
      .finally(() => setLoading(false));
      
    // Poll balance every 10 seconds if user is logged in
    const interval = setInterval(() => {
      refreshBalance();
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.walletAddress]);

  async function login() {
    setConnecting(true);
    try {
      const { user: loggedInUser, isNewUser } = await loginWithWallet();
      setUser(loggedInUser);
      await refreshBalance(loggedInUser.walletAddress);
      return { isNewUser };
    } finally {
      setConnecting(false);
    }
  }

  function logout() {
    logoutService();
    setUser(null);
    setBalance("0.00");
  }

  async function refreshUser() {
    const freshUser = await fetchCurrentUser();
    setUser(freshUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, connecting, login, logout, refreshUser, balance, refreshBalance }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
