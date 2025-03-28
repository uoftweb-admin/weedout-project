"use client";

import React from "react";
import { ChevronDown, ChevronRight, X, Terminal } from "lucide-react";

export default function Sidebar({
  items,
  activeContent,
  expandedSections,
  onItemClick,
  onToggle,
  sidebarOpen,
  setSidebarOpen,
}) {
  // Function to handle the close button click
  const handleClose = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <div
      className={`
        fixed top-0 left-0 w-64 h-screen pt-20 pb-8 overflow-y-auto
        bg-beige backdrop-blur-sm md:bg-beige
        transform transition-all duration-300 ease-in-out z-40
        shadow-lg
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo/Header area */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-4 bg-customGreen text-beige">
        <div className="flex items-center space-x-2">
          <Terminal size={20} />
          <h1 className="text-lg font-semibold font-serif">weedout</h1>
        </div>
        
        {/* Close button */}
        <button
          onClick={handleClose}
          className="text-beige/80 hover:text-beige p-1 rounded-full hover:bg-beige/10 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="p-3 pb-20"> {/* Added padding at bottom for mobile scrolling */}
        <div className="mb-4 px-2">
          <h2 className="text-xs font-medium text-blueText/60 uppercase tracking-wider">API Reference</h2>
        </div>
        
        {items.map((section) => {
          if (!section.hasChildren) {
            // Render a single-level item
            return (
              <button
                key={section.title}
                className={`flex items-center space-x-2 w-full p-2.5 my-1 rounded-lg transition-all duration-200 ${
                  activeContent === section.content
                    ? "bg-customGreen text-white font-medium shadow-sm"
                    : "text-blueText hover:bg-blue-100"
                }`}
                onClick={() => onItemClick(section.content)}
              >
                {section.icon && <span className="text-blueText">{section.icon}</span>}
                <span>{section.title}</span>
              </button>
            );
          } else {
            // Render a section with children
            const isExpanded = expandedSections.has(section.title);
            return (
              <div key={section.title} className="mb-2">
                <button
                  className={`flex items-center justify-between w-full p-2.5 my-1 rounded-lg transition-all duration-200 
                    ${isExpanded ? "bg-blue-100" : ""} 
                    text-blueText hover:bg-blue-100 group`}
                  onClick={() => onToggle(section.title)}
                >
                  <div className="flex items-center space-x-2">
                    {section.icon && <span className={`${isExpanded ? "text-customGreen" : "text-blueText"} group-hover:text-customGreen transition-colors`}>{section.icon}</span>}
                    <span className="font-medium">{section.title}</span>
                  </div>
                  <span className={`${isExpanded ? "text-customGreen" : "text-blueText"} group-hover:text-customGreen transition-colors`}>
                    {isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </span>
                </button>
                
                {/* Children items with animated height transition */}
                <div 
                  className={`
                    ml-4 overflow-hidden transition-all duration-300 ease-in-out
                    ${isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}
                  `}
                >
                  <div className="border-l-2 border-blue-200 pl-2 py-1 space-y-1">
                    {section.children.map((item) => (
                      <button
                        key={item.content}
                        className={`block w-full p-2 text-left rounded-lg transition-all duration-200 ${
                          activeContent === item.content
                            ? "bg-customGreen text-white font-medium shadow-sm"
                            : "text-blueText hover:bg-blue-100"
                        }`}
                        onClick={() => onItemClick(item.content)}
                      >
                        {item.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </nav>
    </div>
  );
}