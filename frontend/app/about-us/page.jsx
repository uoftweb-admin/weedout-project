"use client"
import { Inria_Serif } from "next/font/google"
import { useRouter } from "next/navigation"
import { Code, Database, Clock, Users, BarChart3, Zap, Layers, GitMerge, Shield } from "lucide-react"

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export default function AboutUsPage() {

  const router = useRouter()

  return (
    <div className={`bg-customGreen w-full min-h-screen ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto">
        <section className="pt-16 lg:pt-24 px-4 sm:px-10 lg:px-20">
          {/* Header with decorative element */}
          <div className="relative inline-block">
            <h1 className="text-beige text-4xl sm:text-4xl lg:text-5xl font-bold">About Us</h1>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes rounded-full"></div>
          </div>

          {/* What is WeedOut? section */}
          <div className="bg-beige mt-12 mx-auto rounded-xl px-6 py-8 sm:px-8 lg:px-12 lg:py-12 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem] shadow-lg transform transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center mb-4">
              <Code className="text-customGreen mr-3" size={28} />
              <h2 className="text-blueText text-2xl sm:text-3xl font-bold">What is WeedOut?</h2>
            </div>

            <div className="space-y-6">
              <p className="text-blueText text-sm sm:text-base lg:text-lg leading-relaxed">
                Weedout is a Python library that helps you preprocess your data and visualize it. It is an open-source
                library that is easy to use and has a wide range of features. Built on top of pandas and matplotlib,
                WeedOut is a robust and intuitive data pre-processing library designed to optimize and accelerate
                machine learning workflows. By automating critical tasks such as data cleaning, transformation, and
                feature engineering, WeedOut eliminates the bottlenecks of manual pre-processing, enabling you to focus
                on model development and deriving actionable insights.
              </p>

              <p className="text-blueText text-sm sm:text-base lg:text-lg leading-relaxed">
                Whether working with cross-sectional or time-series data, for classification or regression tasks,
                WeedOut offers a comprehensive suite of tools to prepare your data with precision and efficiency. Its
                emphasis on organizing datasets and filtering out irrelevant or noisy information ensures your data is
                clean, structured, and reliable. By establishing a solid data foundation, WeedOut enhances the accuracy
                and performance of your machine learning models, driving more effective data-driven decisions.
              </p>
            </div>

            {/* Current Version Note */}
            <div className="mt-16">
              <div className="flex items-center mb-4">
                <Database className="text-customGreen mr-3" size={28} />
                <h2 className="text-blueText text-2xl sm:text-3xl font-bold">Current Version Note</h2>
              </div>

              <div className="text-blueText text-sm sm:text-base lg:text-lg leading-relaxed">
                <p>
                  The current version of WeedOut is designed to handle datasets for two specific types of machine
                  learning models:
                </p>

                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center bg-infoBoxes text-blueText rounded-full w-6 h-6 mr-3 flex-shrink-0">
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
                    Binary Classification
                  </li>
                  <li className="flex items-center">
                    <span className="inline-flex items-center justify-center bg-infoBoxes text-blueText rounded-full w-6 h-6 mr-3 flex-shrink-0">
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
                    Regression
                  </li>
                </ul>

                <div className="mt-6 p-4 bg-infoBoxes/20 border-l-4 border-infoBoxes rounded-r-lg">
                  <p className="italic">
                    As the project is still in its early stages, the sampling in the pre-processing pipeline is limited
                    to these dataset types.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why WeedOut? section */}
        <section className="mt-20 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-8">
            <Zap className="text-infoBoxes mr-3" size={32} />
            <h2 className="text-beige text-3xl sm:text-4xl font-bold">Why WeedOut?</h2>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="mx-auto rounded-lg py-6 lg:py-10 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group bg-beige p-6 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-customGreen transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="flex items-start mb-4">
                  <div className="bg-infoBoxes/20 p-3 rounded-full mr-4 group-hover:bg-gradient-to-r group-hover:from-infoBoxes/30 group-hover:to-customGreen/20 transition-all duration-300">
                    <BarChart3 className="text-customGreen" size={24} />
                  </div>
                  <div className="text-blueText text-2xl font-bold">Effortless data cleaning</div>
                </div>
                <p className="text-blueText pl-14">
                  Automate the process of cleaning and organizing your data with ease.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-infoBoxes p-6 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-customGreen to-beige transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="flex items-start mb-4">
                  <div className="bg-customGreen/20 p-3 rounded-full mr-4 group-hover:bg-gradient-to-r group-hover:from-customGreen/30 group-hover:to-beige/20 transition-all duration-300">
                    <Layers className="text-blueText" size={24} />
                  </div>
                  <div className="text-blueText text-2xl font-bold">Smart feature engineering</div>
                </div>
                <p className="text-blueText pl-14">
                  Intelligently create and select the most relevant features for your models.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-beige p-6 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-customGreen transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="flex items-start mb-4">
                  <div className="bg-infoBoxes/20 p-3 rounded-full mr-4 group-hover:bg-gradient-to-r group-hover:from-infoBoxes/30 group-hover:to-customGreen/20 transition-all duration-300">
                    <GitMerge className="text-customGreen" size={24} />
                  </div>
                  <div className="text-blueText text-2xl font-bold">Seamless Integration with ML libraries</div>
                </div>
                <p className="text-blueText pl-14">
                  Intelligently create and select the most relevant features for your models.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-infoBoxes p-6 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-customGreen to-beige transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="flex items-start mb-4">
                  <div className="bg-customGreen/20 p-3 rounded-full mr-4 group-hover:bg-gradient-to-r group-hover:from-customGreen/30 group-hover:to-beige/20 transition-all duration-300">
                    <Clock className="text-blueText" size={24} />
                  </div>
                  <div className="text-blueText text-2xl font-bold">Specialized time series tools</div>
                </div>
                <p className="text-blueText pl-14">
                  Automate the process of cleaning and organizing your data with ease.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-beige p-6 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105 sm:col-span-2 lg:col-span-1">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-customGreen transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="flex items-start mb-4">
                  <div className="bg-infoBoxes/20 p-3 rounded-full mr-4 group-hover:bg-gradient-to-r group-hover:from-infoBoxes/30 group-hover:to-customGreen/20 transition-all duration-300">
                    <Zap className="text-customGreen" size={24} />
                  </div>
                  <div className="text-blueText text-2xl font-bold">Automated sampling techniques</div>
                </div>
                <p className="text-blueText pl-14">
                  Implement various sampling methods to balance and optimize your datasets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values section */}
        <section className="mt-20 pb-28 px-4 sm:px-10 lg:px-20">
          <div className="relative inline-flex items-center mb-8">
            <Users className="text-infoBoxes mr-3" size={32} />
            <h2 className="text-beige text-3xl sm:text-4xl font-bold">Our Values</h2>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige mt-8 mx-auto rounded-xl px-6 py-8 sm:px-8 lg:px-12 lg:py-12 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem] shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Value 1 */}
              <div className="group bg-blueText p-8 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center text-center min-h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-beige transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="bg-beige/10 p-4 rounded-full mb-6 group-hover:bg-gradient-to-r group-hover:from-beige/20 group-hover:to-infoBoxes/20 transition-all duration-300">
                  <Shield className="text-infoBoxes" size={32} />
                </div>
                <h3 className="text-beige text-2xl font-bold mb-4 pb-2 border-b border-beige/20">
                  Innovation and Simplicity
                </h3>
                <p className="text-beige/90 text-sm">
                  We strive to create innovative solutions that simplify complex data pre-processing tasks. WeedOut is
                  designed to be intuitive and efficient, empowering users to focus on what matters most—developing
                  impactful machine learning models.
                </p>
              </div>

              {/* Value 2 */}
              <div className="group bg-blueText p-8 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center text-center min-h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-beige transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="bg-beige/10 p-4 rounded-full mb-6 group-hover:bg-gradient-to-r group-hover:from-beige/20 group-hover:to-infoBoxes/20 transition-all duration-300">
                  <Users className="text-infoBoxes" size={32} />
                </div>
                <h3 className="text-beige text-2xl font-bold mb-4 pb-2 border-b border-beige/20">
                  Community and Collaboration
                </h3>
                <p className="text-beige/90 text-sm">
                  WeedOut thrives on community engagement. We believe in the power of collaboration and welcome
                  contributions from developers, data scientists, and enthusiasts alike. Together, we can build tools
                  that drive the future of data science.
                </p>
              </div>

              {/* Value 3 */}
              <div className="group bg-blueText p-8 rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 hover:shadow-xl hover:scale-105 flex flex-col items-center justify-center text-center min-h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-infoBoxes to-beige transform origin-left transition-all duration-500 group-hover:h-2"></div>
                <div className="bg-beige/10 p-4 rounded-full mb-6 group-hover:bg-gradient-to-r group-hover:from-beige/20 group-hover:to-infoBoxes/20 transition-all duration-300">
                  <Database className="text-infoBoxes" size={32} />
                </div>
                <h3 className="text-beige text-2xl font-bold mb-4 pb-2 border-b border-beige/20">
                  Transparency and Quality
                </h3>
                <p className="text-beige/90 text-sm">
                  We are committed to maintaining and delivering high-quality, reliable tools. From clean code to
                  comprehensive documentation, we prioritize accuracy and performance to support data-driven decision
                  making.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="pb-20 px-4 sm:px-10 lg:px-20">
          <div className="bg-gradient-to-r from-customGreen/90 to-blueText/90 rounded-xl p-8 text-center shadow-lg max-w-[95%] md:max-w-[85%] lg:max-w-[80rem] mx-auto">
            <h2 className="text-beige text-2xl sm:text-3xl font-bold mb-6">
              Ready to simplify your data preprocessing?
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push("/preprocessing/demo")}
                className="bg-infoBoxes text-blueText text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
              hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige
              hover:shadow-infoBoxes/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                Try WeedOut Demo
              </button>
              <button
              onClick={() => router.push("/documentation")}
                className="bg-blueText text-beige text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
              hover:bg-gradient-to-r hover:from-blueText hover:to-customGreen
              hover:shadow-blueText/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                View Documentation
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

