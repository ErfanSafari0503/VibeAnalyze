/**
 * @file SuccessToast.jsx
 * @description A reusable toast component for displaying success messages.
 * It uses the 'sonner' library for toast management and provides a consistent,
 * styled appearance for success notifications.
 */

import { toast as sonnerToast } from "sonner";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";

// An object to map string names to the actual icon components.
// This allows for future flexibility if other success-style icons are needed.
const icons = {
  CheckCircleIcon: CheckCircleIcon,
};

/**
 * Renders a styled success toast notification.
 * @param {object} props - The component props.
 * @param {string|number} props.id - The unique ID provided by the 'sonner' library, used for dismissing the toast.
 * @param {string} [props.icon] - The string key for the icon to display (defaults to "CheckCircleIcon").
 * @param {string} props.title - The main title of the success message.
 * @param {string} [props.description] - A more detailed description of the success.
 * @param {React.ReactNode} [props.button] - An optional button component for user actions.
 */
function SuccessToast({ id, icon, title, description, button }) {
  /**
   * Handles dismissing the toast notification.
   */
  const handleDismiss = () => {
    sonnerToast.dismiss(id);
  };

  // Select the correct icon component from the map based on the string prop,
  // with a safe fallback to the default success icon.
  const IconComponent = icons[icon] || CheckCircleIcon;

  return (
    // Main container for the toast with dark theme styling.
    <div className="flex w-full max-w-md gap-4 rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-2xl transition-all duration-200 ease-in-out">
      {/* Icon section */}
      <div className="flex-shrink-0 pt-0.5">
        <IconComponent className="h-6 w-6 text-green-500" />
      </div>

      {/* Content section */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="font-Inter text-base font-semibold text-gray-100">
            {title || "Success"}
          </h3>
          <button
            onClick={handleDismiss}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300 focus:ring-2 focus:ring-green-200 focus:outline-none"
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

export default SuccessToast;
