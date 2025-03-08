import React from "react";
import { Inria_Serif } from '@next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function AboutUsPage() {
  return (
    <div className={`bg-customGreen w-full h-full ${inriaSerif.className}`}>
      <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20">
        {/* Responsive heading */}
        <h1 className="text-beige text-3xl sm:text-4xl lg:text-5xl font-bold">
          About Us
        </h1>

        {/* Responsive beige box */}
        <div className="bg-beige mt-8 mx-auto rounded-lg px-4 py-6 sm:px-6 lg:px-10 lg:py-10 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
          {/* Responsive h3 */}
          <h3 className="text-blueText text-xl sm:text-2xl font-bold">
            What is WeedOut?
          </h3>

          {/* Responsive paragraph */}
          <p className="text-blueText mt-4 text-sm sm:text-base lg:text-lg leading-relaxed">
            Weedout is a Python library that helps you preprocess your data and
            visualize it. It is an open-source library that is easy to use and has
            a wide range of features. Built on top of pandas and matplotlib, WeedOut 
            is a robust and intuitive data pre-processing library designed to optimize 
            and accelerate machine learning workflows. By
            automating critical tasks such as data cleaning, transformation, and
            feature engineering, WeedOut eliminates the bottlenecks of manual
            pre-processing, enabling you to focus on model development and
            deriving actionable insights.
          </p>

          <p className="text-blueText mt-6 text-sm sm:text-base lg:text-lg leading-relaxed">
            Whether working with cross-sectional or time-series data, for
            classification or regression tasks, WeedOut offers a comprehensive
            suite of tools to prepare your data with precision and efficiency.
            Its emphasis on organizing datasets and filtering out irrelevant or
            noisy information ensures your data is clean, structured, and
            reliable. By establishing a solid data foundation, WeedOut enhances
            the accuracy and performance of your machine learning models, driving
            more effective data-driven decisions.
          </p>

          <h3 className=" mt-16 text-blueText text-xl sm:text-2xl font-bold">Current Version Note</h3>
          
          <div className="text-blueText mt-4 text-sm sm:text-base lg:text-lg leading-relaxed">
            <p>
              The current version of WeedOut is designed to handle datasets for two specific 
              types of machine learning models:
            </p>

            <ul className="list-disc pl-6 mt-2">
              <li>Binary Classification</li>
              <li>Regression</li>
            </ul>

            <p className="mt-4">
            As the project is still in its early stages, the sampling in the pre-processing 
            pipeline is limited to these dataset types.
            </p>
          </div>

        </div>
        {/* End of beige div*/}
      </section>

      <h4 className="text-beige mt-11 sm:px-10 lg:px-20 text-2xl sm:text-3xl font-bold lg:pt-20">
  Why WeedOut?
</h4>



      <section>
        <div className=" mx-auto rounded-lg py-6 lg:py-10 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-9">
            {/* Box 1 */}
            <div className="bg-beige p-6 rounded-lg shadow-md hover:shadow-lg hover:ring-8 hover:ring-infoBoxes transition duration-300 hover:scale-110">
              <div className="text-blueText text-2xl font-bold mb-2">
                Effortless data cleaning
              </div>
              <p className="text-blueText">
                Automate the process of cleaning and organizing your data with ease.
              </p>
            </div>
            {/* Box 2 */}
            <div className="bg-infoBoxes p-6 rounded-lg shadow-md hover:shadow-lg hover:ring-8 hover:ring-beige transition duration-300 hover:scale-110">
              <div className="text-blueText text-2xl font-bold mb-2">
                Smart feature engineering
              </div>
              <p className="text-blueText">
                Intelligently create and select the most relevant features for your models.
              </p>
            </div>
            {/* Box 3 */}
            <div className="bg-beige p-6 rounded-lg shadow-md hover:shadow-lg hover:ring-8 hover:ring-infoBoxes transition duration-300 hover:scale-110">
              <div className="text-blueText text-2xl font-bold mb-2">
                Seamless Integration with ML libraries
              </div>
              <p className="text-blueText">
                Intelligently create and select the most relevant features for your models.
              </p>
            </div>
            {/* Box 4 */}
            <div className="bg-infoBoxes p-6 rounded-lg shadow-md hover:shadow-lg hover:ring-8 hover:ring-beige transition duration-300 hover:scale-110">
              <div className="text-blueText text-2xl font-bold mb-2">
                Specialized time series tools
              </div>
              <p className="text-blueText">
                Automate the process of cleaning and organizing your data with ease.
              </p>
            </div>
            {/* Box 5 */}
            <div className="bg-beige p-6 rounded-lg shadow-md hover:shadow-lg hover:ring-8 hover:ring-infoBoxes transition duration-300 hover:scale-110">
              <div className="text-blueText text-2xl font-bold mb-2">
                Automated sampling techniques
              </div>
              <p className="text-blueText">
                Implement various sampling methods to balance and optimize your datasets.
              </p>
            </div>
          </div>
       
       
        </div>


      </section>

      <h4 className="text-beige mt-3 sm:px-10 lg:px-20 text-2xl sm:text-3xl font-bold lg:pt-20">
        Our Values
      </h4>

      {/* Our Values */}
      <section className="pb-28">
        <div className="bg-beige mt-8 mx-auto rounded-lg px-4 py-6 sm:px-6 lg:px-10 lg:py-10 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem] h-auto">
          {/* Grid Container for Dark Blue Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Box 1 */}
            <div className="bg-blueText p-6 rounded-lg shadow-md hover:shadow-xl hover:ring-4 hover:ring-blue-400 transition duration-300 hover:scale-105 flex items-center justify-center text-center h-full min-h-[50vh]">
              <div>
                <h3 className="text-beige text-xl font-bold mb-2">
                  Innovation and Simplicity
                </h3>
                <p className="text-beige text-sm">
                  We strive to create innovative solutions that simplify complex data pre-processing tasks. WeedOut is designed to be intuitive and efficient, empowering users to focus on what matters most—developing impactful machine learning models.
                </p>
              </div>
            </div>

            {/* Box 2 */}
            <div className="bg-blueText p-6 rounded-lg shadow-md hover:shadow-xl hover:ring-4 hover:ring-blue-400 transition duration-300 hover:scale-105 flex items-center justify-center text-center h-full min-h-[50vh]">
              <div>
                <h3 className="text-beige text-xl font-bold mb-2">
                  Community and Collaboration
                </h3>
                <p className="text-beige text-sm">
                  WeedOut thrives on community engagement. We believe in the power of collaboration and welcome contributions from developers, data scientists, and enthusiasts alike. Together, we can build tools that drive the future of data science.
                </p>
              </div>
            </div>

            {/* Box 3 */}
            <div className="bg-blueText p-6 rounded-lg shadow-md hover:shadow-xl hover:ring-4 hover:ring-blue-400 transition duration-300 hover:scale-105 flex items-center justify-center text-center h-full min-h-[50vh]">
              <div>
                <h3 className="text-beige text-xl font-bold mb-2">
                  Transparency and Quality
                </h3>
                <p className="text-beige text-sm">
                  We are committed to maintaining and delivering high-quality, reliable tools. From clean code to comprehensive documentation, we prioritize accuracy and performance to support data-driven decision making.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>



    </div>
  );
}
