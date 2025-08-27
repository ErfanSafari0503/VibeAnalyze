/**
 * @file LoadingProvider.jsx
 * @description Provides a React Context for managing the global loading state
 * throughout the application, making it accessible to any component.
 */

import { useReducer, useCallback, useMemo } from "react";
import { LoadingContext } from "./LoadingContext";
import { initialState, ACTIONS, reducer } from "./loadingStateReducer";

/**
 * The LoadingProvider component wraps parts of the application that need access
 * to the global loading state. It uses a reducer for robust state management.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will have access to this context.
 */
function LoadingProvider({ children }) {
  // --- State Management ---
  // useReducer is used for managing the loading state (visibility and message).
  // This is generally more scalable than useState for state with multiple actions.
  const [state, dispatch] = useReducer(reducer, initialState);

  // --- Memoized Actions ---
  // useCallback is used to memoize the action dispatchers. This ensures that
  // these functions have a stable identity across re-renders, preventing
  // unnecessary re-renders in consumer components.

  /**
   * Shows the loading overlay with an optional custom message.
   * @param {string} [customMessage] - A message to display on the loading screen.
   */
  const showLoading = useCallback((customMessage) => {
    dispatch({
      type: ACTIONS.SHOW_LOADING,
      payload: { message: customMessage },
    });
  }, []);

  /**
   * Updates the message on an already visible loading overlay.
   * @param {string} newMessage - The new message to display.
   */
  const updateLoadingMessage = useCallback((newMessage) => {
    if (!newMessage) return;
    dispatch({
      type: ACTIONS.UPDATE_LOADING_MESSAGE,
      payload: { message: newMessage },
    });
  }, []);

  /**
   * Hides the loading overlay.
   */
  const hideLoading = useCallback(() => {
    dispatch({ type: ACTIONS.HIDE_LOADING });
  }, []);

  // --- Context Value ---
  // The value provided to consumer components. useMemo is used here as a final
  // optimization to ensure the value object itself is stable.
  const value = useMemo(
    () => ({
      loadingVisible: state.show,
      loadingMessage: state.message,
      showLoading,
      updateLoadingMessage,
      hideLoading,
    }),
    [state.show, state.message, showLoading, updateLoadingMessage, hideLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export { LoadingProvider };
