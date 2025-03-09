"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { Inria_Serif } from '@next/font/google';
import { useState } from "react";
import { CloudUpload, Trash2 } from "lucide-react";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function page() {

    const router = useRouter();

    const [file, setFile] = useState(null);

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

  return (
    <div className={`${inriaSerif.className}`}>

      {/* Back Arrow to return to Demo Description Page */}
        <button
            onClick={() => router.push("/preprocessing")}
            className="flex items-center text-blueText hover:text-infoBoxes transition duration-300 ease-in-out"
            >
            <GoArrowLeft className="text-4xl scale-x-125 inherit" />
        </button>

      {/* Title section */}
        <section className="border-4 lg:pt-6 px-4 sm:px-10 lg:px-20">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-infoBoxes">Data-Preprocessing Configuration</h3>
          <h4 className="text-sm sm:text-base lg:text-lg text-center pt-6 text-beige">
            Please answer the following questions to clean and prepare your dataset.
          </h4>
        </section>

      {/* Upload Dataset section */}
      <section className="border-4 lg:pt-6 px-4 sm:px-10 lg:px-20">
          <div className="w-full max-w-4xl mx-auto p-4 bg-beige shadow-md border border-blueText ">
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
                <label className="mt-4 inline-block bg-blueText text-beige px-4 py-2 rounded-md cursor-pointer shadow-md 
                  hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText
                  transition duration-300 ease-in-out">
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
          <select className="mt-1 block w-full text-customGreen p-2 border border-blueText rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-customGreen">
            <option>Select Model Type</option>
            <option>Regression</option>
            <option>Classification</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-blueText">
            Sampling Technique
          </label>
          <select className="mt-1 text-customGreen block w-full p-2 border border-blueText rounded-md bg-white focus:outline-none focus:ring-blue-500 focus:border-customGreen">
            <option>Select Sampling</option>
            <option>Undersampling</option>
            <option>Oversampling</option>
            <option>Smote</option>
            <option>No sampling</option>
          </select>
        </div>
      </div>

        </div>

      </section>

      {/* Dataset Type Question */}
      <section  className="border-4 lg:pt-14 sm:pt-14 px-4 sm:px-10 lg:px-20">
      
        <div className="w-full max-w-4xl mx-auto p-4 bg-beige shadow-md border border-blueText">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Dataset Type
          </h2>

          <div className="flex space-x-6 items-center">
            <label className="flex items-center text-blueText">
              <input type="radio" name="datasetType" value="cross-sectional" className="mr-2" />
              Cross-sectional
            </label>
            <label className="flex items-center text-blueText">
              <input type="radio" name="datasetType" value="time-series" className="mr-2" />
              Time Series
            </label>
          </div>

        </div>

      </section>

      {/* Columns Configuration */}
      <section className="border-4 lg:pt-14 sm:pt-14 px-4 sm:px-10 lg:px-20">
        <div className="w-full max-w-4xl mx-auto p-6 bg-beige shadow-md border border-blueText mb-14">
          <h2 className="text-blueText font-bold text-1xl sm:text-1xl lg:text-2xl mb-4">
            Column Configuration
          </h2>
          <div className="space-y-4">
            {/* Target Column */}
            <div>
              <label className="block text-sm font-medium text-blueText">
                Target Column
              </label>
              <input
                type="text"
                placeholder="Enter target column name"
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Columns to Drop */}
            <div>
              <label className="block text-sm font-medium text-blueText">
                Columns to Drop
              </label>
              <input
                type="text"
                placeholder="Enter column names separated by comma"
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* ID Columns */}
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

            {/* Columns to Not Scale/Encode */}
            <div>
              <label className="block text-sm font-medium text-blueText">
                Columns to Not Scale/Encode
              </label>
              <input
                type="text"
                placeholder="Enter column names separated by comma"
                className="mt-1 block w-full p-2 border border-blueText rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>

        
    </div>
  )
}


