/**
 * @file Hero.jsx
 * @description Renders the main hero section for the homepage.
 * This component is typically the first thing a user sees and is designed
 * to grab their attention with a strong headline and a clear call-to-action.
 */

import { Link } from "react-router-dom";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

function Hero() {
  return (
    // The main section container with responsive top padding.
    <section className="container text-center pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-40">
      {/* Main headline with responsive typography. */}
      <h1 className="font-Inter mb-4 text-4xl font-extrabold tracking-tight text-gray-800 sm:mb-6 sm:text-5xl md:text-6xl md:leading-tight lg:text-7xl xl:text-8xl">
        Unlock Audience Insights
        {/* Highlighted sub-heading for emphasis. */}
        <span className="block text-blue-600">Instantly.</span>
      </h1>

      {/* Sub-heading/paragraph providing more context about the product's value. */}
      <p className="font-DM-Sans mx-auto mb-8 max-w-3xl text-base leading-relaxed text-gray-600 sm:mb-10 sm:text-lg md:mb-12 md:text-xl lg:max-w-4xl lg:text-2xl">
        Stop guessing and start knowing. Our AI analyzes sentiment and
        engagement from social media posts across all platforms to give you the
        data you need to refine your strategy with unprecedented accuracy.
      </p>

      {/* Main call-to-action (CTA) button container. */}
      <div className="flex items-center justify-center">
        <Link
          to="/analyze"
          className="inline-flex items-center justify-center gap-3 rounded-2xl bg-blue-600 px-8 py-5 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50 sm:gap-4 sm:px-10 sm:py-6 sm:text-xl md:px-12 md:py-7 md:text-2xl"
        >
          Analyze Now
          {/* Animated icon container within the button for visual appeal. */}
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white transition-all duration-300 hover:scale-110 hover:rotate-12 sm:h-12 sm:w-12 md:h-14 md:w-14">
            <PaperAirplaneIcon className="size-5 text-blue-600 sm:size-6 md:size-7" />
          </span>
        </Link>
      </div>
    </section>
  );
}

export default Hero;
