/**
 * @file main.jsx
 * @description This is the main entry point for the React application.
 * It handles the initialization of Sentry for error and performance monitoring,
 * and renders the root App component into the DOM.
 */

import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import * as Sentry from "@sentry/react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

// Import global styles and the root App component
import "./index.css";
import App from "./App.jsx";

// --- Environment Variables ---
// Load Sentry DSN and API base URL from Vite environment variables.
// VITE_SENTRY_DSN is exposed to the client, while __SENTRY_RELEASE__ is injected at build time.
const sentryDsn = import.meta.env.VITE_SENTRY_DSN;
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// --- Sentry Initialization ---
// Configure and initialize the Sentry SDK for error tracking, performance monitoring, and session replay.
Sentry.init({
  // The DSN (Data Source Name) tells the Sentry SDK where to send events.
  dsn: sentryDsn,

  // Associates events with a specific version of the application, linking errors to source maps.
  // This value is injected by Vite from package.json during the build process.
  release: __SENTRY_RELEASE__,

  // Enables Sentry's powerful integrations.
  integrations: [
    // Enables performance monitoring and automatic transaction creation for React Router v6.
    Sentry.reactRouterV6BrowserTracingIntegration({
      useEffect,
      useLocation,
      useNavigationType,
      createRoutesFromChildren,
      matchRoutes,
    }),
    // Enables the Session Replay feature to record and replay user sessions.
    Sentry.replayIntegration(),
  ],

  // Allows Sentry to collect potentially personally identifiable information, like IP addresses.
  sendDefaultPii: true,

  // --- Sampling Rates ---
  // Captures 100% of transactions for performance monitoring.
  // In a high-traffic production app, this might be lowered (e.g., to 0.1) to sample transactions.
  tracesSampleRate: 1.0,

  // Enables distributed tracing for requests sent to the specified origins.
  // This allows Sentry to connect frontend transactions with backend transactions.
  tracePropagationTargets: ["localhost", baseUrl],

  // Captures 10% of all user sessions for Session Replay.
  replaysSessionSampleRate: 0.1,
  // Captures 100% of user sessions that encounter an error.
  replaysOnErrorSampleRate: 1.0,
});

// --- Application Rendering ---
// Find the root DOM element and render the React application.
const container = document.getElementById("root");
const root = createRoot(container);

// StrictMode is a developer tool for highlighting potential problems in an application.
// It does not affect the production build.
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
