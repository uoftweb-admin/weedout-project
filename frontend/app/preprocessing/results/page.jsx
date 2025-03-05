"use client"
import React from 'react'
import { useRouter } from "next/navigation";
import { GoArrowLeft } from "react-icons/go";

export default function page() {

const router = useRouter();

  return (
    <div>
      <h1>Results page, here we will display a button that the user can click to automatically donwload their 
        cleaned dataset. We will also display some analytics about the data here. Consider the data displayed by Tableau and 
        other data analysis software to get an idea of what we can show.
        </h1>

        <button
            onClick={() => router.push("/preprocessing/demo")}
            className="flex items-center text-blueText hover:text-infoBoxes transition duration-300 ease-in-out"
            >
            <GoArrowLeft className="text-4xl scale-x-125 inherit" />
        </button>
    </div>
  )
}
