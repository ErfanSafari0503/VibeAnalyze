/**
 * @file ErrorHandler.jsx
 * @description A centralized component for rendering full-page errors.
 * It intelligently handles errors from both React Error Boundaries and the React Router,
 * reports them to Sentry, and displays user-friendly messages for common HTTP statuses.
 */

import { useEffect } from "react";
import { useRouteError } from "react-router-dom";
import * as Sentry from "@sentry/react";
import Error from "./Error";

function ErrorHandler({ error, resetErrorBoundary }) {
  // --- Error Source Detection ---
  // useRouteError() captures errors from the router (e.g., 404 Not Found).
  const routeError = useRouteError();
  // The component prioritizes the 'error' prop from an ErrorBoundary, falling back to the router error.
  const errorToDisplay = error || routeError;

  // --- Side Effect: Sentry Reporting ---
  // This useEffect reports any error that this component is about to display to Sentry.
  useEffect(() => {
    if (errorToDisplay) {
      Sentry.captureException(errorToDisplay);
    }
  }, [errorToDisplay]);

  // --- Fallback for Unknown Errors ---
  // If for some reason no error object is available, render a generic unknown error state.
  if (!errorToDisplay) {
    return (
      <Error
        icon="ExclamationCircleIcon"
        code="UNKNOWN"
        title="An Unknown Error Occurred"
        description="Something went wrong, but no error details were provided."
      />
    );
  }

  // --- Error Message Processing ---
  // Set default, generic error messages.
  let title =
    errorToDisplay.title ||
    errorToDisplay.message ||
    "An unexpected error occurred";
  let description =
    errorToDisplay.description ||
    (errorToDisplay.statusText
      ? errorToDisplay.statusText
      : "Please try again or contact support if the problem persists.");

  // Extract common properties for clarity.
  const code =
    errorToDisplay.code ||
    (errorToDisplay.status ? String(errorToDisplay.status) : "500");
  const icon = errorToDisplay.icon || "ExclamationTriangleIcon";

  // Override the generic messages with user-friendly text for specific HTTP status codes.
  switch (errorToDisplay.status) {
    case 404:
      title = "Page Not Found";
      description =
        "Oops! The page you are looking for does not exist. It might have been moved or deleted.";
      break;
    case 401:
      title = "Unauthorized";
      description =
        "You need to be logged in to access this page. Please log in and try again.";
      break;
    case 403:
      title = "Access Forbidden";
      description =
        "You do not have the necessary permissions to view this content.";
      break;
    case 500:
      title = "Internal Server Error";
      description =
        "There was a problem on our server. We have been notified and are working on a fix.";
      break;
    case 503:
      title = "Service Unavailable";
      description =
        "Our service is temporarily down for maintenance. Please try again in a few moments.";
      break;
    default:
      // No override for other status codes.
      break;
  }

  // --- Final Render ---
  // Pass the processed, user-friendly error details to the presentational Error component.
  return (
    <Error
      icon={icon}
      code={code}
      title={title}
      description={description}
      resetErrorBoundary={resetErrorBoundary}
    />
  );
}

export default ErrorHandler;
