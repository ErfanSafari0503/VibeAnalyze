/**
 * @file Toast.jsx
 * @description A centralized utility function for creating and displaying custom toast notifications.
 * It acts as a wrapper around the 'sonner' toast library to integrate with the custom ToastHandler component.
 */

import { toast as sonnerToast } from "sonner";
import ToastHandler from "./ToastHandler";

/**
 * Creates and displays a custom toast notification.
 * This function abstracts the sonner library's custom toast creation,
 * making it easy to trigger different types of toasts from anywhere in the application.
 * @param {object} props - The properties for the toast.
 * @param {'success'|'Warning'|'Error'} props.type - The type of toast to display.
 * @param {string} [props.icon] - The string key for the icon to be used.
 * @param {string} [props.code] - An optional error code.
 * @param {string} props.title - The main title of the toast message.
 * @param {string} [props.description] - A more detailed description for the toast.
 * @param {React.ReactNode} [props.button] - An optional button component for user actions.
 */
export function Toast({ type, icon, code, title, description, button }) {
  // sonnerToast.custom allows for rendering a completely custom React component as a toast.
  // It provides a unique 'id' that can be used to programmatically dismiss the toast.
  return sonnerToast.custom((id) => (
    <ToastHandler
      id={id}
      type={type}
      icon={icon}
      code={code}
      title={title}
      description={description}
      button={button}
    />
  ));
}

// Re-exporting ToastHandler for convenience, allowing it to be imported from this module if needed.
export { default as ToastHandler } from "./ToastHandler";
