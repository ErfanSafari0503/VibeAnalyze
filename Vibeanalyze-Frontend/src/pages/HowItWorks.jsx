import { Link } from "react-router-dom";
import {
  ClipboardDocumentIcon,
  CpuChipIcon,
  ChartPieIcon,
  SparklesIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";

// Data for the steps to keep the component clean
const steps = [
  {
    icon: ClipboardDocumentIcon,
    name: "Step 1: Paste Your Link",
    description:
      "Simply copy the full URL of any public post from a supported social media platform and paste it into our analysis input field. No accounts or logins are required.",
  },
  {
    icon: CpuChipIcon,
    name: "Step 2: AI-Powered Analysis",
    description:
      "Our system instantly gets to work. Advanced AI models read the post's content and all associated comments, analyzing for sentiment, tone, emotions, keywords, and more.",
  },
  {
    icon: ChartPieIcon,
    name: "Step 3: Explore Actionable Insights",
    description:
      "Within moments, you'll be directed to a detailed results page. Explore interactive charts and data points to understand your audience's reaction with unprecedented clarity.",
  },
];

// Data for supported platforms
const platforms = [
  "Telegram",
  "Instagram",
  "YouTube",
  "Twitter (X)",
  "LinkedIn",
];

function HowItWorks() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Page Header */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-blue-600">How VibeAnalyze Works</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            From Link to Insight in Three Simple Steps
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our process is designed to be fast, intuitive, and powerful, giving
            you direct access to the data you need without the hassle.
          </p>
        </div>

        {/* Step-by-Step Guide */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {steps.map((step) => (
              <div key={step.name} className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-gray-900">
                  <step.icon
                    className="h-8 w-8 flex-none text-blue-600"
                    aria-hidden="true"
                  />
                  {step.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">{step.description}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Supported Platforms Section */}
        <div className="mt-24 rounded-2xl bg-gray-100 p-8 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Supported Platforms
            </h2>
            <p className="mt-4 text-md leading-7 text-gray-600">
              We're constantly expanding our reach. Currently, you can analyze
              posts from the following platforms:
            </p>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {platforms.map((platform) => (
              <span
                key={platform}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="mt-24 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            Stop guessing and start knowing. Your first analysis is just a click
            away.
          </p>
          <div className="mt-10">
            <Link
              to="/analyze"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105 hover:bg-blue-700 hover:shadow-blue-500/50 focus:outline-none focus:ring-4 focus:ring-blue-300 active:scale-[0.98]"
            >
              <RocketLaunchIcon className="h-5 w-5" />
              Analyze Your First Post
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
