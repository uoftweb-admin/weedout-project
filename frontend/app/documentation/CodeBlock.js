// app/documentation/user-guide/CodeBlock.jsx
"use client";
import { useRef, useLayoutEffect } from 'react';
import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import 'highlight.js/styles/atom-one-dark.css';
import { Inria_Serif } from 'next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

hljs.registerLanguage('python', python);

export default function CodeBlock({ code, language = 'python' }) {
  const codeRef = useRef(null);

  useLayoutEffect(() => {
    if (codeRef.current) {
      // Clear the content before re-highlighting it
      codeRef.current.textContent = code;
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className={`relative group ${inriaSerif.className}
    `}>
      <pre className={`
        !bg-gray-800 rounded-md 
        p-2 my-3 overflow-x-auto
        text-sm leading-5
        shadow-sm
        transition-all duration-200
        ${inriaSerif.className}
      `}>
        <code className={`language-${language} font-mono !bg-gray-800 !text-gray-200 ${inriaSerif.className}`}>
          {code}
        </code>
      </pre>
      
      {/* copy button */}
      <button
        className={`
          absolute top-2 right-2 opacity-0 group-hover:opacity-100
          text-gray-400 hover:text-gray-200
          transition-opacity duration-200
          bg-gray-700/50 rounded px-2 py-1 text-xs
          backdrop-blur-sm ${inriaSerif.className}
        `}
        onClick={copyCode}
      >
        Copy
      </button>
    </div>
  );
}