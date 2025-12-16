import { useEffect, useState } from "react";
import { FaClock, FaFilter, FaProcedures, FaSearch, FaStar } from "react-icons/fa";
import TreatmentCard from "../components/TreatmentCard";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';

const Treatments = () => {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [headings, setHeadings] = useState({
    heading: 'Not Available For Selected Language',
    subheading: '',
    description: ''
  });

  // Fetch treatments and headings data from API
  useEffect(() => {
    if (!language) {
      console.log('Language not yet available, skipping fetch');
      return;
    }

    const fetchHeadings = async () => {
      try {
        const response = await fetch(`${url_prefix}/api/headings/treatment/${language}`);
        const result = await response.json();
        if (result.success) {
          setHeadings(result.data.page[0]); // Fetch headings for 'page' type
        }
      } catch (error) {
        console.error('Error fetching headings:', error);
      }
    };

    const fetchTreatments = async () => {
      try {
        const response = await fetch(`${url_prefix}/api/treatments/all`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        if (!result.success || !Array.isArray(result.data)) {
          throw new Error('Invalid API response structure');
        }

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
          console.log('Setting treatments:', dataToSet);
          setTreatments(dataToSet);
          setError(null);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
        setTreatments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHeadings();
    fetchTreatments();
  }, [language]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    minDuration: "",
    maxDuration: "",
    complexity: "",
    minRating: ""
  });

  // Extract unique values for filters from treatments data
  const categories = [...new Set(treatments.map((t) => t.category).filter(Boolean))];
  const complexities = [...new Set(treatments.map((t) => t.typicalComplexity).filter(Boolean))];

  // Duration ranges for filter
  const durationRanges = [
    { value: "30", label: "Under 30 min" },
    { value: "60", label: "30-60 min" },
    { value: "120", label: "1-2 hours" },
    { value: "180", label: "2-3 hours" },
    { value: "240", label: "3+ hours" }
  ];

  const filteredTreatments = treatments.filter((treatment) => {
    const matchesSearch = treatment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filters.category ? treatment.category === filters.category : true;
    const matchesComplexity = filters.complexity ? treatment.typicalComplexity === filters.complexity : true;

    let matchesMinDuration = true;
    let matchesMaxDuration = true;

    if (filters.minDuration) {
      matchesMinDuration = treatment.typicalDuration >= parseInt(filters.minDuration);
    }
    if (filters.maxDuration) {
      matchesMaxDuration = treatment.typicalDuration <= parseInt(filters.maxDuration);
    }

    return matchesSearch && matchesCategory && matchesComplexity &&
      matchesMinDuration && matchesMaxDuration;
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
          <div className="text-red-500 text-6xl mb-4">⚕️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error loading treatments</h2>
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
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 top-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <FaFilter className="text-teal-600 text-lg" />
            <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
          </div>

          {/* Search within filters */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaSearch className="text-teal-500" />
              Search Treatments
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaProcedures className="text-teal-500" />
              Category
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map((category, i) => (
                <option key={i} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Complexity Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaStar className="text-teal-500" />
              Complexity
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.complexity}
              onChange={(e) => setFilters({ ...filters, complexity: e.target.value })}
            >
              <option value="">Any Complexity</option>
              {complexities.map((complexity, i) => (
                <option key={i} value={complexity}>
                  {complexity}
                </option>
              ))}
            </select>
          </div>

          {/* Min Duration Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaClock className="text-teal-500" />
              Minimum Duration
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.minDuration}
              onChange={(e) => setFilters({ ...filters, minDuration: e.target.value })}
            >
              <option value="">Any Duration</option>
              {durationRanges.map((range, i) => (
                <option key={i} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Max Duration Filter */}
          <div className="mb-5">
            <label className="flex items-center gap-2 text-gray-700 font-medium mb-2">
              <FaClock className="text-teal-500" />
              Maximum Duration
            </label>
            <select
              className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
              value={filters.maxDuration}
              onChange={(e) => setFilters({ ...filters, maxDuration: e.target.value })}
            >
              <option value="">Any Duration</option>
              {durationRanges.map((range, i) => (
                <option key={i} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="mb-5 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Showing {filteredTreatments.length} of {treatments.length} treatments
            </p>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilters({
                category: "",
                minDuration: "",
                maxDuration: "",
                complexity: "",
                minRating: ""
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
          <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{headings.heading}</h1>
            <p className="text-gray-600">{headings.description}</p>
          </div>

          {/* Treatments Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredTreatments.length > 0 ? (
              filteredTreatments.map((treatment) => (
                <TreatmentCard key={treatment._id} t={treatment} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">⚕️</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No treatments found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setFilters({
                      category: "",
                      minDuration: "",
                      maxDuration: "",
                      complexity: "",
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

export default Treatments;