/**
 * @file FinalCallToAction.jsx
 * @description Renders a final call-to-action (CTA) section, designed to be
 * the last major prompt on a page to guide users toward the main application feature.
 */

import { Link } from "react-router-dom";

function FinalCallToAction() {
  return (
    // Main section container with distinct styling to draw the user's attention.
    <section className="w-full rounded-3xl border-2 border-gray-100 bg-gray-50 p-8 shadow-xl sm:p-10 md:p-12 lg:p-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* Section heading using the consistent h2-heading utility class. */}
        <h2 className="h2-heading">Ready to Understand Your Audience?</h2>

        {/* A brief paragraph reinforcing the value proposition. */}
        <p className="mb-10 text-lg leading-relaxed text-gray-600 sm:mb-12 sm:text-xl md:text-2xl lg:mb-16">
          Analyze social posts from Telegram, Instagram, YouTube, and more. Get
          clear insights into audience sentiment and engagement with our
          powerful AI.
        </p>

        {/* The primary call-to-action button linking to the analyze page. */}
        <Link
          to="/analyze"
          className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50 sm:px-10 sm:py-5 sm:text-xl md:px-12 md:py-6 md:text-2xl"
          // Provides an accessible name for the link for screen reader users.
          aria-label="Analyze your social posts now"
        >
          Analyze Your Social Posts Now
        </Link>
      </div>
    </section>
  );
}

export default FinalCallToAction;
