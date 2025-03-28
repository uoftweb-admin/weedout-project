"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import Papa from "papaparse";
import { useSearchParams } from "next/navigation";

// Example: we want 10 bins for numeric columns
const NUM_BINS = 10;
// Max columns to display in preview
const MAX_PREVIEW_COLUMNS = 8;
// Max file size to process on client (1MB)
const MAX_CLIENT_PROCESS_SIZE_MB = 1;

export default function ProcessingResultsPage() {
  const router = useRouter();

  const searchParams = useSearchParams();
  const filename = searchParams.get("file");

  // Column definitions & user selections
  const [columns, setColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});   // { colName: "numeric" | "string" }
  const [columnNulls, setColumnNulls] = useState({});   // { colName: number_of_nulls }
  const [selectedColumn, setSelectedColumn] = useState("");

  // Distributions
  const [beforeBins, setBeforeBins] = useState({});     // { colName: { bins: [...], counts: [...] } }
  const [afterBins, setAfterBins] = useState({});       // same structure

  // Data for preview (we'll show after-data in the table)
  const [previewRows, setPreviewRows] = useState([]);
  
  // File information
  const [fileSizeWarning, setFileSizeWarning] = useState(false);
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [processedFileSize, setProcessedFileSize] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [stats, setStats] = useState({});
  const [advancedStats, setAdvancedStats] = useState({});

  /**
   * 1) FETCH CSV + PARSE
   */
  useEffect(() => {
    const fetchCSVData = async (fileName) => {
      try {
        const response = await fetch(`/files/${fileName}`);
        
        // Check file size from headers if available
        const contentLength = response.headers.get('content-length');
        const fileSizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;
        
        if (fileName === "file.csv") {
          setOriginalFileSize(fileSizeMB);
        } else if (fileName === "file_processed.csv") {
          setProcessedFileSize(fileSizeMB);
        }
        
        // If file is larger than threshold, show warning
        if (fileSizeMB > MAX_CLIENT_PROCESS_SIZE_MB) {
          setFileSizeWarning(true);
          // For very large files, you might want to limit the preview
          // Here we'll continue but note that for production you might want 
          // to implement server-side processing for large files
        }
        
        const csvText = await response.text();
        return new Promise((resolve) => {
          Papa.parse(csvText, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            complete: (results) => resolve(results.data),
          });
        });
      } catch (err) {
        console.error(`Error fetching ${fileName}:`, err);
        setError(`Could not load ${fileName}. Please check if the file exists.`);
        return [];
      }
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
        
        // Format numbers for better readability
        const formattedLow = formatNumber(low);
        const formattedHigh = formatNumber(high);
        bins.push(`${formattedLow} – ${formattedHigh}`);
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

    // Format large numbers for better readability
    const formatNumber = (num) => {
      // Check if the number is very small or very large
      if (Math.abs(num) < 0.01 || Math.abs(num) > 9999) {
        return num.toExponential(2);
      }
      
      // For numbers with decimal places
      if (num % 1 !== 0) {
        return Number(num.toFixed(2)).toString();
      }
      
      return num.toString();
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

    // Calculate additional statistics for numerical columns
    const calculateAdvancedStats = (data, columnTypes) => {
      if (!data || !data.length) return {};
      
      const stats = {};
      const columns = Object.keys(data[0]);
      
      columns.forEach(col => {
        if (columnTypes[col] === "numeric") {
          const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined && !isNaN(val));
          
          if (values.length > 0) {
            // Sort values for calculations
            values.sort((a, b) => a - b);
            
            // Calculate basic statistics
            const sum = values.reduce((acc, val) => acc + val, 0);
            const mean = sum / values.length;
            
            // Calculate variance and standard deviation
            const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
            const stdDev = Math.sqrt(variance);
            
            // Calculate median
            const mid = Math.floor(values.length / 2);
            const median = values.length % 2 === 0 
              ? (values[mid - 1] + values[mid]) / 2 
              : values[mid];
            
            // Calculate quartiles
            const q1Index = Math.floor(values.length * 0.25);
            const q3Index = Math.floor(values.length * 0.75);
            const q1 = values[q1Index];
            const q3 = values[q3Index];
            const iqr = q3 - q1;
            
            // Identify potential outliers (outside 1.5 * IQR)
            const lowerBound = q1 - 1.5 * iqr;
            const upperBound = q3 + 1.5 * iqr;
            const outliers = values.filter(val => val < lowerBound || val > upperBound);
            
            stats[col] = {
              min: values[0],
              max: values[values.length - 1],
              mean: mean,
              median: median,
              stdDev: stdDev,
              q1: q1,
              q3: q3,
              iqr: iqr,
              outlierCount: outliers.length,
              outlierPercentage: (outliers.length / values.length) * 100
            };
          }
        } else {
          // For categorical columns
          const valueFrequency = {};
          let totalCount = 0;
          
          data.forEach(row => {
            const val = row[col];
            if (val !== null && val !== undefined && val !== "") {
              valueFrequency[val] = (valueFrequency[val] || 0) + 1;
              totalCount++;
            }
          });
          
          if (totalCount > 0) {
            // Find most common value
            const mostCommon = Object.entries(valueFrequency)
              .sort((a, b) => b[1] - a[1])[0];
              
            stats[col] = {
              uniqueCount: Object.keys(valueFrequency).length,
              mostCommonValue: mostCommon[0],
              mostCommonCount: mostCommon[1],
              mostCommonPercentage: (mostCommon[1] / totalCount) * 100
            };
          }
        }
      });
      
      return stats;
    };

    const loadData = async () => {
      try {
        // Load original and processed CSV data
        const beforeData = await fetchCSVData("file.csv");
        const afterData = await fetchCSVData("file_processed.csv");
    
        if (!afterData || afterData.length === 0) {
          setError("No data found in the processed file.");
          setColumns([]);
          setIsLoading(false);
          return;
        }
    
        const colNames = Object.keys(afterData[0]);
        setColumns(colNames);
        
        // Limit display columns to MAX_PREVIEW_COLUMNS
        const limitedCols = colNames.slice(0, MAX_PREVIEW_COLUMNS);
        setDisplayColumns(limitedCols);
        
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
          if (beforeData[0] && col in beforeData[0]) {
            const beforeNulls = beforeData.filter(row => row[col] === null || row[col] === "").length;
            const afterNulls = afterData.filter(row => row[col] === null || row[col] === "").length;
            nullsFilled += Math.max(0, beforeNulls - afterNulls); // Ensure non-negative
          }
        });
    
        // Calculate duplicates removed
        const beforeUniqueSet = new Set();
        const afterUniqueSet = new Set();
        
        // Use only common columns for duplicate detection
        const commonCols = colNames.filter(col => beforeData[0] && col in beforeData[0]);
        
        beforeData.forEach(row => {
          const uniqueKey = commonCols.map(col => row[col]).join('|');
          beforeUniqueSet.add(uniqueKey);
        });
        
        afterData.forEach(row => {
          const uniqueKey = commonCols.map(col => row[col]).join('|');
          afterUniqueSet.add(uniqueKey);
        });
        
        const duplicatesRemoved = originalRows - cleanedRows - (beforeUniqueSet.size - afterUniqueSet.size);
    
        // Update stats
        setStats({
          originalRows,
          cleanedRows,
          nullsFilled,
          duplicatesRemoved,
          dataReduction: ((originalRows - cleanedRows) / originalRows * 100).toFixed(1)
        });
    
        // Calculate advanced statistics
        const advStats = calculateAdvancedStats(afterData, types);
        setAdvancedStats(advStats);
        
        // Build distribution bins
        const beforeBinsData = processData(beforeData);
        const afterBinsData = processData(afterData);
        setBeforeBins(beforeBinsData);
        setAfterBins(afterBinsData);
    
        // Preview first few rows
        setPreviewRows(afterData.slice(0, 5));
      } catch (err) {
        console.error("Error loading data: ", err);
        setError("Failed to process data. Please check browser console for details.");
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
    if (!columnBins) return <div className="text-beige/60">No data available</div>;
    const { bins, counts } = columnBins;
    if (!bins || bins.length === 0) return <div className="text-beige/60">No data available</div>;

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
                className="flex-1 flex flex-col justify-end items-center mx-0.5 relative group"
              >
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: color,
                    transition: "height 0.3s ease",
                  }}
                />
                {/* Tooltip showing exact count */}
                <div className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Count: {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div className="flex mt-2 text-xs text-beige/80">
          {bins.map((label, idx) => (
            <div key={idx} className="flex-1 text-center truncate px-0.5 hover:overflow-visible hover:z-10 hover:whitespace-normal">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  /**
   * 3) COMPARISON CHART: Vertical bar charts with side-by-side bars
   */
  const renderComparison = () => {
    const bBins = beforeBins[selectedColumn];
    const aBins = afterBins[selectedColumn];
    if (!bBins || !aBins) return <div className="text-beige/60">No distribution data available.</div>;

    // Use the numeric column's natural bins
    const columnType = columnTypes[selectedColumn] || "string";
    const labels = columnType === "numeric" ? bBins.bins : bBins.bins.filter((_, i) => i < 5);
    const beforeCounts = columnType === "numeric" ? bBins.counts : bBins.counts.filter((_, i) => i < 5);
    const afterCounts = columnType === "numeric" ? aBins.counts : aBins.counts.filter((_, i) => i < 5);

    // Calculate max for scaling
    const maxCount = Math.max(...beforeCounts, ...afterCounts);

    return (
      <div className="flex flex-col">
        <div className="flex justify-between space-x-4 h-60">
          {labels.map((label, idx) => {
            const bCount = beforeCounts[idx] || 0;
            const aCount = afterCounts[idx] || 0;
            const bHeight = maxCount ? (bCount / maxCount) * 100 : 0;
            const aHeight = maxCount ? (aCount / maxCount) * 100 : 0;
            
            return (
              <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                <div className="w-full flex justify-center items-end space-x-1 h-full">
                  {/* Before bar */}
                  <div className="w-5/12 relative">
                    <div 
                      className="absolute bottom-0 w-full bg-[#007057] rounded-t"
                      style={{ height: `${bHeight}%` }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                      {bCount}
                    </div>
                  </div>
                  
                  {/* After bar */}
                  <div className="w-5/12 relative">
                    <div 
                      className="absolute bottom-0 w-full bg-[#f3dab1] rounded-t"
                      style={{ height: `${aHeight}%` }}
                    ></div>
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none">
                      {aCount}
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-2 text-xs text-beige/80 truncate w-full px-1">
                  {label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * 4) UI RENDER
   */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#007057] to-emerald-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-beige mx-auto mb-4"></div>
          <p className="text-beige text-xl">Loading CSV data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#007057] to-emerald-900">
        <div className="bg-black/20 p-8 rounded-xl max-w-lg text-center">
          <p className="text-beige text-xl mb-4">Error</p>
          <p className="text-beige/80 mb-6">{error}</p>
          <button 
            onClick={() => router.push("/preprocessing/demo")} 
            className="px-6 py-2.5 bg-emerald-700/30 text-beige border border-emerald-500/30 rounded-lg"
          >
            Return to Upload
          </button>
        </div>
      </div>
    );
  }

  if (!columns || columns.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#007057] to-emerald-900">
        <div className="bg-black/20 p-8 rounded-xl max-w-lg text-center">
          <p className="text-beige text-xl mb-4">No Data Available</p>
          <p className="text-beige/80 mb-6">No columns found in the processed data.</p>
          <button 
            onClick={() => router.push("/preprocessing/demo")} 
            className="px-6 py-2.5 bg-emerald-700/30 text-beige border border-emerald-500/30 rounded-lg"
          >
            Return to Upload
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#007057] to-emerald-900">
      {/* File size warning */}
      {fileSizeWarning && (
        <div className="bg-yellow-500/20 border border-yellow-400/30 py-2 px-4 text-center">
          <p className="text-yellow-100">
            Some data visualizations may be limited due to file size constraints.
          </p>
        </div>
      )}

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
                href={`http://localhost:5001/download/processed_${filename}`}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                download
              >
                Download Processed File
              </a>
            ) : (
              <p className="text-beige/60">No processed file name provided</p>
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
              <p className="text-beige text-3xl font-bold">{stats.originalRows?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Cleaned Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.cleanedRows?.toLocaleString() || 0}</p>
              {stats.originalRows > 0 && (
                <p className="text-beige/60 text-sm">
                  ({Math.round((stats.cleanedRows / stats.originalRows) * 100)}% of original)
                </p>
              )}
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Nulls Filled</h3>
              <p className="text-beige text-3xl font-bold">{stats.nullsFilled?.toLocaleString() || 0}</p>
            </div>
            <div className="bg-black/20 rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Duplicates Removed</h3>
              <p className="text-beige text-3xl font-bold">{stats.duplicatesRemoved?.toLocaleString() || 0}</p>
            </div>
          </div>

          {/* Data Preview (AFTER data) */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-beige">Data Preview (After Cleaning)</h2>
              {columns.length > MAX_PREVIEW_COLUMNS && (
                <div className="text-beige/60 text-sm">
                  Showing {MAX_PREVIEW_COLUMNS} of {columns.length} columns
                </div>
              )}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/30">
                    {displayColumns.map((col) => (
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
                      {displayColumns.map((col) => (
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

            {/* Vertical Bar Comparison */}
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

          {/* Column Info and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Column Information */}
            <div className="bg-black/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-beige mb-4">Column Information</h2>
              <div className="overflow-x-auto">
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
            </div>

            {/* Enhanced Data Summary */}
            <div className="bg-black/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-beige mb-4">Enhanced Data Insights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-emerald-300 mb-2">Dataset Overview</h3>
                  <ul className="space-y-2 text-beige/80">
                    <li>
                      <span className="text-emerald-200">Total Features:</span>{" "}
                      {columns.length}
                    </li>
                    <li>
                      <span className="text-emerald-200">Numeric Columns:</span>{" "}
                      {Object.values(columnTypes).filter((t) => t === "numeric").length}
                    </li>
                    <li>
                      <span className="text-emerald-200">Categorical Columns:</span>{" "}
                      {Object.values(columnTypes).filter((t) => t !== "numeric").length}
                    </li>
                    <li>
                      <span className="text-emerald-200">Columns with Missing Values:</span>{" "}
                      {Object.entries(columnNulls).filter(([, c]) => c > 0).length}
                    </li>
                    <li>
                      <span className="text-emerald-200">Data Reduction:</span>{" "}
                      {stats.dataReduction}% fewer rows after cleaning
                    </li>
                  </ul>
                </div>
                
                {selectedColumn && advancedStats[selectedColumn] && (
                  <div>
                    <h3 className="text-lg font-medium text-emerald-300 mb-2">
                      Statistics for {selectedColumn}
                    </h3>
                    {columnTypes[selectedColumn] === "numeric" ? (
                      <ul className="space-y-2 text-beige/80">
                        <li>
                          <span className="text-emerald-200">Range:</span> {advancedStats[selectedColumn].min.toFixed(2)} to {advancedStats[selectedColumn].max.toFixed(2)}
                        </li>
                        <li>
                          <span className="text-emerald-200">Mean:</span> {advancedStats[selectedColumn].mean.toFixed(2)}
                        </li>
                        <li>
                          <span className="text-emerald-200">Median:</span> {advancedStats[selectedColumn].median.toFixed(2)}
                        </li>
                        <li>
                          <span className="text-emerald-200">Standard Deviation:</span> {advancedStats[selectedColumn].stdDev.toFixed(2)}
                        </li>
                        <li>
                          <span className="text-emerald-200">Potential Outliers:</span> {advancedStats[selectedColumn].outlierCount} ({advancedStats[selectedColumn].outlierPercentage.toFixed(1)}%)
                        </li>
                      </ul>
                    ) : (
                      <ul className="space-y-2 text-beige/80">
                        <li>
                          <span className="text-emerald-200">Unique Values:</span> {advancedStats[selectedColumn].uniqueCount}
                        </li>
                        <li>
                          <span className="text-emerald-200">Most Common:</span> {advancedStats[selectedColumn].mostCommonValue}
                        </li>
                        <li>
                          <span className="text-emerald-200">Frequency:</span> {advancedStats[selectedColumn].mostCommonCount} occurrences ({advancedStats[selectedColumn].mostCommonPercentage.toFixed(1)}%)
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-emerald-700/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-beige mb-4 md:mb-0">Ready to use your cleaned data?</p>
              <div className="flex space-x-4">
                {filename && (
                  <a
                    href={`http://localhost:5001/download/processed_${filename}`}
                    className="px-6 py-2.5 bg-beige text-emerald-900 rounded-lg font-medium hover:bg-emerald-50 transition-all duration-200"
                    download
                  >
                    Download CSV
                  </a>
                )}
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