/**
 * @file commentsDetails.js
 * @description Defines a service function for fetching the detailed analysis results for all comments of a post.
 */

import apiClient from "./apiClient";

/**
 * Fetches the detailed analysis results for all comments associated with a completed analysis job.
 * @param {string} id - The unique ID of the analysis job.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of comment data objects from the API.
 */
export async function commentsDetails(id) {
  // Use the pre-configured apiClient to make a GET request to the /analysis/{id}/comments endpoint.
  const response = await apiClient.get(`/analysis/${id}/comments`);

  // Return the data from the response body, which should be an array of comments.
  return response.data;
}
