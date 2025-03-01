"use client";

import React from "react";
import Cards from "./Cards";
import Link from "next/link"
import { GREEN, BLUE, WHITE } from "./colors";
import { Inria_Serif } from '@next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function DocumentationPage() {
    const descriptionStart = `New to WeedOut? Check out the getting started guides. \
    They contain an introduction to WeedOut main concepts.`;
    const descriptionUserGuide = `The api reference provides in-depth information on the \
    key concepts with useful background information.`;
    // const descriptionApiRef = `Step-by-step guide to API ref`;
    const descriptionContributor = `Explore advanced configurations and customization \
    options for power users.`;

    const description = [
      {description: descriptionStart, link: "start", title: "Quick Start"},
      {description: descriptionUserGuide, link: "api-ref", title: "API Reference"},
      // {description: descriptionApiRef, link: "api-ref", title: "API Reference"},
      {description: descriptionContributor, link: "contributors-guide", title: "Contributors' Guide"},
    ];



    return (
      <div
        style={{backgroundColor: GREEN}}
        className={`min-h-screen p-4 sm:p-6 md:p-8, ${inriaSerif.className}`}
      >
        {/* Header Section */}
        <div className="mx-auto max-w-7xl mb-8 space-y-6">
          <div className="space-y-2">
            <h1 
              style={{marginTop: "5%", marginLeft: "10%", color: WHITE} }
              className=" font-bold text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              Newest Version: {" "}
              <Link 
                href="/#" // direct to new version description
                // style={{color: WHITE}}
                // when hover over, get transparent and + underline
                className="font-normal text-blue-200 hover:text-blue-300 
                  transition-colors hover:underline underline-offset-4
                  text-sm sm:text-base md:text-lg" // fluid text size
                onClick={(e) => {
                  e.preventDefault(); // Prevent default link behavior
                }}
              >
                1.4 (02/20/2025)
              </Link>
            </h1>
            <h1 
              style={{marginLeft: "10%", color: WHITE} }
              className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              Previous Versions: {" "}
              <Link 
                href="/" // direct to new version description
                // style={{color: WHITE}}
                className="font-normal text-blue-200 hover:text-blue-300 
                  transition-colors hover:underline underline-offset-4
                  text-sm sm:text-base md:text-lg" // fluid text size
                // onClick={(e) => {
                //   e.preventDefault(); // Prevent default link behavior
                // }}
              >
                link
              </Link>
            </h1>
            <h1 
              style={{marginLeft: "10%", color: WHITE}}
              className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl"
            >
              Useful Resources and Help: {" "}
              <div className="inline-block space-x-2">
                {[1, 2, 3].map((_, i) => (
                  <React.Fragment key={i}>
                    <Link 
                      href="/#"
                      className="font-normal text-blue-200
                       hover:text-blue-300 transition-colors 
                       hover:underline underline-offset-4
                       text-sm sm:text-base md:text-lg" // fluid text size
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
          {description.map(({description, link, title}) => (
            <Cards 
              key = {title} // unique key
              link={link}
              title={title}
              description={description}
            >
            </Cards>
          ))}
{/* 
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
          </Cards> */}
        </div>
        
      </div>
      
    );
  }

