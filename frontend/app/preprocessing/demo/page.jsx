"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Inria_Serif } from "next/font/google"
import { CloudUpload, Trash2, Database, Settings, FileType, Columns } from "lucide-react"
import { GoArrowLeft } from "react-icons/go";
import axios from "axios";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function PreprocessingConfig() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [targetColumn, setTargetColumn] = useState("");
  const [columnsToDrop, setColumnsToDrop] = useState("");
  const [untouchedColumns, setUntouchedColumns] = useState("");
  const [datasetType, setDatasetType] = useState("");
  const [modelType, setModelType] = useState("");
  const [samplingStrategy, setSamplingStrategy] = useState("Select Sampling");


  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      if (selectedFile && selectedFile.type === "text/csv") {
        setFile(selectedFile);
      } else {
        alert("Invalid file type! Please upload a CSV file.");
      }
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === "text/csv") {
      setFile(droppedFile);
    } else {
      alert("Invalid file type! Please upload a CSV file.");
    }
  }

  const handleDelete = () => {
    setFile(null)
  }

  const handleProcessDataset = async (event) => {
    event.preventDefault();
  
    if (!file) {
      alert("Please upload a CSV file.");
      return;
    }
  
    // Basic validation
    if (!targetColumn) {
      alert("Please enter a target column name.");
      return;
    }
  
    if (!datasetType) {
      alert("Please select a dataset type.");
      return;
    }
  
    if (!modelType) {
      alert("Please select a model type.");
      return;
    }
  
    if (samplingStrategy === "Select Sampling") {
      setSamplingStrategy("none");
    }
  
    // Convert values to match backend expectations
    // Convert datasetType to integer (0 for cross-sectional, 1 for time-series)
    const datasetTypeInt = datasetType === "cross-sectional" ? 0 : 1;
    
    // Convert modelType to integer (1 for classification, 0 for regression)
    const modelTypeInt = modelType === "classification" ? 1 : 0;
    
    // Map sampling strategy to integer - THIS IS CRITICAL
    let samplingInt = 0; // Default: no sampling
    if (samplingStrategy === "undersampling") samplingInt = 1;
    else if (samplingStrategy === "oversampling") samplingInt = 2;
    else if (samplingStrategy === "smote") samplingInt = 3;
    else samplingInt = 0; // Explicitly set to 0 for "none" or any default case
  
    console.log(`📊 Sending sampling strategy: ${samplingStrategy}`);  
    console.log(`📊 Sending sampling INT: ${samplingInt}`);
  
    // Convert column inputs into arrays
    const dropColumnsArray = columnsToDrop.split(",").map((col) => col.trim()).filter(col => col !== "");
    const untouchedColumnsArray = untouchedColumns.split(",").map((col) => col.trim()).filter(col => col !== "");
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("target_column", targetColumn);
    formData.append("drop_columns", JSON.stringify(dropColumnsArray));
    formData.append("untouched_columns", JSON.stringify(untouchedColumnsArray)); 
    formData.append("dataset_type", datasetTypeInt);
    formData.append("model_type", modelTypeInt);
    formData.append("sampling", samplingInt);  // Send as integer (0, 1, 2, 3)
    formData.append("sampling_strategy", samplingStrategy);  // Send string version for backend logging
  
    // Log the complete form data for debugging
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
    try {
      console.log("Sending request to backend...");
      
      const response = await axios.post(`${BASE_URL}/process`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      const filename = response.data.filename;
      console.log("Backend responded with filename:", filename);
      console.log("Options used:", response.data.options_used);
  
      // Make sure we store the correct sampling strategy string in localStorage
      localStorage.setItem('processingOptions', JSON.stringify({
        ...response.data.options_used,
        sampling: response.data.options_used.sampling || samplingStrategy
      }));
  
      router.push(`/preprocessing/results?file=${filename}`);
    } catch (err) {
      console.error("Processing failed:", err);
      alert(`Something went wrong while processing the file: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className={`bg-customGreen w-full min-h-screen ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto">
        {/* Back button */}
        <div className="pt-6 px-4 sm:px-10 lg:px-20">
          <button
            onClick={() => router.push("/preprocessing")}
            className="flex items-center text-beige hover:text-emerald-300 transition duration-300"
          >
            <GoArrowLeft className="text-3xl" />
          </button>
        </div>

        {/* Header */}
        <section className="pt-8 lg:pt-12 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-block">
          <h1 className="text-beige text-4xl sm:text-4xl lg:text-5xl font-bold">Data Preprocessing</h1>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes rounded-full"></div>
          </div>

          <p className="text-beige mt-8 text-lg opacity-90 max-w-3xl">
            Please answer the following questions to clean and prepare your dataset.
          </p>
        </section>

        <form onSubmit={handleProcessDataset} method="POST" encType="multipart/form-data">

        {/* Upload Dataset section */}

        <section className="mt-12 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-6">
            <CloudUpload className="text-infoBoxes mr-3" size={28} />
            <h2 className="text-beige text-2xl sm:text-3xl font-bold">Dataset Upload</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div
              className="border-dashed border-2 border-blueText/40 rounded-lg p-8 text-center transition-all duration-300 hover:border-blueText"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <CloudUpload size={60} className="mx-auto text-blueText opacity-70" />
                  <p className="text-blueText mt-4 text-lg">Drag and drop your CSV file here or:</p>
                  <label
                    className="mt-6 inline-block bg-blueText text-beige px-6 py-3 rounded-full cursor-pointer shadow-md 
                    hover:bg-gradient-to-r hover:from-blueText hover:to-customGreen
                    hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
                  >
                    Browse Files
                    <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} />
                  </label>
                </>
              ) : (
                <div className="flex items-center justify-between p-4 bg-infoBoxes/20 border border-infoBoxes/40 rounded-lg">
                  <div className="flex items-center">
                    <Database className="text-blueText mr-3" />
                    <p className="text-blueText font-medium">{file.name}</p>
                  </div>
                  <button
                    className="bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 hover:text-red-700 transition-colors duration-300"
                    onClick={handleDelete}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dataset and Model Type Questions */}
        <section className="mt-12 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-6">
            <Settings className="text-infoBoxes mr-3" size={28} />
            <h2 className="text-beige text-2xl sm:text-3xl font-bold">Dataset and Model Type</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label className="block text-blueText font-medium mb-2 group-hover:text-customGreen transition-colors duration-300">
                  Model Type
                </label>
                <div className="relative">
                  <select
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                    className="block w-full text-beige p-3 bg-customGreen border-2 border-infoBoxes/50 rounded-lg focus:outline-none focus:border-infoBoxes focus:ring-1 focus:ring-infoBoxes transition-all duration-300 appearance-none shadow-md"
                  >
                    <option value="">Select Model Type</option>
                    <option value="regression">Regression</option>
                    <option value="classification">Classification</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-infoBoxes flex items-center justify-center">
                      <svg className="w-4 h-4 text-blueText" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <label className="block text-blueText font-medium mb-2 group-hover:text-customGreen transition-colors duration-300">
                  Sampling Technique
                </label>
                <div className="relative">
                  <select
                    value={samplingStrategy}
                    onChange={(e) => setSamplingStrategy(e.target.value)}
                    className="block w-full text-beige p-3 bg-customGreen border-2 border-infoBoxes/50 rounded-lg focus:outline-none focus:border-infoBoxes focus:ring-1 focus:ring-infoBoxes transition-all duration-300 appearance-none shadow-md"
                  >
                    <option value="">Select Sampling</option>
                    <option value="undersampling">Undersampling</option>
                    <option value="oversampling">Oversampling</option>
                    <option value="smote">SMOTE</option>
                    <option value="none">No sampling</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <div className="w-6 h-6 rounded-full bg-infoBoxes flex items-center justify-center">
                      <svg className="w-4 h-4 text-blueText" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dataset Type Question */}
        <section className="mt-12 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-6">
            <FileType className="text-infoBoxes mr-3" size={28} />
            <h2 className="text-beige text-2xl sm:text-3xl font-bold">Dataset Type</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col sm:flex-row sm:space-x-8">
              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer mb-4 sm:mb-0 transition-all duration-300 ${datasetType === "cross-sectional" ? "border-customGreen bg-infoBoxes/20" : "border-blueText/30 hover:border-customGreen hover:bg-infoBoxes/10"}`}
              >
                <input
                  type="radio"
                  name="datasetType"
                  value="cross-sectional"
                  checked={datasetType === "cross-sectional"}
                  onChange={() => setDatasetType("cross-sectional")}
                  className="hidden"
                />
                <div
                  className={`w-6 h-6 mr-3 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${datasetType === "cross-sectional" ? "border-customGreen" : "border-blueText"}`}
                >
                  {datasetType === "cross-sectional" && <div className="w-3 h-3 bg-customGreen rounded-full"></div>}
                </div>
                <span
                  className={`font-medium transition-colors duration-300 ${datasetType === "cross-sectional" ? "text-customGreen" : "text-blueText"}`}
                >
                  Cross-sectional
                </span>
              </label>

              <label
                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${datasetType === "time-series" ? "border-customGreen bg-infoBoxes/20" : "border-blueText/30 hover:border-customGreen hover:bg-infoBoxes/10"}`}
              >
                <input
                  type="radio"
                  name="datasetType"
                  value="time-series"
                  checked={datasetType === "time-series"}
                  onChange={() => setDatasetType("time-series")}
                  className="hidden"
                />
                <div
                  className={`w-6 h-6 mr-3 border-2 rounded-full flex items-center justify-center transition-colors duration-300 ${datasetType === "time-series" ? "border-customGreen" : "border-blueText"}`}
                >
                  {datasetType === "time-series" && <div className="w-3 h-3 bg-customGreen rounded-full"></div>}
                </div>
                <span
                  className={`font-medium transition-colors duration-300 ${datasetType === "time-series" ? "text-customGreen" : "text-blueText"}`}
                >
                  Time Series
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Columns Configuration */}
        <section className="mt-12 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-6">
            <Columns className="text-infoBoxes mr-3" size={28} />
            <h2 className="text-beige text-2xl sm:text-3xl font-bold">Column Configuration</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="space-y-6">
              {/* Target Column */}
              <div className="group">
                <label className="block text-blueText font-medium mb-2 group-hover:text-customGreen transition-colors duration-300">
                  Target Column
                </label>
                <input
                  type="text"
                  value={targetColumn}
                  onChange={(e) => setTargetColumn(e.target.value)}
                  placeholder="Enter target column name"
                  className={`block w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 ${
                    targetColumn
                      ? "bg-customGreen text-beige border-infoBoxes focus:border-infoBoxes focus:ring-infoBoxes placeholder-beige/50"
                      : "text-blueText border-blueText/30 focus:border-customGreen focus:ring-customGreen"
                  }`}
                />
                <p className="mt-1 text-sm text-blueText/70">The column you want to predict</p>
              </div>

              {/* Columns to Drop */}
              <div className="group">
                <label className="block text-blueText font-medium mb-2 group-hover:text-customGreen transition-colors duration-300">
                  Columns to Drop
                </label>
                <input
                  type="text"
                  value={columnsToDrop}
                  onChange={(e) => setColumnsToDrop(e.target.value)}
                  placeholder="Enter column names separated by comma"
                  className={`block w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 ${
                    columnsToDrop
                      ? "bg-customGreen text-beige border-infoBoxes focus:border-infoBoxes focus:ring-infoBoxes placeholder-beige/50"
                      : "text-blueText border-blueText/30 focus:border-customGreen focus:ring-customGreen"
                  }`}
                />
                <p className="mt-1 text-sm text-blueText/70">Columns that should be excluded from the analysis</p>
              </div>

              

              {/* Columns to Not Scale/Encode */}
              <div className="group">
                <label className="block text-blueText font-medium mb-2 group-hover:text-customGreen transition-colors duration-300">
                  Columns to Not Scale/Encode
                </label>
                <input
                  type="text"
                  value={untouchedColumns}
                  onChange={(e) => setUntouchedColumns(e.target.value)}
                  placeholder="Enter column names separated by comma"
                  className={`block w-full p-3 border-2 rounded-lg focus:outline-none focus:ring-1 transition-all duration-300 ${
                    untouchedColumns
                      ? "bg-customGreen text-beige border-infoBoxes focus:border-infoBoxes focus:ring-infoBoxes placeholder-beige/50"
                      : "text-blueText border-blueText/30 focus:border-customGreen focus:ring-customGreen"
                  }`}
                />
                <p className="mt-1 text-sm text-blueText/70">Columns that should be kept in their original form</p>
              </div>
            </div>
          </div>
        </section>

       {/* Process Dataset Button */}
        <section className="mt-12 mb-20 px-4 sm:px-10 lg:px-20 flex justify-center">
          <button
            type="submit"
            className="bg-blueText text-beige text-lg font-semibold px-10 py-4 rounded-full shadow-lg 
            hover:bg-gradient-to-r hover:from-blueText hover:to-customGreen
            hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
          >
            Process Dataset
          </button>
        </section>
        </form>
      </div>
    </div>
  )
}

