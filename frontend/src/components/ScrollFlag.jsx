import { motion } from "framer-motion";
import { CountryFlag } from "../helper/countryFlags";

export default function ScrollFlag() {
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

  return (
    <section className=" w-full flex flex-col items-center justify-center py-6  ">
      <div className="text-center text-black w-full max-w-7xl mx-auto px-4">
        {/* Title */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-6">
          Our Medical Destinations
        </h2>

        {/* Countries Belt */}
        <div className="w-full overflow-hidden">
          <div className="relative overflow-hidden">
            <motion.div
              className="flex gap-3 whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
            >
              {countries.concat(countries).map((dest, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  className="bg-white/10 px-3 py-1.5 rounded-lg inline-flex items-center gap-2 backdrop-blur-md cursor-pointer text-sm"
                >
                  <CountryFlag name={dest.name} slug={dest.slug} width={24} />
                  <span>{dest.name}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
