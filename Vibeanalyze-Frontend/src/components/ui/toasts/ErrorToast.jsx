/**
 * @file ErrorToast.jsx
 * @description A reusable toast component for displaying error messages.
 * It uses the 'sonner' library for toast management and provides a consistent,
 * styled appearance for various types of errors with dynamic icons.
 */

import { toast as sonnerToast } from "sonner";
import {
  ExclamationTriangleIcon,
  LinkIcon,
  ClockIcon,
  XCircleIcon,
  ServerIcon,
  SignalSlashIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

// An object to map string names to the actual icon components.
// This provides a clean and scalable way to render different error icons.
const icons = {
  ExclamationTriangleIcon: ExclamationTriangleIcon,
  LinkIcon: LinkIcon,
  ClockIcon: ClockIcon,
  XCircleIcon: XCircleIcon,
  ServerIcon: ServerIcon,
  SignalSlashIcon: SignalSlashIcon,
};

/**
 * Renders a styled error toast notification.
 * @param {object} props - The component props.
 * @param {string|number} props.id - The unique ID provided by the 'sonner' library, used for dismissing the toast.
 * @param {string} [props.icon] - The string key for the icon to display (e.g., "ServerIcon").
 * @param {string} [props.code] - An optional error code to display.
 * @param {string} props.title - The main title of the error message.
 * @param {string} [props.description] - A more detailed description of the error.
 * @param {React.ReactNode} [props.button] - An optional button component for user actions (e.g., "Try Again").
 */
function ErrorToast({ id, icon, code, title, description, button }) {
  /**
   * Handles dismissing the toast notification.
   */
  const handleDismiss = () => {
    sonnerToast.dismiss(id);
  };

  // Select the correct icon component from the map based on the string prop.
  // It defaults to a generic warning icon if the specified icon is not found.
  const IconComponent = icons[icon] || ExclamationTriangleIcon;

  return (
    // Main container for the toast with dark theme styling.
    <div className="flex w-full max-w-md gap-4 rounded-xl border border-gray-700 bg-gray-900 p-4 shadow-2xl transition-all duration-200 ease-in-out">
      {/* Icon section */}
      <div className="flex-shrink-0 pt-0.5">
        {IconComponent && <IconComponent className="h-6 w-6 text-red-500" />}
      </div>

      {/* Content section */}
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-Inter text-base font-semibold text-gray-100">
              {title || "Error"}
            </h3>
            {/* Conditionally render the error code if provided. */}
            {code && (
              <span className="mt-0.5 inline-block rounded-md bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-400">
                Code: {code}
              </span>
            )}
          </div>
          <button
            onClick={handleDismiss}
            className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-800 hover:text-gray-300 focus:ring-2 focus:ring-red-200 focus:outline-none"
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

export default ErrorToast;
