/**
 * @file Error.jsx
 * @description A presentational component for rendering a full-page error screen.
 * It's designed to be highly reusable, displaying a dynamic icon, error code,
 * title, and description, along with user actions like navigating home or back.
 */

import { Link, useNavigate } from "react-router-dom";
import {
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";

// An object mapping string keys to icon components. This provides a clean,
// scalable way to render different icons based on the `icon` prop.
const iconMap = {
  ExclamationTriangleIcon: (
    <ExclamationTriangleIcon
      className="size-14 text-red-500"
      aria-hidden="true"
    />
  ),
  QuestionMarkCircleIcon: (
    <QuestionMarkCircleIcon
      className="size-14 text-red-500"
      aria-hidden="true"
    />
  ),
};

/**
 * Renders a user-friendly, full-page error display.
 * @param {object} props - The component props.
 * @param {string} props.icon - The string key for the icon to display (e.g., "ExclamationTriangleIcon").
 * @param {string} props.code - The error code to display (e.g., "404", "500").
 * @param {string} props.title - The main title of the error message.
 * @param {string} props.description - A more detailed description of the error.
 * @param {Function} [props.resetErrorBoundary] - An optional function from an error boundary to reset the component's state.
 */
function Error({ icon, code, title, description, resetErrorBoundary }) {
  const navigate = useNavigate();

  /**
   * Navigates the user to the previous page in their history.
   */
  const handleGoBack = () => {
    navigate(-1);
  };

  // Select the appropriate icon from the map, with a safe fallback to the default error icon.
  const displayIcon = iconMap[icon] || iconMap.ExclamationTriangleIcon;

  return (
    // Main container for the full-screen error page.
    <div className="flex min-h-screen w-full items-center justify-center px-4 py-12">
      <main className="w-full max-w-lg text-center">
        {/* Icon container */}
        <div
          className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg"
          role="img"
          aria-label="Error Icon"
        >
          {displayIcon}
        </div>

        {/* Error code and title section */}
        <p className="font-Inter mb-2 text-lg font-semibold text-red-500">
          Error: <span className="text-blue-600">{code}</span>
        </p>
        <h1 className="font-Inter mb-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h1>
        <p className="font-DM-Sans mb-8 text-base text-gray-600">
          {description}
        </p>

        {/* User actions container */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="font-DM-Sans focus:ring-opacity-50 inline-flex transform items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50 focus:ring-4 focus:ring-blue-300 focus:outline-none active:scale-[0.98]"
          >
            <HomeIcon className="h-5 w-5" aria-hidden="true" />
            Go to Homepage
          </Link>

          <button
            onClick={handleGoBack}
            className="font-DM-Sans focus:ring-opacity-50 inline-flex transform items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-md transition-all duration-300 hover:bg-gray-100 hover:text-gray-800 hover:shadow-lg focus:ring-4 focus:ring-gray-200 focus:outline-none active:scale-[0.98]"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" aria-hidden="true" />
            Go Back
          </button>

          {/* Conditionally render the "Try Again" button only if a reset function is provided. */}
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className="font-DM-Sans focus:ring-opacity-50 inline-flex transform items-center justify-center gap-2 rounded-xl bg-blue-100 px-6 py-3 text-base font-semibold text-blue-700 shadow-md transition-all duration-300 hover:bg-blue-200 hover:text-blue-800 hover:shadow-lg focus:ring-4 focus:ring-blue-300 focus:outline-none active:scale-[0.98]"
            >
              <ArrowPathIcon className="h-5 w-5" aria-hidden="true" />
              Try Again
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

export default Error;
