"use client"
import { Inria_Serif } from 'next/font/google';
import CodeBlock from '../CodeBlock';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

import { useState } from "react";

const InstallTabs = () => {
  const [activeTab, setActiveTab] = useState("pypi");

  const code_pypi = "pip install weedout";
  const code_local_install = (
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

  return (
    <div className={`max-w-full md:max-w-4xl mt-8 ${inriaSerif.className}`}>
      <div className="flex border-b border-beige">
        <button
          className={`px-4 py-2 font-semibold border-2 border-transparent transition-all duration-300 ${
            activeTab === "pypi"
              ? "border-b-2 border-infoBoxes text-infoBoxes hover:border-t-2 hover:border-infoBoxes"
              : "text-beige hover:border-t-2 hover:border-infoBoxes hover:border-b-2 "
          }`}
          onClick={() => setActiveTab("pypi")}
        >
          PyPi
        </button>
        <button
          className={`px-4 py-2 font-semibold border-2 border-transparent transition-all duration-300 ${
            activeTab === "local"
              ? "border-b-2 border-infoBoxes text-infoBoxes hover:border-t-2 hover:border-infoBoxes"
              : "text-beige hover:border-t-2 hover:border-infoBoxes hover:border-b-2 "
          }`}
          onClick={() => setActiveTab("local")}
        >
          Local Installation
        </button>
      </div>

      <div className="min-h-[30vh] md:min-h-[35vh] lg:min-h-[40vh]
">
      {activeTab === "pypi" && (
      <div className="pt-4">
        <CodeBlock code={code_pypi} language="python" />
      </div>
    )}

      {activeTab === "local" && (
        <div className="pt-4">
          <p>In order to install WeedOut locally on your machine, you must first clone it's&nbsp;  
            <a href="https://github.com/rohannair2022/weedout.git" className="text-infoBoxes underline underline-offset-1 hover:text-blueText hover:underline ">github repository.</a>
            &nbsp;Then run the following commands, in order:
          </p>
          <CodeBlock code={code_local_install} language="python" />
        </div>

      )}
      </div>
    </div>
  );
}

export default InstallTabs;
