"use client";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

import { Inria_Serif } from '@next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation.js';

export default function Navbar() {

  const pathname = usePathname();

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
            <Link href="/">
            <Image 
              src="/dull_logo_bria.png" 
              alt="Logo"
              width={36} height={48}
            />
            </Link>
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
              href="/preprocessing" 
              className={`text-lg font-semibold transition-colors ${
                pathname.startsWith("/preprocessing") ? "text-blue-300" : " hover:text-blue-200"
              }`}
            >
              Preprocessing-Demo
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