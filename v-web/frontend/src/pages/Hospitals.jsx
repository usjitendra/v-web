import { useEffect, useState } from "react";
import { FaFilter, FaHospital, FaMapMarkerAlt, FaSearch, FaStar } from "react-icons/fa";
import SectionHeading from "../components/home/SectionHeading";
import HospitalCard from "../components/HospitalCard";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';


const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    'title': 'Not Available For Selected Language',
    'sub': '',
    'desc': ''
  });
  // Fetch hospitals data from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchHospitals = async () => {
      try {
        const response = await fetch(url_prefix + '/api/hospitals/all');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid API response structure');
        }
        if (result.success) {
          let dataToSet;
          if (Array.isArray(result.data)) {
            dataToSet = result.data.filter(
              item => item.language?.toLowerCase() === language?.toLowerCase()
            );
          } else {
            dataToSet =
              result.data.language?.toLowerCase() === language?.toLowerCase()
                ? [result.data]
                : [];
          }

          if (dataToSet.length > 0) {
            console.log('Setting aboutData:', dataToSet);
            setHospitals(dataToSet);
            setError(null);
            setHeadings({
              title: dataToSet[0].htitle,
              sub: dataToSet[0].hsubtitle,
              desc: dataToSet[0].hdesc
            })
          }
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setHospitals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitals();
  }, [language]);
  // console.log(hospitals.pages);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    country: "",
    city: "",
    specialty: "",
    accreditation: "",
    minRating: ""
  });

  // Extract unique values for filters from hospitals data
  const countries = [...new Set(hospitals.map((h) => h.country).filter(Boolean))];
  const cities = [...new Set(hospitals.map((h) => h.city).filter(Boolean))];

  // Extract all specialties (flatten arrays)
  const allSpecialties = hospitals.flatMap(h => h.specialties || []);
  const specialties = [...new Set(allSpecialties.filter(Boolean))];

  // Extract all accreditations (flatten arrays)
  const allAccreditations = hospitals.flatMap(h => h.accreditation || []);
  const accreditations = [...new Set(allAccreditations.filter(Boolean))];

  const filteredHospitals = hospitals.filter((hospital) => {
    const matchesSearch = hospital.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCountry = filters.country ? hospital.country === filters.country : true;
    const matchesCity = filters.city ? hospital.city === filters.city : true;
    const matchesSpecialty = filters.specialty ?
      hospital.specialties?.includes(filters.specialty) : true;
    const matchesAccreditation = filters.accreditation ?
      hospital.accreditation?.includes(filters.accreditation) : true;
    const matchesRating = filters.minRating ?
      hospital.rating >= parseFloat(filters.minRating) : true;

    return matchesSearch && matchesCountry && matchesCity &&
      matchesSpecialty && matchesAccreditation && matchesRating;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading hospitals</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filter Sidebar */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100  top-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-teal-600 text-lg" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>

          {/* Search within filters */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaSearch className="text-teal-500" />
              Search
            </label>
            <input
              type="text"
              placeholder="Search hospitals..."
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Country Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="text-teal-500" />
              Country
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.country}
              onChange={(e) => setFilters({ ...filters, country: e.target.value })}
            >
              <option value="">All Countries</option>
              {countries.map((country, i) => (
                <option key={i} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* City Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaMapMarkerAlt className="text-teal-500" />
              City
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
            >
              <option value="">All Cities</option>
              {cities.map((city, i) => (
                <option key={i} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Specialty Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaHospital className="text-teal-500" />
              Specialty
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
            >
              <option value="">All Specialties</option>
              {specialties.map((spec, i) => (
                <option key={i} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Accreditation Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <span className="text-teal-500">🏅</span>
              Accreditation
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.accreditation}
              onChange={(e) => setFilters({ ...filters, accreditation: e.target.value })}
            >
              <option value="">All Accreditations</option>
              {accreditations.map((acc, i) => (
                <option key={i} value={acc}>
                  {acc}
                </option>
              ))}
            </select>
          </div>

          {/* Rating Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaStar className="text-teal-500" />
              Minimum Rating
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.minRating}
              onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
              <option value="3.0">3.0+ Stars</option>
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-5 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing {filteredHospitals.length} of {hospitals.length} hospitals
            </p>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={() => setFilters({
              country: "",
              city: "",
              specialty: "",
              accreditation: "",
              minRating: ""
            })}
            className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset All Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}
          {/* <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{headings.title}</h1>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Find Hospitals</h1> */}
          {/* <p className="text-gray-600"> */}
          {/* Discover {hospitals.length} healthcare facilities worldwide with advanced filtering options. */}
          {/* {headings.desc} */}
          {/* </p> */}
          {/* </div> */}

          <SectionHeading
            center={false}
            title={'hospital'}
            page={'page'}
          />

          {/* Hospitals Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredHospitals.length > 0 ? (
              filteredHospitals.map((hospital) => (
                <HospitalCard key={hospital._id} hospital={hospital} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No hospitals found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      country: "",
                      city: "",
                      specialty: "",
                      accreditation: "",
                      minRating: ""
                    });
                  }}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;