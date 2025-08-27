/**
 * @file AppLayout.jsx
 * @description Provides the main structural layout for the application,
 * including a consistent Header, Footer, and main content area.
 * It also manages and displays global loading indicators for both page
 * navigation and asynchronous API calls.
 */

import { Suspense } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";
import Loading from "../ui/Loading";
import Header from "./Header";
import Footer from "./Footer";

function AppLayout() {
  // --- Hooks ---
  // useNavigation from React Router tracks the state of page transitions.
  const navigation = useNavigation();
  // useLoading is a custom hook to access the global manual loading state.
  const { loadingVisible, loadingMessage } = useLoading();

  // --- State Logic ---
  // The page is considered to be loading if a route transition is in progress.
  const isPageLoading = navigation.state === "loading";

  // The main loading overlay should be shown if either a page is loading OR a manual loading process is active.
  const shouldShowLoading = isPageLoading || loadingVisible;

  // Determine the correct message to display based on the type of loading.
  const message = isPageLoading ? "Loading page..." : loadingMessage;

  return (
    // This main div sets a CSS variable that the Header component can use.
    // This is a robust way to allow a parent to control a child's styles.
    <div
      className="flex min-h-screen w-full flex-col scroll-smooth"
      style={{ "--header-z-index": shouldShowLoading ? 0 : 50 }}
    >
      {/* Conditionally render the full-screen loading overlay. */}
      {shouldShowLoading && <Loading propMessage={message} />}

      <Header />

      {/* The main content area where child routes will be rendered. */}
      <main className="w-full flex-1 pt-20 sm:pt-24 md:pt-28">
        {/*
         * Suspense provides a fallback UI (the Loading component) to show
         * while the code for a lazy-loaded route is being downloaded.
         */}
        <Suspense fallback={<Loading message="Loading page..." />}>
          {/* Outlet is the placeholder where React Router will render the matched child route component. */}
          <Outlet />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

export default AppLayout;
