/**
 * @file useAnalysis.jsx
 * @description Defines a custom hook for accessing the AnalysisContext.
 * This simplifies the process of consuming the analysis state in components.
 */

import { useContext } from "react";
import { AnalysisContext } from "../contexts/AnalysisContext";

/**
 * A custom hook that provides a convenient way to access the AnalysisContext.
 * It abstracts the useContext logic and includes a safety check to ensure
 * it is used within an AnalysisProvider.
 * @returns {object} The value of the AnalysisContext, which includes analysis state and setter functions.
 * @throws {Error} If the hook is used outside of an AnalysisProvider.
 */
function useAnalysis() {
  const context = useContext(AnalysisContext);

  // This safety check ensures the hook is only used within the component tree
  // wrapped by AnalysisProvider, preventing common bugs.
  if (context === undefined) {
    throw new Error("useAnalysis must be used within an AnalysisProvider");
  }

  return context;
}

export { useAnalysis };
