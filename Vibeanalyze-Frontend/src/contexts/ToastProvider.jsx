/**
 * @file ToastProvider.jsx
 * @description Provides a context wrapper for the 'sonner' toast notification library,
 * ensuring that the toast container is available throughout the application.
 */

import { Toaster } from "sonner";

/**
 * The ToastProvider component. It should be placed high in the component tree
 * (e.g., in App.jsx) to ensure that toasts can be displayed from anywhere.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components of the provider.
 */
function ToastProvider({ children }) {
  return (
    <>
      {/* Renders the rest of the application. */}
      {children}
      {/* The Toaster component from 'sonner' is the container where all toast
        notifications will be rendered. It only needs to be rendered once.
        - position: Sets the screen location for toasts.
        - closeButton: Adds a default close button to all toasts.
      */}
      <Toaster position="bottom-right" closeButton />
    </>
  );
}

export { ToastProvider };
