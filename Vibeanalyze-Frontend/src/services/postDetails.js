/**
 * @file postDetails.js
 * @description Defines a service function for fetching the detailed analysis results for a specific post.
 */

import apiClient from "./apiClient";

/**
 * Fetches the detailed analysis results for the main post of a completed analysis job.
 * @param {string} id - The unique ID of the analysis job.
 * @returns {Promise<object>} A promise that resolves to the post data object from the API.
 */
export async function postDetails(id) {
  // Use the pre-configured apiClient to make a GET request to the /analysis/{id}/post endpoint.
  const response = await apiClient.get(`/analysis/${id}/post`);

  // Return the data from the response body, which should be the post's details.
  return response.data;
}
