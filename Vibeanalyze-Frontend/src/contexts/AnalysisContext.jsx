/**
 * @file AnalysisContext.jsx
 * @description Defines the React Context for managing global state related to the analysis process.
 * This includes the post link and the resulting analysis data.
 */

import { createContext } from "react";

/**
 * AnalysisContext provides a way to pass analysis-related data and functions
 * through the component tree without having to pass props down manually at every level.
 */
const AnalysisContext = createContext();

export { AnalysisContext };
