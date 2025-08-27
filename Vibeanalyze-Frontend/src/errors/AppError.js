/**
 * @file AppError.js
 * @description Defines a custom, structured error class for the application.
 * This allows for creating consistent, predictable error objects that can be
 * handled gracefully by the UI (e.g., showing a toast vs. a full-page error).
 */

/**
 * A custom error class that extends the native Error class.
 * It allows for additional properties like severity, error codes, and UI hints (icons).
 */
export class AppError extends Error {
  /**
   * Creates an instance of AppError.
   * @param {object} [options={}] - The configuration for the error.
   * @param {string} [options.icon] - The name of the Heroicon to display.
   * @param {string} [options.code] - A unique code for the error (e.g., "POST_LINK_EMPTY").
   * @param {string} [options.title] - The main title of the error message.
   * @param {string} [options.description] - A more detailed, user-friendly description.
   * @param {'toast'|'fullPage'} [options.severity] - Determines how the error should be displayed to the user.
   */
  constructor(options = {}) {
    // Call the parent Error constructor with a sensible default message.
    super(options.description || options.title || "An error occurred");

    // Set the name of the error, which is useful for identifying it in catch blocks.
    this.name = "AppError";

    // Assign custom properties from the options object.
    this.icon = options.icon;
    this.code = options.code;
    this.title = options.title;
    this.description = options.description;
    this.severity = options.severity; // 'toast' or 'fullPage'
  }
}
