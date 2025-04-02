import React from "react";
import { BLUE, WHITE } from "./colors";
import Link from "next/link";
import { Inria_Serif } from 'next/font/google';

const inriaSerif = Inria_Serif({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function Cards({ link, title, description }) {
    return (
        <div
          style={{
            // You can swap to display: "flex" or "grid" as you prefer:
            background: WHITE,
            color: BLUE,
          }}
        className={` rounded-xl shadow-lg hover:shadow-xl
        transition-shadow duration-300 p-8 h-full flex flex-col ${inriaSerif.className}`}
        >
            {/* title and descriptions */}
            <div className="flex-1 text-center">
                <h3 className="text-2xl font-bold mb-4">{title}</h3>
                <p className="mb-6 whitespace-pre-line">{description}</p>
            </div>

            {/* the link button */}
            {/* <button> */}
            <Link
                href={`documentation/${link}`}
                style={{background: BLUE, color: WHITE}}
                className={`mt-auto inline-block hover:scale-105 px-6 py-3 rounded-lg font-medium transition-colors duration-200 text-center`}
            >
                For More →
            </Link>
            {/* </button> */}
        </div>
    );
}