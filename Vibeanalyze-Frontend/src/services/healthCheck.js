/**
 * @file healthCheck.js
 * @description Defines a service function for checking the health and availability of the backend API.
 */

import apiClient from "./apiClient";

/**
 * Performs a health check by sending a GET request to the root of the API.
 * It's used to verify that the backend service is online and responsive.
 * @returns {Promise<boolean>} A promise that resolves to true if the API responds with a 200 OK status.
 * @throws {Error} Throws an error if the health check fails (i.e., the response status is not 200).
 */
export async function healthCheck() {
  // Use the pre-configured apiClient to make a GET request to the base URL.
  const response = await apiClient.get();

  // Check if the HTTP status code is 200 (OK).
  if (response.status === 200) {
    return true;
  } else {
    // If the status is anything other than 200, the check is considered failed.
    throw new Error("Health check failed");
  }
}
