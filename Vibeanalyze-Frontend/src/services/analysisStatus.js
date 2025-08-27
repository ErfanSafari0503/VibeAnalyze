/**
 * @file analysisStatus.js
 * @description Defines a service function for fetching the status of an ongoing analysis from the API.
 */

import apiClient from "./apiClient";

/**
 * Fetches the current status of a specific analysis job.
 * This is typically used for polling the backend to see if a long-running task is complete.
 * @param {string} id - The unique ID of the analysis job to check.
 * @returns {Promise<object>} A promise that resolves to the analysis status data from the API.
 */
export async function analysisStatus(id) {
  // Use the pre-configured apiClient to make a GET request to the /analysis/{id} endpoint.
  const response = await apiClient.get(`/analysis/${id}`);

  // Return the data from the response body.
  return response.data;
}
