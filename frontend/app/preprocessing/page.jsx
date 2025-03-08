"use client"
import React from 'react'
import { Inria_Serif } from '@next/font/google';
import Image from "next/image";
import { useRouter } from "next/navigation";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Demo() {

  const router = useRouter();

  return (
    <div className={`${inriaSerif.className}`}>
      {/* About this demo */}
      <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

        <div className="flex items-center gap-2">

          <Image 
          src="/green_book.png"
          alt="Image of a Book"
          width={75}
          height={50}
        />

          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">About this Demo</h3>
        </div>

        <p className="pt-5 pl-20">
          One of the core functionalities of WeedOut is that it simplifies the tedious process 
          of data preprocessing for machine learning. <br />This demo allows you to:
        </p>


        <ul className="list-disc pl-24 pt-3">
          <li>Handle missing values, encoding, and feature scaling with ease.</li>
          <li>Apply sampling techniques (oversampling, SMOTE, undersampling) for imbalanced datasets.</li>
          <li>Choose columns to drop or exclude from preprocessing.</li>
          <li>Upload a CSV file and get a clean, transformed dataset ready for modeling.</li>
        </ul>

      </section>

      {/* How it works */}
      <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

        <div className="flex items-center gap-3">
        <Image 
          src="/gears_pic.png"
          alt="Image of a Book"
          width={65}
          height={40}
        />
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">How it Works</h3>
        </div>

        <ul className="list-decimal pl-24 pt-3">
          <li>Select your dataset type and model type (Regression or Classification).</li>
          <li>Choose sampling techniques if needed.</li>
          <li>Specify target and columns to exclude/drop.</li>
          <li>Upload your dataset (must be a .csv file) and let WeedOut handle the rest.</li>
          <li>You will then be redirected to a page where you can download your cleaned dataset.</li>
        </ul>


      </section>

      {/* Why this is Useful */}
      <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

      <div className="flex items-center gap-2">

        <Image 
        src="/useful.png"
        alt="Image of a Book"
        width={75}
        height={50}
        />

        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Why this is Useful</h3>
      </div>

      <ul className="list-disc pl-24 pt-3">
          <li>Saves hours of manual preprocessing.</li>
          <li>Ensures cleaner, standardized datasets for ML models.</li>
          <li>Works for both cross-sectional and time-series datasets.</li>
      </ul>

      </section>

      {/* Ready to start? */}
      <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">
        <p className="text-1xl sm:text-1xl lg:text-2xl font-bold">
          Ready to start your demo? Click the button below!
        </p>


        <div className="pt-3">
          <button 
            onClick={() => router.push("/preprocessing/demo")} 
            className="bg-blueText text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md 
            hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText
            transition duration-300 ease-in-out">
                WeedOut Demo
          </button>
        </div>

      </section>



    </div>
  )
}
