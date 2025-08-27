/**
 * @file Loading.jsx
 * @description A full-screen loading overlay component that displays animated
 * spinners and a dynamic message to the user during asynchronous operations
 * like page navigation or API calls.
 */

import { useLoading } from "../../hooks/useLoading";

function Loading({ propMessage }) {
  // --- Hooks ---
  // Access the global loading message from the LoadingContext.
  const { loadingMessage } = useLoading();

  // --- Sub-components for Visuals ---
  // These are defined inside the main component as they are only used here.

  /**
   * Renders a multi-layered, rotating spinner with the brand logo at its center.
   */
  const LoadingSpinner = () => (
    <div className="relative h-24 w-24 transform transition-all duration-500 ease-out sm:h-28 sm:w-28 md:h-32 md:w-32">
      {/* The rotating outer rings */}
      <div className="absolute inset-0 animate-[spin-slow_3s_linear_infinite] rounded-full border-4 border-transparent border-t-yellow-500/70 shadow-lg drop-shadow-lg" />
      <div className="absolute inset-2 animate-[spin-medium-reverse_2s_linear_infinite] rounded-full border-3 border-transparent border-t-blue-500/60 transition-all duration-300" />
      <div className="absolute inset-4 animate-[spin-fast_1.5s_linear_infinite] rounded-full border-2 border-transparent border-t-gray-300/80 transition-all duration-300" />

      {/* The central logo, replacing the white dot */}
      <img
        src="/logo.png"
        alt="Loading logo"
        className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 animate-[pulse-custom_2s_ease-in-out_infinite] rounded-full object-contain"
      />
    </div>
  );

  /**
   * Renders three bouncing dots as a secondary loading indicator.
   */
  const LoadingDots = () => (
    <div className="flex justify-center gap-2 transition-all duration-300">
      {[0, 1, 2].map((index) => {
        const dotColors = [
          "bg-yellow-400/90",
          "bg-blue-400/90",
          "bg-gray-300/90",
        ];
        return (
          <span
            key={index}
            className={`h-2 w-2 animate-[bounce_1.4s_ease-in-out_infinite] rounded-full sm:h-2.5 sm:w-2.5 ${dotColors[index]} shadow-sm`}
            style={{
              animationDelay: `${index * 0.2}s`,
              animationDuration: "1.4s",
            }}
          />
        );
      })}
    </div>
  );

  // --- Render Logic ---
  // Determine the message to display. Priority is given to the message passed via props
  // (e.g., from AppLayout for page navigation), falling back to the global context message.
  const messageToDisplay = propMessage || loadingMessage || "Loading...";

  return (
    // The main overlay container. It's fixed to cover the entire viewport.
    // z-50 ensures it appears on top of all other content.
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-md transition-all duration-300"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex transform flex-col items-center gap-6 px-6 text-center transition-all duration-500 ease-out sm:gap-8 md:gap-10">
        <LoadingSpinner />
        <div className="space-y-4 sm:space-y-5">
          <p className="font-Inter text-lg font-medium tracking-wide text-yellow-50 transition-all duration-300 sm:text-xl md:text-2xl">
            {messageToDisplay}
          </p>
          <LoadingDots />
        </div>
      </div>
    </div>
  );
}

export default Loading;
