import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  signMessage,
} from "@stellar/freighter-api";

export class FreighterNotInstalledError extends Error {
  constructor() {
    super("Freighter wallet extension is not installed.");
    this.name = "FreighterNotInstalledError";
  }
}

export class WalletConnectionRejectedError extends Error {
  constructor() {
    super("Wallet connection was rejected.");
    this.name = "WalletConnectionRejectedError";
  }
}

/**
 * Ensures Freighter is installed and the app is allowed to access it,
 * then returns the connected wallet's public address.
 */
export async function connectFreighter(): Promise<string> {
  const connected = await isConnected();
  if (!connected.isConnected) {
    throw new FreighterNotInstalledError();
  }

  const allowed = await isAllowed();
  if (!allowed.isAllowed) {
    const access = await setAllowed();
    if (!access.isAllowed) {
      throw new WalletConnectionRejectedError();
    }
  }

  const access = await requestAccess();
  if (access.error) {
    throw new WalletConnectionRejectedError();
  }

  const addressResult = await getAddress();
  if (addressResult.error || !addressResult.address) {
    throw new WalletConnectionRejectedError();
  }

  return addressResult.address;
}

/**
 * Signs an arbitrary UTF-8 message with the connected Freighter wallet.
 * Used for the login challenge — does not touch the blockchain or cost gas.
 */
export async function signAuthMessage(message: string): Promise<string> {
  const result = await signMessage(message);
  if (result.error || !result.signedMessage) {
    throw new Error("Message signing was rejected or failed.");
  }
  // Freighter returns signedMessage as a string (base64) when no keypair provided as Uint8Array
  const signed = result.signedMessage;
  return typeof signed === "string" ? signed : Buffer.from(signed).toString("base64");
}
