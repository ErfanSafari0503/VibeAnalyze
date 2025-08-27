/**
 * @file FeatureCard.jsx
 * @description A reusable card component for displaying a single feature or benefit.
 * It includes a dynamic icon, title, and description, with hover animations.
 */

import {
  MagnifyingGlassIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

// An object to map string names to the actual icon components.
// This allows for dynamically rendering icons based on a prop.
const icons = {
  MagnifyingGlassIcon: MagnifyingGlassIcon,
  UsersIcon: UsersIcon,
  ChartBarIcon: ChartBarIcon,
};

/**
 * Renders a single feature card with an icon, title, and description.
 * @param {object} props - The component props.
 * @param {string} props.icon - The string key for the icon to display (e.g., "UsersIcon").
 * @param {string} props.title - The title of the feature.
 * @param {string} props.description - The description of the feature.
 */
function FeatureCard({ icon, title, description }) {
  // Select the correct icon component from the map based on the string prop.
  const IconComponent = icons[icon];

  return (
    // The main article element for the card with hover transition effects.
    <article className="group flex h-full flex-col rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:bg-white hover:shadow-2xl sm:p-8 md:rounded-3xl md:p-10 lg:p-12">
      {/* Icon container with background and hover animations. */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-blue-600/50 sm:h-18 sm:w-18 md:mb-6 md:h-20 md:w-20 lg:h-24 lg:w-24">
        {/* Conditionally render the icon only if it exists in the map. */}
        {IconComponent && (
          <IconComponent className="size-6 text-white sm:size-7 md:size-8 lg:size-9" />
        )}
      </div>

      {/* Feature title. */}
      <h3 className="font-DM-Sans mb-3 text-lg font-semibold tracking-tight text-gray-800 transition-colors duration-300 group-hover:text-gray-900 sm:mb-4 sm:text-xl md:text-2xl lg:text-3xl">
        {title}
      </h3>

      {/* Decorative underline element with hover animation. */}
      <div className="mb-4 w-16 rounded-full border-b-4 border-blue-600 transition-all duration-300 group-hover:w-20 group-hover:border-blue-700 sm:mb-6 sm:w-20 group-hover:sm:w-24 md:w-24 group-hover:md:w-28"></div>

      {/* Feature description. 'mt-auto' pushes it to the bottom of the card. */}
      <p className="font-DM-Sans mt-auto text-sm leading-relaxed text-gray-600 transition-colors duration-300 group-hover:text-gray-700 sm:text-base md:text-lg lg:text-xl">
        {description}
      </p>
    </article>
  );
}

export default FeatureCard;
