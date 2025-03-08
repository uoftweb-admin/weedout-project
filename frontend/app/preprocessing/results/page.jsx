"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";
import { Inria_Serif } from '@next/font/google';
import Image from "next/image";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function page() {
  const router = useRouter();

  // Sample data based on Binary_Classification_Dataset.csv
  const stats = {
    originalRows: 1000,
    cleanedRows: 982,
    nullsFilled: 18,
    duplicatesRemoved: 0
  };
  
  const columns = [
    { name: 'Age', type: 'int', nulls: 0 },
    { name: 'Income', type: 'int', nulls: 8 },
    { name: 'Num_Transactions', type: 'int', nulls: 0 },
    { name: 'Spending_Score', type: 'float', nulls: 10 },
    { name: 'Target', type: 'int', nulls: 0 },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-b from-[#007057] to-emerald-900 ${inriaSerif.className}`}>
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
              <h1 className="text-4xl font-bold text-beige">
                Processing Results
              </h1>
            </div>
            <button 
              className="px-6 py-2.5 bg-beige text-emerald-900 rounded-lg font-medium
              hover:bg-emerald-50 transition-all duration-200"
            >
              Download CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Original Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.originalRows}</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Cleaned Rows</h3>
              <p className="text-beige text-3xl font-bold">{stats.cleanedRows}</p>
              <p className="text-beige/60 text-sm">({Math.round((stats.cleanedRows/stats.originalRows) * 100)}% of original)</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Nulls Filled</h3>
              <p className="text-beige text-3xl font-bold">{stats.nullsFilled}</p>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-emerald-300 font-medium mb-1">Duplicates Removed</h3>
              <p className="text-beige text-3xl font-bold">{stats.duplicatesRemoved}</p>
            </div>
          </div>
          
          {/* Data Preview */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl mb-8 p-6">
            <h2 className="text-xl font-bold text-beige mb-4">Data Preview</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-emerald-500/30">
                    {columns.map(col => (
                      <th key={col.name} className="text-left py-3 px-4 text-beige font-medium">{col.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Just show 3 sample rows */}
                  {/* Sample data rows based on Binary_Classification_Dataset */}
                  <tr className="border-b border-emerald-500/10 bg-emerald-900/10">
                    <td className="py-2 px-4 text-beige">56</td>
                    <td className="py-2 px-4 text-beige/80">54674</td>
                    <td className="py-2 px-4 text-beige/80">44</td>
                    <td className="py-2 px-4 text-beige/80">33.42</td>
                    <td className="py-2 px-4 text-beige/80">0</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10">
                    <td className="py-2 px-4 text-beige">69</td>
                    <td className="py-2 px-4 text-beige/80">55854</td>
                    <td className="py-2 px-4 text-beige/80">49</td>
                    <td className="py-2 px-4 text-beige/80">78.49</td>
                    <td className="py-2 px-4 text-beige/80">0</td>
                  </tr>
                  <tr className="border-b border-emerald-500/10 bg-emerald-900/10">
                    <td className="py-2 px-4 text-beige">46</td>
                    <td className="py-2 px-4 text-beige/80">66271</td>
                    <td className="py-2 px-4 text-beige/80">75</td>
                    <td className="py-2 px-4 text-beige/80">70.77</td>
                    <td className="py-2 px-4 text-beige/80">1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <p className="text-beige/60">Showing 3 of {stats.cleanedRows} rows</p>
            </div>
          </div>
          
          {/* Column Info */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl mb-8 p-6">
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
                    {columns.map((col, index) => (
                      <tr 
                        key={col.name}
                        className={`border-b border-emerald-500/10 ${index % 2 === 0 ? 'bg-emerald-900/10' : ''}`}
                      >
                        <td className="py-2 px-3 text-beige">{col.name}</td>
                        <td className="py-2 px-3 text-beige/80">{col.type}</td>
                        <td className="py-2 px-3 text-beige/80">{col.nulls}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-black/30 rounded-lg p-4 flex flex-col justify-center items-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full"></div>
                  <Image
                    src="/dull_logo_bria.png"
                    alt="Data Visualization Placeholder"
                    width={200}
                    height={200}
                    className="relative opacity-60"
                  />
                </div>
                <p className="text-beige/80 mt-2 text-center">
                  Data visualization coming soon
                </p>
              </div>
            </div>
          </div>
          
          {/* Export Section */}
          <div className="bg-emerald-700/20 border border-emerald-500/30 rounded-xl p-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <p className="text-beige mb-4 md:mb-0">
                Ready to use your cleaned data?
              </p>
              <div className="flex space-x-4">
                <button className="px-6 py-2.5 bg-beige text-emerald-900 rounded-lg font-medium
                  hover:bg-emerald-50 transition-all duration-200">
                  Export Data
                </button>
                <a
                  href="https://github.com/rohannair2022/weedout"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 bg-emerald-700/30 text-beige border border-emerald-500/30
                  rounded-lg font-medium hover:bg-emerald-700/40 transition-all duration-200"
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