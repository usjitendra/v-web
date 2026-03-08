import React, { useState, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  IoChevronForward,

} from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";


import {
  LuLayoutDashboard,

} from "react-icons/lu";
import { PiGlobe, PiListBullets, PiListPlus, PiLockKeyOpen, PiShieldChevron, PiStack, PiTranslate, PiUserPlus, PiMagnifyingGlass, PiArticle } from "react-icons/pi";


import logo from '../../assets/logo.jpg';

const menuItems = [
  // {
  //   icon: <LuLayoutDashboard />,
  //   label: "Dashboard",
  //   link: "/admin/dashboard",
  //   permission: "dashboard",
  // },
  {
    icon: <PiLockKeyOpen />,
    label: "Doctor",
    permission: "rbac",
    subItems: [
      // {
      //   icon: <PiShieldChevron />,
      //   label: "Doctor List",
      //   link: "/admin/doctors/list",
      //   permission: "doctor.create",
      // },
      {
        icon: <PiUserPlus />,
        label: "Doctor List",
        link: "/admin/doctors-add",
        permission: "doctor.create",
      },
    ],

  },
  {
    icon: <PiLockKeyOpen />,
    label: "Hospital",
    permission: "rbac",
    subItems: [
      {
        icon: <PiShieldChevron />,
        label: "Hospital List",
        link: "/admin/hospitals/list",
        permission: "hospital.create",
      },
      {
        icon: <PiUserPlus />,
        label: "Add Hospital",
        link: "/admin/hospitals-add",
        permission: "hospital.create",
      },
    ],

  },
  {
    icon: <PiStack />,
    label: "Master Management",
    permission: "rbac",
    subItems: [
      {
        icon: <PiGlobe />,
        label: "Countries",
        link: "/admin/master/countries",
        permission: "country.read",
      },
      {
        icon: <PiTranslate />,
        label: "Languages",
        link: "/admin/hospital/language-setting",
        permission: "language.read",
      },
      {
        icon: <PiListBullets />,
        label: "Categories",
        link: "/admin/master/categories",
        permission: "category.read",
      },
      {
        icon: <PiListPlus />,
        label: "Sub-Categories",
        link: "/admin/master/sub-categories",
        permission: "subcategory.read",
      },
    ],
  },
  {
    icon: <PiMagnifyingGlass />,
    label: "SEO Management",
    link: "/admin/seo",
    permission: "seo.read",
  },
  {
    icon: <PiArticle />,
    label: "Blog Management",
    link: "/admin/blogs",
    permission: "blog.read",
  }

];

const Sidebar = ({ sidebarCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const [openDropdown, setOpenDropdown] = useState(null);
  const { logout } = useAuth();


  const getUserObject = () => {
    return typeof isAdmin === "object" ? isAdmin : null;
  };

  const user = getUserObject();

  const isUserAdmin = !user?.role || user?.role === "admin";
  // console.log("isUserAdmin in sidebar=", isUserAdmin);

  const userPermissions =
    user?.permissions?.filter((p) => p?.name).map((p) => p.name) || [];
  // console.log("userPermissions in sidebar=", userPermissions);

  const getPanelName = () => {
    if (!user?.role) return "Admin Panel";
    if (user.role === "admin") return "Admin Panel";
    if (user.role === "staff") return "Staff Panel";
    return `${user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel`;
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  useEffect(() => {
    const activeIndex = menuItems.findIndex(
      (item) =>
        item.subItems &&
        item.subItems.some((subItem) => currentPath === subItem.link)
    );
    if (activeIndex !== -1) {
      setOpenDropdown(activeIndex);
    }
  }, [currentPath]);

  const toggleDropdown = (index) => {
    if (openDropdown === index) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(index);
    }
  };

  const isActive = (link, subItems) => {
    if (link && currentPath === link) return true;
    if (subItems) {
      return subItems.some((item) => currentPath === item.link);
    }
    return false;
  };

  const hasPermission = (permission) => {
    if (permission === "dashboard") return true;
    if (isUserAdmin) return true;
    return userPermissions.includes(permission);
  };

  const filteredMenuItems = menuItems.filter((item) => {
    if (isUserAdmin) return true;

    if (item.subItems) {
      const hasValidSubItems = item.subItems.some((subItem) =>
        hasPermission(subItem.permission)
      );
      return hasValidSubItems;
    }

    return item.permission ? hasPermission(item.permission) : true;
  });

  return (
      <div className="w-64 md:w-56 xl:w-64 min-h-full bg-white px-4 py-6">
        <div className="flex items-center space-x-2 mb-8 md:mb-4 xl:mb-8 ml-5">
          <img
            src={logo}
            alt="Admin Logo"
            loading="lazy"
            className="w-10 h-10 object-cover"
          />
          <span className="font-semibold text-lg md:text-sm xl:text-lg">
            {getPanelName()}
          </span>
        </div>

        <ul className="space-y-1">
          {filteredMenuItems.map((item, index) => {
            const filteredSubItems = item.subItems
              ? item.subItems.filter((subItem) =>
                hasPermission(subItem.permission)
              )
              : null;

            if (item.subItems && filteredSubItems.length === 0) {
              return null;
            }

            return (
              <li key={index}>
                {filteredSubItems ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(index)}
                      className={`flex items-center justify-between w-full px-4 py-2 rounded-full text-sm md:text-xs xl:text-sm font-medium transition-colors ${isActive(item.link, filteredSubItems)
                        ? "bg-[#06e861] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <span className="truncate">{item.label}</span>
                      </div>
                      <span className="text-xl md:text-sm xl:text-xl transition-transform duration-500 ease-in-out">
                        {openDropdown === index ? (
                          <FiChevronUp />
                        ) : (
                          <FiChevronDown />
                        )}
                      </span>
                    </button>

                    <div
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${openDropdown === index ? "max-h-full" : "max-h-0"
                        }`}
                    >
                      <ul className="ml-4 mt-1 space-y-1">
                        {filteredSubItems.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.link}
                              onClick={handleLinkClick}
                              className={`flex items-center px-4 py-2 rounded-full text-sm md:text-xs xl:text-sm font-medium transition-colors ${currentPath === subItem.link
                                ? "bg-gray-200 text-black"
                                : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                              <div className="flex items-center space-x-2">
                                {subItem.icon}
                                <span className="truncate">
                                  {subItem.label}
                                </span>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.link}
                    onClick={handleLinkClick}
                    className={`flex items-center justify-between px-4 py-2 rounded-full text-sm md:text-xs xl:text-sm font-medium transition-colors ${currentPath === item.link
                      ? "bg-[#06e861] text-white"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </div>
                    <span className="text-xl md:text-sm xl:text-xl">
                      <IoChevronForward />
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
  );
};

export default Sidebar;
