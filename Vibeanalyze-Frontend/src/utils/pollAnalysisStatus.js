/**
 * @file pollAnalysisStatus.js
 * @description Defines a utility function for polling an API endpoint to get the
 * status of a long-running job, with support for cancellation.
 */

import { analysisStatus } from "../services/analysisStatus";

/**
 * Periodically fetches the status of an analysis job until it is completed or failed.
 * This function is cancellable via an AbortController signal.
 * @param {object} options - The options for the polling function.
 * @param {string} options.id - The unique ID of the analysis job to poll.
 * @param {AbortSignal} options.signal - An AbortSignal from an AbortController to cancel the polling.
 * @param {number} [options.intervalMs=2000] - The interval in milliseconds between polling attempts.
 * @returns {Promise<object>} A promise that resolves with the final status object when the job is
 * finished, or rejects if an error occurs or the operation is aborted.
 */
export async function pollAnalysisStatus({ id, signal, intervalMs = 2000 }) {
  // Return a new Promise to allow the caller to await the final result of the polling.
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      // --- Cancellation Check ---
      // Before each poll, check if the AbortController has signaled an abort.
      if (signal?.aborted) {
        // Added optional chaining for safety
        clearInterval(interval);
        // Reject the promise with a standard AbortError to be handled by the caller.
        return reject(new DOMException("Aborted", "AbortError"));
      }

      try {
        // --- API Call ---
        // Fetch the current status of the analysis job.
        const statusResult = await analysisStatus(id);

        // --- Completion Check ---
        // Check if the job's status is a terminal state (COMPLETED or FAILED).
        if (
          statusResult.status.toUpperCase() === "COMPLETED" ||
          statusResult.status.toUpperCase() === "FAILED"
        ) {
          // If the job is finished, stop polling and resolve the promise with the final result.
          clearInterval(interval);
          resolve(statusResult);
        }
        // If the status is still pending (e.g., "ANALYZING"), the interval will simply run again.
      } catch (error) {
        // --- Error Handling ---
        // If any API call fails, stop polling and reject the promise with the error.
        clearInterval(interval);
        reject(error);
      }
    }, intervalMs);
  });
}
