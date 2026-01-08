import React, { useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

export default function HospitalSearch() {
  const [country, setCountry] = useState('India');
  const [city, setCity] = useState('All Cities');
  const [specialty, setSpecialty] = useState('CARDIOLOGY AND CARDIAC SURGERY');
  const [treatment, setTreatment] = useState('All Treatment');
  const [hospital, setHospital] = useState('All Hospital');

  const handleSearch = () => {
    console.log('Searching with:', { country, city, specialty, treatment, hospital });
  };

  return (
    <div className=" bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Best Cardiac Hospital in India
          </h1>
        </div>

        {/* Search Box */}
        <div className="bg-main rounded-xl p-5 shadow-lg">
          <div className="bg-white rounded-lg p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Country Input */}
            <div className="flex-1 min-w-0">
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2.5 text-gray-800 font-medium focus:outline-none"
                placeholder="India"
              />
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-10 bg-gray-300"></div>

            {/* City Select */}
            <div className="flex-1 min-w-0 relative flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 py-2.5 text-gray-800 font-medium focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer"
              >
                <option>All Cities</option>
                <option>Mumbai</option>
                <option>Delhi</option>
                <option>Bangalore</option>
                <option>Chennai</option>
              </select>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-10 bg-gray-300"></div>

            {/* Specialty Select */}
            <div className="flex-1 min-w-0 relative flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="flex-1 py-2.5 text-gray-800 font-medium focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer"
              >
                <option>CARDIOLOGY AND CARDIAC SURGERY</option>
                <option>INTERVENTIONAL CARDIOLOGY</option>
                <option>PEDIATRIC CARDIOLOGY</option>
              </select>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-10 bg-gray-300"></div>

            {/* Treatment Select */}
            <div className="flex-1 min-w-0 relative">
              <select
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                className="w-full py-2.5 text-gray-800 font-medium focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer"
              >
                <option>All Treatment</option>
                <option>Bypass Surgery</option>
                <option>Valve Replacement</option>
              </select>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-10 bg-gray-300"></div>

            {/* Hospital Select with Dropdown Icon */}
            <div className="flex-1 min-w-0 relative flex items-center">
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="flex-1 py-2.5 text-gray-800 font-medium focus:outline-none appearance-none bg-transparent pr-8 cursor-pointer"
              >
                <option>All Hospital</option>
                <option>Apollo Hospitals</option>
                <option>Fortis Healthcare</option>
              </select>
              <ChevronDown className="w-5 h-5 text-gray-600 absolute right-2 pointer-events-none" />
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="lg:ml-4 px-8 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors duration-200"
            >
              Search
            </button>
          </div>
        </div>

        {/* Description Text */}
        <div className="mt-12 max-w-6xl">
          <p className="text-gray-700 text-base leading-relaxed text-center">
            Know about the best cardiac surgeons in India with over decades of experience. Our 1208 cardiac experts ensure comprehensive care with minimally invasive cardiac surgery, robotic surgery along with treating other cardiac conditions.
          </p>
        </div>
      </div>
    </div>
  );
}