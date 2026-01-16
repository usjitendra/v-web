// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        main: '#0E857F',           // Primary teal color
        'main-light': '#3A9B94',   // Lighter shade for hovers
        'main-dark': '#0A6B65',    // Darker shade for active states

        // Semantic Colors (using main color variations)
        primary: '#0E857F',        // Alias for main
        secondary: '#3A9B94',      // Light main
        accent: '#0E857F',         // Main color for accents

        // Neutral Colors
        darktext: '#1E293B',       // Dark text
        lighttext: '#64748B',      // Light text
        lightbg: '#FAFAFA',        // Light background

        // Layout Colors
        lightSky: '#F7FBFF',       // Very light blue-white
        sectiondiv: '#d8e8e8b0',   // Section divider with transparency

        // Standard Colors
        white: '#ffffff',
        black: '#000000',

        // Gradients
        sectiondivgradient: "linear-gradient(135deg, #e6f2f2 0%, #d8e8e8 100%)",

        // CSS Custom Properties
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))"
      },

      fontFamily: {
        sans: ["Poppins", "sans-serif"],
        sans: ["Poppins", "sans-serif"],
      },
      boxShadow: {
        smooth: "0 8px 30px rgba(16,24,40,0.06)",
      },
      borderRadius: {
        xl: "1rem",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
