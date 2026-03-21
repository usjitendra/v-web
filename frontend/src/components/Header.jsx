import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { Link, NavLink } from "react-router-dom";

import {
  useGetCountryCategoryDropdownQuery,
  useGetLanguageDropdownQuery,
} from "@/rtk/slices/dropdownApiSlice";
import { CountryFlag } from "@/helper/countryFlags";

const Header2 = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [hoverCountry, setHoverCountry] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState({});
  const closeTimer = useRef(null);

  /* ================= API ================= */
  const { data } = useGetCountryCategoryDropdownQuery();
  const { data: languageData } = useGetLanguageDropdownQuery();

  const countries = data?.data?.result || [];
  const languages = languageData?.data || [];

  useEffect(() => {
    if (countries.length && !hoverCountry) {
      setHoverCountry(countries[0]);
    }
  }, [countries]);

  /* ================= Scroll Effect ================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ================= Mega menu open/close with delay ================= */
  const openMega = (label) => {
    clearTimeout(closeTimer.current);
    setActiveMega(label);
  };

  const closeMega = () => {
    closeTimer.current = setTimeout(() => {
      setActiveMega(null);
    }, 150);
  };

  const cancelClose = () => {
    clearTimeout(closeTimer.current);
  };

  /* ================= Nav ================= */
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Hospitals", path: "/hospitals", mega: true },
    { label: "Doctors", path: "/doctors", mega: true },
    { label: "Clinical Psychology", path: "/specialities/clinical-psychology" },
  ];

  /* ================= UI ================= */
  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.98)"
          : "rgba(228,244,242,0.75)",
        boxShadow: scrolled ? "0 4px 18px rgba(0,0,0,0.08)" : "none",
      }}
      transition={{ duration: 0.25 }}
      className="fixed w-full z-[900] backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">

        {/* ================= Logo ================= */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-teal-600 text-white rounded-md flex items-center justify-center font-bold text-lg">
            V
          </div>
          <div className="hidden sm:block font-semibold text-gray-900">
            Vaidam <span className="text-gray-500 font-normal">Medical</span>
          </div>
        </Link>

        {/* ================= Desktop Menu ================= */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega ? openMega(item.label) : null}
              onMouseLeave={() => item.mega ? closeMega() : null}
            >
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    isActive
                      ? "text-teal-600 bg-teal-50"
                      : "text-gray-700 hover:text-teal-600 hover:bg-gray-50"
                  }`
                }
              >
                {item.label}
                {item.mega && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${activeMega === item.label ? "rotate-180" : ""}`}
                  />
                )}
              </NavLink>

              {/* ===== Mega Menu ===== */}
              <AnimatePresence>
                {item.mega && activeMega === item.label && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeMega}
                    className="absolute top-full left-0 mt-1 bg-white shadow-2xl border border-gray-100 rounded-xl z-50 flex overflow-hidden"
                    style={{ minWidth: 460 }}
                  >
                    {/* Countries Column */}
                    <div className="w-52 border-r border-gray-100 py-2">
                      <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Countries
                      </p>
                      {countries.map((country) => (
                        <div
                          key={country.countryId}
                          onMouseEnter={() => setHoverCountry(country)}
                          className={`px-4 py-2.5 cursor-pointer flex items-center justify-between text-sm transition-colors duration-100 ${
                            hoverCountry?.countryId === country.countryId
                              ? "bg-teal-50 text-teal-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <CountryFlag slug={country.slugName} name={country.countryName} width={20} className="shadow-sm" />
                            {country.countryName}
                          </span>
                          <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
                        </div>
                      ))}
                    </div>

                    {/* Categories Column */}
                    <div className="flex-1 py-2 bg-gray-50 min-w-[220px]">
                      {hoverCountry ? (
                        <>
                          <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                            {hoverCountry.countryName} — Specialities
                          </p>
                          <div className="max-h-72 overflow-y-auto">
                            {hoverCountry.categories?.length > 0 ? (
                              hoverCountry.categories.map((cat) => (
                                <Link
                                  key={cat.categoryId}
                                  to={
                                    item.label === "Doctors"
                                      ? `/doctors?country=${hoverCountry.slugName}&category=${cat.slugName}`
                                      : `/hospitals?country=${hoverCountry.slugName}&category=${cat.slugName}`
                                  }
                                  onClick={() => setActiveMega(null)}
                                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 transition-colors duration-100"
                                >
                                  {cat.categoryName}
                                </Link>
                              ))
                            ) : (
                              <p className="px-4 py-3 text-sm text-gray-400">
                                No specialities found
                              </p>
                            )}
                          </div>
                          <div className="px-4 pt-2 pb-1 border-t border-gray-200 mt-1">
                            <Link
                              to={
                                item.label === "Doctors"
                                  ? `/doctors?country=${hoverCountry.slugName}`
                                  : `/hospitals?country=${hoverCountry.slugName}`
                              }
                              onClick={() => setActiveMega(null)}
                              className="text-xs text-teal-600 font-medium hover:underline"
                            >
                              View all in {hoverCountry.countryName} →
                            </Link>
                          </div>
                        </>
                      ) : (
                        <p className="px-4 py-3 text-sm text-gray-400">
                          Hover a country to see specialities
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* ================= Right Section ================= */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => openMega("lang")}
            onMouseLeave={closeMega}
          >
            <button className="flex items-center gap-1.5 text-sm text-gray-700 hover:text-teal-600 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors">
              <Globe size={15} />
              <span>Language</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${activeMega === "lang" ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {activeMega === "lang" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={closeMega}
                  className="absolute right-0 top-full mt-1 bg-white shadow-xl border border-gray-100 rounded-xl min-w-[160px] py-1 z-50"
                >
                  {languages.length > 0 ? (
                    languages.map((lang, idx) => (
                      <div
                        key={idx}
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors"
                      >
                        {lang.language_name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-sm text-gray-400">No languages</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Button */}
          <Link
            to="/contact"
            className="px-5 py-2 rounded-full bg-teal-600 text-white text-sm font-semibold shadow-sm hover:bg-teal-700 hover:shadow-md transition-all duration-200"
          >
            Get Free Quote
          </Link>
        </div>

        {/* ================= Mobile Hamburger ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ================= Mobile Menu ================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      {/* Expandable section for mega items */}
                      <button
                        onClick={() =>
                          setMobileExpanded((prev) => ({
                            ...prev,
                            [item.label]: !prev[item.label],
                          }))
                        }
                        className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          size={16}
                          className={`transition-transform duration-200 ${mobileExpanded[item.label] ? "rotate-180" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {mobileExpanded[item.label] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-3 overflow-hidden"
                          >
                            {countries.map((country) => (
                              <div key={country.countryId}>
                                {/* Country row */}
                                <button
                                  onClick={() =>
                                    setMobileExpanded((prev) => ({
                                      ...prev,
                                      [`${item.label}-${country.countryId}`]: !prev[`${item.label}-${country.countryId}`],
                                    }))
                                  }
                                  className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-teal-50 transition-colors"
                                >
                                  <span className="flex items-center gap-2">
                                    <CountryFlag slug={country.slugName} name={country.countryName} width={18} className="shadow-sm" />
                                    {country.countryName}
                                  </span>
                                  <ChevronDown
                                    size={13}
                                    className={`transition-transform duration-200 ${
                                      mobileExpanded[`${item.label}-${country.countryId}`] ? "rotate-180" : ""
                                    }`}
                                  />
                                </button>

                                <AnimatePresence>
                                  {mobileExpanded[`${item.label}-${country.countryId}`] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.12 }}
                                      className="ml-3 overflow-hidden"
                                    >
                                      {country.categories?.map((cat) => (
                                        <Link
                                          key={cat.categoryId}
                                          to={
                                            item.label === "Doctors"
                                              ? `/doctors?country=${country.slugName}&category=${cat.slugName}`
                                              : `/hospitals?country=${country.slugName}&category=${cat.slugName}`
                                          }
                                          onClick={() => setMobileOpen(false)}
                                          className="block px-3 py-2 text-sm text-teal-700 hover:bg-teal-50 rounded-md transition-colors"
                                        >
                                          {cat.categoryName}
                                        </Link>
                                      ))}
                                      <Link
                                        to={
                                          item.label === "Doctors"
                                            ? `/doctors?country=${country.slugName}`
                                            : `/hospitals?country=${country.slugName}`
                                        }
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2 text-xs text-teal-500 font-medium hover:underline"
                                      >
                                        View all →
                                      </Link>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <NavLink
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        `block px-3 py-2.5 text-sm font-medium rounded-md transition-colors ${
                          isActive ? "text-teal-600 bg-teal-50" : "text-gray-800 hover:bg-gray-50"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}

              <div className="pt-2 border-t border-gray-100">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-teal-600 text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
                >
                  Get Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header2;
