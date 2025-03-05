import React from "react";
import Link from "next/link"
import {BLUE, GREEN, WHITE} from "../colors.js"
import { Inria_Serif } from '@next/font/google';
import InstallTabs from "./install-tabs.jsx";
import CodeBlock from "../CodeBlock.js";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function QuickStartPage() {

    return (
        <div className={`${inriaSerif.className}`}>

          <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

            <p className="text-sm sm:text-base lg:text-lg leading-relaxed">
              Welcome to the beginner's guide to WeedOut!
            </p>

            <p className={`mt-4`}>
              Weedout is a Python library that helps you preprocess your data and
              visualize it. It is an open-source library that is easy to use and has
              a wide range of features. It is built on top of pandas and matplotlib.
            </p>
          </section>

          <section className="lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold">
              How to install WeedOut
            </p>

            <p className=" pt-11">
              You can install WeedOut directly from PyPi, or locally from the source. Choose the method that best suits your needs. 
            </p>

            <InstallTabs />


          </section>

          <section className="lg:pt-20 px-4 sm:px-10 lg:px-20 border-4">

            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-8">
              How to import WeedOut
            </p>

            <p className=" pt-11">
              After installing WeedOut, it may be imported into Python code as shown below:
            </p>

            

          </section>
            
            {/* some prev info for you :) */}
            {/*   const contentMap = {
    // Example top-level guide entry:
    "10-minutes-to-weedout-content": (
      <div className={`${inriaSerif.className}`}>
        <h2 className={`text-2xl font-bold mb-4`}>10 minutes to weedout</h2>
        <p className={`mt-4`}>
          Weedout is a Python library that helps you preprocess your data and
          visualize it. It is an open-source library that is easy to use and has
          a wide range of features. It is built on top of pandas and matplotlib.
        </p>
        <p className="mt-4">
          In this guide, we will show you how to quickly get started with
          Weedout to preprocess your data and visualize it. We will cover:
        </p>
        <ul className="list-disc pl-6 mt-4">
          <li>Preprocessing data using Weedout</li>
          <li>Visualizing data using Weedout</li>
        </ul>
      </div>
    ), */}
        </div>
    )

}