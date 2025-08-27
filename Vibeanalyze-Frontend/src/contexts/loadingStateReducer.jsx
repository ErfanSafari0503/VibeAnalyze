/**
 * @file loadingStateReducer.js
 * @description Defines the state structure, actions, and reducer logic for the global
 * loading context. This follows the standard Redux pattern for predictable state management.
 */

// The initial state for the loading context when the application first loads.
const initialState = {
  show: false,
  message: "Loading...",
};

// An object containing action type constants. Using constants helps prevent
// typos and makes the code more maintainable.
const ACTIONS = {
  SHOW_LOADING: "SHOW_LOADING",
  UPDATE_LOADING_MESSAGE: "UPDATE_LOADING_MESSAGE",
  HIDE_LOADING: "HIDE_LOADING",
};

/**
 * The reducer function for the loading state. It takes the current state and an
 * action, and returns the new state based on the action type.
 * @param {object} state - The current state.
 * @param {object} action - The action dispatched to the reducer.
 * @returns {object} The new state.
 */
function reducer(state, action) {
  switch (action.type) {
    // Handles the action to show the loading overlay.
    case ACTIONS.SHOW_LOADING:
      return {
        ...state,
        show: true,
        message: action.payload.message || "Loading...",
      };

    // Handles the action to update the message on an already visible loader.
    // It also ensures the loader becomes visible if it was previously hidden.
    case ACTIONS.UPDATE_LOADING_MESSAGE:
      return {
        ...state,
        show: true,
        message: action.payload.message || state.message,
      };

    // Handles the action to hide the loading overlay and resets the message.
    case ACTIONS.HIDE_LOADING:
      return {
        ...state,
        show: false,
        message: "Loading...",
      };

    // Returns the current state if the action type is unknown.
    default:
      return state;
  }
}

export { initialState, ACTIONS, reducer };
