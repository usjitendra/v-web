import { useEffect, useState } from "react";
import { FaFilter, FaGraduationCap, FaHospital, FaMoneyBill, FaSearch, FaStar, FaUserMd } from "react-icons/fa";
import DoctorCard from "../components/DoctorCard";
import SectionHeading from "../components/home/SectionHeading";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    'title': 'Not Available For Selected Language',
    'sub': '',
    'desc': ''
  });
  // Fetch doctors data from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }
    const fetchDoctors = async () => {
      try {
        const response = await fetch(url_prefix + "/api/doctors/all");

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
            setDoctors(dataToSet);
            setError(null);
            setHeadings({
              title: dataToSet[0].ptitle,
              desc: dataToSet[0].pdesc
            })
          }
        }

      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [language]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    specialty: "",
    hospital: "",
    minRating: "",
    maxFee: "",
    minExperience: ""
  });

  // Extract unique values for filters from doctors data
  const specialties = [...new Set(doctors.map((d) => d.specialty).filter(Boolean))];

  // Extract hospital names (assuming hospital is populated with name)
  const hospitals = [...new Set(doctors
    .map((d) => d.hospital && d.hospital.name)
    .filter(Boolean)
  )];

  // Experience ranges for filter
  const experienceRanges = [
    { value: "5", label: "5+ years" },
    { value: "10", label: "10+ years" },
    { value: "15", label: "15+ years" },
    { value: "20", label: "20+ years" }
  ];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialty?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = filters.specialty ?
      doctor.specialty === filters.specialty : true;

    const matchesHospital = filters.hospital ?
      doctor.hospital && doctor.hospital.name === filters.hospital : true;

    const matchesRating = filters.minRating ?
      doctor.rating >= parseFloat(filters.minRating) : true;

    const matchesFee = filters.maxFee ?
      doctor.consultationFee <= parseFloat(filters.maxFee) : true;

    const matchesExperience = filters.minExperience ?
      doctor.experience >= parseInt(filters.minExperience) : true;

    return matchesSearch && matchesSpecialty && matchesHospital &&
      matchesRating && matchesFee && matchesExperience;
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
          <div className="text-red-500 text-6xl mb-4">👨‍⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading doctors</h2>
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
              Search Doctors
            </label>
            <input
              type="text"
              placeholder="Search by name or specialty..."
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Specialty Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaUserMd className="text-teal-500" />
              Specialty
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.specialty}
              onChange={(e) => setFilters({ ...filters, specialty: e.target.value })}
            >
              <option value="">All Specialties</option>
              {specialties.map((specialty, i) => (
                <option key={i} value={specialty}>
                  {specialty}
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaHospital className="text-teal-500" />
              Hospital
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.hospital}
              onChange={(e) => setFilters({ ...filters, hospital: e.target.value })}
            >
              <option value="">All Hospitals</option>
              {hospitals.map((hospital, i) => (
                <option key={i} value={hospital}>
                  {hospital}
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

          {/* Consultation Fee Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaMoneyBill className="text-teal-500" />
              Max Consultation Fee
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.maxFee}
              onChange={(e) => setFilters({ ...filters, maxFee: e.target.value })}
            >
              <option value="">Any Fee</option>
              <option value="500">Under ₹500</option>
              <option value="1000">Under ₹1000</option>
              <option value="1500">Under ₹1500</option>
              <option value="2000">Under ₹2000</option>
              <option value="3000">Under ₹3000</option>
            </select>
          </div>

          {/* Experience Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaGraduationCap className="text-teal-500" />
              Minimum Experience
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.minExperience}
              onChange={(e) => setFilters({ ...filters, minExperience: e.target.value })}
            >
              <option value="">Any Experience</option>
              {experienceRanges.map((range, i) => (
                <option key={i} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-5 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing {filteredDoctors.length} of {doctors.length} doctors
            </p>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                specialty: "",
                hospital: "",
                minRating: "",
                maxFee: "",
                minExperience: ""
              });
            }}
            className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Reset All Filters
          </button>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Header */}

          <SectionHeading
            center={false}
            title={'doctor'}
            page={'page'}
          />

          {/* Doctors Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor._id} doc={doctor} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">👨‍⚕️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      specialty: "",
                      hospital: "",
                      minRating: "",
                      maxFee: "",
                      minExperience: ""
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

export default Doctors;