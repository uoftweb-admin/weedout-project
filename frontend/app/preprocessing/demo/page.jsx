"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";

export default function page() {

    const router = useRouter();

  return (
    <div>
        <h1>Demo Page</h1>
        <button
            onClick={() => router.push("/preprocessing")}
            className="flex items-center text-blueText hover:text-infoBoxes transition duration-300 ease-in-out"
            >
            <GoArrowLeft className="text-4xl scale-x-125 inherit" />
        </button>

        {/* Temporary button to go to results page*/}
        <button 
            onClick={() => router.push("/preprocessing/results")} 
            className="bg-blueText text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md 
            hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText
            transition duration-300 ease-in-out">
                Results page (temporary button)
          </button>
    </div>
  )
}


