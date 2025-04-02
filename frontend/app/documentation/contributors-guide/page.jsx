"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BLUE, GREEN, WHITE } from "../colors.js";
import { Inria_Serif } from 'next/font/google';
import {
  BookOpen,
  Code,
  GitPullRequest,
  AlertCircle,
  Wrench,
  Plus,
  FileText,
  Check,
  Github,
  ArrowRight,
} from "lucide-react";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

// Component for contribution tabs
function ContributionTabs() {
  const [activeTab, setActiveTab] = useState("report-bugs");
  
  const tabItems = [
    { id: "report-bugs", label: "Report Bugs", icon: <AlertCircle size={18} /> },
    { id: "enhance-features", label: "Enhance Features", icon: <Wrench size={18} /> },
    { id: "create-features", label: "Create Features", icon: <Plus size={18} /> },
    { id: "other-ways", label: "Other Ways", icon: <FileText size={18} /> },
  ];

  const tabContent = {
    "report-bugs": (
      <div className="mt-6 space-y-4">
        <h4 className="text-blueText text-xl font-bold flex items-center gap-2">
          <AlertCircle className="text-customGreen" size={24} />
          Report Bugs
        </h4>
        <p className="text-blueText mb-4">
          Finding and reporting bugs is one of the most valuable ways to contribute to WeedOut. Your detailed bug reports help us improve the library for everyone.
        </p>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <ol className="list-decimal list-inside space-y-3 text-blueText">
            <li className="pl-2">Navigate to our <Link href="https://github.com/rohannair2022/Weedout/issues" className="text-blue-400 font-medium hover:underline">Issues page</Link></li>
            <li className="pl-2">Click "New Issue" and select the Bug report template</li>
            <li className="pl-2">Fill out the template with detailed information about the bug, including:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-blueText/80">
                <li>Steps to reproduce the issue</li>
                <li>Expected behavior</li>
                <li>Actual behavior</li>
                <li>Version of WeedOut and Python you're using</li>
                <li>Any relevant code samples or error messages</li>
              </ul>
            </li>
            <li className="pl-2">You can assign the task to yourself if you want to fix the issue</li>
            <li className="pl-2">To fix the bug yourself:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-blueText/80">
                <li>Fork the <Link href="https://github.com/rohannair2022/Weedout" className="text-blue-400 font-medium hover:underline">repository</Link></li>
                <li>Create a new branch with a descriptive name</li>
                <li>Make your changes and add appropriate tests</li>
                <li>Submit a pull request with your fix, referencing the original issue</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    ),
    "enhance-features": (
      <div className="mt-6 space-y-4">
        <h4 className="text-blueText text-xl font-bold flex items-center gap-2">
          <Wrench className="text-customGreen" size={24} />
          Enhance Existing Features
        </h4>
        <p className="text-blueText mb-4">
          Help us improve WeedOut's existing functionality by making our code more efficient, robust, or user-friendly.
        </p>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <ul className="list-disc list-inside space-y-3 text-blueText">
            <li className="pl-2">Review our current <Link href="https://github.com/rohannair2022/Weedout/tree/main/weedout" className="text-blue-400 font-medium hover:underline">code modules</Link> to understand existing functionality</li>
            <li className="pl-2">Areas that often need enhancement:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-blueText/80">
                <li>Performance optimization</li>
                <li>Adding support for edge cases</li>
                <li>Improving error handling and messages</li>
                <li>Enhancing API flexibility</li>
                <li>Expanding test coverage</li>
              </ul>
            </li>
            <li className="pl-2">You can make direct pull requests for improving existing features</li>
            <li className="pl-2">Ensure your code follows our style guidelines and includes appropriate tests</li>
            <li className="pl-2">Check our <Link href="https://github.com/rohannair2022/Weedout/pulls" className="text-blue-400 font-medium hover:underline">open pull requests</Link> to avoid duplicate work</li>
          </ul>
        </div>
      </div>
    ),
    "create-features": (
      <div className="mt-6 space-y-4">
        <h4 className="text-blueText text-xl font-bold flex items-center gap-2">
          <Plus className="text-customGreen" size={24} />
          Create New Features
        </h4>
        <p className="text-blueText mb-4">
          Have an idea for a new preprocessing technique or visualization that would benefit WeedOut users? We welcome your contributions!
        </p>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <ol className="list-decimal list-inside space-y-3 text-blueText">
            <li className="pl-2">First, submit an issue using the Feature request template on our <Link href="https://github.com/rohannair2022/Weedout/issues" className="text-blue-400 font-medium hover:underline">Issues page</Link></li>
            <li className="pl-2">Include details about:
              <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-blueText/80">
                <li>The problem your feature would solve</li>
                <li>Your proposed solution</li>
                <li>Alternative solutions you've considered</li>
                <li>Any references or examples from other libraries</li>
              </ul>
            </li>
            <li className="pl-2">Wait for approval from core team members before implementation</li>
            <li className="pl-2">Once approved, fork the repository and implement your feature</li>
            <li className="pl-2">Add appropriate documentation and tests</li>
            <li className="pl-2">Submit a pull request referencing the original feature request</li>
          </ol>
        </div>
      </div>
    ),
    "other-ways": (
      <div className="mt-6 space-y-4">
        <h4 className="text-blueText text-xl font-bold flex items-center gap-2">
          <FileText className="text-customGreen" size={24} />
          Other Ways to Help
        </h4>
        <p className="text-blueText mb-4">
          Code contributions aren't the only way to help! There are many other valuable ways to contribute to WeedOut.
        </p>
        <div className="bg-white p-5 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-infoBoxes/10 p-4 rounded-lg">
              <h5 className="text-blueText font-bold mb-2 flex items-center gap-2">
                <Check size={18} className="text-customGreen" />
                Documentation
              </h5>
              <ul className="list-disc list-inside space-y-1 text-blueText pl-2">
                <li>Improve <Link href="https://github.com/rohannair2022/weedout/blob/main/README.md" className="text-blue-400 font-medium hover:underline">README</Link></li>
                <li>Add code comments</li>
                <li>Create tutorials</li>
                <li>Write function docstrings</li>
              </ul>
            </div>
            
            <div className="bg-infoBoxes/10 p-4 rounded-lg">
              <h5 className="text-blueText font-bold mb-2 flex items-center gap-2">
                <Check size={18} className="text-customGreen" />
                Testing
              </h5>
              <ul className="list-disc list-inside space-y-1 text-blueText pl-2">
                <li>Write <Link href="https://github.com/rohannair2022/Weedout/tree/main/tests" className="text-blue-400 font-medium hover:underline">unit tests</Link></li>
                <li>Create test datasets</li>
                <li>Help with test coverage</li>
                <li>Report edge cases</li>
              </ul>
            </div>
            
            <div className="bg-infoBoxes/10 p-4 rounded-lg">
              <h5 className="text-blueText font-bold mb-2 flex items-center gap-2">
                <Check size={18} className="text-customGreen" />
                Community
              </h5>
              <ul className="list-disc list-inside space-y-1 text-blueText pl-2">
                <li>Answer questions</li>
                <li>Review pull requests</li>
                <li>Spread the word</li>
                <li>Provide feedback</li>
              </ul>
            </div>
            
            <div className="bg-infoBoxes/10 p-4 rounded-lg">
              <h5 className="text-blueText font-bold mb-2 flex items-center gap-2">
                <Check size={18} className="text-customGreen" />
                Examples
              </h5>
              <ul className="list-disc list-inside space-y-1 text-blueText pl-2">
                <li>Create case studies</li>
                <li>Build example notebooks</li>
                <li>Benchmark comparisons</li>
                <li>Share use cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  };

  return (
    <div className="max-w-full mt-8">
      <div className="flex flex-wrap border-b border-blueText">
        {tabItems.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-semibold border-2 border-transparent transition-all duration-300 flex items-center gap-2 ${
              activeTab === tab.id
                ? "border-b-2 border-blueText text-blueText hover:border-t-2 hover:border-blueText"
                : "text-blueText hover:border-t-2 hover:border-infoBoxes hover:border-b-2"
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[40vh]">
        {tabContent[activeTab]}
      </div>
    </div>
  );
}

export default function ContributorsGuidePage() {
  return (
    <div className={`bg-customGreen w-full min-h-screen ${inriaSerif.className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <section className="mb-16">
          <div className="relative inline-block mb-8">
          <h1 className="text-beige text-4xl sm:text-4xl lg:text-5xl font-bold">Contributor's Guide</h1>
            <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="bg-infoBoxes/20 p-3 rounded-full text-customGreen flex-shrink-0">
                <BookOpen size={28} />
              </div>
              <div>
                <h2 className="text-blueText text-2xl font-bold mb-2">Want to Contribute?</h2>
                <p className="text-blueText text-lg">
                  Join our community and help make WeedOut even better!
                </p>
              </div>
            </div>

            <div className="space-y-4 text-blueText">
              <p>
                WeedOut is an open-source Python package for data preprocessing, and we'd love your help in making it even better! 
                Whether you're a coding expert, documentation enthusiast, or data science practitioner, there's a way for you to contribute.
              </p>

              <p>
                Every contribution, big or small, helps us grow and innovate. By contributing to WeedOut, you'll not only improve a tool 
                used by data scientists worldwide, but also enhance your own skills and become part of our growing community.
              </p>

              <div className="bg-gradient-to-r from-customGreen/10 to-infoBoxes/10 p-4 rounded-lg mt-6">
                <h3 className="text-blueText font-bold mb-2 flex items-center gap-2">
                  <GitPullRequest size={20} className="text-customGreen" />
                  Getting Started
                </h3>
                <p className="text-blueText">
                  Before contributing, we recommend:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                  <li>Familiarizing yourself with WeedOut by using it</li>
                  <li>Reading through our <Link href="https://github.com/rohannair2022/weedout/blob/main/README.md" className="text-blue-400 font-medium hover:underline">README</Link></li>
                  <li>Exploring the <Link href="https://github.com/rohannair2022/Weedout/issues" className="text-blue-400 font-medium hover:underline">open issues</Link> to see what's currently needed</li>
                  <li>Joining our community discussions</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Contribution Tabs Section */}
        <section className="mb-16">
          <div className="relative inline-flex items-center mb-6">
            <Code className="text-blue-400 mr-3" size={28} />
            <h2 className="text-beige text-2xl sm:text-3xl font-bold">Ways to Contribute</h2>
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
          </div>

          <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
            <ContributionTabs />
          </div>
        </section>

        {/* GitHub CTA */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-customGreen/90 to-blueText/90 rounded-xl p-8 text-center shadow-lg">
            <h2 className="text-beige text-2xl sm:text-3xl font-bold mb-6">Ready to Start Contributing?</h2>
            <p className="text-beige mb-8 max-w-3xl mx-auto">
              Visit our GitHub repository to explore the codebase, check out open issues, and make your first contribution!
            </p>

            <a
              href="https://github.com/rohannair2022/Weedout"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-infoBoxes text-blueText text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
              hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige
              hover:shadow-infoBoxes/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out inline-flex items-center"
            >
              <Github className="mr-2" size={20} />
              WeedOut's GitHub Repository
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}