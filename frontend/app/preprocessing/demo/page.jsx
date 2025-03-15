"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { Inria_Serif } from "@next/font/google";
import { CloudUpload, Trash2 } from "lucide-react";

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Page() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [modelType, setModelType] = useState("0");
  const [samplingTechnique, setSamplingTechnique] = useState("no sampling");
  const [dataType, setDataType] = useState("0");
  const [samplingResponse, setSamplingResponse] = useState("0");
  const [targetName, setTargetName] = useState("");
  const [droppedColumn, setDroppedColumn] = useState("");
  const [untouchedColumn, setUntouchedColumn] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDelete = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }
    const formData = new FormData();
    formData.append("csv_file", file);
    formData.append("data_type", dataType);
    formData.append("model_type", modelType);
    formData.append("sampling_response", samplingResponse);
    formData.append("strategy_sample", samplingTechnique);
    formData.append("target_name", targetName);
    formData.append("dropped_column", droppedColumn);
    formData.append("untouched_column", untouchedColumn);

    const res = await fetch("http://localhost:5000/api/preprocess", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (res.ok) {
      router.push("/preprocessing/results");
    } else {
      const error = await res.json();
      alert("Error: " + error.error);
    }
  };

  return (
    <div className={`${inriaSerif.className}`}>
      {/* Back Arrow */}
      <button
        onClick={() => router.push("/preprocessing")}
        className="flex items-center text-blueText hover:text-infoBoxes transition duration-300 ease-in-out p-4"
      >
        <GoArrowLeft className="text-4xl scale-x-125" />
      </button>

      {/* Title section */}
      <section className="border-4 lg:pt-6 px-4 sm:px-10 lg:px-20">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-infoBoxes">
          Data-Preprocessing Configuration
        </h3>
        <h4 className="text-sm sm:text-base lg:text-lg text-center pt-6 text-beige">
          Please answer the following questions to clean and prepare your
          dataset.
        </h4>
      </section>

      {/* Upload Dataset section */}
      <section className="border-4 lg:pt-6 px-4 sm:px-10 lg:px-20 my-6">
        <div className="w-full max-w-4xl mx-auto p-4 bg-beige shadow-md border border-blueText">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Dataset Upload
          </h2>
          <div
            className="border-dashed border-2 border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            {!file ? (
              <>
                <CloudUpload size={40} className="mx-auto text-[#1a365d]" />
                <p className="text-blueText mt-2">
                  Drag and drop your CSV file here or
                </p>
                <label className="mt-4 inline-block bg-blueText text-beige px-4 py-2 rounded-md cursor-pointer shadow-md hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText transition duration-300 ease-in-out">
                  Browse Files
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-100 border border-gray-300 rounded-md">
                <p className="text-blueText">{file.name}</p>
                <button
                  className="text-red-500 hover:text-red-700"
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
      <section className="border-4 lg:pt-14 sm:pt-14 px-4 sm:px-10 lg:px-20">
        <div className="w-full max-w-4xl mx-auto p-4 bg-beige shadow-md border border-blueText">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Dataset and Model Type
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-blueText">
                Model Type
              </label>
              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
                className="mt-1 block w-full text-customGreen p-2 border border-blueText rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-customGreen"
              >
                <option value="0">Regression</option>
                <option value="1">Classification</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-blueText">
                Sampling Technique
              </label>
              <select
                value={samplingTechnique}
                onChange={(e) => setSamplingTechnique(e.target.value)}
                className="mt-1 block w-full text-customGreen p-2 border border-blueText rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-customGreen"
              >
                <option value="no sampling">No Sampling</option>
                <option value="undersampling">Undersampling</option>
                <option value="oversampling">Oversampling</option>
                <option value="smote">Smote</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset Type Question */}
      <section className="border-4 lg:pt-14 sm:pt-14 px-4 sm:px-10 lg:px-20">
        <div className="w-full max-w-4xl mx-auto p-4 bg-beige shadow-md border border-blueText">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Dataset Type
          </h2>
          <div className="flex space-x-6 items-center">
            <label className="flex items-center text-blueText">
              <input
                type="radio"
                name="datasetType"
                value="0"
                checked={dataType === "0"}
                onChange={() => setDataType("0")}
                className="mr-2"
              />
              Cross-sectional
            </label>
            <label className="flex items-center text-blueText">
              <input
                type="radio"
                name="datasetType"
                value="1"
                checked={dataType === "1"}
                onChange={() => setDataType("1")}
                className="mr-2"
              />
              Time Series
            </label>
          </div>
        </div>
      </section>

      {/* Columns Configuration */}
      <section className="border-4 lg:pt-14 sm:pt-14 px-4 sm:px-10 lg:px-20">
        <div className="w-full max-w-4xl mx-auto p-6 bg-beige shadow-md border border-blueText mb-8">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Column Configuration
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blueText">
                Target Column
              </label>
              <input
                type="text"
                placeholder="Enter target column name"
                value={targetName}
                onChange={(e) => setTargetName(e.target.value)}
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blueText">
                Columns to Drop
              </label>
              <input
                type="text"
                placeholder="Enter column names separated by comma"
                value={droppedColumn}
                onChange={(e) => setDroppedColumn(e.target.value)}
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blueText">
                ID Columns
              </label>
              <input
                type="text"
                placeholder="Enter ID column names"
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blueText">
                Columns to Not Scale/Encode
              </label>
              <input
                type="text"
                placeholder="Enter column names separated by comma"
                value={untouchedColumn}
                onChange={(e) => setUntouchedColumn(e.target.value)}
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Dataset Button */}
      <section className="flex justify-center items-center border-4 mb-10">
        <button
          onClick={handleSubmit}
          className="bg-blueText text-beige text-lg font-semibold px-8 py-3 rounded-md shadow-md hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText transition duration-300 ease-in-out"
        >
          Process Dataset
        </button>
      </section>
    </div>
  );
}
