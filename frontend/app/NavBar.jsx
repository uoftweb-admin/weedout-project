"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation.js';
// import { GREEN, BLUE, WHITE } from "./documentation/colors.js";
import { UIProvider, useUI } from "./UIProvider.js";
import { Inria_Serif } from '@next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const defaultNavItems = [
  { label: "Home", href: "/", key: "home-key" },
  { label: "Documentation", href: "/documentation", key: "documentation-key" },
  { label: "About Us", href: "/about-us", key: "about-us-key" },
  { label: "Our Team", href: "/our-team", key: "our-team-key" },
];

// if no navItems are passed, use the defaultNavItems
export default function Navbar({navItems = defaultNavItems}) {
  const { sidebarOpen, setSidebarOpen } = useUI();
  const pathname = usePathname();

  // Function to check if the current link is active.
  const isActive = (href) => {
    // For exact match or starts with match for nested routes
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className={`sticky top-0 z-[100] bg-customGreen shadow-md ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto px-4 color-beige">
        <div className="flex justify-between items-center h-16">
          {/* Left-aligned logo and title */}
          {/* WeedOut Title */}
          <div className="flex items-center space-x-2">
            <button
              className="p-2 hover:scale-110"
              onClick={() => setSidebarOpen(!sidebarOpen)} // toggle sidebar
            >
              <img 
                src="/favicon.ico" 
                alt="Logo"
                className="h-8 w-8"
              />
            </button>
            {/* for small screen, we hind it */}
            <span className="text-xl font-bold hidden sm:inline">WeedOut</span>
          </div>

          {/* Navigation links */}
          {/* nav bar：use flex-nowrap + overflow-x-auto control --> horizontal rolling */}
          <div className='flex-1 flex overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
            {/* mobile and screen screen view, scrolling enabled */}
            <div className="
              flex flex-nowrap space-x-4 md:space-x-8 mx-auto
              max-w-[14rem] sm:max-w-[14rem]
              "
            >
              {navItems.map(({label, href, key}) => (
                <Link
                  key={key}
                  href={href}
                  className={`
                    flex-shrink-0 whitespace-nowrap text-lg font-semibold transition-colors
                    relative pb-0 
                    ${isActive(href) 
                      ? "text-blue-300 after:scale-100" 
                      : "hover:text-blue-200 after:scale-0"}
                    after:content-[''] after:absolute 
                    after:bottom-0 after:left-0 
                    after:w-full after:h-[2px] 
                    after:bg-blue-300 
                    after:transition-transform after:duration-300
                  `}
                >
                  {label}
                  
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
