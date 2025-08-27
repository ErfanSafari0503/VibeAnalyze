/**
 * @file fetchImage.js
 * @description Defines a service function for fetching image files (like avatars)
 * from the backend API as binary data and converting them into a usable URL.
 */

import apiClient from "./apiClient";

/**
 * Fetches an image file from a given path on the API and creates a local,
 * temporary URL for it that can be used in an `<img>` src attribute.
 * @param {string} fileName - The name or path of the image file to fetch from the API.
 * @returns {Promise<string|null>} A promise that resolves to a local blob URL for the image, or null if the fetch fails.
 */
export async function fetchImage(fileName) {
  try {
    // Use the pre-configured apiClient to make a GET request.
    const response = await apiClient.get(`/analysis/thumbnails/${fileName}`, {
      // 'responseType: "blob"' is crucial. It tells Axios to expect binary data (an image)
      // instead of trying to parse the response as JSON.
      responseType: "blob",
      headers: {
        // Explicitly state that we accept JPEG images.
        Accept: "image/jpeg",
      },
    });

    // URL.createObjectURL creates a temporary, local URL that references the
    // downloaded image data (the blob). This is highly efficient.
    const imageUrl = URL.createObjectURL(response.data);
    return imageUrl;
  } catch (error) {
    // If the request fails, log the error for debugging and return null.
    console.error("Error fetching image:", error);
    return null;
  }
}
