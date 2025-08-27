/**
 * @file ToastHandler.jsx
 * @description A component that acts as a router to render the correct
 * visual toast component (e.g., Success, Error, Warning) based on a 'type' prop.
 */

import SuccessToast from "./SuccessToast";
import ErrorToast from "./ErrorToast";
import ToastWarning from "./ToastWarning";

/**
 * Renders the appropriate toast component based on the provided type.
 * This component allows the main Toast utility to remain simple while
 * centralizing the logic for which visual component to display.
 * @param {object} props - The component props, passed down from the main Toast function.
 * @param {string|number} props.id - The unique ID for the toast.
 * @param {'success'|'Warning'|'Error'} props.type - The type of toast to render.
 * @param {string} [props.icon] - The string key for the icon.
 * @param {string} [props.code] - An optional error code.
 * @param {string} props.title - The title of the toast.
 * @param {string} [props.description] - The description for the toast.
 * @param {React.ReactNode} [props.button] - An optional button component.
 * @returns {React.ReactNode|null} The corresponding toast component or null.
 */
function ToastHandler({ id, type, icon, code, title, description, button }) {
  if (type === "success") {
    return (
      <SuccessToast
        id={id}
        icon={icon}
        title={title}
        description={description}
        button={button}
      />
    );
  } else if (type === "Warning") {
    return (
      <ToastWarning
        id={id}
        icon={icon}
        title={title}
        description={description}
        button={button}
      />
    );
  } else if (type === "Error") {
    return (
      <ErrorToast
        id={id}
        icon={icon}
        code={code}
        title={title}
        description={description}
        button={button}
      />
    );
  } else if (type === "Action") {
    // Placeholder for a potential 'Action' toast type.
    return null;
  } else if (type === "Promise") {
    // Placeholder for a potential 'Promise' toast type (e.g., for async operations).
    return null;
  } else if (type === "Loading") {
    // Placeholder for a potential 'Loading' toast type.
    return null;
  }

  // Return null if the type is unknown to prevent rendering errors.
  return null;
}

export default ToastHandler;
