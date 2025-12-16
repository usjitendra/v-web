import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink } from "react-router-dom";
import url_prefix from "../data/variable"; // Make sure to adjust the path
import { useLanguage } from "../hooks/useLanguage";
import LanguageDropdown from "./LanguageDropdown";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [language] = useLanguage();
  const [navbarTabs, setNavbarTabs] = useState([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fetch navbar titles
  useEffect(() => {
    const fetchNavbarTitles = async () => {
      if (!language) return;

      try {
        const response = await fetch(`${url_prefix}/api/headings/navbar/${language}`);
        const result = await response.json();

        if (result.success) {
          setNavbarTabs(result.data.detailPage.navbar);
        } else {
          // Fallback to English if current language fails
          const fallbackResponse = await fetch(`${url_prefix}/api/headings/navbar/EN`);
          const fallbackResult = await fallbackResponse.json();
          if (fallbackResult.success) {
            setNavbarTabs(fallbackResult.data.detailPage.navbar);
          } else {
            setNavbarTabs(['Home', 'Treatments', 'Doctors', 'Hospitals', 'About', 'Log In']);
          }
        }
      } catch (error) {
        console.error('Failed to fetch navbar titles:', error);
        // Fallback titles
        setNavbarTabs(['Home', 'Treatments', 'Doctors', 'Hospitals', 'About', 'Log In']);
      }
    };

    fetchNavbarTitles();
  }, [language]);

  // Helper function to get navbar title safely
  const getNavTitle = (index) => {
    return navbarTabs[index] || ['Home', 'Treatments', 'Doctors', 'Hospitals', 'About', 'Log In'][index] || 'Menu';
  };

  return (
    <motion.header
      initial={false}
      animate={{
        backgroundColor: scrolled
          ? "rgba(255,255,255,0.96)"
          : "rgba(228, 244, 242, 0.55)",
        boxShadow: scrolled ? "0 4px 18px rgba(16,24,40,0.06)" : "none",
      }}
      transition={{ duration: 0.25 }}
      className="fixed w-full z-50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-md flex items-center justify-center text-white font-bold">
            W
          </div>
          <div className="hidden sm:block font-semibold text-darktext">
            Web <span className="text-lighttext font-medium">Name</span>
          </div>
        </Link>

        {/* Desktop Navbar */}
        <nav className="hidden md:flex gap-6 items-center">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold"
                : "text-darktext hover:text-primary transition"
            }
          >
            {getNavTitle(0)}
          </NavLink>
          <NavLink
            to="/treatments"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold"
                : "text-darktext hover:text-primary transition"
            }
          >
            {getNavTitle(1)}
          </NavLink>
          <NavLink
            to="/doctors"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold"
                : "text-darktext hover:text-primary transition"
            }
          >
            {getNavTitle(2)}
          </NavLink>
          <NavLink
            to="/hospitals"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold"
                : "text-darktext hover:text-primary transition"
            }
          >
            {getNavTitle(3)}
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive
                ? "text-primary font-semibold"
                : "text-darktext hover:text-primary transition"
            }
          >
            {getNavTitle(4)}
          </NavLink>

          {/* 🔑 Log In styled as CTA */}
          <NavLink
            to="/patient/login"
            className={({ isActive }) =>
              `px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm
               ${isActive
                ? "bg-primary text-white shadow-md scale-[1.05]"
                : "bg-gradient-to-r from-primary to-teal-500 text-white hover:scale-[1.07] hover:shadow-lg"
              }`
            }
          >
            {getNavTitle(5)}
          </NavLink>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* 🌟 Subtle Get Free Quote */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="animate-pulse-slow"
          >
            <Link
              to={`/book`}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-primary to-teal-500 text-white font-semibold tracking-wide shadow-md hover:shadow-lg transition-all duration-300"
            >
              Get Free Quote
            </Link>
          </motion.div>

          <LanguageDropdown />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="md:hidden bg-white border-t"
        >
          <div className="px-4 py-4 flex flex-col gap-3">
            <NavLink to="/" onClick={() => setOpen(false)}>
              {getNavTitle(0)}
            </NavLink>
            <NavLink to="/treatments" onClick={() => setOpen(false)}>
              {getNavTitle(1)}
            </NavLink>
            <NavLink to="/doctors" onClick={() => setOpen(false)}>
              {getNavTitle(2)}
            </NavLink>
            <NavLink to="/hospitals" onClick={() => setOpen(false)}>
              {getNavTitle(3)}
            </NavLink>
            <NavLink to="/about" onClick={() => setOpen(false)}>
              {getNavTitle(4)}
            </NavLink>
            <NavLink to="/patient/login" onClick={() => setOpen(false)}>
              {getNavTitle(5)}
            </NavLink>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}