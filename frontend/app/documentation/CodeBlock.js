// app/documentation/user-guide/CodeBlock.jsx
"use client";
import { useEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/vs2015.css';

hljs.registerLanguage('python', python);

export default function CodeBlock({ code, language = 'python' }) {
  useEffect(() => {
    hljs.highlightAll();
  }, []);

  return (
    <div className="relative group">
      <pre className="
        bg-gray-800 rounded-md 
        p-2 my-3 overflow-x-auto
        text-xs leading-5
        shadow-sm
        transition-all duration-200
      ">
        <code className={`language-${language} font-mono`}>
          {code}
        </code>
      </pre>
      
      {/* copy button */}
      <button
        className="
          absolute top-2 right-2 opacity-0 group-hover:opacity-100
          text-gray-400 hover:text-gray-200
          transition-opacity duration-200
          bg-gray-700/50 rounded px-2 py-1 text-xs
          backdrop-blur-sm
        "
        onClick={() => navigator.clipboard.writeText(code)}
      >
        Copy
      </button>
    </div>
  );
}