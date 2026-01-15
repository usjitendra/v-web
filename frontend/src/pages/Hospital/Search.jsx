import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGetCountryListQuery, useGetCategoryListQuery } from '../../rtk/slices/commanApiSlice';

export default function HospitalSearch() {
  const navigate = useNavigate();
  const { data: countriesData, isLoading: countriesLoading } = useGetCountryListQuery();
  const { data: categoriesData, isLoading: categoriesLoading } = useGetCategoryListQuery();

  const [country, setCountry] = useState('All Countries');
  const [city, setCity] = useState('All Cities');
  const [specialty, setSpecialty] = useState('All Specialties');
  const [treatment, setTreatment] = useState('All Treatment');
  const [hospital, setHospital] = useState('All Hospital');

  // Advanced filters
  const [priceRange, setPriceRange] = useState('All Ranges');
  const [rating, setRating] = useState('All Ratings');
  const [facilities, setFacilities] = useState('All Facilities');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const countries = countriesData?.data || [];
  const categories = categoriesData?.data || [];

  // Set default country to first available country
  useEffect(() => {
    if (countries.length > 0 && country === 'All Countries') {
      setCountry(countries[0].name);
    }
  }, [countries, country]);

  const handleSearch = () => {
    // Build search parameters
    const searchParams = new URLSearchParams();

    if (country && country !== 'All Countries') {
      searchParams.set('country', country);
    }
    if (city && city !== 'All Cities') {
      searchParams.set('city', city);
    }
    if (specialty && specialty !== 'All Specialties') {
      searchParams.set('category', specialty);
    }
    if (priceRange && priceRange !== 'All Ranges') {
      searchParams.set('priceRange', priceRange);
    }
    if (rating && rating !== 'All Ratings') {
      searchParams.set('rating', rating);
    }
    if (facilities && facilities !== 'All Facilities') {
      searchParams.set('facilities', facilities);
    }

    // Navigate to hospital listing page with search parameters
    navigate(`/hospitals?${searchParams.toString()}`);
  };

  return (
    <div className=" bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Find Your Perfect Hospital Worldwide
          </h1>
        </div>

        {/* Search Box */}
        <div className="bg-main rounded-xl p-5 shadow-lg">
          <div className="bg-white rounded-lg p-4 flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Country Select */}
            <div className="flex-1 min-w-0 relative flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="flex-1 py-2.5 text-gray-800 font-medium focus:outline-none appearance-none bg-transparent pr-6 cursor-pointer"
                disabled={countriesLoading}
              >
                <option>All Countries</option>
                {Array.isArray(countries) && countries  && countries.map((countryItem) => (
                  <option key={countryItem._id} value={countryItem.name}>
                    {countryItem.name}
                  </option>
                ))}
              </select>
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
                <option>Kolkata</option>
                <option>Pune</option>
                <option>Hyderabad</option>
                <option>Ahmedabad</option>
                <option>Jaipur</option>
                <option>Surat</option>
                <option>Lucknow</option>
                <option>Kanpur</option>
                <option>Nagpur</option>
                <option>Indore</option>
                <option>Thane</option>
                <option>Bhopal</option>
                <option>Visakhapatnam</option>
                <option>Pimpri-Chinchwad</option>
                <option>Patna</option>
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
                disabled={categoriesLoading}
              >
                <option>All Specialties</option>
                {categories && Array.isArray(categories) && categories.length>0 && categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
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

          {/* Advanced Filters Toggle */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="text-red-600 hover:text-red-700 font-medium text-sm underline"
            >
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="mt-4 bg-white/50 rounded-lg p-4 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Price Range */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full py-2 px-3 text-gray-800 font-medium focus:outline-none border border-gray-300 rounded-md bg-white"
                  >
                    <option>All Ranges</option>
                    <option>$0 - $5,000</option>
                    <option>$5,000 - $10,000</option>
                    <option>$10,000 - $25,000</option>
                    <option>$25,000 - $50,000</option>
                    <option>$50,000+</option>
                  </select>
                </div>

                {/* Rating */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full py-2 px-3 text-gray-800 font-medium focus:outline-none border border-gray-300 rounded-md bg-white"
                  >
                    <option>All Ratings</option>
                    <option>4.5+ Stars</option>
                    <option>4.0+ Stars</option>
                    <option>3.5+ Stars</option>
                    <option>3.0+ Stars</option>
                  </select>
                </div>

                {/* Facilities */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facilities
                  </label>
                  <select
                    value={facilities}
                    onChange={(e) => setFacilities(e.target.value)}
                    className="w-full py-2 px-3 text-gray-800 font-medium focus:outline-none border border-gray-300 rounded-md bg-white"
                  >
                    <option>All Facilities</option>
                    <option>24/7 Emergency</option>
                    <option>ICU Available</option>
                    <option>Advanced Equipment</option>
                    <option>Pharmacy</option>
                    <option>Laboratory</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Description Text */}
        <div className="mt-12 max-w-6xl">
          <p className="text-gray-700 text-base leading-relaxed text-center">
            Discover world-class hospitals across the globe with advanced medical technology and expert care. Our comprehensive platform helps you find the perfect healthcare facility for your medical needs, from specialized treatments to general healthcare services.
          </p>
        </div>
      </div>
    </div>
  );
}