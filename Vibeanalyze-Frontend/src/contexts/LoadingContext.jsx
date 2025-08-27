/**
 * @file LoadingContext.jsx
 * @description Defines the React Context for managing the global loading state,
 * allowing any component in the tree to show, hide, or update the full-screen loading overlay.
 */

import { createContext } from "react";

/**
 * LoadingContext provides a way to pass the global loading state (visibility and message)
 * and the functions to control it through the component tree without prop drilling.
 */
const LoadingContext = createContext();

export { LoadingContext };
