import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RootLayout } from "./components/layout/RootLayout";
import Landing from "./pages/Landing";
import ChallengeMarketplace from "./pages/ChallengeMarketplace";
import ChallengeDetail from "./pages/ChallengeDetail";
import CreateChallenge from "./pages/CreateChallenge";
import SubmissionsReview from "./pages/SubmissionsReview";
import Dashboard from "./pages/Dashboard";
import PublicProfile from "./pages/PublicProfile";
import Settings from "./pages/Settings";
import Feedback from "./pages/Feedback";
import Admin from "./pages/Admin";

function NotFound() {
  return (
    <div className="max-w-md mx-auto px-6 py-24 text-center">
      <p className="font-display text-2xl text-ledger-ink mb-2">Page not found</p>
      <p className="text-sm text-ledger-inkMuted">
        The page you're looking for doesn't exist or was moved.
      </p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/challenges" element={<ChallengeMarketplace />} />
            <Route path="/challenge/:id" element={<ChallengeDetail />} />
            <Route path="/create-challenge" element={<CreateChallenge />} />
            <Route path="/submissions/:challengeId" element={<SubmissionsReview />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile/:username" element={<PublicProfile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
