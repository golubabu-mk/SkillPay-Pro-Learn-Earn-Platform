import { Keypair, TransactionBuilder, Account, Networks, Operation, Transaction } from "@stellar/stellar-sdk";
import crypto from "crypto";

export function generateAuthTransaction(walletAddress: string, nonce: string, expiresAt: Date): string {
  const account = new Account(walletAddress, "0");
  const maxTime = Math.floor(expiresAt.getTime() / 1000).toString();
  
  const tx = new TransactionBuilder(account, { 
    fee: "100", 
    networkPassphrase: Networks.TESTNET,
    timebounds: { minTime: "0", maxTime }
  })
    .addOperation(Operation.manageData({ name: "SkillPayAuth", value: Buffer.from(nonce) }))
    .build();
    
  return tx.toXDR();
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
  expectedXdr: string,
  signedXdrBase64: string
): boolean {
  try {
    const tx = new Transaction(signedXdrBase64, Networks.TESTNET);
    const expectedTx = new Transaction(expectedXdr, Networks.TESTNET);
    
    // Hash must match exactly
    if (tx.hash().toString("hex") !== expectedTx.hash().toString("hex")) {
      return false;
    }
    
    // Check signature
    if (!tx.signatures || tx.signatures.length === 0) return false;
    
    const keypair = Keypair.fromPublicKey(walletAddress);
    const signature = tx.signatures[0].signature();
    return keypair.verify(tx.hash(), signature);
  } catch (err) {
    return false;
  }
}
