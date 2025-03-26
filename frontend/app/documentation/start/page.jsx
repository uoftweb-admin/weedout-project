"use client"
import { useState } from "react"
import Link from "next/link"
import { Inria_Serif } from "next/font/google"
import {
  BookOpen,
  Download,
  Code,
  PlayCircle,
  ChevronRight,
  Copy,
  Check,
  Info,
  AlertCircle,
  Zap,
  FileText,
  List,
  ArrowRight,
  Database,
} from "lucide-react"

const inriaSerif = Inria_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
})

// Component for code blocks with copy functionality
function CodeBlockWithCopy({ code, language = "python" }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative bg-blueText text-beige p-5 rounded-lg font-mono text-sm overflow-hidden">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 bg-infoBoxes/20 hover:bg-infoBoxes/40 p-2 rounded-md transition-colors duration-200"
        aria-label="Copy code"
      >
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </button>
      <pre className="overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// Component for callout boxes
function Callout({ type = "info", title, children }) {
  const icons = {
    info: <Info size={20} className="text-blue-500" />,
    warning: <AlertCircle size={20} className="text-amber-500" />,
    tip: <Zap size={20} className="text-green-500" />,
  }

  const colors = {
    info: "border-blue-500 bg-blue-50",
    warning: "border-amber-500 bg-amber-50",
    tip: "border-green-500 bg-green-50",
  }

  return (
    <div className={`border-l-4 ${colors[type]} p-4 rounded-r-lg`}>
      <div className="flex items-center gap-2 font-bold mb-2">
        {icons[type]}
        <span className="text-customGreen">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  )
}

export default function QuickStartPage() {
  // Navigation items
  const navItems = [
    { id: "what-is-weedout", label: "What is WeedOut?", icon: <BookOpen size={18} /> },
    { id: "installation", label: "Installation", icon: <Download size={18} /> },
    { id: "importing", label: "Importing", icon: <Code size={18} /> },
    { id: "minimal-example", label: "Worked Example", icon: <PlayCircle size={18} /> },
    { id: "inputs", label: "Explanation", icon: <FileText size={18} /> },
    { id: "outputs", label: "Output", icon: <Database size={18} /> },
    { id: "use-cases", label: "Use Cases", icon: <List size={18} /> },
  ]

  // Sample code for installation
  const pipInstallCode = "pip install weedout"
  const localInstallCode = (
    <span>
      <span className="text-gray-400"># Install dependencies</span> <br />
      pip install setuptools wheel twine <br />
      <br />
      <span className="text-gray-400"># Build the package</span> <br />
      python setup.py sdist bdist_wheel <br />
      <br />
      <span className="text-gray-400"># Replace & install the built package</span>
      <br />
      pip install dist/weedout-&lt;version&gt;-py3-none-any.whl
    </span>
  );
  const importCode = `# Import the main modules
import weedout.preprocess as wd_pre
import weedout.visualization as wd_vis

# For additional functionality
import weedout.datainfo as wd_dinfo`

  // working example code
  const minimalExampleCode = `import pandas as pd
from weedout.preprocess import (
    initial_check_dt,
    cross_sectional_imputation,
    remove_outliers,
    separate_target_column,
    encoding,
    feature_scaling,
    combine
)
from weedout.visualization import show_removed_outliers

# === Step 1: Set parameters ===
file_path = "path to BCD.csv"           
target_column = "Target"
columns_to_drop = []
untouched_columns = []

# === Step 2: Load & clean the data ===
df = initial_check_dt(file_path, target_variable=target_column, columns_to_drop=columns_to_drop)
df = cross_sectional_imputation(df, target_name=target_column)
df_no_outliers = remove_outliers(df)

# === Optional: Visualize changes after outlier removal ===
show_removed_outliers(df, df_no_outliers)

# === Step 3: Process columns ===
features, target = separate_target_column(df_no_outliers, target_variable=target_column)
features_encoded = encoding(features, untouched_columns=untouched_columns)
features_scaled = feature_scaling(features_encoded, unscale_columns=untouched_columns)
cleaned_df = combine(features_scaled, target)

# === Step 4: Save the cleaned dataset ===
cleaned_df.to_csv("BCD_cleaned.csv", index=False)
print("Cleaned dataset saved as 'BCD_cleaned.csv'")
`

  // Scroll to section function
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className={`bg-customGreen w-full min-h-screen ${inriaSerif.className}`}>
      <div className="flex">
        {/* Left sidebar navigation */}
        <div className="hidden lg:block w-64 bg-blueText h-screen sticky top-0 p-6 overflow-y-auto">
          <div className="text-beige text-xl font-bold mb-8">Quick Start Guide</div>
          <nav>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-beige hover:bg-customGreen/20 rounded-lg transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
              <li className="pt-4 mt-4 border-t border-beige/20">
                <Link
                  href="/documentation"
                  className="w-full flex items-center gap-3 px-4 py-2 text-infoBoxes hover:bg-customGreen/20 rounded-lg transition-colors duration-200"
                >
                  <FileText size={18} />
                  <span>Full Documentation</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Mobile navigation (shown only on small screens) */}
            <div className="lg:hidden mb-8 bg-blueText rounded-xl p-4 sticky top-4 z-10 shadow-lg">
              <div className="text-beige font-bold mb-2">Quick Start Guide</div>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className="flex items-center gap-1 px-3 py-1 text-xs text-beige bg-customGreen/30 hover:bg-customGreen/50 rounded-full transition-colors duration-200"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* What is WeedOut? section */}
            <section id="what-is-weedout" className="mb-16">
              <div className="relative inline-block mb-8">
              <h1 className="text-beige text-4xl sm:text-4xl lg:text-5xl font-bold">Quick Start Guide</h1>
                <div className="absolute -bottom-3 left-0 w-full h-1 bg-infoBoxes rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <div className="flex items-start gap-4 mb-6">
                  <div className="bg-infoBoxes/20 p-3 rounded-full text-customGreen flex-shrink-0">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h2 className="text-blueText text-2xl font-bold mb-2">What is WeedOut?</h2>
                    <p className="text-blueText text-lg">
                      A powerful Python library for data preprocessing and visualization
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-blueText">
                  <p>
                    WeedOut is a robust and intuitive data pre-processing library designed to optimize and accelerate
                    machine learning workflows. By automating critical tasks such as data cleaning, transformation, and
                    feature engineering, WeedOut eliminates the bottlenecks of manual pre-processing, enabling you to
                    focus on model development and deriving actionable insights.
                  </p>

                  <p>
                    Whether working with cross-sectional or time-series data, for classification or regression tasks,
                    WeedOut offers a comprehensive suite of tools to prepare your data with precision and efficiency.
                  </p>

                </div>
              </div>
            </section>

            {/* Installation section */}
            <section id="installation" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <Download className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Installation</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">
                  You can install WeedOut using pip or you can install it locally from the source. In order to install it locally, you must first clone WeedOut from its <a href="https://github.com/rohannair2022/weedout.git" className="text-customGreen underline underline-offset-1 hover:text-blueText hover:underline ">Github repository.</a>
                  &nbsp; Choose the method that best suits your environment:
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        1
                      </div>
                      Using pip (recommended)
                    </h3>
                    <CodeBlockWithCopy code={pipInstallCode} />
                  </div>

                  <div>
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        2
                      </div>
                      Installing Weedout locally
                    </h3>
                    <CodeBlockWithCopy code={localInstallCode} />
                  </div>

                  <Callout type="info" title="Dependencies">
                    <p className="text-blueText">
                      WeedOut requires Python 3.7+ and automatically installs its dependencies including pandas, numpy,
                      scikit-learn, and matplotlib.
                    </p>
                  </Callout>
                </div>
              </div>
            </section>

            {/* Importing section */}
            <section id="importing" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <Code className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Importing WeedOut</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">
                  After installing WeedOut, you can import its modules into your Python code:
                </p>

                <CodeBlockWithCopy code={importCode} />

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-infoBoxes/20 p-4 rounded-lg border-t-4 border-customGreen">
                    <h4 className="text-blueText font-bold mb-2">preprocess</h4>
                    <p className="text-blueText text-sm">Core data cleaning and transformation functions</p>
                  </div>

                  <div className="bg-infoBoxes/20 p-4 rounded-lg border-t-4 border-customGreen">
                    <h4 className="text-blueText font-bold mb-2">visualization</h4>
                    <p className="text-blueText text-sm">Tools for visualizing data and preprocessing results</p>
                  </div>

                  <div className="bg-infoBoxes/20 p-4 rounded-lg border-t-4 border-customGreen">
                    <h4 className="text-blueText font-bold mb-2">datainfo</h4>
                    <p className="text-blueText text-sm">Utility functions to inspect and compare datasets</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Minimal Example section */}
            <section id="minimal-example" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <PlayCircle className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Worked Example</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">
                  Here's a complete example showing how to use WeedOut's core functions to preprocess a dataset. 
                  The code below is based on the following file:&nbsp;
                  <a href="/BCD.csv" download className="text-customGreen underline underline-offset-1 hover:text-blueText hover:underline ">
                     Binary_Classification_dataset
                  </a>.
                </p>

                <CodeBlockWithCopy code={minimalExampleCode} />

                <div className="mt-6">
                  <Callout type="tip" title="Try it yourself">
                    <p className="text-blueText">
                      Copy this code and replace "path to BCD.csv" with your actual dataset file path to get started
                      quickly.
                    </p>
                  </Callout>
                </div>
              </div>
            </section>

            {/* Explanation of Inputs section */}
            <section id="inputs" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <FileText className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Explanation of Example</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">Understanding the key steps and functions in the example above:</p>

                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-blueText text-xl font-bold mb-3">Step 1: Set Parameters</h3>
                    <p className="text-blueText mb-3">Define the key variables needed for preprocessing:</p>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">file_path:</span>
                        <span className="text-blueText">Path to your CSV dataset file</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">target_column:</span>
                        <span className="text-blueText">Name of your target column for prediction</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">columns_to_drop:</span>
                        <span className="text-blueText">List of columns to exclude from analysis</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">
                          untouched_columns:
                        </span>
                        <span className="text-blueText">Columns to leave unmodified during encoding/scaling</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-blueText text-xl font-bold mb-3">Step 2: Load & Clean the Data</h3>
                    <p className="text-blueText mb-3">
                      Process the dataset through initial checks, imputation, and outlier removal using the following functions:
                    </p>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">
                          initial_check_dt:
                        </span>
                        <span className="text-blueText pl-20">Loads the dataset and performs basic checks</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">
                          cross_sectional_imputation:
                        </span>
                        <span className="text-blueText pl-20">Fills missing values in the dataset</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">remove_outliers:</span>
                        <span className="text-blueText pl-20">Detects and removes statistical outliers</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">
                          show_removed_outliers:
                        </span>
                        <span className="text-blueText pl-20">Visualizes the outliers that were removed</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-blueText text-xl font-bold mb-3">Step 3: Process Columns</h3>
                    <p className="text-blueText mb-3">Separate, encode, and scale the features for machine learning using the following functions:</p>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">
                          separate_target_column:
                        </span>
                        <span className="text-blueText pl-14">Splits features from the target variable</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">encoding:</span>
                        <span className="text-blueText pl-14">Converts categorical features to numeric</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">feature_scaling:</span>
                        <span className="text-blueText pl-14">Normalizes numeric features</span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">combine:</span>
                        <span className="text-blueText pl-14">Rejoins processed features with target</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md">
                    <h3 className="text-blueText text-xl font-bold mb-3">Step 4: Save the Cleaned Dataset</h3>
                    <p className="text-blueText mb-3">Export the processed data to a CSV file:</p>
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center">
                        <span className="font-mono text-customGreen font-bold w-48 flex-shrink-0">to_csv:</span>
                        <span className="text-blueText">Saves the cleaned DataFrame to a CSV file</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Description of Output section */}
            <section id="outputs" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <Database className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Description of Output</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">
                  Understanding what you get after running the WeedOut preprocessing pipeline:
                </p>

                <div className="bg-white p-5 rounded-lg shadow-md mb-6">
                  <h3 className="text-blueText text-xl font-bold mb-3">cleaned_df</h3>
                  <p className="text-blueText mb-4">
                    The final output is a cleaned Pandas DataFrame with the following characteristics:
                  </p>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">No missing values</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">Outliers removed or handled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">Categorical features encoded</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">Numeric features scaled</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">Target column preserved in its original form</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="bg-infoBoxes text-blueText rounded-full w-6 h-6 mt-0.5 flex-shrink-0 flex items-center justify-center">
                        <Check size={16} />
                      </div>
                      <span className="text-blueText">Ready for machine learning model training</span>
                    </li>
                  </ul>
                </div>

                <Callout type="info" title="Data Transformation">
                  <p className="text-blueText">
                    WeedOut preserves the original structure of your data while applying necessary transformations. The
                    output DataFrame maintains the same number of rows (unless outliers are removed) and includes all
                    columns except those explicitly dropped.
                  </p>
                </Callout>
              </div>
            </section>

            {/* Common Use Cases section */}
            <section id="use-cases" className="mb-16">
              <div className="relative inline-flex items-center mb-6">
                <List className="text-infoBoxes mr-3" size={28} />
                <h2 className="text-beige text-2xl sm:text-3xl font-bold">Common Use Cases</h2>
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-infoBoxes/50 rounded-full"></div>
              </div>

              <div className="bg-beige rounded-xl p-6 md:p-8 shadow-lg">
                <p className="text-blueText mb-6">
                  WeedOut is versatile and can be applied to various data preprocessing scenarios:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        <ArrowRight size={18} />
                      </div>
                      Classification Tasks
                    </h3>
                    <p className="text-blueText mb-3">Prepare data for binary or multi-class classification models.</p>
                    <div className="text-sm text-blueText/80 bg-infoBoxes/10 p-3 rounded-lg">
                      <code>
                        # For classification tasks
                        <br/>
                        from weedout.preprocess import *
                        <br/>
                        df = initial_check_dt("customer_churn.csv", target_variable="Churn", columns_to_drop=[])
                        <br/>
                        df = cross_sectional_imputation(df, target_name="Churn")
                        <br/>
                        df = remove_outliers(df)
                        <br/>
                        X, y = separate_target_column(df, target_variable="Churn")
                        <br/>
                        X = encoding(X)
                        <br/>
                        X = feature_scaling(X, unscale_columns=[])
                        <br/>
                        df_cleaned = combine(X, y)
                      </code>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        <ArrowRight size={18} />
                      </div>
                      Regression Analysis
                    </h3>
                    <p className="text-blueText mb-3">Clean and prepare data for predicting continuous values.</p>
                    <div className="text-sm text-blueText/80 bg-infoBoxes/10 p-3 rounded-lg">
                      <code>
                        # For regression tasks
                        <br />
                        from weedout.preprocess import *
                        <br />
                        df = initial_check_dt("house_prices.csv", target_variable="Price", columns_to_drop=[])
                        <br />
                        df = cross_sectional_imputation(df, target_name="Price")
                        <br />
                        df = remove_outliers(df)
                        <br />
                        X, y = separate_target_column(df, target_variable="Price")
                        <br />
                        X = encoding(X)
                        <br />
                        X = feature_scaling(X, unscale_columns=[])
                        <br />
                        df_cleaned = combine(X, y)

                      </code>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        <ArrowRight size={18} />
                      </div>
                      Imbalanced Datasets
                    </h3>
                    <p className="text-blueText mb-3">Handle class imbalance with various sampling techniques.</p>
                    <div className="text-sm text-blueText/80 bg-infoBoxes/10 p-3 rounded-lg">
                      <code>
                        # For imbalanced data
                        <br />
                        from weedout.preprocess import *
                        <br />
                        df = initial_check_dt("fraud_detection.csv", target_variable="Fraud", columns_to_drop=[])
                        <br />
                        df = cross_sectional_imputation(df, target_name="Fraud")
                        <br />
                        df = remove_outliers(df)
                        <br />
                        X, y = separate_target_column(df, target_variable="Fraud")
                        <br />
                        X = encoding(X)
                        <br />
                        X = feature_scaling(X, unscale_columns=[])
                        <br />
                        <br />
                        # Handle class imbalance with built-in function
                        <br />
                        df_balanced = handle_imbalanced_data(df, target_variable="Fraud", strategy="smote")
                        <br />
                        <br />
                        df_cleaned = df_balanced
                      </code>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                    <h3 className="text-blueText text-xl font-bold mb-3 flex items-center">
                      <div className="bg-infoBoxes w-8 h-8 rounded-full flex items-center justify-center text-blueText mr-2">
                        <ArrowRight size={18} />
                      </div>
                      Time Series Data
                    </h3>
                    <p className="text-blueText mb-3">Process temporal data with specialized techniques.</p>
                    <div className="text-sm text-blueText/80 bg-infoBoxes/10 p-3 rounded-lg">
                      <code>
                      # For time series data
                      <br />
                      from weedout.preprocess import *
                      <br />
                      df = initial_check_dt("stock_prices.csv", target_variable="Price", columns_to_drop=[])
                      <br />
                      df = df.sort_values(by="Date")  # Sort chronologically
                      <br />
                      df = time_series_imputation(df, target_name="Price")
                      <br />
                      df = remove_outliers(df)
                      <br />
                      X, y = separate_target_column(df, target_variable="Price")
                      <br />
                      X = encoding(X, untouched_columns=[])
                      <br />
                      X = feature_scaling(X, unscale_columns=[])
                      <br />
                      df_cleaned = combine(X, y)
                      </code>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Full Documentation link */}
            <section className="mb-20">
              <div className="bg-gradient-to-r from-customGreen/90 to-blueText/90 rounded-xl p-8 text-center shadow-lg">
                <h2 className="text-beige text-2xl sm:text-3xl font-bold mb-6">Ready to Explore More?</h2>
                <p className="text-beige mb-8 max-w-3xl mx-auto">
                  Now that you've seen the basics, check out our comprehensive documentation to discover all the
                  features WeedOut has to offer!
                </p>

                <Link
                  href="/documentation/api-ref"
                  className="bg-infoBoxes text-blueText text-lg font-semibold px-8 py-3 rounded-full shadow-lg 
                  hover:bg-gradient-to-r hover:from-infoBoxes hover:to-beige
                  hover:shadow-infoBoxes/30 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out inline-flex items-center"
                >
                  View Full Documentation
                  <ChevronRight className="ml-2" size={20} />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

