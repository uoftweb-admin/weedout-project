"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import Papa from "papaparse";
import { useSearchParams } from "next/navigation";

// Example: we want 10 bins for numeric columns
const NUM_BINS = 10;

export default function ProcessingResultsPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const filename = searchParams.get("file");

  // Column definitions & user selections
  const [columns, setColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});   // { colName: "numeric" | "string" }
  const [columnNulls, setColumnNulls] = useState({});   // { colName: number_of_nulls }
  const [selectedColumn, setSelectedColumn] = useState("");

  // Distributions
  const [beforeBins, setBeforeBins] = useState({});     // { colName: { bins: [...], counts: [...] } }
  const [afterBins, setAfterBins] = useState({});       // same structure

  // Data for preview (we’ll show after-data in the table)
  const [previewRows, setPreviewRows] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const [stats, setStats] = useState({});

  // // For “Stats Overview” (just an example)
  // const stats = {
  //   originalRows: 1000,
  //   cleanedRows: 982,
  //   nullsFilled: 18,
  //   duplicatesRemoved: 0,
  // };

  /**
   * 1) FETCH CSV + PARSE
   */
  useEffect(() => {
    const fetchCSVData = async (fileName) => {
      const response = await fetch(`/files/${fileName}`);
      const csvText = await response.text();
      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => resolve(results.data),
        });
      });
    };

    // Determine basic column info: type (num/string), number of nulls
    const getColumnInfo = (data) => {
      if (!data || !data.length) return { types: {}, nullCounts: {} };

      const firstRow = data[0];
      const colNames = Object.keys(firstRow);
      const types = {};
      const nullCounts = {};

      colNames.forEach((col) => {
        let numeric = true;    // assume numeric until proven otherwise
        let nullCount = 0;

        data.forEach((row) => {
          const val = row[col];
          // Check for null or empty
          if (val === null || val === "" || val === undefined) {
            nullCount += 1;
          } else {
            // If any non-empty row is non-numeric, treat entire column as string
            if (typeof val !== "number") {
              numeric = false;
            }
          }
        });

        types[col] = numeric ? "numeric" : "string";
        nullCounts[col] = nullCount;
      });

      return { types, nullCounts };
    };

    // For numeric columns, compute min & max so we can bin
    const getMinMax = (data, col) => {
      let min = Number.POSITIVE_INFINITY;
      let max = Number.NEGATIVE_INFINITY;
      data.forEach((row) => {
        const val = row[col];
        if (typeof val === "number") {
          if (val < min) min = val;
          if (val > max) max = val;
        }
      });
      if (min === Number.POSITIVE_INFINITY || max === Number.NEGATIVE_INFINITY) {
        // means we had no valid numeric data
        return { min: 0, max: 0 };
      }
      return { min, max };
    };

    // Return an object describing bins & counts for a numeric column
    const binNumericColumn = (data, col, min, max, numBins = NUM_BINS) => {
      if (min >= max) {
        // All values the same, or no data
        // Just put them in one "bin"
        return {
          bins: [`${min}`],
          counts: [data.length],
        };
      }
      const binWidth = (max - min) / numBins;
      const bins = [];
      const counts = new Array(numBins).fill(0);

      for (let i = 0; i < numBins; i++) {
        const low = min + i * binWidth;
        const high = i === numBins - 1 ? max : low + binWidth;
        bins.push(`${Math.round(low * 100) / 100} – ${Math.round(high * 100) / 100}`);
      }

      data.forEach((row) => {
        const val = row[col];
        if (typeof val === "number") {
          let binIndex = Math.floor(((val - min) / (max - min)) * numBins);
          // edge case: val == max
          if (binIndex === numBins) binIndex = numBins - 1;
          counts[binIndex] += 1;
        }
      });

      return { bins, counts };
    };

    // For string columns, do simple frequency counts for top 10 categories, etc.
    const binStringColumn = (data, col) => {
      const freq = {};
      data.forEach((row) => {
        const val = row[col];
        if (val == null || val === "") return;
        if (!freq[val]) freq[val] = 0;
        freq[val]++;
      });
      // Sort by freq desc
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      // Maybe keep top 10
      const top = sorted.slice(0, 10);
      return {
        bins: top.map(([k]) => String(k)),
        counts: top.map(([_, count]) => count),
      };
    };

    const processData = (data) => {
      if (!data || !data.length) return {};

      const colNames = Object.keys(data[0]);
      const { types } = getColumnInfo(data);
      const binsMap = {};

      colNames.forEach((col) => {
        if (types[col] === "numeric") {
          const { min, max } = getMinMax(data, col);
          binsMap[col] = binNumericColumn(data, col, min, max, NUM_BINS);
        } else {
          binsMap[col] = binStringColumn(data, col);
        }
      });
      return binsMap;
    };

    const loadData = async () => {
      try {
        // Load original and processed CSV data
        const beforeData = await fetchCSVData("file.csv");
        const afterData = await fetchCSVData("file_processed.csv");
    
        if (!afterData || afterData.length === 0) {
          setColumns([]);
          return;
        }
    
        const colNames = Object.keys(afterData[0]);
        setColumns(colNames);
        setSelectedColumn(colNames[0]);
    
        // Column metadata
        const { types, nullCounts } = getColumnInfo(afterData);
        setColumnTypes(types);
        setColumnNulls(nullCounts);
    
        // Compute stats
        const originalRows = beforeData.length;
        const cleanedRows = afterData.length;
        
        // Calculate nulls filled
        let nullsFilled = 0;
        colNames.forEach(col => {
          const beforeNulls = beforeData.filter(row => !row[col]).length;
          const afterNulls = afterData.filter(row => !row[col]).length;
          nullsFilled += beforeNulls - afterNulls;
        });
    
        // Calculate duplicates removed
        const beforeUniqueRows = new Set(beforeData.map(row => JSON.stringify(row))).size;
        const afterUniqueRows = new Set(afterData.map(row => JSON.stringify(row))).size;
        const duplicatesRemoved = beforeUniqueRows - afterUniqueRows;
    
        // Update stats
        setStats({
          originalRows,
          cleanedRows,
          nullsFilled,
          duplicatesRemoved,
        });
    
        // Build distribution bins
        const beforeBinsData = processData(beforeData);
        const afterBinsData = processData(afterData);
        setBeforeBins(beforeBinsData);
        setAfterBins(afterBinsData);
    
        // Preview first few rows
        setPreviewRows(afterData.slice(0, 5));
      } catch (err) {
        console.error("Error loading data: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    

    loadData();
  }, []);

  /**
   * 2) HELPER: Render a distribution chart for the selected column
   *    We pass in e.g. beforeBins[selectedColumn] or afterBins[selectedColumn].
   */
  const renderBinnedChart = (columnBins, color) => {
    if (!columnBins) return <div className="text-beige/60">No data</div>;
    const { bins, counts } = columnBins;
    if (!bins || bins.length === 0) return <div>No data</div>;

    // Find max count to scale bar heights
    const maxCount = Math.max(...counts);

    return (
      <div className="flex flex-col h-64">
        <div className="flex h-full">
          {bins.map((label, idx) => {
            const count = counts[idx];
            const heightPct = maxCount ? (count / maxCount) * 100 : 0;
            return (
              <div
                key={idx}
                className="flex-1 flex flex-col justify-end items-center mx-0.5"
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: color,
                    transition: "height 0.3s ease",
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div className="flex mt-2 text-xs text-beige/80">
          {bins.map((label, idx) => (
            <div key={idx} className="flex-1 text-center truncate px-0.5">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * 3) COMPARISON CHART: Overlapping bars or side-by-side
   *    For "Before vs After", we want them to share the same bin labels if numeric.
   *    But if the column is string, we might only chart the top categories from each set. 
   *    (Below is a simplistic approach that matches indices 1:1.)
   */
  const renderComparison = () => {
    const bBins = beforeBins[selectedColumn];
    const aBins = afterBins[selectedColumn];
    if (!bBins || !aBins) return <div className="text-beige/60">No distribution data available.</div>;

    // We assume they have the same bin labels in the same order, e.g. if numeric
    const beforeLabels = bBins.bins;
    const afterLabels = aBins.bins;
    const beforeCounts = bBins.counts;
    const afterCounts = aBins.counts;

    // If the user has changed columns from numeric to string, etc., you may want to do more robust matching
    const length = Math.min(beforeLabels.length, afterLabels.length);
    const maxCount = Math.max(...beforeCounts, ...afterCounts);

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length }).map((_, idx) => {
          const bCount = beforeCounts[idx];
          const aCount = afterCounts[idx];
          const bPct = maxCount ? (bCount / maxCount) * 100 : 0;
          const aPct = maxCount ? (aCount / maxCount) * 100 : 0;
          return (
            <div key={idx} className="flex flex-col">
              {/* stacked or side-by-side bars */}
              <div className="relative h-5 w-full bg-emerald-900/50 rounded overflow-hidden">
                {/* 'Before' bar */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#007057]"
                  style={{ width: `${bPct}%` }}
                />
                {/* 'After' bar in front (light color) */}
                <div
                  className="absolute left-0 top-0 bottom-0 bg-[#f3dab1]"
                  style={{ width: `${aPct}%`, mixBlendMode: "lighten" }}
                />
              </div>
              <div className="text-center mt-1 text-xs text-beige/80">
                {beforeLabels[idx]}
              </div>
              <div className="text-center text-[0.7rem] text-beige/60">
                {bCount} → {aCount}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  /**
   * 4) UI RENDER
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige text-xl">Loading CSV data...</p>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-beige text-xl">No columns found in the processed data.</p>
      </div>
    );
  }

  console.log("Filename from URL:", filename);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#007057] to-emerald-900">


      {/* Header */}
      <div className="pt-8 pb-6 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/preprocessing/demo")}
                className="flex items-center text-beige hover:text-emerald-300 transition duration-300"
              >
                <GoArrowLeft className="text-3xl" />
              </button>
              <h1 className="text-4xl font-bold text-beige">Processing Results</h1>
            </div>
            {filename ? (
        <a
          href={`http://localhost:5001/download/${filename}`}
          className="bg-green-500 text-white px-4 py-2 rounded"
          download
        >
          Download Processed File
        </a>
      ) : (
        <p>No processed file available.</p>
      )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Original Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.originalRows}</p>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Cleaned Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.cleanedRows}</p>
              <p className="text-beige/60 text-sm">
                ({Math.round((stats.cleanedRows / stats.originalRows) * 100)}% of original)
              </p>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Nulls Filled</h3>
              <p className="text-beige text-3xl font-bold">{stats.nullsFilled}</p>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Duplicates Removed</h3>
              <p className="text-beige text-3xl font-bold">{stats.duplicatesRemoved}</p>
            </div>
          </div>

          {/* Data Preview (AFTER data) */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <h2 className="text-xl font-bold text-beige mb-4">Data Preview (After Cleaning)</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/30">
                    {columns.map((col) => (
                      <th key={col} className="text-left py-3 px-4 text-beige font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewRows.map((row, rowIdx) => (
                    <tr
                      key={rowIdx}
                      className={`border-b border-emerald-500/10 ${
                        rowIdx % 2 === 0 ? "bg-emerald-900/10" : ""
                      }`}
                    >
                      {columns.map((col) => (
                        <td key={col} className="py-2 px-4 text-beige/80">
                          {row[col] == null ? "" : String(row[col])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              {/* Adjust if you have the actual row count from after data */}
              <p className="text-beige/60">Showing {previewRows.length} of {stats.cleanedRows} rows</p>
            </div>
          </div>

          {/* Data Distribution */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-beige">Data Distribution</h2>
              {/* Column Selection */}
              <select
                value={selectedColumn}
                onChange={(e) => setSelectedColumn(e.target.value)}
                className="bg-emerald-800 text-beige border border-emerald-600 rounded-lg py-2 px-4"
              >
                {columns.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Before / After charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">Before Cleaning</h3>
                {renderBinnedChart(beforeBins[selectedColumn], "#007057")}
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">After Cleaning</h3>
                {renderBinnedChart(afterBins[selectedColumn], "#f3dab1")}
              </div>
            </div>

            {/* Overlapping Comparison */}
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-center text-beige mb-4">Before vs After Comparison</h3>
              <div className="flex justify-center mb-4">
                <div className="flex items-center mr-6">
                  <div className="w-3 h-3 rounded-full bg-[#007057] mr-2" />
                  <span className="text-beige text-sm">Before</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#f3dab1] mr-2" />
                  <span className="text-beige text-sm">After</span>
                </div>
              </div>
              {renderComparison()}
            </div>
          </div>

          {/* Column Info */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <h2 className="text-xl font-bold text-beige mb-4">Column Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-emerald-500/30">
                      <th className="text-left py-2 px-3 text-beige">Column</th>
                      <th className="text-left py-2 px-3 text-beige">Type</th>
                      <th className="text-left py-2 px-3 text-beige">Nulls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {columns.map((col, idx) => {
                      const colType = columnTypes[col] || "unknown";
                      const nullCount = columnNulls[col] ?? 0;
                      return (
                        <tr
                          key={col}
                          className={`border-b border-emerald-500/10 ${
                            idx % 2 === 0 ? "bg-emerald-900/10" : ""
                          }`}
                        >
                          <td className="py-2 px-3 text-beige">{col}</td>
                          <td className="py-2 px-3 text-beige/80">{colType}</td>
                          <td className="py-2 px-3 text-beige/80">{nullCount}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex flex-col h-full justify-center">
                  <h3 className="text-lg font-bold text-beige mb-3">Data Summary</h3>
                  <ul className="space-y-2 text-beige/80">
                    <li>
                      <span className="text-emerald-300">Total Features:</span>{" "}
                      {columns.length}
                    </li>
                    <li>
                      <span className="text-emerald-300">Target Column:</span> Target?
                      {/* Adjust if you know which is your target */}
                    </li>
                    {/* Example: count numeric vs. categorical */}
                    <li>
                      <span className="text-emerald-300">Numeric Columns:</span>{" "}
                      {
                        Object.values(columnTypes).filter((t) => t === "numeric")
                          .length
                      }
                    </li>
                    <li>
                      <span className="text-emerald-300">Categorical Columns:</span>{" "}
                      {
                        Object.values(columnTypes).filter((t) => t !== "numeric")
                          .length
                      }
                    </li>
                    <li>
                      <span className="text-emerald-300">Columns w/ Missing Values:</span>{" "}
                      {
                        Object.entries(columnNulls).filter(([, c]) => c > 0)
                          .length
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-emerald-700/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-beige mb-4 md:mb-0">Ready to use your cleaned data?</p>
              <div className="flex space-x-4">
                <button className="px-6 py-2.5 bg-beige text-emerald-900 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200">
                  Export Data
                </button>
                <a
                  href="https://github.com/rohannair2022/weedout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-emerald-700/30 text-beige border border-emerald-500/30 rounded-lg font-medium hover:bg-emerald-700/40 transition-all duration-200"
                >
                  View Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
