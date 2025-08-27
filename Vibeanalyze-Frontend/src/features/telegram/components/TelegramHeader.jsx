/**
 * @file TelegramHeader.jsx
 * @description Renders the header section for the Telegram results page,
 * displaying the author's avatar, name, username, and follower count.
 */

import { useState, useEffect } from "react";
import { UserGroupIcon } from "@heroicons/react/24/solid";
import { fetchImage } from "../../../services/fetchImage";

/**
 * Renders the header for the Telegram analysis results.
 * @param {object} props - The component props.
 * @param {object} props.postData - The data object for the analyzed post.
 */
function TelegramHeader({ postData }) {
  // --- State ---
  // Manages the URL for the author's avatar, which is fetched asynchronously.
  const [avatarUrl, setAvatarUrl] = useState(null);

  // --- Props Destructuring ---
  // Destructure required properties from the postData object for cleaner access.
  const {
    authorAvatarPath,
    authorFollowersCount,
    authorFullName,
    authorUsername,
  } = postData;

  // --- Side Effect for Avatar Fetching ---
  // This effect runs when the authorAvatarPath changes to fetch the avatar image.
  useEffect(() => {
    // If there's no avatar path, set a default avatar and exit.
    if (!authorAvatarPath) {
      setAvatarUrl("./src/assets/default-avatar.png");
      return;
    }

    /**
     * An async function to fetch the avatar URL from the provided path.
     */
    async function loadAuthorAvatar() {
      try {
        const url = await fetchImage(authorAvatarPath);
        // Set the fetched URL, or a default if the fetch returns a falsy value.
        setAvatarUrl(url || "./src/assets/default-avatar.png");
      } catch (error) {
        console.error("Failed to load avatar:", error);
        // Set a default avatar if the fetch operation fails.
        setAvatarUrl("./src/assets/default-avatar.png");
      }
    }

    loadAuthorAvatar();
  }, [authorAvatarPath]);

  return (
    // Main header container with border and padding.
    <div className="flex items-center gap-3 border-b border-gray-700 p-4">
      {/* Author Avatar Image */}
      <img
        src={avatarUrl}
        alt={authorFullName}
        // Fallback in case the image source fails to load for any reason.
        onError={(e) => (e.target.src = "./src/assets/default-avatar.png")}
        className="h-12 w-12 rounded-full border border-gray-700 object-cover"
      />
      {/* Author Name and Username */}
      <div className="flex flex-col">
        <span className="text-base font-bold text-gray-100">
          {authorFullName}
        </span>
        <span className="text-xs text-gray-400">@{authorUsername}</span>
      </div>
      {/* Follower Count Badge */}
      <span className="ml-auto flex items-center gap-1 rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
        <UserGroupIcon className="h-4 w-4" />
        {`Followers: ${authorFollowersCount ? authorFollowersCount : 0}`}
      </span>
    </div>
  );
}

export default TelegramHeader;
