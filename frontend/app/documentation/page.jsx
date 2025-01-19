"use client";

import React from "react";
import Cards from "./Cards";
import { GREEN, BLUE, WHITE } from "./colors";

export default function DocumentationPage() {
    return (
      <div
        style={{
          backgroundColor: GREEN,
        }}
      >
        <h1 style={{marginTop: "5%", marginLeft: "10%", color: WHITE} }>
          Newest Version: {"\t"}
          <a 
            href="/#" // direct to new version description
            style={{textDecorationLine: "underline", color: WHITE}}
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
            }}
          >
            1.2
          </a>
        </h1>
        <h1 style={{marginLeft: "10%", color: WHITE}}>
          Previous Versions: {"\t"}
          <a 
            href="/#" // direct to new version description
            style={{textDecorationLine: "underline", color: WHITE}}
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
            }}
          >
            link
          </a>
        </h1>
        <h1 style={{marginLeft: "10%", color: WHITE}}>
          Useful Resources and Help: {"\t"}
          <a 
            href="/#" // direct to new version description
            style={{textDecorationLine: "underline"}}
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
            }}
          >
            link
          </a>
          <a> | </a>
          <a 
            href="/#" // direct to new version description
            style={{textDecorationLine: "underline"}}
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
            }}
          >
            link
          </a>
          <a> | </a>
          <a 
            href="/#" // direct to new version description
            style={{textDecorationLine: "underline"}}
            onClick={(e) => {
              e.preventDefault(); // Prevent default link behavior
            }}
          >
            link
          </a>
        </h1>

        <Cards
          link="module"
        >
          Module
        </Cards>

        <Cards
          link="userGuide"
        >
          User Guide
        </Cards>

        <Cards
          link="start"
        >
          {"How To Install\n (Quick Start)"}
        </Cards>

        <Cards
          link="XXX"
        >
          XXX
        </Cards>

      </div>
      
    );
  }

