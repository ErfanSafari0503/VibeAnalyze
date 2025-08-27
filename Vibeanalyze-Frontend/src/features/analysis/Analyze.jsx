/**
 * @file Analyze.jsx
 * @description The main page component for the analysis feature. It handles
 * the primary form submission, identifies the social media platform from the URL,
 * and conditionally renders the appropriate analysis component (e.g., AnalyzeTelegram).
 * It also manages its own error state for full-page errors originating from form submission.
 */

import { useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  PaperAirplaneIcon,
  LinkIcon,
  SparklesIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { useLoading } from "../../hooks/useLoading";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { AppError } from "../../errors/AppError";
import { identifyPlatform } from "../../utils/identifyPlatform";
import { AnalyzeTelegram } from "./AnalyzeTelegram";
import ErrorHandler from "../../errors/ErrorHandler";

function Analyze() {
  // --- State ---
  // Determines which platform-specific analysis component to render.
  const [analyzePlatform, setAnalyzePlatform] = useState("");
  // Manages full-page errors that occur within this component's event handlers.
  const [pageError, setPageError] = useState(null);

  // --- Hooks ---
  const { showLoading, hideLoading } = useLoading();
  const { postLink, setPostLink } = useAnalysis();
  const handleError = useErrorHandler();

  /**
   * Handles the submission of the analysis form.
   * It validates the input, identifies the platform, and triggers the appropriate analysis flow.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  async function handleSendPostLink(e) {
    e.preventDefault();
    // Reset any previous page errors before starting a new analysis.
    setPageError(null);
    try {
      if (!postLink) {
        throw new AppError({
          icon: "LinkIcon",
          code: "POST_LINK_EMPTY",
          title: "No Link Provided",
          description:
            "Please paste the URL of the post you would like to analyze.",
          severity: "toast",
        });
      }

      showLoading("Identifying platform");
      const platform = identifyPlatform(postLink);

      if (!platform) {
        throw new AppError({
          icon: "QuestionMarkCircleIcon",
          code: "PLATFORM_NOT_SUPPORTED",
          title: "Unrecognized Platform",
          description:
            "Sorry, we couldn't identify a supported platform from that URL. We can currently analyze posts from: Telegram, Instagram, YouTube, Twitter, and LinkedIn.",
          severity: "fullPage",
        });
      }

      switch (platform) {
        case "telegram":
          setAnalyzePlatform("telegram");
          break;
        default:
          throw new AppError({
            icon: "ClockIcon",
            code: "PLAT_NOT_IMPLEMENTED",
            title: "Analysis for this Platform is Coming Soon!",
            description:
              "We've recognized the platform, but our analysis feature for it is still under development. Please check back later!",
            severity: "toast",
          });
      }
    } catch (error) {
      hideLoading();
      // Use the central error handler hook to process the error.
      const errorToDisplay = handleError(error);
      // If the handler determines it's a full-page error, set it in local state.
      if (errorToDisplay) {
        setPageError(errorToDisplay);
      }
    }
  }

  // If a full-page error has occurred, render the ErrorHandler component.
  if (pageError) {
    return (
      <ErrorHandler
        error={pageError}
        resetErrorBoundary={() => setPageError(null)}
      />
    );
  }

  return (
    // This ErrorBoundary catches rendering errors within its children.
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorHandler error={error} resetErrorBoundary={resetErrorBoundary} />
      )}
    >
      <div className="mx-auto flex w-full max-w-[90rem] flex-col justify-start pt-10 pb-6 px-4 sm:px-6 sm:py-8 md:px-8 md:py-12 lg:px-12 xl:px-16">
        {/* Page Header Section */}
        <div className="mb-6 text-center sm:mb-8 md:mb-12">
          <h1 className="font-Inter mb-2 text-2xl font-bold tracking-wide text-gray-800 sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
            Analyze Social Media Posts
          </h1>
          <p className="font-DM-Sans mx-auto max-w-xl text-sm tracking-normal text-gray-600 sm:text-base md:max-w-2xl md:text-lg lg:max-w-3xl lg:text-xl xl:max-w-4xl">
            Understand audience reactions with our smart AI post analysis across
            Telegram, Instagram, YouTube, Twitter, and LinkedIn for more
            effective engagement.
          </p>
        </div>

        {/* Main Analysis Form Container */}
        <div className="mx-auto w-full max-w-lg space-y-4 sm:max-w-xl sm:space-y-6 md:max-w-2xl lg:space-y-8">
          <form
            onSubmit={handleSendPostLink}
            className="space-y-4 sm:space-y-5 md:space-y-6"
          >
            {/* URL Input Field */}
            <div className="relative transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02]">
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-blue-600 via-gray-800 to-yellow-500 opacity-20 blur-[2px] transition-all duration-300 hover:opacity-30 hover:blur-[3px] sm:-inset-1 sm:rounded-3xl sm:blur-[3px] sm:hover:blur-[4px]"></div>
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl md:rounded-3xl">
                <input
                  type="text"
                  placeholder="Paste social media post URL here..."
                  className="font-DM-Sans w-full rounded-xl border-0 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-lg ring-2 ring-gray-100 transition-all duration-300 focus:ring-4 focus:ring-blue-200 focus:outline-none sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base md:rounded-3xl md:px-6 md:py-5 md:text-lg lg:py-6"
                  value={postLink}
                  onChange={(e) => setPostLink(e.target.value)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 via-gray-800 to-yellow-500 px-4 py-3 text-sm font-medium text-white shadow-xl transition-all duration-300 hover:shadow-2xl disabled:opacity-50 sm:rounded-2xl sm:px-5 sm:py-4 sm:text-base md:rounded-3xl md:px-6 md:py-5 md:text-lg lg:py-6"
            >
              Analyze Post
              <PaperAirplaneIcon className="ml-2 h-4 w-4 transform transition-transform duration-300 group-hover:translate-x-1 sm:ml-3 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </form>

          {/* How It Works Guide Section */}
          <div className="mx-auto mt-8 w-full space-y-4 rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-4 shadow-xl sm:mt-10 sm:space-y-6 sm:rounded-3xl sm:p-6 md:mt-12 md:space-y-8 md:p-8 lg:mt-16">
            <h2 className="font-Inter mb-4 text-center text-xl font-semibold text-gray-800 sm:mb-6 sm:text-2xl md:mb-8 md:text-3xl lg:text-4xl">
              How It Works
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 md:gap-8">
              {/* Step 1: Paste Link */}
              <div className="group rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl sm:p-6 md:p-6 lg:p-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14 md:rounded-2xl lg:h-16 lg:w-16">
                  <LinkIcon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-800 sm:mb-3 sm:text-lg md:text-xl">
                  Paste Link
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
                  Enter any public post URL from Telegram, Instagram, YouTube,
                  Twitter, or LinkedIn.
                </p>
              </div>

              {/* Step 2: AI Analysis */}
              <div className="group rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl sm:p-6 md:p-6 lg:p-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-500 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14 md:rounded-2xl lg:h-16 lg:w-16">
                  <SparklesIcon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-800 sm:mb-3 sm:text-lg md:text-xl">
                  AI Analysis
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
                  Our advanced AI processes comments and content in real-time.
                </p>
              </div>

              {/* Step 3: Get Results */}
              <div className="group rounded-xl bg-white p-4 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl sm:p-6 md:p-6 lg:p-8">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-gray-700 text-white shadow-lg transition-transform duration-300 group-hover:scale-110 sm:mb-4 sm:h-14 sm:w-14 md:rounded-2xl lg:h-16 lg:w-16">
                  <ChartBarIcon className="h-6 w-6 text-white sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-gray-800 sm:mb-3 sm:text-lg md:text-xl">
                  Get Results
                </h3>
                <p className="text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
                  Review detailed insights and actionable metrics instantly.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Conditionally render the platform-specific analysis component. */}
      {analyzePlatform === "telegram" && <AnalyzeTelegram />}
    </ErrorBoundary>
  );
}

export default Analyze;
