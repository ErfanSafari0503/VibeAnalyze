/**
 * @file cancelAnalysis.js
 * @description Defines a service function for cancelling a running analysis job via the API.
 */

import apiClient from "./apiClient";

/**
 * Sends a request to the backend to cancel an ongoing analysis job.
 * @param {string} id - The unique ID of the analysis job to be cancelled.
 * @returns {Promise<object>} A promise that resolves to the data from the API response,
 * typically a success message or status.
 */
export async function cancelAnalysis(id) {
  // Use the pre-configured apiClient to make a DELETE request to the /analysis/{id} endpoint.
  const response = await apiClient.delete(`/analysis/${id}`);

  // Return the data from the response body.
  return response.data;
}
