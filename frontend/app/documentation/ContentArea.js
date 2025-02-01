// app/documentation/user-guide/ContentArea.jsx
import React from "react";
import CodeBlock from "./CodeBlock";
import { useRouter } from "next/navigation";
import { useUI } from "../UIProvider";

const contentMap = {
  "10-minutes-to-weedout-content": (
    <div>
      <h2 className="text-2xl font-bold mb-4">10 minutes to weedout</h2>
      <p className="mt-4">Weedout is a python library that helps you to preprocess your data and visualize it. It is an open-source library that is easy to use and has a lot of features. It is built on top of pandas and matplotlib.</p>
      <p className="mt-4">In this guide, we will show you how to use weedout to preprocess your data and visualize it. We will cover the following topics:</p>
      <ul className="list-disc pl-6 mt-4">
        <li>Preprocessing your data using weedout</li>
        <li>Visualizing your data using weedout</li>
      </ul>
    </div>
  ),
  "check_target_variable-content": (
    <div>
      <h2 className="text-2xl font-bold mb-4">.check_target_variable</h2>
      <p className="mt-4">The function returns true if the given target name exists in the dataframe. It returns false if the target name is not in the dataframe.</p>
      <CodeBlock code={`def check_target_variable(df: pd.DataFrame, target_name: str) -> bool:`} language="python" />
      
      <h3 className="text-xl font-bold mb-4">Paramters:</h3>
      <p className="mt-4"><CodeBlock code={`df: pd.DataFrame`} language="python" />Given dataframe.</p>
      <p className="mt-4 mb-4"><CodeBlock code={`target_name: str`} language="python" />Given target Name.</p>

      <h3 className="text-xl font-bold mb-4">Return:</h3>
      <p className="mt-4 mb-4"><CodeBlock code={`bool:`} language="python" /> Indicates if target name exists of not.</p>

      <h3 className="text-xl font-bold mb-4">Example:</h3>
    </div>
  ),
  "series-content": (
    <div>
      <h2 className="text-2xl font-bold mb-4">Series</h2>
      <CodeBlock
        code={`import pandas as pd\ns = pd.Series([1, 3, 5, np.nan, 6, 8])`}
        language="python"
      />
      <div className="mt-4 space-y-2">
        <h3 className="font-bold">Parameters:</h3>
        <ul className="list-disc pl-6">
          <li><code>data</code>: Input data</li>
          <li><code>index</code>: Optional index array</li>
        </ul>
      </div>
    </div>
  ),
  // more content here...
};

export default function ContentArea({ contentKey }) {
    const { setActiveNavItem } = useUI();
    const router = useRouter();

    const handleBack = () => {
        setActiveNavItem('');
        router.back();
    };
  return (
    <div className="prose max-w-none text-beige px-4 md:px-0">
        {/* <button 
            onClick={handleBack}
            className="absolute top-0 right-0 text-sm text-blue-200 hover:text-blue-400"
        >
            ← Back to Documentation
        </button> */}
        <div className="max-w-full md:max-w-4xl mx-auto">
            {contentMap[contentKey] || <p>Select a topic from the sidebar</p>}
        </div>
    </div>
  );
}