"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [lastScroll, setLastScroll] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 20);
      setHidden(currentScroll > lastScroll && currentScroll > 80);
      setLastScroll(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScroll]);

  return (
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-emerald-900/90 backdrop-blur shadow-lg' : 'bg-transparent'
      } ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-xl font-bold text-white hover:text-emerald-200 transition-colors">
              WeedOut
            </Link>
            <div className="flex space-x-8">
              {[
                { name: 'Documentation', href: '/documentation' },
                { name: 'About Us', href: '/about-us' },
                { name: 'Our Team', href: '/our-team' }
              ].map(({ name, href }) => (
                  <Link
                      key={name}
                      href={href}
                      className="relative text-white/80 hover:text-white transition-colors group"
                  >
                    {name}
                    <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-emerald-300 scale-x-0 group-hover:scale-x-100 transition-transform" />
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
  );
}
