// tailwind.config.cjs
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#008080",
        accent: "#F4A261",
        lightbg: "#FAFAFA",
        darktext: "#1E293B",
        lighttext: "#64748B",
        // sectiondiv: "#eff5f2",
        // sectiondiv: "#d8e8e8ff",
        sectiondiv: "#d8e8e8b0",
        sectiondivgradient: "linear-gradient(135deg, #e6f2f2 0%, #d8e8e8 100%)",
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        main: '#0E857F',
        light: '#656262',
        // prime: '#1A9CA6', 
        lightSky: '#F7FBFF',
        dark: '#001E3A',
        white: '#ffffff',  // Standard white color
        black: '#000000',  // Standard black color
        yellow: '#0E857F'
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
