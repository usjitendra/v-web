import {
  FaFilter,
  FaSearch,
  FaHospital,
  FaStar,
  FaMoneyBill,
  FaGraduationCap,
  FaUserMd,
  FaGlobeAsia,
} from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import {
  useGetCategoryListQuery,
  useGetHospitalListQuery,
  useGetCountryListQuery,
} from "@/rtk/slices/commanApiSlice";
import CountrySelectDropdown from "@/components/CountrySelectDropdown";

export default function DoctorFilterSidebar({ doctorsCount }) {
  const [searchParams, setSearchParams] = useSearchParams();

  /* ================= API CALLS ================= */
  const { data: categoryData } = useGetCategoryListQuery();
  const { data: hospitalData } = useGetHospitalListQuery();
  const { data: countryData } = useGetCountryListQuery();

  /* ================= DATA NORMALIZATION ================= */
  const categories = categoryData?.data?.data || [];
  const hospitals = hospitalData?.data?.data || [];
  const countries = countryData?.data?.data || [];

  /* ================= HELPERS ================= */
  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    value ? params.set(key, value) : params.delete(key);
    setSearchParams(params);
  };

  const inputCls =
    "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent transition";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 lg:sticky lg:top-20">
      <div className="flex items-center gap-2 mb-5">
        <FaFilter className="text-teal-600 text-base" />
        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaSearch className="text-teal-500" /> Search
        </label>
        <input
          type="text"
          placeholder="Doctor name"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParam("search", e.target.value)}
          className={inputCls}
        />
      </div>

      {/* COUNTRY */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaGlobeAsia className="text-teal-500" /> Country
        </label>
        <CountrySelectDropdown
          countries={countries}
          value={searchParams.get("country") || ""}
          onChange={(slug) => updateParam("country", slug)}
        />
      </div>

      {/* SPECIALTY */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaUserMd className="text-teal-500" /> Specialty
        </label>
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className={inputCls}
        >
          <option value="">All Specialties</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* HOSPITAL */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaHospital className="text-teal-500" /> Hospital
        </label>
        <select
          value={searchParams.get("hospital") || ""}
          onChange={(e) => updateParam("hospital", e.target.value)}
          className={inputCls}
        >
          <option value="">All Hospitals</option>
          {hospitals.map((h) => (
            <option key={h._id} value={h.slug}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {/* RATING */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaStar className="text-teal-500" /> Minimum Rating
        </label>
        <select
          value={searchParams.get("rating") || ""}
          onChange={(e) => updateParam("rating", e.target.value)}
          className={inputCls}
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3.5">3.5+</option>
        </select>
      </div>

      {/* EXPERIENCE */}
      <div className="mb-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaGraduationCap className="text-teal-500" /> Experience
        </label>
        <select
          value={searchParams.get("experience") || ""}
          onChange={(e) => updateParam("experience", e.target.value)}
          className={inputCls}
        >
          <option value="">Any</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
        </select>
      </div>

      {/* FEE */}
      <div className="mb-5">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
          <FaMoneyBill className="text-teal-500" /> Consultation Fee
        </label>
        <select
          value={searchParams.get("priceRange") || ""}
          onChange={(e) => updateParam("priceRange", e.target.value)}
          className={inputCls}
        >
          <option value="">Any Fee</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1000</option>
          <option value="2000">Under ₹2000</option>
        </select>
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-500 mb-3">
        Showing {doctorsCount} doctor{doctorsCount !== 1 ? "s" : ""}
      </p>

      <button
        onClick={() => setSearchParams({})}
        className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
      >
        Reset All Filters
      </button>
    </div>
  );
}
