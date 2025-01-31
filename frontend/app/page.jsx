import Image from "next/image";

export default function Home() {
  return (
    <div
      className="text-white min-h-screen text-center pt-20 pb-20"
      style={{ background: "#007057" }}
    >
      {/* Header Section */}
      <div className="flex flex-wrap justify-center items-center gap-8">
        {/* Left Content */}
        <div>
          <h1 className="italic  text-5xl font-italiana mb-2">WeedOut</h1>
          <p className="italic text-2xl font-italiana mb-8">
            one-stop data pre-processing tool
          </p>
          <div>
            <button className="px-6 text-black  py-3 mr-4 bg-gray-300 rounded-md cursor-pointer">
              Try it out
            </button>
            <button className="px-6 py-3 bg-gray-300 rounded-md cursor-pointer">
              <a
                href="https://github.com/rohannair2022/weedout"
                target="_blank"
                rel="noopener noreferrer"
                className="text-black no-underline"
              >
                Contribute
              </a>
            </button>
          </div>
        </div>

        {/* Right Content (Image) */}
        <div>
          <Image src="/dog.png" alt="WeedOut Logo" width={250} height={250} />
        </div>
      </div>

      {/* Footer Section */}
      <div
        className="flex justify-center items-center mt-12"
        style={{ background: "#669873" }}
      >
        <a
          href="https://pypi.org/project/weedout/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-2 rounded-md max-w-[90%] w-1/3 hover:bg-opacity-80 transition-all duration-300"
        >
          <Image
            src="/python-logo.webp"
            alt="Python Logo"
            width={30}
            height={30}
          />
          <span className="ml-4 text-lg text-white">pip install weedout</span>
        </a>
      </div>

      {/* Latest Changes Section */}
      <div className="text-white p-8 rounded-lg mt-8 max-w-[90%] mx-auto text-center">
        <h2 className="text-3xl mb-4">Latest Changes</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b-2 border-white py-3 text-lg">
                Version Number
              </th>
              <th className="border-b-2 border-white py-3 text-lg">
                Note of the Changes
              </th>
              <th className="border-b-2 border-white py-3 text-lg">
                Download Link
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              { version: "1.0.0", note: "Initial release" },
              { version: "1.1.0", note: "Added new preprocessing tools" },
              { version: "1.2.0", note: "Bug fixes and improvements" },
              { version: "1.3.0", note: "Improved performance" },
              { version: "1.4.0", note: "Added new visualization tools" },
            ].map(({ version, note }) => (
              <tr key={version}>
                <td className="py-3">{version}</td>
                <td className="py-3">{note}</td>
                <td className="py-3">
                  <a
                    href={`/downloads/${version}`}
                    className="text-gray-300 no-underline"
                  >
                    Download
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
