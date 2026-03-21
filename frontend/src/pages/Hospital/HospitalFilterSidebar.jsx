import {
  FaFilter,
  FaSearch,
  FaHospital,
  FaStar,
  FaMoneyBill,
  FaGlobeAsia,
  FaCity,
  FaBed,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  useGetCategoryListQuery,
  useGetCountryListQuery,
} from "@/rtk/slices/commanApiSlice";
import CountrySelectDropdown from "@/components/CountrySelectDropdown";

export default function HospitalFilterSidebar({ hospitalsCount }) {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= API CALLS ================= */
  const { data: categoryData } = useGetCategoryListQuery();
  const { data: countryData } = useGetCountryListQuery();

  /* ================= DATA NORMALIZATION ================= */
  const categories = categoryData?.data?.data || [];
  const countries = countryData?.data?.data || [];

  /* ================= HELPERS ================= */
  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(key, value) : params.delete(key);
    setSearchParams(params);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 lg:sticky lg:top-20">
      <div className="flex items-center gap-2 mb-6">
        <FaFilter className="text-main text-lg" />
        <h2 className="text-xl font-semibold text-gray-800">Filter Hospitals</h2>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaSearch className="text-main" /> Search
        </label>
        <input
          type="text"
          placeholder="Hospital name"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParam("search", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        />
      </div>

      {/* ================= COUNTRY ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaGlobeAsia className="text-main" /> Country
        </label>
        <CountrySelectDropdown
          countries={countries}
          value={searchParams.get("country") || ""}
          onChange={(slug) => updateParam("country", slug)}
        />
      </div>

      {/* ================= CITY ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaCity className="text-main" /> City
        </label>
        <input
          type="text"
          placeholder="Enter city"
          defaultValue={searchParams.get("city") || ""}
          onChange={(e) => updateParam("city", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        />
      </div>

      {/* ================= SPECIALTY/CATEGORY ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaHospital className="text-main" /> Specialty
        </label>
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        >
          <option value="">All Specialties</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= RATING ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaStar className="text-main" /> Minimum Rating
        </label>
        <select
          value={searchParams.get("rating") || ""}
          onChange={(e) => updateParam("rating", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3.5">3.5+</option>
          <option value="3">3+</option>
        </select>
      </div>

      {/* ================= FACILITIES ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaBed className="text-main" /> Facilities
        </label>
        <select
          value={searchParams.get("facilities") || ""}
          onChange={(e) => updateParam("facilities", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        >
          <option value="">All Facilities</option>
          <option value="ICU">ICU</option>
          <option value="Emergency">Emergency 24/7</option>
          <option value="OT">Operation Theater</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Ambulance">Ambulance Service</option>
        </select>
      </div>

      {/* ================= PRICE RANGE ================= */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaMoneyBill className="text-main" /> Price Range
        </label>
        <select
          value={searchParams.get("priceRange") || ""}
          onChange={(e) => updateParam("priceRange", e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-main focus:border-transparent"
        >
          <option value="">Any Price</option>
          <option value="budget">Budget (₹)</option>
          <option value="moderate">Moderate (₹₹)</option>
          <option value="premium">Premium (₹₹₹)</option>
          <option value="luxury">Luxury (₹₹₹₹)</option>
        </select>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {hospitalsCount} hospitals
      </div>

      <button
        onClick={() => setSearchParams({})}
        className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
      >
        Reset All Filters
      </button>
    </div>
  );
}