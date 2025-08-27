/**
 * @file App.jsx
 * @description The root component of the application. It sets up the main router,
 * context providers, and global side-effects like Sentry user identification
 * and an initial backend health check.
 */

import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import * as Sentry from "@sentry/react";

// --- Application Providers ---
import { LoadingProvider } from "./contexts/LoadingProvider.jsx";
import { ToastProvider } from "./contexts/ToastProvider.jsx";
import { AnalysisProvider } from "./contexts/AnalysisProvider.jsx";

// --- Services & UI Components ---
import { healthCheck } from "./services/healthCheck";
import { Toast } from "./components/ui/toasts/Toast.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import ErrorHandler from "./errors/ErrorHandler.jsx";

/**
 * A helper function to create a lazy-loaded route wrapped in an ErrorBoundary.
 * This pattern ensures that each lazy-loaded page has its own error boundary,
 * preventing a single page's error from crashing the entire application.
 * @param {Function} importFn - The dynamic import function, e.g., () => import('./pages/Home.jsx').
 * @returns {Object} A route configuration object for React Router.
 */
const createLazyRoute = (importFn) => {
  return {
    lazy: async () => {
      const { default: Component } = await importFn();
      // Return a new component that wraps the lazy-loaded one in an ErrorBoundary.
      return {
        Component: () => (
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <ErrorHandler
                error={error}
                resetErrorBoundary={resetErrorBoundary}
              />
            )}
          >
            <Component />
          </ErrorBoundary>
        ),
      };
    },
  };
};

// --- Router Configuration ---
// Defines the application's routes using React Router.
const router = createBrowserRouter([
  {
    // The root layout that wraps all pages.
    element: <AppLayout />,
    // The error element to display for router-level errors (e.g., 404 Not Found).
    errorElement: <ErrorHandler />,
    children: [
      {
        path: "/",
        ...createLazyRoute(() => import("./pages/home/Home.jsx")),
      },
      {
        path: "/how-it-works",
        ...createLazyRoute(() => import("./pages/HowItWorks.jsx")),
      },
      {
        path: "/about-us",
        ...createLazyRoute(() => import("./pages/AboutUs.jsx")),
      },
      {
        path: "/analyze",
        ...createLazyRoute(() => import("./features/analysis/Analyze.jsx")),
      },
      {
        path: "/telegram",
        ...createLazyRoute(() => import("./features/telegram/Telegram.jsx")),
      },
    ],
  },
]);

/**
 * The main App component.
 * It wraps the entire application in necessary context providers and a global error boundary.
 */
function App() {
  // This useEffect runs once when the application first loads.
  useEffect(() => {
    // Set a unique anonymous user ID for Sentry session tracking.
    // This can be replaced with a real user ID upon authentication.
    Sentry.setUser({
      id: `anonymous-user-${Math.random().toString(36).substring(2, 9)}`,
    });

    // Performs a health check against the backend API on startup.
    const checkBackendStatus = async () => {
      try {
        await healthCheck();
      } catch (error) {
        // If the backend is unreachable, display a user-friendly warning toast.
        Toast({
          type: "Warning",
          icon: "CloudIcon",
          title: "Service Temporarily Unavailable",
          description:
            "We're having trouble connecting to our services at the moment. Some features may be limited while we work to fix the issue.",
        });
      }
    };

    checkBackendStatus();
  }, []); // The empty dependency array ensures this effect runs only once on mount.

  return (
    // A global ErrorBoundary to catch any uncaught errors from the providers or router.
    <ErrorBoundary
      fallbackRender={({ error }) => <ErrorHandler error={error} />}
    >
      {/* Context providers to make global state available throughout the app. */}
      <LoadingProvider>
        <ToastProvider>
          <AnalysisProvider>
            {/* The RouterProvider renders the application based on the defined routes. */}
            <RouterProvider router={router} />
          </AnalysisProvider>
        </ToastProvider>
      </LoadingProvider>
    </ErrorBoundary>
  );
}

export default App;
