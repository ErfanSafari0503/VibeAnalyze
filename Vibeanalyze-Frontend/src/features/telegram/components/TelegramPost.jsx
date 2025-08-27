/**
 * @file TelegramPost.jsx
 * @description Renders the main content of an analyzed Telegram post,
 * including its text, thumbnail (if available), and key engagement metrics.
 */

import { useState, useEffect } from "react";
import {
  EyeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { fetchImage } from "../../../services/fetchImage";

/**
 * Renders the main post content within the Telegram results page.
 * @param {object} props - The component props.
 * @param {object} props.postData - The data object for the analyzed post.
 */
function TelegramPost({ postData }) {
  // --- State ---
  // Manages the URL for the post's thumbnail, which is fetched asynchronously.
  const [thumbnailUrl, setThumbnailUrl] = useState(null);

  // --- Props Destructuring ---
  // Destructure required properties from the postData object for cleaner access.
  const {
    authorFullName,
    commentsCount,
    content,
    thumbnailPath,
    viewsCount,
    publishedAt,
  } = postData;

  // --- Side Effect for Thumbnail Fetching ---
  // This effect runs when the thumbnailPath changes to fetch the image.
  useEffect(() => {
    if (!thumbnailPath) {
      return;
    }

    /**
     * An async function to fetch the thumbnail URL from the provided path.
     */
    async function loadThumbnail() {
      try {
        const url = await fetchImage(thumbnailPath);
        // Set the fetched URL in state to trigger a re-render with the image.
        setThumbnailUrl(url);
      } catch (error) {
        console.error("Failed to load post thumbnail:", error);
        // Ensure no image is shown if the fetch operation fails.
        setThumbnailUrl(null);
      }
    }

    loadThumbnail();
  }, [thumbnailPath]);

  // --- Data Formatting ---
  // Formats the ISO date string into a more readable, localized format.
  const formattedPublishedAt = publishedAt
    ? new Date(publishedAt).toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col gap-2">
      {/* Main container with Telegram-like styling. */}
      <div className="mx-auto flex w-full flex-col justify-center rounded-2xl bg-sky-500 p-4 shadow-md">
        <div className="mb-2">
          <span className="text-sm font-bold text-yellow-300">
            {authorFullName}
          </span>
        </div>

        {/* Conditionally render the thumbnail image only if a URL has been successfully fetched. */}
        {thumbnailUrl && (
          <div className="mb-3 overflow-hidden rounded-lg shadow-inner">
            <img
              src={thumbnailUrl}
              alt="Post thumbnail"
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {/* The main text content of the post. */}
        <div className="mb-2 whitespace-pre-line text-sm leading-relaxed text-white">
          {content}
        </div>

        {/* Footer section for engagement metrics and publish date. */}
        <div className="mt-2 flex items-center gap-4 text-xs text-sky-200">
          <span className="flex items-center gap-1">
            <EyeIcon className="h-4 w-4" />
            {`${viewsCount ? viewsCount : 0}`}
          </span>
          <span className="flex items-center gap-1">
            <ChatBubbleLeftRightIcon className="h-4 w-4" />
            {`${commentsCount ? commentsCount : 0}`}
          </span>
          <span className="ml-auto flex items-center gap-1">
            {formattedPublishedAt}
            {formattedPublishedAt && <CheckIcon className="h-4 w-4" />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default TelegramPost;
