"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import {BLUE, GREEN, WHITE} from "../colors.js";
import Sidebar from "../Sidebar.js";
import ContentArea from "../ContentArea.js";
import useMediaQuery from "../useMediaQuery.js";
import { useUI } from "../../UIProvider.js";

// side bar data structure
const sidebarItems = [
    {
        title: "10 minutes to weedout",
        hasChildren: false,
        content: "10-minutes-to-weedout-content",
    },
    {
        title: "weedout.preprocess",
        hasChildren: true,
        children: [
        { title: "check_target_variable", content: "check_target_variable-content" },
        { title: "Basic Concepts", content: "basic-concepts" },
        ],
    },
    {
        title: "weedout.datainfo",
        hasChildren: true,
        children: [
        { title: "Series", content: "series-content" },
        { title: "DataFrame", content: "dataframe-content" },
        ],
    },
    {
        title: "weedout.visualization",
        hasChildren: true,
        children: [
        { title: "Preprocessing", content: "preprocessing" },
        { title: "Visualization", content: "visualization" },
        ],
    },
];

export default function UserGuidePage() {
  const [activeContent, setActiveContent] = useState("10-minutes-to-weedout-content");
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (title) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(title) ? newExpanded.delete(title) : newExpanded.add(title);
    setExpandedSections(newExpanded);
  };

  const { sidebarOpen, setSidebarOpen } = useUI();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // For auto-closing sidebar when user selects an item on mobile
  const handleItemClick = (content) => {
    setActiveContent(content);
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-customGreen">
      {/* side bar */}
      <div 
        className={`fixed md:relative z-50
        md:translate-x-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <Sidebar
            items={sidebarItems}
            activeContent={activeContent}
            expandedSections={expandedSections}
            onItemClick={handleItemClick}
            onToggle={toggleSection}
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
        />
      </div>

      {/* main ared */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div
        className={`
          flex-1 p-8 max-w-4xl mx-auto transition-margin duration-300
          ${!isMobile && sidebarOpen ? "ml-64" : ""}
          w-full md:w-[calc(100%-16rem)]
        `}
      >
        <ContentArea contentKey={activeContent} />
      </div>
    </div>
  );
}