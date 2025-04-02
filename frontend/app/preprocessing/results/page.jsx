"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import Papa from "papaparse";
import { useSearchParams } from "next/navigation";
import { Inria_Serif } from "next/font/google";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

// Configuration constants
const NUM_BINS = 10;
const MAX_PREVIEW_COLUMNS = 8;
const MAX_CLIENT_PROCESS_SIZE_MB = 1;

export default function ProcessingResultsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filename = searchParams.get("file");

  // State management
  const [columns, setColumns] = useState([]);
  const [displayColumns, setDisplayColumns] = useState([]);
  const [columnTypes, setColumnTypes] = useState({});   // { colName: "numeric" | "string" }
  const [columnNulls, setColumnNulls] = useState({});   // { colName: number_of_nulls }
  const [selectedColumn, setSelectedColumn] = useState("");
  const [beforeBins, setBeforeBins] = useState({});     // { colName: { bins: [...], counts: [...] } }
  const [afterBins, setAfterBins] = useState({});       // same structure
  const [previewRows, setPreviewRows] = useState([]);
  const [fileSizeWarning, setFileSizeWarning] = useState(false);
  const [originalFileSize, setOriginalFileSize] = useState(0);
  const [processedFileSize, setProcessedFileSize] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({});
  const [advancedStats, setAdvancedStats] = useState({});
  const [processingOptions, setProcessingOptions] = useState({});

  /**
   * Fetch and process CSV data
   */
  useEffect(() => {
    const fetchCSVData = async (fileName) => {
      try {
        const response = await fetch(`/files/${fileName}`);
        
        // Check file size
        const contentLength = response.headers.get('content-length');
        const fileSizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;
        
        if (fileName === "file.csv") {
          setOriginalFileSize(fileSizeMB);
        } else if (fileName === "file_processed.csv") {
          setProcessedFileSize(fileSizeMB);
        }
        
        if (fileSizeMB > MAX_CLIENT_PROCESS_SIZE_MB) {
          setFileSizeWarning(true);
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

    // Analyze column data types and null values
    const getColumnInfo = (data) => {
      if (!data || !data.length) return { types: {}, nullCounts: {} };

      const types = {};
      const nullCounts = {};

      Object.keys(data[0]).forEach((col) => {
        let numeric = true;
        let nullCount = 0;

        data.forEach((row) => {
          const val = row[col];
          if (val === null || val === "" || val === undefined) {
            nullCount += 1;
          } else if (typeof val !== "number") {
            numeric = false;
          }
        });

        types[col] = numeric ? "numeric" : "string";
        nullCounts[col] = nullCount;
      });

      return { types, nullCounts };
    };

    // Get min/max for numeric columns
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
        return { min: 0, max: 0 };
      }
      
      return { min, max };
    };

    // Format numbers for readability
    const formatNumber = (num) => {
      if (Math.abs(num) < 0.01 || Math.abs(num) > 9999) {
        return num.toExponential(2);
      }
      
      if (num % 1 !== 0) {
        return Number(num.toFixed(2)).toString();
      }
      
      return num.toString();
    };

    // Create distribution bins for numeric columns
    const binNumericColumn = (data, col, min, max, numBins = NUM_BINS) => {
      if (min >= max) {
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
        
        const formattedLow = formatNumber(low);
        const formattedHigh = formatNumber(high);
        bins.push(`${formattedLow} – ${formattedHigh}`);
      }

      data.forEach((row) => {
        const val = row[col];
        if (typeof val === "number") {
          let binIndex = Math.floor(((val - min) / (max - min)) * numBins);
          if (binIndex === numBins) binIndex = numBins - 1;
          counts[binIndex] += 1;
        }
      });

      return { bins, counts };
    };

    // Create frequency counts for string columns
    const binStringColumn = (data, col) => {
      const freq = {};
      
      data.forEach((row) => {
        const val = row[col];
        if (val == null || val === "") return;
        if (!freq[val]) freq[val] = 0;
        freq[val]++;
      });
      
      // Sort by frequency and get top 10
      const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      const top = sorted.slice(0, 10);
      
      return {
        bins: top.map(([k]) => String(k)),
        counts: top.map(([_, count]) => count),
      };
    };

    // Process column data into bins
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

    // Calculate statistics for columns
    const calculateAdvancedStats = (data, columnTypes) => {
      if (!data || !data.length) return {};
      
      const stats = {};
      const columns = Object.keys(data[0]);
      
      columns.forEach(col => {
        if (columnTypes[col] === "numeric") {
          // Handle numeric columns
          const values = data.map(row => row[col])
                             .filter(val => val !== null && val !== undefined && !isNaN(val));
          
          if (values.length > 0) {
            values.sort((a, b) => a - b);
            
            const sum = values.reduce((acc, val) => acc + val, 0);
            const mean = sum / values.length;
            const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length;
            const stdDev = Math.sqrt(variance);
            
            const mid = Math.floor(values.length / 2);
            const median = values.length % 2 === 0 
              ? (values[mid - 1] + values[mid]) / 2 
              : values[mid];
            
            const q1Index = Math.floor(values.length * 0.25);
            const q3Index = Math.floor(values.length * 0.75);
            const q1 = values[q1Index];
            const q3 = values[q3Index];
            const iqr = q3 - q1;
            
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
          // Handle categorical columns
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

    // Check if a column might be a time-related column
    const getTimeColumns = (data) => {
      if (!data || data.length === 0) return [];
      
      const colNames = Object.keys(data[0]);
      const datePatterns = [
        /^\d{4}-\d{2}-\d{2}/,  // ISO date
        /^\d{1,2}\/\d{1,2}\/\d{4}/,  // MM/DD/YYYY
        /^\d{10,13}$/  // Unix timestamp
      ];
      
      return colNames.filter(col => {
        const sample = data.slice(0, Math.min(10, data.length));
        return sample.some(row => {
          const val = row[col];
          return typeof val === 'string' && datePatterns.some(pattern => pattern.test(val));
        });
      });
    };

    // Main data loading function
    const loadData = async () => {
      try {
        console.log("Starting loadData with filename:", filename);
        
        // Set default processing options
        const defaultOptions = {
          model_type: "classification",
          sampling: "none",
          dataset_type: "cross-sectional",
          target_column: "target",
          columns_dropped: 0,
          columns_untouched: 0
        };
        
        // Get processing options from localStorage if available
        const storedOptions = localStorage.getItem('processingOptions');
        if (storedOptions) {
          console.log("Retrieved stored options from localStorage:", storedOptions);
          setProcessingOptions(JSON.parse(storedOptions));
        } else {
          console.log("No stored options found in localStorage, using defaults");
          setProcessingOptions(defaultOptions);
        }

        // Load CSV data
        const beforeData = await fetchCSVData("file.csv");
        const afterData = await fetchCSVData("file_processed.csv");
    
        if (!afterData || afterData.length === 0) {
          setError("No data found in the processed file.");
          setColumns([]);
          setIsLoading(false);
          return;
        }
    
        // Get column names
        const beforeColNames = beforeData && beforeData.length > 0 ? Object.keys(beforeData[0]) : [];
        const afterColNames = Object.keys(afterData[0]);
        
        // Detect dropped columns
        const droppedColumns = beforeColNames.filter(col => !afterColNames.includes(col));
        const isColumnsDropped = droppedColumns.length > 0;
        
        setColumns(afterColNames);
        setDisplayColumns(afterColNames.slice(0, MAX_PREVIEW_COLUMNS));
        setSelectedColumn(afterColNames[0]);
    
        // Analyze column types and nulls
        const { types, nullCounts } = getColumnInfo(afterData);
        setColumnTypes(types);
        setColumnNulls(nullCounts);
    
        // Calculate basic statistics
        const originalRows = beforeData.length;
        const cleanedRows = afterData.length;
        
        // Calculate nulls filled
        let nullsFilled = 0;
        afterColNames.forEach(col => {
          if (beforeData[0] && col in beforeData[0]) {
            const beforeNulls = beforeData.filter(row => row[col] === null || row[col] === "").length;
            const afterNulls = afterData.filter(row => row[col] === null || row[col] === "").length;
            nullsFilled += Math.max(0, beforeNulls - afterNulls);
          }
        });
    
        // Calculate duplicates removed
        const beforeUniqueSet = new Set();
        const afterUniqueSet = new Set();
        
        const commonCols = afterColNames.filter(col => beforeData[0] && col in beforeData[0]);
        
        beforeData.forEach(row => {
          const uniqueKey = commonCols.map(col => row[col]).join('|');
          beforeUniqueSet.add(uniqueKey);
        });
        
        afterData.forEach(row => {
          const uniqueKey = commonCols.map(col => row[col]).join('|');
          afterUniqueSet.add(uniqueKey);
        });
        
        const duplicatesRemoved = beforeData.length - beforeUniqueSet.size;
        
        // Determine data characteristics
        const isOversampled = cleanedRows > originalRows;
        const isUndersampled = cleanedRows < originalRows;
        const dataChangePercent = ((cleanedRows - originalRows) / originalRows * 100).toFixed(1);
        
        // Get time columns for display purposes only
        const timeColumns = getTimeColumns(afterData);
        
        // Detect SMOTE as fallback
        let isSmote = false;
        if (isOversampled) {
          // Simple heuristic: if oversampled and has categorical columns
          const categoricalCols = Object.entries(types).filter(([_, type]) => type !== 'numeric');
          isSmote = categoricalCols.length > 0 && dataChangePercent > 10;
        }
    
        // Update statistics - We'll update the model-specific flags in the useEffect
        setStats({
          originalRows,
          cleanedRows,
          nullsFilled,
          duplicatesRemoved,
          dataChangePercent,
          isOversampled,
          isUndersampled,
          timeColumns,
          isColumnsDropped,
          droppedColumns,
          isSmote,
          targetColumn: "" // Will be updated from processingOptions in useEffect
        });
    
        // Calculate advanced statistics
        setAdvancedStats(calculateAdvancedStats(afterData, types));
        
        // Build distribution bins
        setBeforeBins(processData(beforeData));
        setAfterBins(processData(afterData));
    
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
  }, [filename]); // Added filename as dependency

  // Add this useEffect to update stats when processingOptions changes
  useEffect(() => {
    if (!isLoading && Object.keys(processingOptions).length > 0) {
      console.log("Processing options updated:", processingOptions);

      // Map sampling strategy to a consistent string
      const samplingStrategy = 
      processingOptions.sampling === 1 ? "undersampling" :
      processingOptions.sampling === 2 ? "oversampling" :
      processingOptions.sampling === 3 ? "smote" :
      "none";

      // Explicitly map dataset_type and model_type
      const isTimeSeriesData = processingOptions.dataset_type === 1;
      const isCrossSectionalData = processingOptions.dataset_type === 0;
      const isRegressionData = processingOptions.model_type === 0;
      const isClassificationData = processingOptions.model_type === 1;
      
      // Update stats based on current processing options
      setStats(prevStats => {
        const updatedStats = {
          ...prevStats,
          isTimeSeriesData,
          isCrossSectionalData,
          isRegressionData,
          isClassificationData,
          isSmote: samplingStrategy === "smote",
          targetColumn: processingOptions.target_column || prevStats.targetColumn
        };
        
        console.log("Updated stats:", updatedStats);
        return updatedStats;
      });
    }
  }, [processingOptions, isLoading]);

  /**
   * Render distribution chart for the selected column
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
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Count: {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* X labels */}
        <div className="flex mt-2 text-xs text-beige/80 min-h-12">
          {bins.map((label, idx) => (
            <div key={idx} className="flex-1 text-center px-0.5 break-words">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Loading state
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

  // Error state
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

  // No data state
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

  // Debugging div for display at the bottom
  const debuggingDiv = (
    <div className="bg-red-800/20 border border-red-500/30 rounded-xl p-6 mb-8">
      <h2 className="text-xl font-bold text-white mb-4">Debug Information</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-2">Processing Options</h3>
          <pre className="text-xs text-white/80 overflow-auto max-h-40">
            {JSON.stringify(processingOptions, null, 2)}
          </pre>
        </div>
        <div className="bg-black/30 p-4 rounded-lg">
          <h3 className="text-white font-medium mb-2">Stats Object</h3>
          <pre className="text-xs text-white/80 overflow-auto max-h-40">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
        <div className="bg-black/30 p-4 rounded-lg col-span-2">
          <h3 className="text-white font-medium mb-2">Flags</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/70">isTimeSeriesData:</span> <span className={stats.isTimeSeriesData ? "text-green-400" : "text-red-400"}>{String(stats.isTimeSeriesData)}</span></div>
            <div><span className="text-white/70">isCrossSectionalData:</span> <span className={stats.isCrossSectionalData ? "text-green-400" : "text-red-400"}>{String(stats.isCrossSectionalData)}</span></div>
            <div><span className="text-white/70">isRegressionData:</span> <span className={stats.isRegressionData ? "text-green-400" : "text-red-400"}>{String(stats.isRegressionData)}</span></div>
            <div><span className="text-white/70">isClassificationData:</span> <span className={stats.isClassificationData ? "text-green-400" : "text-red-400"}>{String(stats.isClassificationData)}</span></div>
            <div><span className="text-white/70">isSmote:</span> <span className={stats.isSmote ? "text-green-400" : "text-red-400"}>{String(stats.isSmote)}</span></div>
            <div><span className="text-white/70">isOversampled:</span> <span className={stats.isOversampled ? "text-green-400" : "text-red-400"}>{String(stats.isOversampled)}</span></div>
            <div><span className="text-white/70">isUndersampled:</span> <span className={stats.isUndersampled ? "text-green-400" : "text-red-400"}>{String(stats.isUndersampled)}</span></div>
            <div><span className="text-white/70">isColumnsDropped:</span> <span className={stats.isColumnsDropped ? "text-green-400" : "text-red-400"}>{String(stats.isColumnsDropped)}</span></div>
            <div><span className="text-white/70">dataset_type:</span> <span className="text-yellow-400">{processingOptions.dataset_type}</span></div>
            <div><span className="text-white/70">model_type:</span> <span className="text-yellow-400">{processingOptions.model_type}</span></div>
            <div><span className="text-white/70">sampling:</span> <span className="text-yellow-400">{processingOptions.sampling}</span></div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleDownload = () => {
    if (filename) {
      setIsLoading(true);
      console.log(`Attempting to download file: ${filename}`);

      const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      
      // Simple direct download approach
      const downloadUrl = `${BASE_URL}/download/${filename}`;
      
      // Create a link element and trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename; // This sets the download attribute
      
      // Add to DOM, click, and remove (cleaner approach than iframe)
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Set a reasonable timeout to consider the download started
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      // Add error handling
      fetch(downloadUrl, { method: 'HEAD' })
        .then(response => {
          if (!response.ok) {
            setError("Could not find the file for download. Please try processing again.");
          }
        })
        .catch(() => {
          setError("Download failed. Please check your connection and try again.");
        });
    }
  };

  // Main content
  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#007057] to-emerald-900 ${inriaSerif.className}`}>
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
              <button
                onClick={handleDownload}
                className="bg-infoBoxes text-blueText text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
                  hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige
                  hover:shadow-infoBoxes/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out" 
                  >
                Download Processed File
              </button>
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
              <h3 className="text-emerald-300 font-medium mb-1">Processed Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.cleanedRows?.toLocaleString() || 0}</p>
              {stats.originalRows > 0 && (
                <p className={`text-sm ${stats.isOversampled ? 'text-yellow-300' : 'text-beige/60'}`}>
                  {stats.isOversampled
                    ? `(${stats.dataChangePercent}% increase)`
                    : stats.isUndersampled
                      ? `(${Math.abs(stats.dataChangePercent)}% reduction)`
                      : `(No change in row count)`
                  }
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

          {/* Data Type Information Card */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <h3 className="text-lg font-medium text-emerald-300 mb-3">
              Processing Configuration Used
            </h3>
            
            <div className="flex flex-col gap-4 w-full">
              {/* Model Type */}
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="text-emerald-200 font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                  {/* 1 for Regression, 0 for Classification */}
                  Model Type: {processingOptions.model_type === 0 ? "Regression" : 
                            processingOptions.model_type === 1 ? "Classification" : "None"}
                </h4>
                {/* CHANGE THIS PART - The problem is here */}
                {processingOptions.target_column && (
                  <p className="text-beige/80 text-sm">
                    Target Column: <span className="bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded text-xs">{processingOptions.target_column}</span>
                  </p>
                )}
              </div>
              
              {/* Dataset Type */}
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="text-emerald-200 font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                  {/* 1 for time series, 0 for cross */}
                  Dataset Type: {processingOptions.dataset_type === 1 ? "Time Series" : 
                                processingOptions.dataset_type === 0 ? "Cross-Sectional" : 
                                "Not Specified"}
                </h4>
                {stats.isTimeSeriesData && stats.timeColumns && stats.timeColumns.length > 0 && (
                  <div>
                    <p className="text-beige/80 text-sm mb-2">Time-related columns:</p>
                    <div className="flex flex-wrap gap-1">
                      {stats.timeColumns.map(col => (
                        <span key={col} className="bg-emerald-900/50 text-emerald-200 px-2 py-0.5 rounded text-xs">
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sampling Strategy */}
              <div className="bg-black/30 p-3 rounded-lg">
                <h4 className="text-emerald-200 font-medium mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                  Sampling Strategy
                </h4>
                <p className="text-beige/80 text-sm">
                  {processingOptions.sampling === 'smote' ? "SMOTE (Synthetic Minority Oversampling)" : 
                   processingOptions.sampling === "oversampling" ? "Oversampling" : 
                   processingOptions.sampling === "undersampling" ? "Undersampling" : 
                   "No Sampling"}
                  
                  {(stats.isOversampled || stats.isUndersampled) && (
                    <span className="text-yellow-300 ml-2">
                      ({stats.isOversampled ? "+" : ""}{stats.dataChangePercent}% rows)
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Data Preview */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-beige">Data Preview</h2>
              {columns.length > MAX_PREVIEW_COLUMNS && (
                <div className="text-beige/60 text-sm">
                  Showing {displayColumns.length} of {columns.length} columns
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">Before Cleaning</h3>
                {renderBinnedChart(beforeBins[selectedColumn], "#007057")}
              </div>

              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">After Cleaning</h3>
                {renderBinnedChart(afterBins[selectedColumn], "#f3dab1")}
              </div>
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
                    {columns.map((col, idx) => (
                      <tr
                        key={col}
                        className={`border-b border-emerald-500/10 ${
                          idx % 2 === 0 ? "bg-emerald-900/10" : ""
                        }`}
                      >
                        <td className="py-2 px-3 text-beige">{col}</td>
                        <td className="py-2 px-3 text-beige/80">{columnTypes[col] || "unknown"}</td>
                        <td className="py-2 px-3 text-beige/80">{columnNulls[col] ?? 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Data Insights */}
            <div className="bg-black/20 rounded-xl p-6">
              <h2 className="text-xl font-bold text-beige mb-4">Data Insights</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-emerald-300 mb-2">Dataset Overview</h3>
                  <ul className="space-y-2 text-beige/80">
                    <li>
                      <span className="text-emerald-200">Total Features:</span>{" "}
                      {columns.length}
                      {stats.isColumnsDropped && (
                        <span className="text-yellow-300 ml-2">
                          ({stats.droppedColumns.length} columns removed)
                        </span>
                      )}
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
                  </ul>

                  {/* Data transformations summary */}
                  <div className="mt-4 bg-black/30 p-3 rounded-lg text-sm">
                    <p className="text-beige font-medium mb-2">Transformations Applied:</p>
                    <ul className="list-inside space-y-1 text-beige/70">
                      {stats.nullsFilled > 0 && <li>• Missing values filled: {stats.nullsFilled}</li>}
                      {stats.duplicatesRemoved > 0 && <li>• Duplicates removed: {stats.duplicatesRemoved}</li>}
                      {stats.isColumnsDropped && <li>• Columns dropped: {stats.droppedColumns.length}</li>}
                      {stats.isSmote && <li>• SMOTE oversampling applied</li>}
                      {stats.isOversampled && !stats.isSmote && <li>• General oversampling applied</li>}
                      {stats.isUndersampled && <li>• Undersampling applied</li>}
                      {!stats.isOversampled && !stats.isUndersampled && !stats.isColumnsDropped && stats.nullsFilled === 0 && stats.duplicatesRemoved === 0 && (
                        <li>• Minor cleaning only</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Column-specific stats */}
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
                          <span className="text-emerald-200">Outliers:</span> {advancedStats[selectedColumn].outlierCount} ({advancedStats[selectedColumn].outlierPercentage.toFixed(1)}%)
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
                          <span className="text-emerald-200">Frequency:</span> {advancedStats[selectedColumn].mostCommonCount} ({advancedStats[selectedColumn].mostCommonPercentage.toFixed(1)}%)
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Suggested Analysis Techniques */}
          <div className="bg-black/20 rounded-xl mb-8 p-6">
            <h2 className="text-xl font-bold text-beige mb-4">Next Steps</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Visualizations */}
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-300 mb-3">Recommended Visualizations</h3>
                <ul className="list-disc list-inside space-y-1 text-beige/80">
                  {stats.isTimeSeriesData && (
                    <>
                      <li>Line charts with time on x-axis</li>
                      <li>Heatmaps for seasonal patterns</li>
                    </>
                  )}
                  {stats.isCrossSectionalData && (
                    <>
                      <li>Bar charts for group comparisons</li>
                      <li>Box plots for distributions</li>
                    </>
                  )}
                  {stats.isRegressionData && (
                    <>
                      <li>Scatter plots with regression lines</li>
                      <li>Feature importance charts</li>
                    </>
                  )}
                  {stats.isClassificationData && (
                    <>
                      <li>Confusion matrix</li>
                      <li>ROC/AUC curves</li>
                    </>
                  )}
                  <li>Histograms for distributions</li>
                  <li>Correlation heatmaps</li>
                </ul>
              </div>
              
              {/* Analysis Methods */}
              <div className="bg-black/30 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-emerald-300 mb-3">Modeling Options</h3>
                <ul className="list-disc list-inside space-y-1 text-beige/80">
                  {stats.isRegressionData && (
                    <>
                      <li>Linear regression</li>
                      <li>Decision trees (Random Forest)</li>
                      <li>Gradient boosting</li>
                      <li>Neural networks</li>
                    </>
                  )}
                  {stats.isClassificationData && (
                    <>
                      <li>Logistic regression</li>
                      <li>Support Vector Machines</li>
                      <li>Random Forest classifier</li>
                      <li>XGBoost classifier</li>
                    </>
                  )}
                  {stats.isTimeSeriesData && (
                    <>
                      <li>ARIMA/SARIMA models</li>
                      <li>Prophet forecasting</li>
                    </>
                  )}
                  {stats.isCrossSectionalData && (
                    <>
                      <li>Clustering (e.g., K-Means, DBSCAN)</li>
                      <li>Principal Component Analysis (PCA)</li>
                      <li>Factor analysis</li>
                      <li>Discriminant Analysis (LDA/QDA)</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Dataset specifics */}
            <div className="mt-4 bg-emerald-900/30 border border-emerald-700/30 rounded-lg p-4">
              <h4 className="text-emerald-200 font-medium mb-2">
                Your Processed Dataset
              </h4>
              <p className="text-beige/80">
                You now have a clean, processed dataset with {stats.cleanedRows} rows and {columns.length} columns. 
                {stats.nullsFilled > 0 && ` ${stats.nullsFilled} missing values were filled.`}
                {stats.duplicatesRemoved > 0 && ` ${stats.duplicatesRemoved} duplicate rows were removed.`}
                {stats.isColumnsDropped && ` ${stats.droppedColumns.length} columns were dropped.`}
                {' '}This dataset is ready for{' '}
                {stats.isRegressionData ? 'regression analysis' : 
                 stats.isClassificationData ? 'classification models' : 
                 'further analysis and modeling'}.
              </p>
            </div>
          </div>

          {/* Download Section */}
          {/* <div className="bg-emerald-700/20 border border-emerald-500/30 rounded-xl p-6">
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
          </div> */}
          
          {/* Debugging information */}
          {/* {debuggingDiv} */}
        </div>
      </div>
    </div>
  );
}