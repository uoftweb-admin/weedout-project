/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        customGreen: "#007057",
        beige: "#EDF5E1",
        blueText: "#05386B",
        infoBoxes: "#8EE4AF"
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        '7xl': '80rem',
      }
    },
  },
  variants: {
    extend: {
      scale: ['hover'],
      shadow: ['hover']
    }
  },
  plugins: [],
  
};
