"use client";

import React from "react";
import Cards from "./Cards";
import Link from "next/link"
import { GREEN, BLUE, WHITE } from "./colors";

export default function DocumentationPage() {
    const descriptionStart = `New to WeedOut? Check out the getting started guides. \
    They contain an introduction to WeedOut main concepts.`;
    const descriptionUserGuide = `The user guide provides in-depth information on the \
    key concepts with useful background information.`;
    const descriptionApiRef = `Step-by-step guide to API ref`;
    const descriptionDevlopment = `Explore advanced configurations and customization \
    options for power users.`;



    return (
      <div
        style={{backgroundColor: GREEN}}
        className="min-h-screen p-4 sm:p-6 md:p-8"
      >
        {/* Header Section */}
        <div className="mx-auto max-w-7xl mb-8 space-y-6">
          <div className="space-y-2">
            <h1 
              style={{marginTop: "5%", marginLeft: "10%", color: WHITE} }
              className=" font-bold text-2xl"
            >
              Newest Version: {" "}
              <Link 
                href="/#" // direct to new version description
                // style={{color: WHITE}}
                // when hover over, get transparent and + underline
                className="font-normal text-blue-200 hover:text-blue-300 
                  transition-colors hover:underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                }}
              >
                1.2 (MM/DD/YYYY)
              </Link>
            </h1>
            <h1 
              style={{marginLeft: "10%", color: WHITE} }
              className="font-bold text-2xl"
            >
              Previous Versions: {" "}
              <Link 
                href="/#" // direct to new version description
                // style={{color: WHITE}}
                className="font-normal text-blue-200 hover:text-blue-300 
                  transition-colors hover:underline underline-offset-4"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                }}
              >
                link
              </Link>
            </h1>
            <h1 
              style={{marginLeft: "10%", color: WHITE}}
              className="font-bold text-2xl"
            >
              Useful Resources and Help: {" "}
              <div className="inline-block space-x-2">
                {[1, 2, 3].map((_, i) => (
                  <React.Fragment key={i}>
                    <Link 
                      href="/#"
                      className="font-normal text-blue-200
                       hover:text-blue-300 transition-colors 
                       hover:underline underline-offset-4"
                      onClick={(e) => e.preventDefault()}
                    >
                      link
                    </Link>
                    {i < 2 && <span>|</span>}
                  </React.Fragment>
                ))}
              </div>
            </h1>
          </div>
        </div>

        {/* Cards */}
        <div className="mx-auto max-w-7xl grid 
          grid-cols-1 md:grid-cols-2 gap-6">
          <Cards 
            link="start"
            title="Quick Start"
            description={descriptionApiRef}
          >
          </Cards>
          <Cards 
            link="user-guide"
            title="User Guide"
            description={descriptionUserGuide}
          >
          </Cards>
          <Cards 
            link="api-ref"
            title="API Reference"
            description={descriptionStart}
          >
          </Cards>
          <Cards 
            link="developer-hack"
            title="Developer HACK"
            description={descriptionDevlopment}
          >
          </Cards>
        </div>
        
      </div>
      
    );
  }

