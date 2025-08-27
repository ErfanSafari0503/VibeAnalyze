import { Link } from "react-router-dom";
import {
  UsersIcon,
  CodeBracketIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

// Data for the team members to keep it clean and scalable
const teamMembers = [
  {
    name: "Erfan Safari",
    role: "Frontend Programmer",
    githubUrl: "https://github.com/ErfanSafari0503",
  },
  {
    name: "Erfan Bahramali",
    role: "Backend Programmer",
    githubUrl: "https://github.com/ErfanBahramali",
  },
];

function AboutUs() {
  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            About VibeAnalyze
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We believe in the power of data to reveal the true voice of your
            audience. Our mission is to transform raw social media engagement
            into clear, actionable insights.
          </p>
        </div>

        {/* Team Section */}
        <div className="mx-auto mt-16 max-w-2xl text-center sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <h3 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Meet Our Team
          </h3>
          <p className="mt-4 text-md leading-7 text-gray-600">
            The dedicated developers behind the VibeAnalyze platform.
          </p>
        </div>

        {/* Team Member Cards */}
        <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-x-8 gap-y-12 sm:mt-16 md:max-w-3xl md:grid-cols-2 lg:mx-0 lg:max-w-none">
          {teamMembers.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center gap-y-6 text-center"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 shadow-md">
                <UsersIcon className="h-12 w-12 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-gray-900">
                  {person.name}
                </h3>
                <p className="text-md font-semibold leading-7 text-blue-600">
                  {person.role}
                </p>
                <a
                  href={person.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                >
                  <CodeBracketIcon className="h-5 w-5" />
                  GitHub Profile
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
