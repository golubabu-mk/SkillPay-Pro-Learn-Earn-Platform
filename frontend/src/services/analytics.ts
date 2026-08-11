import posthog from "posthog-js";

const KEY = import.meta.env.VITE_POSTHOG_KEY;
const HOST = import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com";

export function initAnalytics() {
  if (!KEY) return; // no-op until a real project key is configured
  posthog.init(KEY, { api_host: HOST, capture_pageview: true });
}

/** Event names match the tracking plan in the README. */
export type AnalyticsEvent =
  | "user_registered"
  | "wallet_connected"
  | "challenge_created"
  | "challenge_funded"
  | "challenge_joined"
  | "submission_created"
  | "submission_approved"
  | "reward_sent"
  | "achievement_issued"
  | "feedback_submitted";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.capture(event, properties);
}

export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (!KEY) return;
  posthog.identify(userId, traits);
}
