import React, { useState, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  PiGlobe, PiListBullets, PiListPlus, PiLockKeyOpen,
  PiShieldChevron, PiStack, PiTranslate, PiUserPlus,
  PiMagnifyingGlass, PiArticle,
} from "react-icons/pi";
import logo from "../../assets/logo.jpg";

const menuItems = [
  {
    icon: <LuLayoutDashboard />,
    label: "Dashboard",
    link: "/admin/dashboard",
  },
  {
    icon: <PiLockKeyOpen />,
    label: "Doctor",
    subItems: [
      {
        icon: <PiUserPlus />,
        label: "Doctor List",
        link: "/admin/doctors-add",
      },
    ],
  },
  {
    icon: <PiLockKeyOpen />,
    label: "Hospital",
    subItems: [
      {
        icon: <PiShieldChevron />,
        label: "Hospital List",
        link: "/admin/hospitals/list",
      },
      {
        icon: <PiUserPlus />,
        label: "Add Hospital",
        link: "/admin/hospitals-add",
      },
    ],
  },
  {
    icon: <PiStack />,
    label: "Master Management",
    subItems: [
      { icon: <PiGlobe />,       label: "Countries",       link: "/admin/master/countries" },
      { icon: <PiTranslate />,   label: "Languages",       link: "/admin/hospital/language-setting" },
      { icon: <PiListBullets />, label: "Categories",      link: "/admin/master/categories" },
      { icon: <PiListPlus />,    label: "Sub-Categories",  link: "/admin/master/sub-categories" },
    ],
  },
  {
    icon: <PiMagnifyingGlass />,
    label: "SEO Management",
    link: "/admin/seo",
  },
  {
    icon: <PiArticle />,
    label: "Blog Management",
    link: "/admin/blogs",
  },
];

/* ═══════════════════════════════════════════════════ */
const Sidebar = ({ sidebarCollapsed, toggleSidebar }) => {
  const location  = useLocation();
  const path      = location.pathname;
  const { logout } = useAuth();
  const [openDropdown, setOpenDropdown] = useState(null);

  /* Auto-open the dropdown whose child is active */
  useEffect(() => {
    const idx = menuItems.findIndex(
      item => item.subItems?.some(sub => path === sub.link)
    );
    if (idx !== -1) setOpenDropdown(idx);
  }, [path]);

  const toggleDropdown = (index) =>
    setOpenDropdown(prev => (prev === index ? null : index));

  const isActive = (link, subItems) => {
    if (link) return path === link || (link === "/admin/dashboard" && path === "/admin");
    return subItems?.some(s => path === s.link);
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  /* ── styles ── */
  const activeItem  = "bg-teal-600 text-white";
  const inactiveItem = "text-gray-600 hover:bg-teal-50 hover:text-teal-700";
  const activeSub   = "bg-teal-50 text-teal-700 font-semibold";
  const inactiveSub = "text-gray-500 hover:bg-gray-50 hover:text-gray-800";

  return (
    <div className="w-full min-h-full bg-white flex flex-col border-r border-gray-100">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <img src={logo} alt="Logo" className="w-9 h-9 object-cover rounded-lg" />
        <div>
          <p className="text-sm font-bold text-gray-900 leading-none">Admin Panel</p>
          <p className="text-xs text-gray-400 mt-0.5">Medical Tourism</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {menuItems.map((item, index) => {
          const active = isActive(item.link, item.subItems);

          /* ── direct link ── */
          if (!item.subItems) {
            return (
              <Link
                key={index}
                to={item.link}
                onClick={closeOnMobile}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? activeItem : inactiveItem
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {!active && <IoChevronForward className="text-xs text-gray-300" />}
              </Link>
            );
          }

          /* ── dropdown ── */
          return (
            <div key={index}>
              <button
                onClick={() => toggleDropdown(index)}
                className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-teal-50 text-teal-700" : inactiveItem
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                <span className="text-gray-400 text-xs transition-transform duration-200">
                  {openDropdown === index ? <FiChevronUp /> : <FiChevronDown />}
                </span>
              </button>

              {/* Sub items */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openDropdown === index ? "max-h-60" : "max-h-0"
                }`}
              >
                <ul className="ml-4 mt-0.5 mb-1 border-l border-teal-100 pl-3 space-y-0.5">
                  {item.subItems.map((sub, si) => (
                    <li key={si}>
                      <Link
                        to={sub.link}
                        onClick={closeOnMobile}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                          path === sub.link ? activeSub : inactiveSub
                        }`}
                      >
                        <span className="text-xs">{sub.icon}</span>
                        <span>{sub.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </nav>

      {/* Logout at bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
          <span className="text-base">⏻</span>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
