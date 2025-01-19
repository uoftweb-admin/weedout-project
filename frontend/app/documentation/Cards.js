import React from "react";
import { GREEN, BLUE, WHITE } from "./colors";

export default function Cards({ children, link }) {
    return (
        <div
          style={{
            // You can swap to display: "flex" or "grid" as you prefer:
            display: "flex",
            background: WHITE,
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "2rem",
            marginTop: "3rem",
            marginLeft: "10%",
            marginRight: "10%",
            color: BLUE,
          }}
        >
            <a
                href={`document/${link}`}
            >
                {children}
            </a>
        </div>
    );
}