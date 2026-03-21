import React, { useState, useRef, useEffect } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { GoDotFill } from "react-icons/go";
import { FaUserLarge } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const DashboardHeader = ({ toggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, adminData } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])
  return (
    <div className="flex sticky top-0 z-20 justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-lightBlue rounded-md">
      {/* Sidebar Toggle */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-700 focus:outline-none text-xl"
      >
        <RiMenu2Fill />
      </button>

      {/* Welcome Text */}
      <div className="flex-1 mx-3 md:mx-0">
        <h1 className="text-md md:text-lg xl:text-2xl font-semibold text-gray-900">
          Welcome Back, <span className="font-bold">{adminData?.username || 'Admin'}</span>! 👋
        </h1>
        <p className="text-xs xl:text-sm text-gray-500 mt-1 hidden md:block">
          Let's see how your Dashboard looks today.
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-3 md:space-x-4">
        {/* Static Date */}
        <div className="font-semibold flex items-center px-3 py-1 bg-white rounded-full border shadow-sm text-xs text-black">
          <svg
            fill="none"
            viewBox="0 0 24 25"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 size-5"
          >
            <path
              d="M7 4.866v-1.5m10 1.5v-1.5"
              stroke="#000"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <path
              d="M21.5 9.866H2"
              stroke="#000"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
            <path
              d="M14 22.866h-4c-3.771 0-5.657 0-6.828-1.172C2.001 20.522 2 18.637 2 14.866v-2c0-3.77 0-5.657 1.172-6.828C4.344 4.868 6.229 4.866 10 4.866h4c3.771 0 5.657 0 6.828 1.172C21.999 7.21 22 9.095 22 12.866v2c0 3.771 0 5.657-1.172 6.828"
              stroke="#000"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
          {new Date().toLocaleString("default", { month: "long", year: "numeric" })}
        </div>

        {/* Profile Dropdown (Static UI) */}
        <div className="relative" ref={dropdownRef}>
          <button className="bg-Lime rounded-full p-2 relative flex items-center"
            onClick={() => setOpen((prev) => !prev)}
          >
            <GoDotFill className="absolute top-0 right-0 text-emerald-500 size-3 animate-ping" />
            <FaUserLarge className="w-4 h-4" />
          </button>

          {/* Always visible dropdown (static) */}
          {open && <div className="absolute right-0 mt-2 w-32 bg-white rounded-sm shadow-xl py-0 z-50">
            <Link
              to="/admin/my-profile"
              className="block px-4 py-2 text-xs text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </Link>
            <div className="border-t border-gray-200" />
            <button
              onClick={() => {
                setOpen(false);
                logout();
              }}
              className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-red-100"
            >
              Sign Out
            </button>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
