/**
 * @file useLoading.jsx
 * @description Defines a custom hook for accessing the LoadingContext.
 * This simplifies the process of consuming the global loading state in components.
 */

import { useContext } from "react";
import { LoadingContext } from "../contexts/LoadingContext";

/**
 * A custom hook that provides a convenient way to access the LoadingContext.
 * It abstracts the useContext logic and includes a safety check to ensure
 * it is used within a LoadingProvider.
 * @returns {object} The value of the LoadingContext, which includes loading state and control functions.
 * @throws {Error} If the hook is used outside of a LoadingProvider.
 */
function useLoading() {
  const context = useContext(LoadingContext);

  // This safety check ensures the hook is only used within the component tree
  // wrapped by LoadingProvider. If used elsewhere, it throws a clear error
  // to the developer, preventing common bugs.
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }

  return context;
}

export { useLoading };
