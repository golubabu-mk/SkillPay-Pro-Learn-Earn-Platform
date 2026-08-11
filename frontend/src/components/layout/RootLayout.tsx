import { Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./Navbar";

export function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-ledger-line py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[11px] text-ledger-inkMuted uppercase tracking-widest">
          <span>SkillPay Pro · Stellar Testnet</span>
          <span>Verified achievements, on-chain</span>
        </div>
      </footer>
      <Toaster
        toastOptions={{
          style: {
            background: "#1D2420",
            color: "#EDEFE9",
            border: "1px solid #2B342F",
            fontFamily: "Inter, sans-serif",
            fontSize: "13px",
          },
        }}
      />
    </div>
  );
}
