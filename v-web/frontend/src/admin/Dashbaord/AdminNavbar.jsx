import React, { useEffect, useRef, useState } from "react";
import { RiMenu2Fill } from "react-icons/ri";
import { GoBellFill, GoDotFill } from "react-icons/go";
import Calendar from "./Calendar";
import useAuth from "../../../Hooks/useAuth";
import { Link } from "react-router-dom";
import { FaUserLarge } from "react-icons/fa6";
import NotificationDropdown from "../../../components/NotificationDropdown/NotificationDropdown";
import adminLogout from "../../../Hooks/adminLogout";

const DashboardHeader = ({ toggleSidebar }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const [currentDate] = useState(new Date());
  const formatDate = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const { isAdmin } = useAuth();

  const logout = adminLogout();

  const handleLogout = async () => {
    await logout();
  };

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showCalendar &&
        calendarRef.current &&
        !calendarRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowCalendar(false);
      }

      if (
        isLoginDropdownOpen &&
        !event.target.closest(".login-dropdown-trigger") &&
        !event.target.closest(".login-dropdown-content")
      ) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar, isLoginDropdownOpen]);

  return (
    <div
      className={`flex sticky top-0  z-20 justify-between items-center px-4 py-3 md:px-6 md:py-4 bg-lightBlue rounded-md `}
    >
      <button
        onClick={toggleSidebar}
        className="md:hidden text-gray-700  focus:outline-none text-xl"
      >
        <RiMenu2Fill />
      </button>

      <div className="flex-1 mx-3 md:mx-0">
        <h1 className="text-md md:text-lg xl:text-2xl font-semibold text-gray-900 md:truncate">
          Welcome Back,{" "}
          {isAdmin?.name ? (
            <>
              <span className="md:hidden">{isAdmin.name.split(" ")[0]}</span>
              <span className="hidden md:inline">{isAdmin.name}</span>
            </>
          ) : (
            "Sir"
          )}
          ! <span className="inline-block">👋</span>
        </h1>
        <p className="text-xs md:text-xs xl:text-sm text-gray-500 mt-1 hidden md:block md:truncate">
          Let's see how your Dashboard looks today.
        </p>
      </div>

      <div className="relative">
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* <div className="w-7 h-7 md:w-6 md:h-6 xl:w-8 xl:h-8 flex items-center justify-center bg-Lime rounded-full">
            <GoBellFill className="text-black size-4 md:size-4 xl:size-5" />
          </div> */}
          <NotificationDropdown />

          <button
            ref={buttonRef}
            onClick={toggleCalendar}
            className="relative font-semibold  sm:flex items-center px-2 py-2 md:px-2 md:py-1 xl:px-3 xl:py-1 bg-white rounded-full border shadow-sm text-xs  text-black cursor-pointer"
          >
            <svg
              fill="none"
              viewBox="0 0 24 25"
              xmlns="http://www.w3.org/2000/svg"
              className=" md:mr-2 size-6 md:size-5 xl:size-7"
            >
              <path
                d="M7 4.866v-1.5m10 1.5v-1.5"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M9 15.366l1.5-1.5v4"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M21.5 9.866H10.75m-8.75 0h3.875m7.125 7v-2a1 1 0 012 0v2a1 1 0 01-2 0z"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
              <path
                d="M14 22.866h-4c-3.771 0-5.657 0-6.828-1.172C2.001 20.522 2 18.637 2 14.866v-2c0-3.77 0-5.657 1.172-6.828C4.344 4.868 6.229 4.866 10 4.866h4c3.771 0 5.657 0 6.828 1.172C21.999 7.21 22 9.095 22 12.866v2c0 3.771 0 5.657-1.172 6.828-.653.654-1.528.943-2.828 1.07"
                stroke="#000"
                strokeLinecap="round"
                strokeWidth="1.5"
              />
            </svg>
            <span className="hidden sm:block">{formatDate(currentDate)}</span>
          </button>

          <div className="relative">
            <button
              onClick={toggleLoginDropdown}
              className="login-dropdown-trigger bg-Lime rounded-full p-2 md:p-1.5 xl:p-2 relative flex cp items-center gap-1 hover:text-black transition"
            >
              <GoDotFill className="absolute top-0 text-emerald-500 right-0 size-3 md:size-2 xl:size-3 animate-ping" />
              <FaUserLarge className="cursor-pointer w-4 h-4  md:w-3 md:h-3 xl:w-4 xl:h-4" />
            </button>
            {isLoginDropdownOpen && (
              <div className="login-dropdown-content font-medium  absolute right-0 mt-2 w-32 md:w-28 xl:w-32  bg-white rounded-sm shadow-xl py-0 z-50 ">
                {isAdmin ? (
                  <>
                    <Link
                      to="/admin/my-profile"
                      className="block  px-4 py-2 text-xs md:text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      My Profile
                    </Link>

                    <div className="border-t border-gray-200"></div>
                    <button
                      className="w-full text-left px-4 py-2 text-xs md:text-xs xl:text-sm cp text-gray-700 hover:bg-red-100 rounded-sm"
                      onClick={handleLogout}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/admin/login"
                      className="block px-4 py-2 text-xs xl:text-sm text-gray-700 hover:bg-gray-100 rounded-sm"
                      onClick={() => setIsLoginDropdownOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {showCalendar && (
          <div
            ref={calendarRef}
            className="absolute w-[250%] sm:w-[180%] right-0 mt-2 z-50"
          >
            <Calendar onClose={() => setShowCalendar(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
