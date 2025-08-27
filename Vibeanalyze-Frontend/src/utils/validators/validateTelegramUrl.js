/**
 * @file validateTelegramUrl.js
 * @description Defines a utility function for validating the format of a Telegram post URL.
 */

/**
 * Validates if the provided string is a correctly formatted Telegram post URL.
 * A valid URL must be from the t.me domain and have a path structure of /{channel_name}/{post_id}.
 * @param {string} url - The URL string to validate.
 * @returns {boolean} Returns true if the URL is a valid Telegram post link, otherwise false.
 */
export function validateTelegramUrl(url) {
  // Immediately return false for null, undefined, or empty string inputs.
  if (!url) {
    return false;
  }

  try {
    // The URL constructor will throw an error if the input string is not a valid URL format.
    const urlObj = new URL(url);

    // Validate that the hostname is exactly "t.me".
    if (urlObj.hostname !== "t.me") {
      return false;
    }

    // Split the pathname (e.g., "/channel_name/1234") into parts, removing any empty strings.
    const pathParts = urlObj.pathname.split("/").filter(Boolean);

    // A valid post URL must have exactly two parts: the channel name and the post ID.
    if (pathParts.length !== 2) {
      return false;
    }

    const [channelName, postId] = pathParts;

    // Validate that the channel name contains only alphanumeric characters and underscores.
    if (!channelName || !/^[a-zA-Z0-9_]+$/.test(channelName)) {
      return false;
    }

    // Validate that the post ID consists only of digits.
    if (!postId || !/^\d+$/.test(postId)) {
      return false;
    }

    // If all checks pass, the URL is considered valid.
    return true;
  } catch {
    // If the URL constructor throws an error (e.g., for "not a valid url"), catch it and return false.
    return false;
  }
}
