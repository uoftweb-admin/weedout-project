"use client"
import { Inria_Serif } from "next/font/google"
import Image from "next/image"
import { useRouter } from "next/navigation"

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function Demo() {
  const router = useRouter()

  return (
    <div className={`bg-customGreen w-full min-h-screen ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto">
        <section className="pt-16 lg:pt-24 px-4 sm:px-10 lg:px-20">
          {/* Header */}
          <div className="relative inline-block">
            <h1 className="text-beige text-4xl sm:text-4xl lg:text-5xl font-bold">WeedOut Demo</h1>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes rounded-full"></div>
          </div>

          {/* About this demo */}
          <div className="bg-customGreen/80 backdrop-blur-sm rounded-2xl mt-12 mx-auto p-6 md:p-8 mb-10 shadow-lg border border-infoBoxes/30 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-infoBoxes text-blueText p-3 rounded-full transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige/90">
                <Image
                  src="/green_book.png"
                  alt="Book icon"
                  width={40}
                  height={40}
                  className="transform hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">About this Demo</h2>
            </div>

            <div className="space-y-4">
              <p className="opacity-90">
                One of the core functionalities of WeedOut is that it simplifies the tedious process of data
                preprocessing for machine learning. This demo allows you to:
              </p>

              <ul className="grid gap-3 pl-6">
                {[
                  "Handle missing values, encoding, and feature scaling with ease.",
                  "Apply sampling techniques (oversampling, SMOTE, undersampling) for imbalanced datasets.",
                  "Choose columns to drop or exclude from preprocessing.",
                  "Upload a CSV file and get a clean, transformed dataset ready for modeling.",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="inline-flex items-center justify-center bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige/90">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mt-20 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-8">
            <Image src="/gears_pic.png" alt="Gears icon" width={32} height={32} className="mr-3 text-infoBoxes" />
            <h2 className="text-beige text-3xl sm:text-4xl font-bold">How it Works</h2>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-customGreen/80 backdrop-blur-sm rounded-2xl mx-auto p-6 md:p-8 mb-10 shadow-lg border border-infoBoxes/30 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
            <div className="space-y-4">
              <p className="opacity-90">
                You will be asked a set of questions about your dataset. These questions will ask you to:
              </p>

              <ol className="grid gap-4 pl-0 mt-4">
                {[
                  "Select your dataset type and model type (Regression or Classification).",
                  "Choose sampling techniques if needed.",
                  "Specify target and columns to exclude/drop.",
                  "Upload your dataset (must be a .csv file) and let WeedOut handle the rest.",
                  "You will then be redirected to a page where you can download your cleaned dataset.",
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 bg-infoBoxes/20 p-4 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes/20 hover:to-beige/10"
                  >
                    <span className="inline-flex items-center justify-center bg-infoBoxes text-blueText rounded-full w-8 h-8 mt-0.5 flex-shrink-0 font-bold transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige/90">
                      {index + 1}
                    </span>
                    <span className="pt-1">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Why this is Useful */}
        <section className="mt-20 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-8">
            <Image src="/useful.png" alt="Lightbulb icon" width={32} height={32} className="mr-3 text-infoBoxes" />
            <h2 className="text-beige text-3xl sm:text-4xl font-bold">Why this is Useful</h2>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-customGreen/80 backdrop-blur-sm rounded-2xl mx-auto p-6 md:p-8 mb-10 shadow-lg border border-infoBoxes/30 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  title: "Save Time",
                  description: "Saves hours of manual preprocessing work",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Better Quality",
                  description: "Ensures cleaner, standardized datasets for ML models",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ),
                },
                {
                  title: "Versatile",
                  description: "Works for both cross-sectional and time-series datasets",
                  icon: (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"
                      />
                    </svg>
                  ),
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-infoBoxes/20 p-5 rounded-xl flex flex-col items-center text-center transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes/20 hover:to-beige/10"
                >
                  <div className="bg-infoBoxes text-blueText p-3 rounded-full mb-4 transition-all duration-300 hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige/90">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="opacity-90">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Button that redirects to Demo page */}
        <section className="mt-20 pb-28 px-4 sm:px-10 lg:px-20">
          <div className="bg-gradient-to-r from-customGreen/90 to-blueText/90 rounded-xl p-8 text-center shadow-lg max-w-[95%] md:max-w-[85%] lg:max-w-[80rem] mx-auto">
            <h2 className="text-beige text-2xl sm:text-3xl font-bold mb-6">Ready to start your demo?</h2>
            <button
              onClick={() => router.push("/preprocessing/demo")}
              className="bg-infoBoxes text-blueText text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
              hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige
              hover:shadow-infoBoxes/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
            >
              Start WeedOut Demo
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

