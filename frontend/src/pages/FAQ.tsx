import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "How do I connect my wallet?",
    answer: "Currently, we support the Freighter wallet. Ensure you have the extension installed in your browser. Click 'Connect Wallet' in the top right corner and approve the connection request in the Freighter popup."
  },
  {
    question: "Why did my transaction fail?",
    answer: "Common reasons for transaction failures include insufficient XLM for network fees, sequence number mismatches, or network congestion. Make sure you have at least 2 XLM in your testnet wallet to cover minimum balances and fees."
  },
  {
    question: "How do I get Testnet XLM?",
    answer: "You can fund your testnet wallet directly through the Freighter extension by selecting the Testnet network and clicking 'Fund with Friendbot', or by visiting the Stellar Laboratory."
  },
  {
    question: "When are rewards distributed?",
    answer: "Rewards are distributed automatically via our smart contract as soon as the organization approves your submission. The funds will appear directly in your connected wallet."
  },
  {
    question: "What are verifiable credentials?",
    answer: "When you successfully complete a challenge, an on-chain credential (badge) is minted to your wallet address. This serves as a permanent, verifiable proof of your achievement on the Stellar network."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl text-ledger-ink mb-2">Frequently Asked Questions</h1>
      <p className="text-ledger-inkMuted mb-8">Find answers to common questions about wallets, transactions, and rewards.</p>
      
      <div className="space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div 
            key={index} 
            className="border border-ledger-line bg-ledger-surface rounded-seal overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus:outline-none"
            >
              <span className="font-medium text-ledger-ink">{item.question}</span>
              {openIndex === index ? (
                <ChevronUp className="text-ledger-inkMuted" size={20} />
              ) : (
                <ChevronDown className="text-ledger-inkMuted" size={20} />
              )}
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 pt-1 border-t border-ledger-line/50">
                <p className="text-ledger-inkMuted text-sm leading-relaxed">{item.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
