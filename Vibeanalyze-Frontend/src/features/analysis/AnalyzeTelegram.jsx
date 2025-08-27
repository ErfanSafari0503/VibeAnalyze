/**
 * @file AnalyzeTelegram.jsx
 * @description A logic-only component that orchestrates the entire multi-step
 * analysis process for a Telegram post. It handles API calls, polling for results,
 * state management, and cleanup upon completion or cancellation.
 */

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../../hooks/useLoading";
import { useAnalysis } from "../../hooks/useAnalysis";
import { useErrorHandler } from "../../hooks/useErrorHandler";
import { AppError } from "../../errors/AppError";
import { validateTelegramUrl } from "../../utils/validators/validateTelegramUrl";
import { analyzePost } from "../../services/analyzePost";
import { pollAnalysisStatus } from "../../utils/pollAnalysisStatus";
import { postDetails } from "../../services/postDetails";
import { commentsDetails } from "../../services/commentsDetails";
import { cancelAnalysis } from "../../services/cancelAnalysis";

function AnalyzeTelegram() {
  // --- Hooks ---
  const navigate = useNavigate();
  const { showLoading, updateLoadingMessage, hideLoading } = useLoading();
  const { postLink, setPostData, setCommentsData } = useAnalysis();
  const handleError = useErrorHandler();
  // A ref to hold the analysis ID, persisting it across renders without causing re-renders.
  const analysisId = useRef(null);

  // This useEffect hook manages the entire lifecycle of the analysis process.
  useEffect(() => {
    // AbortController is used to cancel the client-side polling if the user navigates away.
    const abortController = new AbortController();

    /**
     * The main async function that performs the multi-step analysis.
     */
    async function analyzeTelegramPost() {
      try {
        // --- Step 1: Initial Setup & Validation ---
        showLoading("Identifying platform");
        updateLoadingMessage("Validating Telegram link");

        const validation = validateTelegramUrl(postLink);
        if (!validation) {
          throw new AppError({
            icon: "XCircleIcon",
            code: "TELEGRAM_VALIDATION_ERROR",
            title: "Invalid Telegram Link Format",
            description:
              "The link format is incorrect. Please ensure you're using a valid Telegram post URL, like: t.me/channel_name/1234",
            severity: "toast",
          });
        }

        // --- Step 2: Start Analysis & Polling ---
        updateLoadingMessage("Processing Telegram post");
        const postResult = await analyzePost(postLink);
        // Store the ID in the ref so it's accessible in the cleanup function.
        analysisId.current = postResult.id;

        updateLoadingMessage("Analysis started, waiting for results");
        const statusResult = await pollAnalysisStatus({
          id: postResult.id,
          signal: abortController.signal,
        });

        // --- Step 3: Handle Final Status ---
        if (statusResult.status.toUpperCase() === "COMPLETED") {
          updateLoadingMessage("Gathering analysis results");
          const postDetailsResult = await postDetails(postResult.id);
          const commentsDetailsResult = await commentsDetails(postResult.id);

          // Update global state and navigate to the results page with fresh data.
          setPostData(postDetailsResult);
          setCommentsData(commentsDetailsResult);
          navigate("/telegram", {
            state: {
              postData: postDetailsResult,
              commentsData: commentsDetailsResult,
            },
          });
        }

        if (statusResult.status.toUpperCase() === "FAILED") {
          throw new AppError({
            icon: "ServerIcon",
            code: "TELEGRAM_ANALYSIS_ERROR",
            title: "Analysis Could Not Be Completed",
            description:
              "We encountered an issue on our server while analyzing the post. Please try again in a few moments.",
            severity: "toast",
          });
        }
      } catch (error) {
        // Gracefully handle the AbortError, which is an expected signal, not a true error.
        if (error.name === "AbortError") {
          return;
        }
        // Re-throw any other unexpected errors to be caught by the final handler.
        throw error;
      }
    }

    // --- Execution & Final Error Handling ---
    // Execute the main async function and attach a final catch block.
    analyzeTelegramPost().catch((error) => {
      hideLoading();
      let processedError = error;
      // Convert generic network errors into a user-friendly AppError.
      if (error.name === "AxiosError" && error.code === "ERR_NETWORK") {
        processedError = new AppError({
          icon: "SignalSlashIcon",
          title: "Connection Error",
          description:
            "Could not connect to the server. Please check your internet connection and try again.",
          severity: "toast",
        });
      }
      // Pass the final error to the central error handler hook.
      handleError(processedError);
    });

    // --- Cleanup Function ---
    // This function is returned from useEffect and runs when the component unmounts.
    return () => {
      // 1. Abort any ongoing client-side polling.
      abortController.abort();
      // 2. Ensure the loading screen is hidden.
      hideLoading();
      // 3. If an analysis was started, send a cancellation request to the backend.
      if (analysisId.current) {
        cancelAnalysis(analysisId.current).catch(() => {
          // Intentionally left blank. We don't need to bother the user if server-side cancellation fails.
        });
      }
    };
  }, [
    showLoading,
    updateLoadingMessage,
    postLink,
    hideLoading,
    setPostData,
    setCommentsData,
    navigate,
    handleError,
  ]);

  // This component renders no UI itself; its only purpose is to run the effect.
  return null;
}

export { AnalyzeTelegram };
