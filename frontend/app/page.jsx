import Image from "next/image";
import Link from "next/link";
import { Inria_Serif } from "next/font/google";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Home() {
  return (
    <div
      className={`min-h-screen bg-gradient-to-b from-[#007057] to-emerald-900 ${inriaSerif.className}`}
    >
      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-6xl font-bold text-beige mb-4">
                  Data Pre-processing
                  <span className="block text-emerald-300">Simplified</span>
                </h1>
                <p className="text-xl text-beige/80 leading-relaxed">
                  A powerful tool designed to streamline your data preparation
                  workflow with advanced preprocessing capabilities.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/preprocessing">
                  <button
                    className="px-8 py-3 bg-beige text-emerald-900 rounded-lg font-medium
                    hover:bg-emerald-50 active:bg-emerald-100 transform hover:-translate-y-0.5
                    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                  >
                    Try it out
                  </button>
                </Link>
                <a
                  href="https://github.com/rohannair2022/weedout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-3 bg-emerald-700/30 text-beige border border-emerald-500/30
                    rounded-lg font-medium hover:bg-emerald-700/40 active:bg-emerald-700/50
                    transform hover:-translate-y-0.5 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-10"
                >
                  View on GitHub
                </a>
              </div>

              <Link href="/our-team">
                <div
                  className="group bg-black/20 backdrop-blur-sm rounded-xl p-4
                  hover:bg-black/30 transition-all duration-200
                  cursor-pointer transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="absolute -inset-1 bg-emerald-500/20 rounded-full blur-sm group-hover:bg-emerald-500/30 transition-all duration-300"></div>
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative text-emerald-300 group-hover:scale-110 transition-transform duration-200">
                        <path d="M18 21a8 8 0 0 0-16 0"></path>
                        <circle cx="10" cy="8" r="5"></circle>
                        <path d="M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3"></path>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="text-beige font-medium text-sm md:text-base">
                        Meet Our Team
                      </div>
                      <div className="mt-1 text-beige/60 text-xs group-hover:text-beige/80 transition-colors duration-200">
                        UofT WebDev Club Members
                      </div>
                    </div>
                    <div className="text-emerald-300 group-hover:text-emerald-200 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform duration-200">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
              <Image
                src="/dull_logo_bria.png"
                alt="WeedOut Logo"
                width={400}
                height={400}
                className="relative transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Latest Changes */}
      <div className="bg-black/20 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-beige mb-12 text-center">
            Latest Changes
          </h2>

          <div
            className={`grid md:grid-cols-2 lg:grid-cols-3 gap-6 ${inriaSerif.className}`}
          >
            {[
              {
                version: "1.2",
                date: "Aug 21, 2024",
                note: "Bug fixes and improvements",
                highlight: true,
              },
              {
                version: "1.1",
                date: "Aug 11, 2024",
                note: "Added new preprocessing tools",
              },
              { version: "1.0", date: "Aug 11, 2024", note: "Initial release" },
            ].map(({ version, date, note, highlight }, index) => (
              <div
                key={version}
                className={`p-6 rounded-xl backdrop-blur-sm transform hover:-translate-y-1 
          transition-all duration-200 cursor-pointer ${
            highlight
              ? "bg-emerald-700/20 border border-emerald-500/30 hover:bg-emerald-700/30"
              : "bg-black/20 hover:bg-black/30"
          }`}
              >
                <div className="font-mono mb-2">
                  <span className="text-emerald-300">Version</span>
                  <span className="text-beige ml-2 font-semibold">
                    {version}
                  </span>
                  <span className="text-beige/50 ml-4 text-sm">({date})</span>
                </div>
                <div className="text-beige/80 mb-4">{note}</div>

                <div className="flex gap-4">
                  <a
                    href={`https://pypi.org/project/weedout/${version}/#files`}
                    className="text-emerald-300 hover:text-emerald-200 font-medium text-sm inline-flex items-center group"
                  >
                    Download .tar.gz
                  </a>

                  <a
                    href={`https://pypi.org/project/weedout/${version}/#files`}
                    className="text-emerald-300 hover:text-emerald-200 font-medium text-sm inline-flex items-center group"
                  >
                    Download .whl
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}