/**
 * @file Header.jsx
 * @description Renders the main application header, including the site logo,
 * navigation, and a full-screen mobile menu overlay. It dynamically adjusts
 * its stacking order (z-index) to appear behind the global loading overlay
 * when it is active.
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Bars4Icon,
  XMarkIcon,
  LightBulbIcon,
  UserGroupIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { useLoading } from "../../hooks/useLoading";

function Header() {
  // --- State ---
  // Manages the visibility of the full-screen mobile menu.
  const [isOpen, setIsOpen] = useState(false);
  // Accesses the global loading state to determine if the loading overlay is visible.
  const { loadingVisible } = useLoading();

  // --- Event Handlers ---
  /**
   * Toggles the mobile menu's open/closed state.
   */
  function menuToggle(e) {
    e.preventDefault();
    setIsOpen(!isOpen);
  }

  /**
   * Handles clicks on the main logo, closing the mobile menu if it's open
   * and scrolling to the top of the page.
   */
  function handleLogoClick() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function logoClick() {
    if (isOpen) setIsOpen(false);
    handleLogoClick();
  }

  // --- Side Effects ---
  // A useEffect hook to prevent background scrolling when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    // Cleanup function to restore default scroll behavior when the component unmounts.
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Main header bar */}
      <header
        className={`fixed top-3 left-0 right-0 bg-transparent px-3 transition-all duration-300 sm:top-4 sm:px-4 md:top-6 md:px-6 lg:px-8 xl:px-10 2xl:px-12 ${
          loadingVisible ? "z-0" : "z-50"
        }`}
      >
        <nav>
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between rounded-full border border-gray-100/50 bg-white/95 px-5 py-4 shadow-xl shadow-gray-400/20 backdrop-blur-lg transition-all duration-300 hover:bg-white hover:shadow-2xl sm:px-6 sm:py-5 md:px-8">
            <div>
              <Link
                to="/"
                onClick={logoClick}
                aria-label="VibeAnalyze Homepage"
                className="block transition-all duration-300 hover:scale-105 active:scale-95"
              >
                <img
                  src="/logo.png"
                  alt="VibeAnalyze Logo"
                  className="h-10 w-auto sm:h-12"
                />
              </Link>
            </div>
            <button
              onClick={menuToggle}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              className="rounded-lg p-2 transition-all duration-300 hover:scale-110 focus:ring-2 focus:ring-blue-300 active:scale-95"
            >
              <div className="relative h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8">
                {/* Animated hamburger icon */}
                <Bars4Icon
                  className={`absolute inset-0 size-6 transform text-gray-600 transition-all duration-300 ease-in-out hover:text-gray-800 sm:size-7 md:size-8 ${
                    isOpen
                      ? "scale-75 rotate-45 opacity-0"
                      : "scale-100 rotate-0 opacity-100"
                  }`}
                />
                {/* Animated close (X) icon */}
                <XMarkIcon
                  className={`absolute inset-0 size-6 transform text-gray-600 transition-all duration-300 ease-in-out hover:text-gray-800 sm:size-7 md:size-8 ${
                    isOpen
                      ? "scale-100 rotate-0 opacity-100"
                      : "scale-75 rotate-45 opacity-0"
                  }`}
                />
              </div>
            </button>
          </div>
        </nav>
      </header>

      {/* Full-screen mobile menu overlay */}
      <div
        className={`fixed inset-0 transition-opacity duration-300 ease-in-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        } ${loadingVisible ? "z-0" : "z-40"}`}
      >
        {/* Backdrop for the menu */}
        <div
          className="absolute inset-0 bg-black/30 backdrop-blur-sm"
          onClick={menuToggle}
          aria-hidden="true"
        />
        {/* Menu content */}
        <div
          className={`relative z-10 mx-auto mt-24 flex w-full max-w-xs flex-col items-center space-y-3 px-4 transition-all duration-500 ease-in-out sm:mt-28 sm:max-w-sm sm:space-y-4 md:mt-32 lg:mt-36 ${
            isOpen ? "scale-100 opacity-100" : "max-h-0 scale-95 opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Links */}
          <div className="w-full" onClick={menuToggle}>
            <Link
              to="/how-it-works"
              className="font-DM-Sans group flex w-full items-center gap-4 rounded-2xl border border-gray-100/50 bg-white/95 px-5 py-4 text-base font-semibold tracking-wide text-gray-800 shadow-xl shadow-gray-300/30 backdrop-blur-lg transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-2xl sm:gap-5 sm:px-6 sm:py-5 sm:text-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-100 to-yellow-50 transition-all duration-300 group-hover:from-yellow-200 group-hover:to-yellow-100 sm:h-9 sm:w-9">
                <LightBulbIcon className="size-5 text-yellow-400 sm:size-6" />
              </span>
              How It Works
            </Link>
          </div>
          <div className="w-full" onClick={menuToggle}>
            <Link
              to="/about-us"
              className="font-DM-Sans group flex w-full items-center gap-4 rounded-2xl border border-gray-100/50 bg-white/95 px-5 py-4 text-base font-semibold tracking-wide text-gray-800 shadow-xl shadow-gray-300/30 backdrop-blur-lg transition-all duration-300 hover:scale-[1.03] hover:bg-white hover:shadow-2xl sm:gap-5 sm:px-6 sm:py-5 sm:text-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-green-50 transition-all duration-300 group-hover:from-green-200 group-hover:to-green-100 sm:h-9 sm:w-9">
                <UserGroupIcon className="size-5 text-green-600 sm:size-6" />
              </span>
              About Us
            </Link>
          </div>
          <div className="w-full" onClick={menuToggle}>
            <Link
              to="/analyze"
              className="font-DM-Sans group flex items-center gap-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-4 text-base font-bold tracking-wide text-white shadow-xl shadow-blue-500/40 transition-all duration-300 hover:scale-[1.03] hover:from-blue-700 hover:to-blue-800 hover:shadow-2xl sm:gap-5 sm:px-6 sm:py-5 sm:text-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white transition-all duration-300 group-hover:bg-gray-50 sm:h-9 sm:w-9">
                <RocketLaunchIcon className="size-5 text-blue-600 sm:size-6" />
              </span>
              Analyze
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
