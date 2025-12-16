import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import url_prefix from "../data/variable";
import { useLanguage } from "../hooks/useLanguage";


export default function Hero() {

  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    heading: "Find Trusted Hospitals & Doctors",
    subheading: "Compare hospitals, connect with specialists, and book appointments effortlessly – across the globe.",
  });


  const countries = [
    { name: "India", flag: "🇮🇳" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "USA", flag: "🇺🇸" },
    { name: "UK", flag: "🇬🇧" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "Turkey", flag: "🇹🇷" },
    { name: "Thailand", flag: "🇹🇭" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "France", flag: "🇫🇷" },
  ];

  const features = [
    {
      icon: "⏰",
      title: "24/7 Support",
      desc: "Always available for patients.",
    },
    {
      icon: "🏥",
      title: "Best Facilities",
      desc: "World-class hospitals & equipment.",
    },
    {
      icon: "⚕️",
      title: "One-Stop Care",
      desc: "Consult, book & treat in one place.",
    },
    {
      icon: "🌍",
      title: "Global Reach",
      desc: "Trusted doctors in 10+ countries.",
    },
  ];


  useEffect(() => {
    if (!language) {
      console.log("Language not yet available, skipping fetch");
      return;
    }

    const fetchHeadings = async () => {
      try {
        const response = await fetch(
          `${url_prefix}/api/headings/carousel/${language}`
        );
        const result = await response.json();
        if (result.success) {
          // console.log('reslut', result.data.home[0])
          setHeadings({
            heading: result.data.home[0]?.heading,
            subheading:
              result.data.home[0]?.description

          });
        }
      } catch (error) {
        console.error("Error fetching headings:", error);
        // Keep default headings if fetch fails
      }
    };

    fetchHeadings();
    // console.log("headings:", headings)
  }, [language]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden py-8 sm:py-12 lg:py-16">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/hero-bg.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 w-full max-w-5xl mx-auto">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-extrabold leading-tight break-words
                     text-[clamp(1.5rem,5vw,3.5rem)]"
        >
          {/* Find Trusted Hospitals & Doctors */}
          {headings.heading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-4 leading-relaxed break-words
                     text-[clamp(0.875rem,3vw,1.25rem)] max-w-md sm:max-w-lg mx-auto"
        >
          {/* Compare hospitals, connect with specialists, and book appointments
          effortlessly – across the globe. */}
          {headings.subheading}

        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-1 sm:px-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: "0px 12px 28px rgba(0, 128, 128, 0.4)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 sm:p-6 flex flex-col items-center text-center shadow-lg cursor-pointer"
            >
              <span className="text-[clamp(1.5rem,4vw,2.5rem)] mb-2">
                {feature.icon}
              </span>
              <h3 className="font-semibold text-[clamp(0.875rem,2.5vw,1.25rem)]">
                {feature.title}
              </h3>
              <p className="text-[clamp(0.625rem,1.5vw,0.875rem)] mt-1 opacity-90">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Countries Belt */}
        <div className="mt-8 sm:mt-10 w-full overflow-hidden px-2">
          <h2
            className="text-white font-semibold mb-2 sm:mb-3 leading-snug
                         text-[clamp(1rem,3.5vw,1.75rem)]"
          >
            Our Medical Destinations
          </h2>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-2 xs:gap-3 sm:gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              {countries
                .concat(countries) // duplicate for seamless loop
                .map((dest, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="bg-white/10 px-2 xs:px-3 py-1 rounded-lg inline-flex items-center gap-1 xs:gap-2 backdrop-blur-md cursor-pointer
                               text-[clamp(0.625rem,1.5vw,0.875rem)]"
                  >
                    <span className="text-[clamp(0.875rem,2.5vw,1.25rem)]">
                      {dest.flag}
                    </span>
                    <span className="truncate max-w-[60px] xs:max-w-[80px] sm:max-w-[100px]">
                      {dest.name}
                    </span>
                  </motion.div>
                ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}