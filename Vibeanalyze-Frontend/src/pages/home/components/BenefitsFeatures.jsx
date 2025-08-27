/**
 * @file BenefitsFeatures.jsx
 * @description Renders a section that highlights the key benefits and features of the application.
 * It uses a reusable FeatureCard component to display each item in a grid layout.
 */

import FeatureCard from "./FeatureCard";

// Data array for the feature cards. This keeps the data separate from the rendering logic,
// making it easier to update or add new features in the future.
const cardsData = [
  {
    id: 1,
    icon: "MagnifyingGlassIcon",
    title: `Cross-Platform AI Analysis`,
    description:
      "Get immediate insights into sentiment, tone, and key themes from posts across Telegram, Instagram, YouTube, Twitter, and LinkedIn.",
  },
  {
    id: 2,
    icon: "UsersIcon",
    title: "Unified Audience Understanding",
    description:
      "Compare audience engagement across platforms with comprehensive analysis of commenter satisfaction, demographics, languages, and interests.",
  },
  {
    id: 3,
    icon: "ChartBarIcon",
    title: "Multi-Platform Analytics",
    description:
      "Access powerful cross-platform analytics with easy-to-digest summaries and data visualizations to optimize your social media strategy.",
  },
];

function BenefitsFeatures() {
  return (
    // The main section container.
    <section className="container">
      <div className="mx-auto">
        {/* Section heading with a custom class for consistent styling. */}
        <h2 className="h2-heading">
          The Universal{" "}
          <span className="font-Inter font-bold tracking-wider text-blue-600">
            VibeAnalyze
          </span>{" "}
          Experience
        </h2>

        {/* Responsive grid to display the feature cards. */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 xl:gap-12">
          {/* Map over the data array to render a FeatureCard for each item. */}
          {cardsData.map((card) => (
            <FeatureCard
              key={card.id}
              icon={card.icon}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default BenefitsFeatures;
