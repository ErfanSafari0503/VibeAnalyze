/**
 * @file ToastWarning.jsx
 * @description A reusable toast component for displaying warning messages.
 * It uses the 'sonner' library for toast management and provides a consistent,
 * styled appearance for warnings with dynamic icons.
 */

import { toast as sonnerToast } from "sonner";
import {
  ExclamationTriangleIcon,
  CloudIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

/**
 * Renders a styled warning toast notification.
 * @param {object} props - The component props.
 * @param {string|number} props.id - The unique ID provided by the 'sonner' library, used for dismissing the toast.
 * @param {string} [props.icon] - The string key for the icon to display (defaults to "ExclamationTriangleIcon").
 * @param {string} props.title - The main title of the warning message.
 * @param {string} [props.description] - A more detailed description of the warning.
 * @param {React.ReactNode} [props.button] - An optional button component for user actions.
 */
function ToastWarning({ id, icon, title, description, button }) {
  /**
   * Handles dismissing the toast notification.
   */
  const handleDismiss = () => {
    sonnerToast.dismiss(id);
  };

  // An object to map icon names (strings) to actual icon components.
  // This allows for future flexibility if other warning-style icons are needed.
  const icons = {
    ExclamationTriangleIcon: (
      <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />
    ),
    CloudIcon: <CloudIcon className="h-6 w-6 text-blue-500" />,
    // e.g., BellIcon: <BellIcon className="h-6 w-6 text-yellow-500" />
  };

  // Select the icon based on the prop, or use a default if not provided.
  const selectedIcon = icons[icon] || icons.ExclamationTriangleIcon;

  return (
    // Main container for the toast with dark theme styling.
    <div className="flex w-full max-w-md gap-4 rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-2xl transition-all duration-200 ease-in-out">
      {/* Icon section */}
      <div className="flex-shrink-0 pt-0.5">{selectedIcon}</div>

      {/* Content section */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-Inter text-base font-semibold text-gray-100">
            {title || "Warning"}
          </h3>
          <button
            onClick={handleDismiss}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300 focus:ring-2 focus:ring-yellow-200 focus:outline-none"
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Conditionally render the description if provided. */}
        {description && (
          <p className="font-DM-Sans mt-2 text-sm leading-relaxed text-gray-400">
            {description}
          </p>
        )}

        {/* Conditionally render an action button if provided. */}
        {button && <div className="mt-4">{button}</div>}
      </div>
    </div>
  );
}

export default ToastWarning;
