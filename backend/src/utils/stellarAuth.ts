import { Keypair } from "@stellar/stellar-sdk";
import crypto from "crypto";

/**
 * Generates a fresh, human-readable nonce message for a wallet to sign.
 * The learner/organization signs this exact string in Freighter
 * (via signMessage), and we verify the signature server-side.
 */
export function generateAuthMessage(walletAddress: string, nonce: string): string {
  return [
    "Sign this message to log in to SkillPay Pro.",
    "",
    `Wallet: ${walletAddress}`,
    `Nonce: ${nonce}`,
    "",
    "This request will not trigger a blockchain transaction or cost gas.",
  ].join("\n");
}

export function generateNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Verifies a signed message against a Stellar public key using ed25519.
 * Freighter's signMessage returns a base64-encoded signature over the raw
 * UTF-8 bytes of the message.
 */
export function verifyStellarSignature(
  walletAddress: string,
  message: string,
  signatureBase64: string | { type: "Buffer"; data: number[] } | any
): boolean {
  try {
    const keypair = Keypair.fromPublicKey(walletAddress);
    const messageBuffer = Buffer.from(message, "utf-8");
    
    let signatureBuffer: Buffer;
    if (typeof signatureBase64 === "object" && signatureBase64 !== null && signatureBase64.type === "Buffer") {
      signatureBuffer = Buffer.from(signatureBase64.data);
    } else if (typeof signatureBase64 === "object" && signatureBase64 !== null && "signature" in signatureBase64) {
      signatureBuffer = Buffer.from(signatureBase64.signature, "base64");
    } else {
      signatureBuffer = Buffer.from(signatureBase64 as string, "base64");
    }
    
    return keypair.verify(messageBuffer, signatureBuffer);
  } catch (err) {
    return false;
  }
}
