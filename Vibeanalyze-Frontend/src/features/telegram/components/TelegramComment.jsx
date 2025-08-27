/**
 * @file TelegramComment.jsx
 * @description Renders a single Telegram comment, including author details,
 * content, a potential thumbnail, and a collapsible section for detailed AI analysis results.
 * It also handles fetching the author's avatar and comment thumbnail asynchronously.
 */

import { useState, useEffect, useRef } from "react";
import {
  ChartBarIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";
import { fetchImage } from "../../../services/fetchImage";

/**
 * Renders a single analyzed Telegram comment.
 * @param {object} props - The component props.
 * @param {object} props.commentData - The data object for the comment.
 * @param {Function} props.onReady - A callback function to notify the parent component when the avatar has finished loading.
 */
function TelegramComment({ commentData, onReady }) {
  // --- State ---
  // Manages the visibility of the collapsible analysis details section.
  const [showAnalysis, setShowAnalysis] = useState(false);
  // Manages the URL for the author's avatar, which is fetched asynchronously.
  const [avatarUrl, setAvatarUrl] = useState(null);
  // Manages the URL for the comment's attached thumbnail, if it exists.
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  // A ref to ensure the onReady callback is only fired once per component instance.
  const notified = useRef(false);

  // --- Props Destructuring ---
  // Destructure all properties from commentData for cleaner access in the JSX.
  const {
    authorAvatarPath,
    authorFullName,
    authorUsername,
    content,
    publishedAt,
    thumbnailPath,
    sentimentType,
    sentimentScore,
    satisfactionScore,
    tone,
    language,
    confidenceLevel,
    emotionScores,
    keywords,
    topics,
    positiveSentences,
    additionalInsights,
    personalityTraits,
  } = commentData;

  // --- Data Formatting ---
  // Formats the ISO date string into a more readable, localized format (date and time without seconds).
  const formattedPublishedAt = publishedAt
    ? new Date(publishedAt).toLocaleString(undefined, {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // --- Side Effect for Avatar Fetching ---
  // This effect runs when the component mounts or authorAvatarPath changes.
  useEffect(() => {
    async function loadAuthorAvatar() {
      try {
        if (!authorAvatarPath) {
          setAvatarUrl("./src/assets/default-avatar.png");
          return;
        }
        const url = await fetchImage(authorAvatarPath);
        setAvatarUrl(url || "./src/assets/default-avatar.png");
      } catch (error) {
        console.error("Failed to load avatar:", error);
        setAvatarUrl("./src/assets/default-avatar.png");
      } finally {
        // The finally block ensures the parent is notified, even if the image fetch fails.
        if (!notified.current) {
          onReady();
          notified.current = true;
        }
      }
    }
    loadAuthorAvatar();
  }, [authorAvatarPath, onReady]);

  // --- Side Effect for Comment Thumbnail Fetching ---
  // This effect runs if a thumbnailPath is provided for the comment.
  useEffect(() => {
    if (!thumbnailPath) {
      return;
    }
    async function loadThumbnail() {
      try {
        const url = await fetchImage(thumbnailPath);
        setThumbnailUrl(url);
      } catch (error) {
        console.error("Failed to load comment thumbnail:", error);
        setThumbnailUrl(null);
      }
    }
    loadThumbnail();
  }, [thumbnailPath]);

  // Determines the background color for the sentiment badge based on its type.
  const sentimentColor =
    sentimentType === "positive"
      ? "bg-green-600"
      : sentimentType === "negative"
        ? "bg-red-600"
        : "bg-gray-500";

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-lg transition-all duration-200 hover:bg-gray-50">
      <div className="flex items-start gap-3">
        <img
          src={avatarUrl}
          alt={authorFullName}
          onError={(e) => (e.target.src = "./src/assets/default-avatar.png")}
          className="h-10 w-10 rounded-full object-cover"
        />
        <div className="flex flex-1 flex-col">
          {/* Comment Header: Author Info and analysis toggle button */}
          <div className="mb-1.5 flex items-center gap-2">
            <span className="font-medium text-gray-900">{authorFullName}</span>
            <div className="flex flex-1 items-center justify-between">
              <span className="text-sm text-gray-500">@{authorUsername}</span>
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="ml-auto flex items-center gap-1 text-sm text-gray-500 transition-colors duration-200 hover:text-gray-700"
                aria-expanded={showAnalysis}
                aria-controls={`analysis-${commentData.id}`}
              >
                {showAnalysis ? (
                  <ChevronUpIcon className="h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Comment Body */}
          <div className="mb-2 whitespace-pre-line text-sm text-gray-800">
            {content}
          </div>

          {/* Conditionally render the comment's thumbnail image if it exists */}
          {thumbnailUrl && (
            <div className="my-2 overflow-hidden rounded-lg shadow-inner">
              <img
                src={thumbnailUrl}
                alt="Comment thumbnail"
                className="h-auto w-full object-cover"
              />
            </div>
          )}

          {/* Comment Footer: Published Date */}
          {formattedPublishedAt && (
            <div className="mt-2 text-right">
              <span className="text-xs text-gray-400">
                {formattedPublishedAt}
              </span>
            </div>
          )}

          {/* Collapsible Analysis Section */}
          {showAnalysis && (
            <div
              id={`analysis-${commentData.id}`}
              className="mx-auto mt-3 w-full border-t border-gray-200 pt-3"
            >
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                {/* --- Main Analysis Data --- */}
                {sentimentType && (
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs text-white ${sentimentColor}`}
                    >
                      {sentimentType
                        ? `${sentimentType
                            .charAt(0)
                            .toUpperCase()}${sentimentType.slice(1)}`
                        : "Neutral"}{" "}
                      Sentiment ({(sentimentScore ?? 0).toFixed(2)})
                    </span>
                  </div>
                )}
                {satisfactionScore !== null &&
                  typeof satisfactionScore === "number" &&
                  satisfactionScore !== 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Satisfaction</span>
                      <span className="font-medium text-gray-800">
                        {satisfactionScore.toFixed(2)}
                      </span>
                    </div>
                  )}
                {language && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Language</span>
                    <span className="font-medium uppercase text-gray-800">
                      {language}
                    </span>
                  </div>
                )}

                {/* --- Tones Section (Updated) --- */}
                {tone && (Array.isArray(tone) ? tone.length > 0 : tone) && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Tones
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {(Array.isArray(tone) ? tone : [tone]).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* --- Other Analysis Data --- */}
                {keywords && keywords.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Keywords
                    </span>
                    <p className="mt-1 text-gray-800">{keywords.join(", ")}</p>
                  </div>
                )}
                {topics && topics.length > 0 && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Topics
                    </span>
                    <p className="mt-1 text-gray-800">{topics.join(", ")}</p>
                  </div>
                )}
                {emotionScores && Object.keys(emotionScores).length > 0 && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Emotions
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {Object.entries(emotionScores).map(([emotion, score]) => (
                        <span
                          key={emotion}
                          className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                        >
                          {`${emotion
                            .charAt(0)
                            .toUpperCase()}${emotion.slice(1)}: ${(
                            score * 100
                          ).toFixed(0)}%`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {positiveSentences && positiveSentences.analysis && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Positive Analysis
                    </span>
                    <p className="mt-1 text-gray-800">
                      {positiveSentences.analysis}
                    </p>
                  </div>
                )}
                {additionalInsights && additionalInsights.Meaning && (
                  <div className="col-span-2">
                    <span className="text-sm font-medium text-gray-600">
                      Insight
                    </span>
                    <p className="mt-1 text-gray-800">
                      {additionalInsights.Meaning}
                    </p>
                  </div>
                )}
                {personalityTraits &&
                  personalityTraits.traits &&
                  personalityTraits.traits.length > 0 && (
                    <div className="col-span-2">
                      <span className="text-sm font-medium text-gray-600">
                        Personality
                      </span>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {personalityTraits.traits.map((trait) => (
                          <span
                            key={trait}
                            className="inline-flex items-center rounded-full bg-gray-200 px-2 py-0.5 text-xs capitalize"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TelegramComment;
