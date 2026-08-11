import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { initAnalytics } from "./services/analytics";
import { initSentry } from "./services/sentry";
import "./index.css";

initSentry();
initAnalytics();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
