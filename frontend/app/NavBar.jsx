import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-100 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center py-4 space-x-8">
          <Link href="/" className="text-lg font-medium text-gray-800 hover:text-blue-500">
            Home
          </Link>
          <Link href="/documentation" className="text-lg font-medium text-gray-800 hover:text-blue-500">
            Documentation
          </Link>
          <Link href="/about-us" className="text-lg font-medium text-gray-800 hover:text-blue-500">
            About Us
          </Link>
          <Link href="/our-team" className="text-lg font-medium text-gray-800 hover:text-blue-500">
            Our Team
          </Link>
        </div>
      </div>
    </nav>
  );
}
