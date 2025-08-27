/**
 * @file useErrorHandler.jsx
 * @description Defines a centralized custom hook for processing application errors.
 * This hook is responsible for reporting all errors to Sentry and then deciding
 * whether to display a non-intrusive toast notification or to let the error
 * bubble up to be handled by a full-page error boundary.
 */

import { useCallback } from "react";
import * as Sentry from "@sentry/react";
import { toast as sonnerToast } from "sonner";
import ErrorToast from "../components/ui/toasts/ErrorToast";

/**
 * A custom hook that provides a stable, centralized function for handling errors.
 * @returns {Function} A memoized `handleError` function that takes an error object.
 */
export function useErrorHandler() {
  /**
   * Processes an error object.
   * It reports the error to Sentry, then determines the appropriate user-facing action.
   * @param {Error|AppError} error - The error object to handle.
   * @returns {Error|null} Returns the error object if it should be handled by an
   * ErrorBoundary, or null if it has been handled (e.g., by showing a toast).
   */
  const handleError = useCallback((error) => {
    // --- Step 1: Report Every Error ---
    // Always report the captured error to Sentry for monitoring and debugging.
    Sentry.captureException(error);

    // --- Step 2: Decide How to Display the Error ---
    // Check if the error is a custom AppError with a 'toast' severity.
    if (error.name === "AppError" && error.severity === "toast") {
      // If it is, display a custom toast notification.
      sonnerToast.custom((id) => (
        <ErrorToast
          id={id}
          icon={error.icon}
          code={error.code}
          title={error.title}
          description={error.description}
        />
      ));
      // Return null to signify that the error has been fully handled.
      return null;
    }

    // --- Step 3: Escalate the Error ---
    // If the error is not a 'toast' type (i.e., it's a fullPage error or a generic one),
    // return the error object. This allows the calling component to set it in state
    // and render a full-page ErrorHandler component.
    return error;
  }, []);

  return handleError;
}
