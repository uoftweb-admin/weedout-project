"use client"
import React, { useState, useEffect } from 'react'
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
  const [selectedColumn, setSelectedColumn] = useState('Age');

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

  // Sample distribution data for each column (before cleaning)
  const beforeData = {
    'Age': [
      { range: '20-30', count: 150 },
      { range: '31-40', count: 220 },
      { range: '41-50', count: 280 },
      { range: '51-60', count: 230 },
      { range: '61-70', count: 120 },
    ],
    'Income': [
      { range: '20k-40k', count: 180 },
      { range: '41k-60k', count: 350 },
      { range: '61k-80k', count: 290 },
      { range: '81k-100k', count: 130 },
      { range: '100k+', count: 50 },
    ],
    'Num_Transactions': [
      { range: '0-20', count: 100 },
      { range: '21-40', count: 250 },
      { range: '41-60', count: 320 },
      { range: '61-80', count: 230 },
      { range: '80+', count: 100 },
    ],
    'Spending_Score': [
      { range: '0-20', count: 120 },
      { range: '21-40', count: 230 },
      { range: '41-60', count: 280 },
      { range: '61-80', count: 250 },
      { range: '81-100', count: 120 },
    ],
  };

  // Sample distribution data for each column (after cleaning)
  const afterData = {
    'Age': [
      { range: '20-30', count: 147 },
      { range: '31-40', count: 216 },
      { range: '41-50', count: 276 },
      { range: '51-60', count: 225 },
      { range: '61-70', count: 118 },
    ],
    'Income': [
      { range: '20k-40k', count: 177 },
      { range: '41k-60k', count: 345 },
      { range: '61k-80k', count: 283 },
      { range: '81k-100k', count: 128 },
      { range: '100k+', count: 49 },
    ],
    'Num_Transactions': [
      { range: '0-20', count: 98 },
      { range: '21-40', count: 246 },
      { range: '41-60', count: 314 },
      { range: '61-80', count: 226 },
      { range: '80+', count: 98 },
    ],
    'Spending_Score': [
      { range: '0-20', count: 118 },
      { range: '21-40', count: 225 },
      { range: '41-60', count: 275 },
      { range: '61-80', count: 246 },
      { range: '81-100', count: 118 },
    ],
  };

  // Helper function to get the highest count for scaling
  const getMaxCount = (column) => {
    const beforeMax = Math.max(...beforeData[column].map(item => item.count));
    const afterMax = Math.max(...afterData[column].map(item => item.count));
    return Math.max(beforeMax, afterMax);
  };

  // Helper function to render simple bar chart
  const renderBarChart = (data, color) => {
    const maxCount = getMaxCount(selectedColumn);
    
    return (
      <div className="flex flex-col h-64">
        <div className="flex h-full">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col justify-end items-center flex-1">
              <div 
                className="w-5/6 rounded-t-sm transition-all duration-500 ease-in-out"
                style={{ 
                  height: `${(item.count / maxCount) * 100}%`,
                  backgroundColor: color
                }}
              ></div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          {data.map((item, index) => (
            <div key={index} className="flex-1 text-center">
              <div className="text-xs text-beige/80 whitespace-nowrap overflow-hidden text-ellipsis px-1">
                {item.range}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

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
          
          {/* Data Distribution Visualization */}
          <div className="bg-black/20 backdrop-blur-sm rounded-xl mb-8 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-beige">Data Distribution</h2>
              
              {/* Column Selection Dropdown */}
              <div className="relative">
                <select 
                  value={selectedColumn} 
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="bg-emerald-800 text-beige border border-emerald-600 rounded-lg py-2 px-4 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-300"
                >
                  {Object.keys(beforeData).map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-beige">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Distribution Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">Before Cleaning</h3>
                {renderBarChart(beforeData[selectedColumn], '#007057')}
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-beige/60">Min</div>
                  <div className="text-xs text-beige/60">Max</div>
                </div>
              </div>
              
              <div className="bg-black/30 rounded-lg p-4">
                <h3 className="text-center text-beige mb-4">After Cleaning</h3>
                {renderBarChart(afterData[selectedColumn], '#f3dab1')}
                <div className="flex justify-between mt-2">
                  <div className="text-xs text-beige/60">Min</div>
                  <div className="text-xs text-beige/60">Max</div>
                </div>
              </div>
            </div>
            
            {/* Overlapping Distribution Graph */}
            <div className="bg-black/30 rounded-lg p-4">
              <h3 className="text-center text-beige mb-4">Before vs After Comparison</h3>
              <div className="flex justify-center mb-4">
                <div className="flex items-center mr-6">
                  <div className="w-3 h-3 rounded-full bg-[#007057] mr-2"></div>
                  <span className="text-beige text-sm">Before</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-[#f3dab1] mr-2"></div>
                  <span className="text-beige text-sm">After</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {beforeData[selectedColumn].map((item, index) => {
                  const beforeCount = item.count;
                  const afterCount = afterData[selectedColumn][index].count;
                  const maxCount = getMaxCount(selectedColumn);
                  const beforeHeight = (beforeCount / maxCount) * 100;
                  const afterHeight = (afterCount / maxCount) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col">
                      <div className="h-40 flex flex-col-reverse relative">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-[#007057]/80 opacity-80 transition-all duration-300"
                          style={{ height: `${beforeHeight}%` }}
                        ></div>
                        <div 
                          className="absolute bottom-0 right-0 w-1/2 bg-[#f3dab1] transition-all duration-300"
                          style={{ height: `${afterHeight}%` }}
                        ></div>
                      </div>
                      <div className="text-center mt-2">
                        <div className="text-xs text-beige/80 truncate px-1">{item.range}</div>
                        <div className="text-xs text-beige/60 mt-1">
                          {beforeCount} → {afterCount}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              <div className="bg-black/30 rounded-lg p-4">
                <div className="flex flex-col h-full justify-center">
                  <h3 className="text-lg font-bold text-beige mb-3">Data Summary</h3>
                  <ul className="space-y-2 text-beige/80">
                    <li><span className="text-emerald-300">Total Features:</span> 4</li>
                    <li><span className="text-emerald-300">Target Column:</span> Target (Binary)</li>
                    <li><span className="text-emerald-300">Numeric Columns:</span> 4 (100%)</li>
                    <li><span className="text-emerald-300">Categorical Columns:</span> 0 (0%)</li>
                    <li><span className="text-emerald-300">Columns with Missing Values:</span> 2</li>
                  </ul>
                </div>
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