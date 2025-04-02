"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { Inria_Serif } from 'next/font/google';
import Sidebar from "../Sidebar.js";
import ContentArea from "../ContentArea.js";
import useMediaQuery from "../useMediaQuery.js";
import { useUI } from "../../UIProvider.js";
import { Menu, Book, FileCode, BarChart2 } from "lucide-react";
import { BLUE, GREEN, WHITE } from "../colors.js";

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-inria-serif',
});

// Using only the Inria Serif font to match existing style

// side bar data structure
const sidebarItems = [
  {
    title: "weedout.preprocess",
    hasChildren: true,
    icon: <FileCode size={18} />,
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
    icon: <Book size={18} />,
    children: [
      { title: "filtered_correlation_matrix", content: "filtered_correlation_matrix-content" },
      { title: "display", content: "display-content" },
    ],
  },
  {
    title: "weedout.visualization",
    hasChildren: true,
    icon: <BarChart2 size={18} />,
    children: [
      { title: "show_removed_outliers", content: "show_removed_outliers-content" },
      { title: "plot_filtered_correlation_matrix", content: "plot_filtered_correlation_matrix-content" },
    ],
  },
];

export default function APIReferencePage() {
  const [activeContent, setActiveContent] = useState("check_target_variable-content");
  const [expandedSections, setExpandedSections] = useState(new Set(["weedout.preprocess"])); // Default expand first section
  const mainContentRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const toggleSection = (title) => {
    const newExpanded = new Set(expandedSections);
    newExpanded.has(title) ? newExpanded.delete(title) : newExpanded.add(title);
    setExpandedSections(newExpanded);
  };

  const { sidebarOpen, setSidebarOpen } = useUI();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // Initialize sidebar as closed on mobile, open on desktop
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile, setSidebarOpen]);

  // Track scroll position for header effects
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setScrollPosition(mainContentRef.current.scrollTop);
      }
    };

    const currentRef = mainContentRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, setSidebarOpen]);

  // For auto-closing sidebar when user selects an item on mobile
  const handleItemClick = (content) => {
    setActiveContent(content);
    if (isMobile) {
      setSidebarOpen(false);
    }
    
    // Scroll to top when changing content
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  };

  // Handler for overlay click to close sidebar
  const handleOverlayClick = () => {
    setSidebarOpen(false);
  };

  // Extract module and function name from active content
  const getPageTitle = () => {
    const activeItem = sidebarItems.flatMap(section => 
      section.hasChildren ? section.children : [{ title: section.title, content: section.content }]
    ).find(item => item.content === activeContent);
    
    return activeItem ? activeItem.title : '';
  };

  return (
    <div className={`min-h-screen flex bg-customGreen ${inriaSerif.variable}`}>
      {/* Floating header for mobile */}
      <div className={`
        fixed top-0 left-0 right-0 z-40 
        bg-beige/95 backdrop-blur-sm shadow-md
        transform transition-transform duration-300
        ${scrollPosition > 20 ? 'translate-y-0' : '-translate-y-full'}
        md:hidden flex items-center justify-between px-4 py-3
      `}>
        <h1 className="font-medium text-blueText truncate">
          {getPageTitle()}
        </h1>
      </div>

      {/* Hamburger button - styled to match the design in images */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`
          fixed top-4 left-4 z-50 
          bg-beige text-customGreen p-2.5 rounded-full
          flex items-center justify-center md:hidden
        `}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu size={22} />
      </button>

      {/* Sidebar component */}
      <Sidebar
        items={sidebarItems}
        activeContent={activeContent}
        expandedSections={expandedSections}
        onItemClick={handleItemClick}
        onToggle={toggleSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 transition-opacity duration-300 md:hidden"
          onClick={handleOverlayClick}
        />
      )}

      {/* Main content */}
      <div
        ref={mainContentRef}
        className={`
          flex-1 p-4 pt-16 md:p-8 md:pt-8 transition-all duration-300 ease-in-out
          ${sidebarOpen ? "md:ml-64" : ""}
          w-full overflow-auto max-h-screen bg-customGreen md:rounded-tl-3xl md:rounded-bl-3xl
          shadow-xl
        `}
      >
        <ContentArea contentKey={activeContent} />
      </div>
    </div>
  );
}