import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo1.jpg";

import {
  useGetCountryCategoryDropdownQuery,
  useGetLanguageDropdownQuery,
} from "@/rtk/slices/dropdownApiSlice";
import { CountryFlag } from "@/helper/countryFlags";

const ROW_H = 46;   // country row height  (px)
const LABEL_H = 32;   // "COUNTRIES" header  (px)
const MAX_LIST_H = 320; // max scrollable height for country list

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const [hoverIdx, setHoverIdx] = useState(0);
  const [mobileExpanded, setMobileExpanded] = useState({});

  const closeTimer = useRef(null);

  const { data } = useGetCountryCategoryDropdownQuery();
  const { data: languageData } = useGetLanguageDropdownQuery();
  const countries = data?.data?.result ?? [];
  const languages = languageData?.data ?? [];

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const openMega = useCallback((lbl) => {
    clearTimeout(closeTimer.current);
    setActiveMega(lbl);
    setHoverIdx(0);
  }, []);
  const closeMega = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveMega(null), 180);
  }, []);
  const cancelClose = useCallback(() => clearTimeout(closeTimer.current), []);

  const navItems = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Hospitals", path: "/hospitals", mega: true },
    { label: "Doctors", path: "/doctors", mega: true },
    { label: "Clinical Psychology", path: "/specialities/therapies" },
  ];

  const hoverCountry = countries[hoverIdx] ?? null;

  /* The left-column full height = LABEL_H + rows + 10px bottom pad */
  const leftH = LABEL_H + Math.min(countries.length, 7) * ROW_H + 10;

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: "rgba(255,255,255,1)",
        boxShadow: scrolled
          ? "0 2px 16px rgba(0,0,0,0.09)"
          : "0 1px 0 rgba(0,0,0,0.07)",
      }}
      transition={{ duration: 0.2 }}
      className="fixed w-full z-[900]"
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center" style={{ height: 62 }}>

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 mr-8">
          <img
            src={logo}
            alt="MedicwayCare Logo"
            className="w-9 h-9 object-cover rounded-xl shadow-sm"
          />
          <span className="font-bold text-gray-900 text-[15px] tracking-tight">
            Medicway<span className="text-gray-400 font-normal">Care</span>
          </span>
        </Link>
        {/* ── Desktop Nav ── */}
        <nav className="hidden lg:flex items-center flex-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.mega ? openMega(item.label) : null}
              onMouseLeave={() => item.mega ? closeMega() : null}
            >
              <NavLink
                to={item.path}
                style={{ height: 62 }}
                className={({ isActive }) =>
                  `relative flex items-center gap-1 px-4 text-[13.5px] font-medium transition-colors duration-150 ${isActive ? "text-teal-600" : "text-gray-700 hover:text-teal-600"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {item.mega && (
                      <ChevronDown
                        size={13}
                        className={`mt-px transition-transform duration-200 ${activeMega === item.label ? "rotate-180" : ""}`}
                      />
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-teal-500 rounded-t-full" />
                    )}
                  </>
                )}
              </NavLink>

              {/* ══════════════ MEGA MENU ══════════════ */}
              <AnimatePresence>
                {item.mega && activeMega === item.label && (
                  <motion.div
                    key="mega"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    onMouseEnter={cancelClose}
                    onMouseLeave={closeMega}
                    className="absolute left-0 bg-white rounded-2xl z-50"
                    style={{
                      top: "calc(100% + 6px)",
                      minWidth: 620,
                      boxShadow: "0 8px 40px rgba(0,0,0,0.13)",
                      border: "1px solid #e8e8e8",
                    }}
                  >
                    <div className="flex overflow-hidden rounded-2xl">

                      {/* ─── LEFT: Country list ─── */}
                      <div
                        style={{
                          width: 230,
                          minWidth: 230,
                          flexShrink: 0,
                          borderRight: "1px solid #f0f0f0",
                        }}
                      >
                        {/* label */}
                        <div
                          className="flex items-center px-5"
                          style={{ height: LABEL_H }}
                        >
                          <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                            Countries
                          </span>
                        </div>

                        {/* rows — scrollable */}
                        <div
                          className="overflow-y-auto"
                          style={{ maxHeight: MAX_LIST_H }}
                        >
                          {countries.map((c, idx) => {
                            const active = hoverIdx === idx;
                            return (
                              <div
                                key={c.countryId}
                                style={{ height: ROW_H }}
                                onMouseEnter={() => setHoverIdx(idx)}
                                className={`relative flex items-center gap-3 px-5 cursor-pointer select-none transition-colors duration-100 ${active ? "bg-teal-50" : "hover:bg-gray-50"
                                  }`}
                              >
                                {active && (
                                  <motion.span
                                    layoutId={`lb-${item.label}`}
                                    className="absolute left-0 top-[8px] bottom-[8px] w-[3px] rounded-r-full bg-teal-500"
                                    transition={{ type: "spring", stiffness: 500, damping: 45 }}
                                  />
                                )}
                                <CountryFlag
                                  slug={c.slugName}
                                  name={c.countryName}
                                  width={22}
                                  className="flex-shrink-0 rounded-[3px] shadow-sm overflow-hidden"
                                />
                                <span className={`flex-1 text-[13.5px] font-medium truncate ${active ? "text-teal-700" : "text-gray-700"}`}>
                                  {c.countryName}
                                </span>
                                <ChevronRight
                                  size={13}
                                  className={`flex-shrink-0 ${active ? "text-teal-500" : "text-gray-300"}`}
                                />
                              </div>
                            );
                          })}
                          <div style={{ height: 10 }} />
                        </div>
                      </div>

                      {/* ─── RIGHT: Categories — ALWAYS starts from top, full height ─── */}
                      <div className="flex-1 flex flex-col min-w-0">

                        {/* spacer that aligns with the "COUNTRIES" label */}
                        <div style={{ height: LABEL_H, flexShrink: 0 }} />

                        {/* full-height scrollable category list */}
                        <AnimatePresence mode="wait">
                          {hoverCountry && (
                            <motion.div
                              key={hoverCountry.countryId}
                              initial={{ opacity: 0, x: -6 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.1 }}
                              className="flex flex-col flex-1"
                            >
                              <div
                                className="overflow-y-auto flex-1"
                                style={{ maxHeight: MAX_LIST_H }}
                              >
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
                                      style={{ height: ROW_H }}
                                      className="flex items-center justify-between px-6 group hover:bg-gray-50 transition-colors"
                                    >
                                      <span className="text-[11.5px] font-bold tracking-[0.09em] uppercase text-gray-500 group-hover:text-teal-600 transition-colors">
                                        {cat.categoryName}
                                      </span>
                                      <ChevronRight
                                        size={13}
                                        className="text-gray-300 group-hover:text-teal-500 flex-shrink-0 transition-colors"
                                      />
                                    </Link>
                                  ))
                                ) : (
                                  <div className="flex items-center justify-center py-10 text-sm text-gray-400">
                                    No specialities available
                                  </div>
                                )}
                              </div>

                              {/* view all */}
                              {hoverCountry.categories?.length > 0 && (
                                <div className="px-6 py-3 border-t border-gray-100 flex-shrink-0">
                                  <Link
                                    to={
                                      item.label === "Doctors"
                                        ? `/doctors?country=${hoverCountry.slugName}`
                                        : `/hospitals?country=${hoverCountry.slugName}`
                                    }
                                    onClick={() => setActiveMega(null)}
                                    className="text-[12px] font-semibold text-teal-600 hover:text-teal-700 hover:underline transition-colors"
                                  >
                                    View all in {hoverCountry.countryName} →
                                  </Link>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* ── Right ── */}
        <div className="hidden lg:flex items-center gap-3 ml-auto">
          <div
            className="relative"
            onMouseEnter={() => openMega("lang")}
            onMouseLeave={closeMega}
          >
            <button className="flex items-center gap-1.5 text-[13px] text-gray-600 hover:text-teal-600 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Globe size={14} />
              Language
              <ChevronDown size={12} className={`transition-transform duration-200 ${activeMega === "lang" ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {activeMega === "lang" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  onMouseEnter={cancelClose} onMouseLeave={closeMega}
                  className="absolute right-0 top-full mt-1.5 bg-white rounded-xl py-1.5 z-50 max-h-64 overflow-y-auto"
                  style={{ minWidth: 160, boxShadow: "0 8px 30px rgba(0,0,0,0.11)", border: "1px solid #e8e8e8" }}
                >
                  {languages.length > 0
                    ? languages.map((lang, i) => (
                      <div key={i} className="px-4 py-2.5 text-[13px] text-gray-700 hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition-colors">
                        {lang.language_name}
                      </div>
                    ))
                    : <div className="px-4 py-3 text-sm text-gray-400">No languages</div>
                  }
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            to="/contact"
            className="px-5 py-2.5 rounded-full bg-teal-500 text-white text-[13.5px] font-semibold hover:bg-teal-600 transition-all duration-200 shadow-sm"
          >
            Get Free Quote
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden p-2 ml-auto rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ══════════════ MOBILE MENU ══════════════ */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-0.5 max-h-[80vh] overflow-y-auto">
              {navItems.map((item) => (
                <div key={item.label}>
                  {item.mega ? (
                    <>
                      <button
                        onClick={() => setMobileExpanded((p) => ({ ...p, [item.label]: !p[item.label] }))}
                        className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium text-gray-800 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        {item.label}
                        <ChevronDown size={15} className={`transition-transform ${mobileExpanded[item.label] ? "rotate-180" : ""}`} />
                      </button>
                      <AnimatePresence>
                        {mobileExpanded[item.label] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.15 }}
                            className="ml-3 overflow-hidden"
                          >
                            {countries.map((country) => (
                              <div key={country.countryId}>
                                <button
                                  onClick={() => setMobileExpanded((p) => ({ ...p, [`${item.label}-${country.countryId}`]: !p[`${item.label}-${country.countryId}`] }))}
                                  className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-teal-50 transition-colors"
                                >
                                  <span className="flex items-center gap-2.5">
                                    <CountryFlag slug={country.slugName} name={country.countryName} width={18} className="rounded-sm" />
                                    {country.countryName}
                                  </span>
                                  <ChevronDown size={13} className={`transition-transform ${mobileExpanded[`${item.label}-${country.countryId}`] ? "rotate-180" : ""}`} />
                                </button>
                                <AnimatePresence>
                                  {mobileExpanded[`${item.label}-${country.countryId}`] && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                      transition={{ duration: 0.12 }}
                                      className="ml-4 overflow-hidden"
                                    >
                                      {country.categories?.map((cat) => (
                                        <Link
                                          key={cat.categoryId}
                                          to={item.label === "Doctors" ? `/doctors?country=${country.slugName}&category=${cat.slugName}` : `/hospitals?country=${country.slugName}&category=${cat.slugName}`}
                                          onClick={() => setMobileOpen(false)}
                                          className="block px-3 py-2 text-sm text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                                        >
                                          {cat.categoryName}
                                        </Link>
                                      ))}
                                      <Link
                                        to={item.label === "Doctors" ? `/doctors?country=${country.slugName}` : `/hospitals?country=${country.slugName}`}
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-3 py-2 text-xs text-teal-500 font-semibold hover:underline"
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
                      className={({ isActive }) => `block px-3 py-3 text-sm font-medium rounded-xl transition-colors ${isActive ? "text-teal-600 bg-teal-50" : "text-gray-800 hover:bg-gray-50"}`}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </div>
              ))}
              <div className="pt-3 mt-1 border-t border-gray-100">
                <Link
                  to="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="block text-center bg-teal-500 text-white py-3 rounded-2xl text-sm font-semibold hover:bg-teal-600 transition-colors"
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

export default Header;