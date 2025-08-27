/**
 * @file Telegram.jsx
 * @description Renders the main results page for a Telegram post analysis.
 * It displays the post details and a list of analyzed comments. It also manages
 * a loading state specifically for fetching comment author avatars.
 */

import { useRef, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import { useLoading } from "../../hooks/useLoading";
import { useAnalysis } from "../../hooks/useAnalysis";
import ErrorHandler from "../../errors/ErrorHandler";
import TelegramHeader from "./components/TelegramHeader";
import TelegramPost from "./components/TelegramPost";
import TelegramComment from "./components/TelegramComment";

function Telegram() {
  // --- Hooks ---
  const location = useLocation();
  const contextData = useAnalysis();
  const { updateLoadingMessage, hideLoading } = useLoading();
  // A ref to count how many comment avatars are still loading.
  const pendingCommentsAvatars = useRef(0);

  // --- Data Retrieval ---
  // This robustly gets the analysis data. It prioritizes fresh data passed via
  // router state on navigation, but falls back to data from the context,
  // which is persisted in localStorage. This ensures data is available even after a page refresh.
  const postData = location.state?.postData || contextData.postData;
  const commentsData = location.state?.commentsData || contextData.commentsData;

  // --- Side Effect for Avatar Loading ---
  // This effect manages the loading state for the comment avatars.
  useEffect(() => {
    if (commentsData && commentsData.length > 0) {
      // Count how many comments have an avatar that needs to be fetched.
      pendingCommentsAvatars.current = commentsData.filter(
        (c) => c?.author?.avatarPath
      ).length;

      // If no avatars need fetching, hide the loader immediately.
      if (pendingCommentsAvatars.current === 0) {
        hideLoading();
        return;
      }
      // Otherwise, show the loader with a specific message.
      updateLoadingMessage("Loading authors avatars");
    } else {
      // If there's no comment data, ensure the loader is hidden.
      hideLoading();
    }
  }, [commentsData, updateLoadingMessage, hideLoading]);

  /**
   * A callback function passed down to each TelegramComment component.
   * Each comment calls this function once its avatar has finished loading (or failed).
   * This allows the parent to track when all children are ready.
   */
  const handleCommentReady = useCallback(() => {
    pendingCommentsAvatars.current -= 1;
    // When the counter reaches zero, all avatars have been processed, so we hide the loader.
    if (pendingCommentsAvatars.current === 0) {
      hideLoading();
    }
  }, [hideLoading]);

  // --- Guard Clause ---
  // If there is no post data available (e.g., user navigates here directly),
  // display a helpful message instead of crashing.
  if (!postData || Object.keys(postData).length === 0) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center p-8 text-center text-gray-200">
        No analysis data found. Please go back and analyze a post.
      </div>
    );
  }

  return (
    // Wrap the component in an error boundary to catch any rendering errors.
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <div className="mx-auto my-10 flex min-h-[70vh] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl transition-all md:my-12 md:max-w-3xl">
        {/* Header section displaying the main author/channel info. */}
        <TelegramHeader postData={postData} />

        <div className="flex flex-col md:flex-row">
          {/* Post Container */}
          <div className="flex flex-col justify-start border-b border-gray-700 p-4 md:w-1/2 md:flex-shrink-0 md:border-b-0 md:border-r">
            <TelegramPost postData={postData} />
          </div>

          {/* Comments Container */}
          <div className="flex-1 overflow-hidden bg-gray-800 p-2 md:w-1/2 md:flex-col">
            {commentsData && commentsData.length > 0 ? (
              // Scrollable container for the list of comments.
              <div className="flex max-h-[350px] flex-col gap-3 overflow-y-auto pr-2 md:max-h-[70vh]">
                {commentsData.map((comment) => (
                  <TelegramComment
                    key={comment.id}
                    commentData={comment}
                    onReady={handleCommentReady}
                  />
                ))}
              </div>
            ) : (
              // Display a message if there are no comments.
              <div className="py-8 text-center text-gray-400">
                No comments to display.
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Telegram;
