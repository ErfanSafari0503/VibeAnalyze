/**
 * @file Home.jsx
 * @description Renders the main homepage of the application.
 * It serves as a landing page, composing several sections to introduce
 * the product's features and guide users to the main call-to-action.
 */

import Hero from "./components/Hero";
import BenefitsFeatures from "./components/BenefitsFeatures";
import QuickStartGuide from "./components/QuickStartGuide";
import FinalCallToAction from "./components/FinalCallToAction";

/**
 * The Home component, which constructs the main landing page.
 * It structures the page into distinct, reusable sections for clarity and maintainability.
 */
function Home() {
  return (
    // Main container for the homepage with responsive padding and spacing between sections.
    <div className="flex flex-col items-center gap-16 px-4 py-8 sm:gap-20 sm:px-6 sm:py-10 md:gap-24 md:px-8 md:py-12 lg:gap-32 lg:py-16 xl:gap-40">
      {/* Hero Section: The main "above the fold" content to grab user attention. */}
      <section className="w-full pt-4 sm:pt-6 md:pt-8 lg:pt-12">
        <Hero />
      </section>

      {/* Benefits & Features Section: Highlights the key value propositions of the application. */}
      <section className="w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
        <BenefitsFeatures />
      </section>

      {/* Quick Start Guide Section: A simple 3-step guide on how to use the service. */}
      <section className="w-full max-w-7xl px-2 sm:px-4 md:px-6 lg:px-8">
        <QuickStartGuide />
      </section>

      {/* Final Call to Action Section: A final prompt for the user to engage with the main feature. */}
      <section className="w-full max-w-6xl px-2 pb-8 sm:px-4 sm:pb-10 md:px-6 md:pb-12 lg:pb-16 xl:pb-20">
        <FinalCallToAction />
      </section>
    </div>
  );
}

export default Home;
