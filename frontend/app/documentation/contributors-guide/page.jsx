import React from "react";
import Link from "next/link"
import {BLUE, GREEN, WHITE} from "../colors.js"
import { Inria_Serif } from '@next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function ContributorsGuidePage() {

    return (
            <div className={`bg-customGreen w-full h-full ${inriaSerif.className}`}>
                <section className="pt-10 lg:pt-20 px-4 sm:px-10 lg:px-20">
                    {/* Responsive heading */}
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                    Contributors Guide
                    </h1>

                    {/* Responsive beige box */}
                    <div className="bg-beige mt-8 mx-auto rounded-lg px-4 py-6 sm:px-6 lg:px-10 lg:py-10 max-w-[95%] md:max-w-[85%] lg:max-w-[80rem]">
                        {/* Responsive h3 */}
                        <h3 className="text-blueText text-xl sm:text-2xl font-bold">
                            Want to Contribute?
                        </h3>

                        {/* Responsive paragraph */}
                        <p className="text-blueText mt-4 text-sm sm:text-base lg:text-lg leading-relaxed">
                            WeedOut is an open-source Python package for data preprocessing, and we'd 
                            love your help in making it even better! Whether you're a coding whiz, 
                            documentation guru, or data science enthusiast, there's a way for you to 
                            contribute. You can help by improving our code, adding new features, writing 
                            tests, enhancing documentation, reporting bugs, or even sharing your experience 
                            with WeedOut. Every contribution, big or small, helps us grow and innovate. 
                        </p>

                        <div className={`mt-6 text-blueText ${inriaSerif.className}`}>
                            <h4 className="text-lg sm:text-xl font-semibold mb-3">Ways to Contribute:</h4>
                        
                            <div className="space-y-6">
                                {/* Report Bugs Section */}
                                <div className=" p-4 rounded-lg">
                                    <h5 className="text-base sm:text-lg font-bold mb-2">1. Report Bugs</h5>
                                    <ol className="list-decimal list-inside ml-2 text-sm sm:text-base">
                                        <li className="mb-1">Navigate to our <Link href="https://github.com/rohannair2022/Weedout/issues" className="text-blue-600 hover:underline">Issues page</Link></li>
                                        <li className="mb-1">Click "New Issue" and select the Bug report template</li>
                                        <li className="mb-1">Fill out the template with detailed information about the bug</li>
                                        <li className="mb-1">You can assign the task to yourself if you want to fix the issue</li>
                                        <li>To fix the bug yourself:
                                            <ul className="list-disc list-inside ml-4 mt-1">
                                                <li>Fork the <Link href="https://github.com/rohannair2022/Weedout" className="text-blue-600 hover:underline">repository</Link></li>
                                                <li>Make your changes in a new branch</li>
                                                <li>Submit a pull request with your fix</li>
                                            </ul>
                                        </li>
                                    </ol>
                                </div>

                                {/* Enhance Existing Features Section */}
                                <div className="p-4 rounded-lg">
                                    <h5 className="text-base sm:text-lg font-bold mb-2">2. Enhance Existing Features</h5>
                                    <ul className="list-disc list-inside ml-2 text-sm sm:text-base">
                                        <li className="mb-1">Review our current <Link href="https://github.com/rohannair2022/Weedout/tree/main/weedout" className="text-blue-600 hover:underline">code modules</Link> to understand existing functionality</li>
                                        <li className="mb-1">You can make direct pull requests for improving existing features</li>
                                        <li className="mb-1">Ensure your code follows our style guidelines and includes appropriate tests</li>
                                        <li>Check our <Link href="https://github.com/rohannair2022/Weedout/pulls" className="text-blue-600 hover:underline">open pull requests</Link> to avoid duplicate work</li>
                                    </ul>
                                </div>

                                {/* Create New Features Section */}
                                <div className="p-4 rounded-lg">
                                    <h5 className="text-base sm:text-lg font-bold mb-2">3. Create New Features</h5>
                                    <ol className="list-decimal list-inside ml-2 text-sm sm:text-base">
                                        <li className="mb-1">First, submit an issue using the Feature request template on our <Link href="https://github.com/rohannair2022/Weedout/issues" className="text-blue-600 hover:underline">Issues page</Link></li>
                                        <li className="mb-1">Wait for approval from core team members before implementation</li>
                                        <li className="mb-1">Once approved, fork the repository and implement your feature</li>
                                        <li className="mb-1">Add appropriate documentation and tests</li>
                                        <li>Submit a pull request referencing the original feature request</li>
                                    </ol>
                                </div>

                                 {/* Additional Contribution Options */}
                                <div className="mt-6">
                                    <h5 className="text-base sm:text-lg font-bold mb-2">Other Ways to Help:</h5>
                                    <ul className="list-disc list-inside ml-2 text-sm sm:text-base grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <li>Improve <Link href="https://github.com/rohannair2022/weedout/blob/main/README.md" className="text-blue-600 hover:underline">documentation (README)</Link></li>
                                        <li>Write <Link href="https://github.com/rohannair2022/Weedout/tree/main/tests" className="text-blue-600 hover:underline">unit tests</Link></li>
                                        <li>Create tutorials or examples</li>
                                        <li>Review open pull requests</li>
                                        <li>Share WeedOut with others</li>
                                        <li>Suggest new preprocessing features</li>
                                    </ul>
                                </div>
                            </div>
                            <p className="text-blueText mt-6 text-sm sm:text-base lg:text-lg">
                                Check out our GitHub repository to get started:
                            </p>

                        </div>

                        
                     
                        
                    </div>
                    <Link href="https://github.com/rohannair2022/Weedout?tab=readme-ov-file#how-can-you-contribute-to-weedout" target="_blank" rel="noopener noreferrer">
                            <div className="flex justify-center mt-6">
                                <button className="bg-blueText text-white text-lg font-semibold px-6 py-3 rounded-full shadow-md 
                                                    hover:shadow-2xl hover:bg-gradient-to-r hover:from-infoBoxes hover:to-blueText
                                                    transition duration-300 ease-in-out">
                                    WeedOut's GitHub Repository
                                </button>
                            </div>
                        </Link>
                </section>
                {/* Adding bottom padding to create space below the button */}
                <div className="pb-10 md:pb-16"></div>

            </div>

        
    )

}