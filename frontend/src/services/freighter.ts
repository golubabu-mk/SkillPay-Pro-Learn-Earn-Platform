import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getPublicKey,
  signBlob,
  signTransaction,
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
  if (!connected) {
    throw new FreighterNotInstalledError();
  }

  const allowed = await isAllowed();
  if (!allowed) {
    const access = await setAllowed();
    if (!access) {
      throw new WalletConnectionRejectedError();
    }
  }

  try {
    const address = await requestAccess();
    if (!address) {
      throw new WalletConnectionRejectedError();
    }
    return address;
  } catch (e) {
    throw new WalletConnectionRejectedError();
  }
}

/**
 * Signs an arbitrary UTF-8 message with the connected Freighter wallet.
 * Used for the login challenge — does not touch the blockchain or cost gas.
 */
export async function signAuthMessage(transactionXdr: string, walletAddress: string): Promise<string> {
  try {
    // Promise.race to prevent Freighter signBlob from hanging indefinitely (known bug)
    const result = await Promise.race([
      signTransaction(transactionXdr, { network: "TESTNET", accountToSign: walletAddress }),
      new Promise<string>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 60000))
    ]);
    
    if (!result) throw new Error();
    return result;
  } catch (e) {
    throw new Error("Message signing was rejected, timed out, or failed.");
  }
}
