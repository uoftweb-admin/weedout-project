import Image from "next/image";

export default function Home() {
  return (
    <>
      <div
        style={{
          backgroundColor: "#007057", // Set the green background
          color: "#FFFFFF", // Ensure text is readable
          minHeight: "100vh", // Ensure the background covers the entire viewport
          textAlign: "center",
          marginTop: "0", // Reset margin
          paddingTop: "5%", // Add padding for spacing
          paddingBottom: "5%", // Add padding for spacing
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap", // Wrap on smaller screens
            justifyContent: "center", // Center content horizontally
            alignItems: "center", // Align content vertically
            gap: "2rem", // Add spacing between the divs
          }}
        >
          {/* Left Content */}
          <div>
            <h1
              style={{
                fontSize: "3rem",
                marginBottom: "0.5rem",
                fontFamily: "Italiana",
              }}
            >
              WeedOut
            </h1>
            <p
              style={{
                fontStyle: "italic",
                fontSize: "1.5rem",
                fontFamily: "Italiana",
                marginBottom: "2rem",
              }}
            >
              one-stop data pre-processing tool
            </p>
            <div>
              <button
                style={{
                  padding: "0.8rem 1.5rem",
                  marginRight: "1rem",
                  backgroundColor: "#D9D9D9",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                Try it out
              </button>
              <button
                style={{
                  padding: "0.8rem 1.5rem",
                  backgroundColor: "#D9D9D9",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                <a
                  href="https://github.com/uoftweb-admin/weedout-project"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#000000" }}
                >
                  Contribute
                </a>
              </button>
            </div>
          </div>

          {/* Right Content (Image) */}
          <div>
            <Image src="/dog.png" alt="WeedOut Logo" width={150} height={150} />
          </div>
        </div>

        {/* Footer Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "3rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#669873",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              maxWidth: "90%", // Limit width for responsiveness
              width: "30%", // Adjust based on screen size
            }}
          >
            <Image
              src="/python-logo.webp"
              alt="Python Logo"
              width={30}
              height={30}
            />
            <span
              style={{
                marginLeft: "1rem",
                fontSize: "1.2rem",
                textAlign: "center",
              }}
            >
              pip install weedout
            </span>
          </div>
        </div>

        <div
          style={{
            backgroundColor: "#007057", // Match the background
            color: "#FFFFFF", // Text color
            padding: "2rem", // Padding for spacing
            borderRadius: "8px", // Rounded corners for the container
            fontFamily: "Italiana", // Match the font style
            margin: "2rem auto", // Center the div with margins
            maxWidth: "90%", // Make it responsive
            textAlign: "center",
          }}
        >
          <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            Latest Changes
          </h2>
          <table
            style={{
              width: "100%", // Full width for the table
              borderCollapse: "collapse", // Remove spacing between cells
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    borderBottom: "2px solid #FFFFFF",
                    padding: "0.8rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Version Number
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #FFFFFF",
                    padding: "0.8rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Note of the Changes
                </th>
                <th
                  style={{
                    borderBottom: "2px solid #FFFFFF",
                    padding: "0.8rem",
                    fontSize: "1.2rem",
                  }}
                >
                  Download Link
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                <td style={{ padding: "0.8rem" }}>1.0.0</td>
                <td style={{ padding: "0.8rem" }}>Initial release</td>
                <td style={{ padding: "0.8rem" }}>
                  <a
                    href="/downloads/1.0.0"
                    style={{ color: "#D9D9D9", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
              {/* Row 2 */}
              <tr>
                <td style={{ padding: "0.8rem" }}>1.1.0</td>
                <td style={{ padding: "0.8rem" }}>
                  Added new preprocessing tools
                </td>
                <td style={{ padding: "0.8rem" }}>
                  <a
                    href="/downloads/1.1.0"
                    style={{ color: "#D9D9D9", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
              {/* Row 3 */}
              <tr>
                <td style={{ padding: "0.8rem" }}>1.2.0</td>
                <td style={{ padding: "0.8rem" }}>
                  Bug fixes and improvements
                </td>
                <td style={{ padding: "0.8rem" }}>
                  <a
                    href="/downloads/1.2.0"
                    style={{ color: "#D9D9D9", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
              {/* Row 4 */}
              <tr>
                <td style={{ padding: "0.8rem" }}>1.3.0</td>
                <td style={{ padding: "0.8rem" }}>Improved performance</td>
                <td style={{ padding: "0.8rem" }}>
                  <a
                    href="/downloads/1.3.0"
                    style={{ color: "#D9D9D9", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
              {/* Row 5 */}
              <tr>
                <td style={{ padding: "0.8rem" }}>1.4.0</td>
                <td style={{ padding: "0.8rem" }}>
                  Added new visualization tools
                </td>
                <td style={{ padding: "0.8rem" }}>
                  <a
                    href="/downloads/1.4.0"
                    style={{ color: "#D9D9D9", textDecoration: "none" }}
                  >
                    Download
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
