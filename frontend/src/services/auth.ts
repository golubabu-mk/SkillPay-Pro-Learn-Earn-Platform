import { api } from "./api";
import { connectFreighter, signAuthMessage } from "./freighter";

export interface AuthUser {
  id: string;
  walletAddress: string;
  role: "learner" | "organization" | "admin";
  username: string;
  name: string;
  verified: boolean;
}

/**
 * Full wallet-login flow:
 * 1. Connect Freighter and get the public address
 * 2. Request a signing challenge (nonce message) from the backend
 * 3. Sign it with Freighter
 * 4. Send the signature back to verify and receive a JWT
 */
export async function loginWithWallet(): Promise<{ token: string; user: AuthUser; isNewUser: boolean }> {
  const walletAddress = await connectFreighter();

  const { data: challengeData } = await api.post("/auth/challenge", { walletAddress });
  const { message, isNewUser } = challengeData as { message: string; isNewUser: boolean };

  const signature = await signAuthMessage(message, walletAddress);

  const { data: verifyData } = await api.post("/auth/verify", { walletAddress, signature });
  const { token, user } = verifyData as { token: string; user: AuthUser };

  localStorage.setItem("skillpay_token", token);

  return { token, user, isNewUser };
}

export function logout() {
  localStorage.removeItem("skillpay_token");
}

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const token = localStorage.getItem("skillpay_token");
  if (!token) return null;

  try {
    const { data } = await api.get("/auth/me");
    return data.user as AuthUser;
  } catch {
    return null;
  }
}
