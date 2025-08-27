/**
 * @file identifyPlatform.js
 * @description Defines a utility function for detecting the source social media
 * platform from a given URL.
 */

/**
 * Detects the source platform of a social media post URL.
 * It supports Telegram, Instagram, YouTube, Twitter, and LinkedIn by matching
 * the URL's hostname against a set of predefined patterns.
 * @param {string} url - The post URL to analyze.
 * @returns {('telegram'|'instagram'|'youtube'|'twitter'|'linkedin'|null)} The detected platform as a lowercase string, or null if the platform is unknown or the URL is invalid.
 */
export function identifyPlatform(url) {
  // --- Input Validation ---
  // Immediately return null if the URL is falsy or not a string.
  if (!url || typeof url !== "string") return null;

  let hostname = "";
  try {
    // Use the URL constructor to safely parse the URL and extract the hostname.
    // This also implicitly validates the basic URL format.
    hostname = new URL(url).hostname.toLowerCase();
  } catch {
    // If the URL constructor fails, the URL is invalid.
    return null;
  }

  // --- Hostname Normalization ---
  // Remove common subdomains (www, m, mobile, web) to simplify pattern matching.
  hostname = hostname.replace(/^(www\.|m\.|mobile\.|web\.)/, "");

  // --- Platform Definitions ---
  // An array of platform objects, each with a name and an array of regex patterns.
  const platforms = [
    {
      name: "telegram",
      patterns: [/^(t|telegram)\.me$/],
    },
    {
      name: "instagram",
      patterns: [/^instagram\.com$/],
    },
    {
      name: "youtube",
      patterns: [/^youtube\.com$/, /^youtu\.be$/],
    },
    {
      name: "twitter",
      patterns: [/^twitter\.com$/, /^x\.com$/],
    },
    {
      name: "linkedin",
      patterns: [/^linkedin\.com$/],
    },
  ];

  // --- Matching Logic ---
  // Iterate through the defined platforms.
  for (const platform of platforms) {
    // Check if the normalized hostname matches any of the patterns for the current platform.
    if (platform.patterns.some((re) => re.test(hostname))) {
      // If a match is found, return the platform's name.
      return platform.name;
    }
  }

  // If no match is found after checking all platforms, return null.
  return null;
}
