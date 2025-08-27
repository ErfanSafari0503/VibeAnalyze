/**
 * @file Footer.jsx
 * @description Renders the main application footer, which includes the site logo,
 * copyright information, and a branding message.
 */

import { Link } from "react-router-dom";

/**
 * A utility function to smoothly scroll the user to the top of the page.
 */
function handleLogoClick() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

/**
 * The main Footer component for the application.
 */
function Footer() {
  // Fetches the current year to ensure the copyright notice is always up-to-date.
  const year = new Date().getFullYear();

  return (
    // The main footer element with background gradient and padding.
    <footer className="mt-12 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 px-4 py-12 shadow-2xl sm:mt-16 sm:px-6 sm:py-14 md:px-8 md:py-16">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col items-center gap-10 sm:gap-12">
          <div className="flex flex-col items-center gap-4 text-center">
            {/* Wrapper for the logo link to handle the scroll-to-top functionality. */}
            <div onClick={handleLogoClick} className="group cursor-pointer">
              <Link
                to="/"
                className="font-Inter text-2xl font-bold tracking-wider text-white/90 transition-all duration-300 group-hover:scale-110 group-hover:text-blue-600 sm:text-3xl md:text-4xl md:tracking-widest"
              >
                VibeAnalyze
              </Link>
            </div>
            {/* Container for copyright and branding text. */}
            <div className="space-y-2 text-center">
              <div className="text-sm tracking-normal text-gray-400 sm:text-base">
                © {year} VibeAnalyze. All rights reserved.
              </div>
              <div className="text-xs text-gray-500 sm:text-sm">
                Built with 💙 for the digital community
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
