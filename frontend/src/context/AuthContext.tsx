import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AuthUser, loginWithWallet, logout as logoutService, fetchCurrentUser } from "../services/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  connecting: boolean;
  login: () => Promise<{ isNewUser: boolean }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    fetchCurrentUser()
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  async function login() {
    setConnecting(true);
    try {
      const { user: loggedInUser, isNewUser } = await loginWithWallet();
      setUser(loggedInUser);
      return { isNewUser };
    } finally {
      setConnecting(false);
    }
  }

  function logout() {
    logoutService();
    setUser(null);
  }

  async function refreshUser() {
    const freshUser = await fetchCurrentUser();
    setUser(freshUser);
  }

  return (
    <AuthContext.Provider value={{ user, loading, connecting, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
