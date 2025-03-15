"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Inria_Serif } from "@next/font/google";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch("http://localhost:5000/api/results", {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        alert("Error fetching results.");
      }
    };
    fetchResults();
  }, []);

  useEffect(() => {
    // Automatically trigger download if results are available
    if (results) {
      window.location.href = "http://localhost:5000/download_zip";
    }
  }, [results]);

  return (
    <div className={`${inriaSerif.className} min-h-screen bg-dark text-white`}>
      {/* Navigation Bar */}
      <nav className="bg-blueText p-4">
        <div className="container mx-auto flex justify-between items-center">
          <a className="text-white font-bold text-xl" href="/">
            WeedOut
          </a>
          <div>
            <a className="mx-2 text-white hover:text-infoBoxes" href="/about">
              About
            </a>
            <a className="mx-2 text-white hover:text-infoBoxes" href="/">
              Pre-process
            </a>
            <a
              className="mx-2 text-white hover:text-infoBoxes"
              href="/documentation"
            >
              Documentation
            </a>
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4 my-5">
        <h1 className="text-3xl font-bold mb-4">Results</h1>
        {results ? (
          <div className="space-y-4">
            <p>
              <strong>Dataset Type:</strong>{" "}
              {results.data_type === "0"
                ? "Cross-Sectional Data"
                : "Time Series Data"}
            </p>
            <p>
              <strong>Model Type:</strong>{" "}
              {results.model_type === "0" ? "Regression" : "Classification"}
            </p>
            <p>
              <strong>Perform Sampling:</strong>{" "}
              {results.sampling_response === "0" ? "Yes" : "No"}
            </p>
            <p>
              <strong>Sampling Technique:</strong> {results.strategy_sample}
            </p>
            <p>
              <strong>Target Column:</strong> {results.target_name}
            </p>
            <p>
              <strong>Columns to Drop:</strong> {results.dropped_column}
            </p>
            <p>
              <strong>Columns to Not Scale/Encode:</strong>{" "}
              {results.untouched_column}
            </p>

            <h2 className="mt-4">Input CSV File Info:</h2>
            {results.csv_content ? (
              <pre>{results.csv_content}</pre>
            ) : (
              <p>No CSV file content available.</p>
            )}

            <h2 className="mt-4">Output CSV File Info:</h2>
            {results.csv_content_post ? (
              <pre>{results.csv_content_post}</pre>
            ) : (
              <p>No CSV file content available.</p>
            )}

            <h2 className="mt-4">Processing Logs:</h2>
            {results.csv_content_process ? (
              <pre>{results.csv_content_process}</pre>
            ) : (
              <p>No logs available.</p>
            )}
          </div>
        ) : (
          <p>Loading results...</p>
        )}

        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.push("/")}
            className="bg-blueText text-beige text-lg font-semibold px-8 py-3 rounded-md shadow-md hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText transition duration-300 ease-in-out"
          >
            Go to Home Page
          </button>
        </div>
      </div>

      <footer className="bg-blueText p-4 text-center">
        <p className="text-sm">&copy; 2024 WeedOut. All rights reserved.</p>
        <p className="text-xs">
          Website Developed by{" "}
          <a
            className="text-infoBoxes"
            href="https://www.linkedin.com/in/rohansunilkumarnair/"
          >
            Rohan Nair
          </a>
        </p>
      </footer>
    </div>
  );
}
