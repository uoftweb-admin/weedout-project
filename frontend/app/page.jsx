import Image from "next/image";

export default function Home() {
  return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-800 to-emerald-900">
        {/* Hero Section */}
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div>
                  <h1 className="text-6xl font-bold text-white mb-4">
                    Data Pre-processing
                    <span className="block text-emerald-300">Simplified</span>
                  </h1>
                  <p className="text-xl text-white/80 leading-relaxed">
                    A powerful tool designed to streamline your data preparation
                    workflow with advanced preprocessing capabilities.
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-3 bg-white text-emerald-900 rounded-lg font-medium
                  hover:bg-emerald-50 active:bg-emerald-100 transform hover:-translate-y-0.5
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50">
                    Try it out
                  </button>
                  <a
                      href="https://github.com/rohannair2022/weedout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-8 py-3 bg-emerald-700/30 text-white border border-emerald-500/30
                    rounded-lg font-medium hover:bg-emerald-700/40 active:bg-emerald-700/50
                    transform hover:-translate-y-0.5 transition-all duration-200
                    focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                  >
                    View on GitHub
                  </a>
                </div>

                <div className="group bg-black/20 backdrop-blur-sm rounded-xl p-4 inline-flex
                items-center space-x-4 hover:bg-black/30 transition-all duration-200
                cursor-pointer transform hover:-translate-y-0.5">
                  <Image
                      src="/python-logo.webp"
                      alt="Python Logo"
                      width={24}
                      height={24}
                      className="group-hover:scale-110 transition-transform duration-200"
                  />
                  <code className="text-white font-mono">pip install weedout</code>
                </div>
              </div>

              <div className="relative flex justify-center lg:justify-end">
                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse"></div>
                <Image
                    src="/dog.png"
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
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Latest Changes
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { version: "1.4.0", note: "Added new visualization tools", highlight: true },
                { version: "1.3.0", note: "Improved performance" },
                { version: "1.2.0", note: "Bug fixes and improvements" },
                { version: "1.1.0", note: "Added new preprocessing tools" },
                { version: "1.0.0", note: "Initial release" }
              ].map(({ version, note, highlight }, index) => (
                  <div
                      key={version}
                      className={`p-6 rounded-xl backdrop-blur-sm transform hover:-translate-y-1 
                  transition-all duration-200 cursor-pointer ${
                          index === 0
                              ? 'bg-emerald-700/20 border border-emerald-500/30 hover:bg-emerald-700/30'
                              : 'bg-black/20 hover:bg-black/30'
                      }`}
                  >
                    <div className="font-mono mb-2">
                      <span className="text-emerald-300">Version</span>
                      <span className="text-white ml-2">{version}</span>
                    </div>
                    <div className="text-white/80 mb-4">{note}</div>
                    <a
                        href={`/downloads/${version}`}
                        className="text-emerald-300 hover:text-emerald-200 font-medium text-sm
                    inline-flex items-center group"
                    >
                      Download
                      <span className="ml-1 transform group-hover:translate-x-0.5 transition-transform">
                    →
                  </span>
                    </a>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </div>
  );
}
