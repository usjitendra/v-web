import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FaHome,
  FaUserAlt,
  FaHeartbeat,
  FaImages,
  FaBlog,
  FaPhoneAlt,
  FaPlus,
} from 'react-icons/fa';
import { MdLabel, MdReviews, MdThermostatAuto } from 'react-icons/md';

const Sidebar = ({ handleSideBar }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  /* =========================
     STATIC DATA (REPLACEMENT)
     ========================= */

  const packageData = [
    { packageName: 'Basic Health Checkup' },
    { packageName: 'Full Body Checkup' },
    { packageName: 'Diabetes Package' },
    { packageName: 'Heart Care Package' },
  ];

  const serviceData = [
    { name: 'X-Ray' },
    { name: 'Blood Test' },
    { name: 'CT Scan' },
  ];

  return (
    <div className="z-auto">
      {/* Sidebar */}
      <div
        id="sidebar"
        className={`transition-all transform fixed top-0 left-0 z-60 w-64 h-full text-white pt-1 pb-2 overflow-y-auto bg-gradient-to-r block lg:hidden from-blue-600 to-blue-800 dark:border-neutral-700 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        role="dialog"
        tabIndex="-1"
        aria-label="Sidebar"
      >
        <nav className="flex flex-col items-start px-2 py-2">
          <ul className="w-full">

            {/* Home */}
            <li>
              <Link
                to="/"
                className="flex items-center gap-x-4 py-3 px-2 text-lg font-medium rounded-lg border-b-2 border-white hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaHome className="text-xl" />
                Home
              </Link>
            </li>

            {/* About Us */}
            <li className="relative">
              <button
                type="button"
                onClick={() => setIsAboutOpen(!isAboutOpen)}
                className="flex items-center gap-x-4 py-3 px-2 text-lg font-medium rounded-lg border-b-2 border-white hover:bg-blue-500 transition-all w-full"
              >
                <FaUserAlt className="text-lg" />
                About Us
                <svg
                  className={`ms-auto transform ${isAboutOpen ? 'rotate-180' : ''
                    } transition-transform duration-300`}
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {isAboutOpen && (
                <div className="ml-2 space-y-2">
                  <Link
                    to="/about"
                    className="block px-2 py-2 text-sm rounded-lg hover:bg-blue-500 border-b-2 border-white transition-all"
                    onClick={handleSideBar}
                  >
                    About MedicwayCare
                  </Link>
                  <Link
                    to="/about/team"
                    className="block px-2 py-2 text-sm rounded-lg hover:bg-blue-500 border-b-2 border-white transition-all"
                    onClick={handleSideBar}
                  >
                    Our Team
                  </Link>
                  <Link
                    to="/about/management"
                    className="block px-2 py-2 text-sm rounded-lg hover:bg-blue-500 border-b-2 border-white transition-all"
                    onClick={handleSideBar}
                  >
                    Our Management
                  </Link>
                  <Link
                    to="/director-message"
                    className="block px-2 py-2 text-sm rounded-lg hover:bg-blue-500 border-b-2 border-white transition-all"
                    onClick={handleSideBar}
                  >
                    Director's Message
                  </Link>
                </div>
              )}
            </li>

            <li>
              <Link
                to="/scan"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <MdThermostatAuto className="text-xl" />
                X-Rays & Scan
              </Link>
            </li>

            <li>
              <Link
                to="/pathology"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <MdLabel className="text-xl" />
                Blood Test
              </Link>
            </li>

            <li>
              <Link
                to="/package"
                className="flex items-center gap-x-4 py-3 px-2 border-b-2 border-white text-lg font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaHeartbeat className="text-xl" />
                Health Package
              </Link>
            </li>

            <li>
              <Link
                to="/gallery"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaImages className="text-xl" />
                Gallery
              </Link>
            </li>

            <li>
              <Link
                to="/blog"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaBlog className="text-xl" />
                Blog
              </Link>
            </li>

            <li>
              <Link
                to="/book-home-collection"
                className="flex items-center gap-x-4 py-3 px-2 border-b-2 border-white text-lg font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaPlus className="text-xl" />
                Book Home Collection
              </Link>
            </li>

            <li>
              <Link
                to="/review"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <MdReviews className="text-xl" />
                Review
              </Link>
            </li>

            <li>
              <Link
                to="/carrer"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <MdReviews className="text-xl" />
                Career
              </Link>
            </li>

            <li>
              <Link
                to="/contact"
                className="flex items-center gap-x-4 py-3 px-2 text-lg border-b-2 border-white font-medium rounded-lg hover:bg-blue-500 transition-all"
                onClick={handleSideBar}
              >
                <FaPhoneAlt className="text-xl" />
                Contact Us
              </Link>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
