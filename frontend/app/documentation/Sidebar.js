// app/documentation/user-guide/Sidebar.jsx
"use client";

import React from "react";
import { WHITE, BLUE } from "./colors";

export default function Sidebar({
  items,
  activeContent,
  expandedSections,
  onItemClick,
  onToggle,
  sidebarOpen,
  isMobile
}) {
  return (
    <div
      className={`
        fixed top-0.5 left-0 w-64 bg-beige min-h-screen p-4 ${isMobile ? 'pt-16' : ''} overflow-y-auto
        transform transition-transform duration-300 z-[40] 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <nav>
        {items.map((section) => {
            if(!section.hasChildren) {
                // Render a single-level item
                return (
                    <button
                    key={section.title}
                    className={`flex items-center justify-between w-full p-1 hover:bg-blue-200 rounded color-beige ${
                        activeContent === section.content ? 'bg-blue-300' : ''
                    }`}
                    style={{color: BLUE}}
                    onClick={() => onItemClick(section.content)}
                    >
                    {section.title}
                    </button>
                );
            } else {
                return (
                <div key={section.title} className="mb-1">
                    <button
                        className="flex items-center justify-between w-full p-1 hover:bg-blue-200 rounded color-beige"
                        onClick={() => onToggle(section.title)}
                        style={{ color: BLUE }}
                    >
                        <span>{section.title}</span>
                        <span>{expandedSections.has(section.title) ? "|" : "="}</span>
                    </button>
                    {expandedSections.has(section.title) && (
                        <div className="ml-2">
                            {section.children.map((item) => (
                                <button
                                    key={item.content}
                                    className={`block w-full p-1 text-left rounded ${
                                    activeContent === item.content
                                        ? "bg-blue-300"
                                        : "hover:bg-blue-200"
                                    }`}
                                    onClick={() => onItemClick(item.content)}
                                    style={{
                                    color: activeContent === item.content ? BLUE : BLUE,
                                    fontSize: "0.9rem",
                                    }}
                                >
                                    {item.title}
                                </button>
                            ))}
                        </div>
                    )}
                </div>   
                )
            }
        })}
      </nav>
    </div>
  );
}