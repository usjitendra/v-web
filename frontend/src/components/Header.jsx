import React, { useState } from 'react';
import { Menu, X, Search, ChevronDown, Globe } from 'lucide-react';
import { useGetConteryDropDownQuery } from '@/rtk/slices/subcategoryApi';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { data, isLoading, isFetching, isError } = useGetConteryDropDownQuery();

  const countries = data?.data || [];

  console.log('Countries for dropdown:', countries);

  // Navigation data structure
  const navItems = [
    { id: 1, label: 'Home', path: '/', hasDropdown: false },
    {
      id: 2,
      label: 'Hospitals',
      path: '/hospitals',
      hasDropdown: true,
      dropdownItems: countries
    },
    {
      id: 3,
      label: 'Doctors',
      path: '/doctors',
      hasDropdown: true,
      dropdownItems: countries
    },
    {
      id: 4,
      label: 'Cost',
      path: '/cost',
      hasDropdown: true,
      dropdownItems: ['Treatment Costs', 'Compare Prices', 'Insurance']
    },
    {
      id: 5,
      label: 'Knowledge',
      path: '/knowledge',
      hasDropdown: true,
      dropdownItems: ['Articles', 'Videos', 'FAQs']
    },
    { id: 6, label: 'Patient Stories', path: '/patient-stories', hasDropdown: false },
    { id: 7, label: 'FREE Consult', path: '/free-consult', hasDropdown: false }
  ];

  const languages = ['English', 'Hindi', 'Spanish', 'Arabic', 'French'];

  const toggleDropdown = (id) => {
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <header className="w-full shadow-md">
      {/* Top Blue Bar */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <div className="bg-white rounded-full p-2 w-12 h-12 flex items-center justify-center">
                <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold tracking-wide text-white">Vaidam.com</h1>
              <p className="text-xs tracking-wider uppercase text-white">For Medical Procedures</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search doctors, hospitals, treatments..."
                className="w-full px-4 py-2 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="absolute right-2 top-[10%] -translate-y-1/2 bg-teal-600 p-2 rounded-full hover:bg-blue-700 transition">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Get Quote Button */}
          <button className="hidden lg:block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold transition whitespace-nowrap">
            Get a FREE quote
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden bg-blue-700 px-4 pb-3">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search doctors, hospitals, treatments..."
            className="w-full px-4 py-2 pr-12 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-full">
            <Search className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-blue-200">
        <div className="hidden md:block max-w-7xl mx-auto px-4">
          <ul className="flex items-center space-x-1">
            {navItems.map((item) => (
              <li key={item.id} className="relative group">
                <button
                  onClick={() => item.hasDropdown && toggleDropdown(item.id)}
                  className="flex items-center space-x-1 px-4 py-3 text-gray-800 hover:bg-blue-300 transition font-medium text-sm"
                >
                  <span>{item.label}</span>
                  {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </button>

                {item.hasDropdown && (
                  <div className="hidden group-hover:block absolute top-full left-0 bg-white shadow-lg rounded-b min-w-48 z-50">
                    {item.dropdownItems.map((countries) => (
                      <a
                        key={countries._id}
                        href="#"
                        className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                      >
                        {countries.country_name}
                      </a>
                    ))}
                  </div>
                )}
              </li>
            ))}

            {/* Language Selector */}
            <li className="ml-auto relative group">
              <button className="flex items-center space-x-2 px-4 py-3 text-gray-800 hover:bg-blue-300 transition">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Select Language</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <div className="hidden group-hover:block absolute top-full right-0 bg-white shadow-lg rounded-b min-w-40 z-50">
                {languages.map((lang, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 transition"
                  >
                    {lang}
                  </a>
                ))}
              </div>
            </li>
          </ul>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-blue-200">
            <ul className="py-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => item.hasDropdown && toggleDropdown(item.id)}
                    className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-300 transition font-medium"
                  >
                    <span>{item.label}</span>
                    {item.hasDropdown && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${activeDropdown === item.id ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </button>

                  {/* Mobile Dropdown */}
                  {item.hasDropdown && activeDropdown === item.id && (
                    <div className="bg-blue-100">
                      {item.dropdownItems.map((dropItem, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="block px-8 py-2 text-gray-700 hover:bg-blue-200"
                        >
                          {dropItem}
                        </a>
                      ))}
                    </div>
                  )}
                </li>
              ))}

              {/* Mobile Language Selector */}
              <li>
                <button
                  onClick={() => toggleDropdown('language')}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-800 hover:bg-blue-300 transition font-medium"
                >
                  <span className="flex items-center space-x-2">
                    <Globe className="w-4 h-4" />
                    <span>Select Language</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${activeDropdown === 'language' ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {activeDropdown === 'language' && (
                  <div className="bg-blue-100">
                    {languages.map((lang, idx) => (
                      <a
                        key={idx}
                        href="#"
                        className="block px-8 py-2 text-gray-700 hover:bg-blue-200"
                      >
                        {lang}
                      </a>
                    ))}
                  </div>
                )}
              </li>

              {/* Mobile CTA Button */}
              <li className="px-4 py-3">
                <button className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded font-semibold transition">
                  Get a FREE quote
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;