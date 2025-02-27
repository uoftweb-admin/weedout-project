"use client";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

import { Inria_Serif } from '@next/font/google';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation.js';

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
    <nav 
      style={ {background: "#007057" }}
      className={`w-full shadow-md sticky top-0 z-50 ${inriaSerif.className}`}
    >
      <div 
        style = {{color: "#EDF5E1"}}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex justify-between items-center h-20">
          {/* Left-aligned logo and title */}
          {/* WeedOut Title */}
          <div className="flex items-center space-x-2">
            <img 
              src="/dull_logo_bria.png" 
              alt="Logo"
              className="h-12 w-9"
            />
            <Link 
              href="/" 
              className={`text-lg font-semibold transition-colors ${
                pathname === "/" ? "text-blue-300" : " hover:text-blue-200"
              }`}
            >
              <span className="text-2xl font-bold">WeedOut</span>
            </Link>
          </div>

          {/* Centered navigation links */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-8">
            {/* <Link 
              href="/" 
              className={`text-lg font-semibold transition-colors ${
                pathname === "/" ? "text-blue-300" : " hover:text-blue-200"
              }`}
            >
              Home
            </Link> */}
            <Link 
              href="/documentation" 
              className={`text-lg font-semibold transition-colors ${
                pathname.startsWith("/documentation") ? "text-blue-300" : " hover:text-blue-200"
              }`}
            >
              Documentation
            </Link>
            <Link 
              href="/about-us" 
              className={`text-lg font-semibold transition-colors ${
                pathname.startsWith("/about-us") ? "text-blue-300" : " hover:text-blue-200"
              }`}
            >
              About Us
            </Link>
            <Link 
              href="/our-team" 
              className={`text-lg font-semibold transition-colors ${
                pathname.startsWith("/our-team") ? "text-blue-300" : "hover:text-blue-200"
              }`}
            >
              Our Team
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
