import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronDown, Globe } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import {
  useGetCountryCategoryDropdownQuery,
  useGetLanguageDropdownQuery,
} from "@/rtk/slices/dropdownApiSlice";

const Header2 = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoverCountry, setHoverCountry] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);


  /* ================= API ================= */
  const { data } = useGetCountryCategoryDropdownQuery();
  const { data: languageData } = useGetLanguageDropdownQuery();

  const countries = data?.data?.result || [];

  console.log("Countries Data:", countries);
  const languages = languageData?.data || [];

  useEffect(() => {
    if (countries.length) {
      setHoverCountry(countries[0]);
      setActiveCountry(null);
    }
  }, [countries]);


  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= Nav ================= */
  const navItems = [
    { label: "Home", path: "/" },
    { label: "Hospitals", path: "/hospitals", mega: true },
    { label: "Doctors", path: "/doctors", mega: true },
    { label: "Cost", path: "/cost" },
    { label: "Knowledge", path: "/knowledge" },
    { label: "Patient Stories", path: "/patient-stories" },
  ];

  /* ================= UI ================= */
  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.96)"
          : "rgba(228,244,242,0.55)",
        boxShadow: scrolled ? "0 4px 18px rgba(0,0,0,0.08)" : "none",
      }}
      transition={{ duration: 0.25 }}
      className="fixed w-full z-[900]"
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* ================= Logo ================= */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 text-white rounded-md flex items-center justify-center font-bold">
            V
          </div>
          <div className="hidden sm:block font-semibold">
            Vaidam <span className="text-gray-500 font-normal">Medical</span>
          </div>
        </Link>

        {/* ================= Desktop Menu ================= */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <div key={item.label} className="relative group">
              <NavLink
                to={item.path}
                className="flex items-center gap-1 text-gray-800 font-medium hover:text-teal-600"
              >
                {item.label}
                {item.mega && <ChevronDown size={14} />}
              </NavLink>

              {/* ===== Mega Menu ===== */}
              {item.mega && (
                <div className="hidden group-hover:flex absolute top-full left-0 bg-white shadow-xl border rounded-md z-50">
                  {/* Countries */}
                  <div className="min-w-[220px] border-r">
                    {countries.map((country) => (
                      <div
                        key={country.countryId}
                        onMouseEnter={() => {
                          setHoverCountry(country);
                          setActiveCountry(null);;
                        }}
                        onClick={() => setActiveCountry(country)}
                        className="px-4 py-2 cursor-pointer hover:bg-blue-50 flex justify-between"
                      >
                        <span>{country.countryName}</span>
                        <ChevronDown className="-rotate-90 w-4 h-4" />
                      </div>
                    ))}
                  </div>

                  {/* Categories */}
                  {activeCountry && (
                    <div className="min-w-[240px] bg-gray-50">
                      {activeCountry.categories.map((cat) => (
                        <Link
                          key={cat.categoryId}
                          to={
                            item.label === "Doctors"
                              ? `/doctors?country=${activeCountry.slugName}&category=${cat.slugName}`
                              : `/hospitals?country=${activeCountry.slugName}&category=${cat.slugName}`
                          }
                          className="block px-4 py-2 hover:bg-blue-100 text-gray-700"
                        >
                          {cat.categoryName}
                        </Link>
                      ))}
                    </div>
                  )}

                </div>
              )}
            </div>
          ))}
        </nav>

        {/* ================= Right Section ================= */}
        <div className="hidden md:flex items-center gap-4">
          {/* Language */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-gray-700">
              <Globe size={16} />
              Language
              <ChevronDown size={14} />
            </button>

            <div className="hidden group-hover:block absolute right-0 top-full bg-white shadow-md rounded-md min-w-[150px] z-50">
              {languages.map((lang, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                >
                  {lang.language_name}
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            to="/free-consult"
            className="px-5 py-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-semibold shadow hover:scale-105 transition"
          >
            Get Free Quote
          </Link>
        </div>

        {/* ================= Mobile Button ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden"
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ================= Mobile Menu ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className="block text-gray-800 font-medium"
            >
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/free-consult"
            className="block text-center bg-teal-600 text-white py-2 rounded"
          >
            Get Free Quote
          </Link>
        </div>
      )}
    </motion.header>
  );
};

export default Header2;
