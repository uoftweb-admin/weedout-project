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
      { title: "check_duplicate_columns", content: "check_duplicate_columns-content" },
      { title: "initial_check_dt", content: "initial_check_dt-content" },
      { title: "cross_sectional_imputation", content: "cross_sectional_imputation-content" },
      { title: "time_series_imputation", content: "time_series_imputation-content" },
      { title: "handle_imbalanced_data", content: "handle_imbalanced_data-content" },
      { title: "remove_outliers", content: "remove_outliers-content" },
      { title: "separate_target_column", content: "separate_target_column-content" },
      { title: "encoding", content: "encoding-content" },
      { title: "feature_scaling", content: "feature_scaling-content" },
      { title: "combine", content: "combine-content" },
      { title: "preprocess_pipeline", content: "preprocess_pipeline-content" },
    ],
  },
  {
    title: "weedout.datainfo",
    hasChildren: true,
    children: [
      { title: "filtered_correlation_matrix", content: "filtered_correlation_matrix-content" },
      { title: "display", content: "display-content" },
    ],
  },
  {
    title: "weedout.visualization",
    hasChildren: true,
    children: [
      { title: "show_removed_outliers", content: "show_removed_outliers-content" },
      { title: "plot_filtered_correlation_matrix", content: "plot_filtered_correlation_matrix-content" },
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