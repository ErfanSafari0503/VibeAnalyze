/**
 * @file apiClient.js
 * @description Centralized Axios instance for making all HTTP requests to the backend API.
 * This setup ensures consistency in base URL, headers, and timeouts across the application.
 */

import axios from "axios";

// --- Environment Configuration ---
// Retrieves the API's base URL and version from Vite's environment variables.
// These are defined in the project's .env file (e.g., VITE_API_BASE_URL).
const baseUrl = import.meta.env.VITE_API_BASE_URL;
const apiVersion = import.meta.env.VITE_API_VERSION;

// Constructs the full base URL for all API requests (e.g., "http://localhost:3002/v1").
const fullUrl = `${baseUrl}/${apiVersion}`;

/**
 * Pre-configured Axios instance.
 * This client should be used for all API communication to ensure
 * consistent settings and easier maintenance.
 */
const apiClient = axios.create({
  // The base URL that will be prepended to all request paths.
  baseURL: fullUrl,

  // Sets a default timeout of 10 seconds (10000ms) for all requests.
  // If a request takes longer than this, it will be automatically aborted.
  timeout: 10000,

  // Default headers sent with every request.
  headers: {
    "Content-Type": "application/json", // Indicates that request bodies are in JSON format.
    Accept: "application/json", // Indicates that the client expects a JSON response.
  },
});

export default apiClient;
