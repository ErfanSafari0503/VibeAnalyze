/**
 * @file QuickStartGuide.jsx
 * @description Renders a section that provides a simple, step-by-step guide
 * on how to use the application, encouraging user engagement.
 */

import { Link } from "react-router-dom";

function QuickStartGuide() {
  return (
    // Main section container with a distinct background and shadow to stand out on the page.
    <section className="mx-auto max-w-4xl bg-white px-4 pt-12 pb-10 shadow-2xl sm:px-6 sm:pt-16 sm:pb-14 md:rounded-3xl md:px-8 md:pt-20 md:pb-16 lg:px-12 lg:pt-24 lg:pb-20">
      <div className="mx-auto max-w-3xl">
        {/* Section heading using the consistent h2-heading utility class. */}
        <h2 className="h2-heading mb-12">
          Universal Social Analysis in{" "}
          <span className="text-blue-600">3 Simple Steps</span>
        </h2>

        {/* Container for the list of steps. */}
        <div className="space-y-10 sm:space-y-12 md:space-y-16">
          {/* Step 1 */}
          <div className="group relative flex items-start space-x-4">
            <div className="font-DM-Sans flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-500 text-lg font-bold text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-yellow-400/50 sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-DM-Sans mb-2 text-xl font-semibold tracking-normal text-gray-800 transition-colors duration-300 group-hover:text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                Paste the Link
              </h3>
              <p className="font-DM-Sans text-base font-medium leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                Copy any public post URL from Telegram, Instagram, YouTube,
                Twitter, or LinkedIn and paste it into our universal analyzer.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group relative flex items-start space-x-4">
            <div className="font-DM-Sans flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-blue-400/50 sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-DM-Sans mb-2 text-xl font-semibold tracking-normal text-gray-800 transition-colors duration-300 group-hover:text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                AI Does the Magic
              </h3>
              <p className="font-DM-Sans text-base font-medium leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                Our advanced AI processes the post content and comments from any
                social platform in seconds using cross-platform sentiment
                analysis.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group flex items-start space-x-4">
            <div className="font-DM-Sans flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-700 text-lg font-bold text-white shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-gray-400/50 sm:h-12 sm:w-12 sm:text-xl md:h-14 md:w-14 md:text-2xl">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-DM-Sans mb-2 text-xl font-semibold tracking-normal text-gray-800 transition-colors duration-300 group-hover:text-gray-900 sm:mb-4 sm:text-2xl md:text-3xl">
                Explore Your Results
              </h3>
              <p className="font-DM-Sans text-base font-medium leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                Dive into a detailed breakdown comparing cross-platform
                sentiment, audience engagement patterns, and platform-specific
                metrics across all your social media channels.
              </p>
            </div>
          </div>
        </div>

        {/* Link to a more detailed page for users who want more information. */}
        <div className="mt-12 text-center sm:mt-16 md:mt-20">
          <Link
            to="/how-it-works"
            className="font-DM-Sans inline-flex items-center gap-2 text-lg font-semibold text-blue-600 transition-all duration-300 hover:gap-3 hover:text-blue-700 sm:text-xl"
          >
            See Platform Comparison
            <span className="transition-transform duration-300 hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default QuickStartGuide;
