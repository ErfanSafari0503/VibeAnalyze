/**
 * @file AnalysisProvider.jsx
 * @description Provides a React Context for managing and persisting global state
 * related to the analysis process, such as the post link and fetched data.
 */

import { useState, useMemo } from "react";
import { AnalysisContext } from "./AnalysisContext";
import { useLocalStorageState } from "../hooks/useLocalStorageState";

/**
 * The AnalysisProvider component wraps parts of the application that need access
 * to the analysis state. It manages the state for the post link, post data, and
 * comments data, persisting the latter two to localStorage.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to this context.
 */
function AnalysisProvider({ children }) {
  // --- State Management ---
  // Standard useState for the post link, as it's temporary and doesn't need to be persisted.
  const [postLink, setPostLink] = useState("");

  // Custom hook to manage state that is automatically saved to and retrieved from localStorage.
  // This ensures that analysis results persist across page refreshes.
  const [postData, setPostData] = useLocalStorageState({}, "postData");
  const [commentsData, setCommentsData] = useLocalStorageState(
    [],
    "commentsData"
  );

  // --- Performance Optimization ---
  // useMemo is used to memoize the context value object. This is a critical optimization
  // that prevents all consumer components from re-rendering every time the provider
  // re-renders, unless one of the dependency values has actually changed.
  const value = useMemo(
    () => ({
      postLink,
      setPostLink,
      postData,
      setPostData,
      commentsData,
      setCommentsData,
    }),
    [
      postLink,
      setPostLink,
      postData,
      setPostData,
      commentsData,
      setCommentsData,
    ]
  );

  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
}

export { AnalysisProvider };
