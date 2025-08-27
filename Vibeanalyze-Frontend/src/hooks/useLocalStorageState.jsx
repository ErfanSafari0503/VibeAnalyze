/**
 * @file useLocalStorageState.js
 * @description Defines a custom React hook that syncs a state variable with the browser's localStorage.
 * This provides a convenient way to create persistent state that survives page reloads.
 */

import { useState, useEffect } from "react";

/**
 * A custom hook that behaves like `useState` but automatically persists the state
 * to localStorage.
 * @param {*} initialState - The initial value of the state, used if nothing is in localStorage.
 * @param {string} key - The unique key under which the value will be stored in localStorage.
 * @returns {[*, Function]} A stateful value and a function to update it.
 */
export function useLocalStorageState(initialState, key) {
  // --- State Initialization ---
  // The state is initialized with a function to ensure this logic runs only once.
  const [value, setValue] = useState(() => {
    try {
      // Attempt to retrieve the value from localStorage.
      const storedValue = localStorage.getItem(key);
      // If a value exists, parse it from JSON; otherwise, use the initial state.
      return storedValue ? JSON.parse(storedValue) : initialState;
    } catch (error) {
      // If parsing fails, log the error and fall back to the initial state.
      console.error(`Error reading localStorage key “${key}”:`, error);
      return initialState;
    }
  });

  // --- Side Effect for Saving State ---
  // This useEffect hook runs whenever the 'value' or 'key' changes.
  useEffect(() => {
    try {
      // Save the current state value to localStorage, converting it to a JSON string.
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Log an error if saving to localStorage fails (e.g., storage is full).
      console.error(`Error setting localStorage key “${key}”:`, error);
    }
  }, [value, key]);

  return [value, setValue];
}
