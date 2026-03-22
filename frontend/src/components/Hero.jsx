import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import url_prefix from "../data/variable";
import { useLanguage } from "../hooks/useLanguage";
import { CountryFlag } from "../helper/countryFlags";


export default function Hero() {

  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    heading: "Find Trusted Hospitals & Doctors",
    subheading: "Compare hospitals, connect with specialists, and book appointments effortlessly – across the globe.",
  });


  const countries = [
    { name: "India", slug: "india" },
    { name: "Germany", slug: "germany" },
    { name: "USA", slug: "usa" },
    { name: "UK", slug: "uk" },
    { name: "Singapore", slug: "singapore" },
    { name: "UAE", slug: "uae" },
    { name: "Turkey", slug: "turkey" },
    { name: "Thailand", slug: "thailand" },
    { name: "Spain", slug: "spain" },
    { name: "France", slug: "france" },
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
  }, [language]);

  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden py-10 sm:py-14 md:py-16 lg:py-20">
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
      <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-8 w-full max-w-xs sm:max-w-xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto">
        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-extrabold leading-tight break-words
                     text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
        >
          {headings.heading}
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-3 sm:mt-4 leading-relaxed break-words
                     text-sm sm:text-base md:text-lg lg:text-xl
                     max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto"
        >
          {headings.subheading}
        </motion.p>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-6 sm:mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 px-0 sm:px-2 md:px-4"
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
              className="bg-white/10 backdrop-blur-md rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col items-center text-center shadow-lg cursor-pointer"
            >
              <span className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-1 sm:mb-2">
                {feature.icon}
              </span>
              <h3 className="font-semibold text-xs sm:text-sm md:text-base lg:text-lg">
                {feature.title}
              </h3>
              <p className="text-[10px] sm:text-xs md:text-sm mt-1 opacity-90 leading-snug">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Countries Belt */}
        <div className="mt-6 sm:mt-8 md:mt-10 w-full overflow-hidden px-0 sm:px-2">
          <h2
            className="text-white font-semibold mb-2 sm:mb-3 leading-snug
                         text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl"
          >
            Our Medical Destinations
          </h2>
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-2 sm:gap-3 md:gap-4 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              {countries
                .concat(countries)
                .map((dest, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.1, y: -2 }}
                    transition={{ type: "spring", stiffness: 200, damping: 12 }}
                    className="bg-white/10 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg inline-flex items-center gap-1 sm:gap-2 backdrop-blur-md cursor-pointer
                               text-[10px] sm:text-xs md:text-sm"
                  >
                    <CountryFlag name={dest.name} slug={dest.slug} width={24} />
                    <span className="truncate max-w-[50px] sm:max-w-[70px] md:max-w-[90px] lg:max-w-[110px]">
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