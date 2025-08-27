/**
 * @file analyzePost.js
 * @description Defines a service function for initiating a new post analysis via the API.
 */

import apiClient from "./apiClient";

/**
 * Sends a post URL to the backend to start a new analysis job.
 * @param {string} postUrl - The full URL of the social media post to be analyzed.
 * @returns {Promise<object>} A promise that resolves to the initial data from the API,
 * which should include the unique ID for the newly created analysis job.
 */
export async function analyzePost(postUrl) {
  // Use the pre-configured apiClient to make a POST request to the /analysis endpoint.
  // The postUrl is sent in the request body.
  const response = await apiClient.post("/analysis", {
    url: postUrl,
  });

  // Return the data from the response body (e.g., { id: 'some-unique-id' }).
  return response.data;
}
