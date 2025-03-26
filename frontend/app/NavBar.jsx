"use client"

import { Inria_Serif } from "next/font/google"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X } from "lucide-react"

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/documentation", label: "Documentation" },
    { href: "/about-us", label: "About Us" },
    { href: "/preprocessing", label: "Preprocessing Demo" },
    { href: "/our-team", label: "Our Team" },
  ]

  const isActive = (path) => {
    return pathname.startsWith(path)
  }

  return (
    <nav className={`w-full sticky top-0 z-50 bg-customGreen shadow-lg ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left-aligned logo and title */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center group">
              <div className="relative overflow-hidden rounded-full p-1 bg-infoBoxes/10 transition-all duration-300 group-hover:bg-infoBoxes/30">
                <Image
                  src="/dull_logo_bria.png"
                  alt="WeedOut Logo"
                  width={36}
                  height={48}
                  className="transform transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-infoBoxes/0 to-beige/0 opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>
              </div>
              <span className="text-2xl font-bold text-beige ml-2 relative group-hover:text-infoBoxes transition-colors duration-300">
                WeedOut
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-infoBoxes to-beige group-hover:w-full transition-all duration-300"></span>
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-beige p-2 rounded-md hover:bg-infoBoxes/20 transition-colors duration-200"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Desktop navigation links */}
          <div className="hidden md:flex items-center justify-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  relative px-4 py-2 text-lg font-semibold rounded-md
                  transition-all duration-300 overflow-hidden
                  ${isActive(link.href) ? "text-blueText bg-infoBoxes" : "text-beige hover:text-blueText"}
                `}
              >
                <span className="relative z-10">{link.label}</span>
                <div
                  className={`
                    absolute inset-0 -z-0 transition-all duration-300 ease-in-out
                    ${
                      isActive(link.href)
                        ? "bg-gradient-to-r from-infoBoxes to-infoBoxes/80"
                        : "bg-gradient-to-r from-infoBoxes to-beige/80 opacity-0 hover:opacity-100"
                    }
                  `}
                ></div>
              </Link>
            ))}
          </div>

          {/* Right side, its just for balance */}
          <div className="hidden md:block w-[36px]"></div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden bg-blueText/95 backdrop-blur-sm overflow-hidden transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "max-h-96 py-4" : "max-h-0"}
        `}
      >
        <div className="px-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`
                block py-3 px-4 rounded-lg text-lg font-semibold transition-all duration-200
                ${isActive(link.href) ? "bg-infoBoxes text-blueText" : "text-beige hover:bg-infoBoxes/20"}
              `}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

