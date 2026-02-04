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

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-6">
      <div className="flex items-center gap-2 mb-6">
        <FaFilter className="text-teal-600 text-lg" />
        <h2 className="text-xl font-semibold text-gray-800">Filters</h2>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaSearch className="text-teal-500" /> Search
        </label>
        <input
          type="text"
          placeholder="Doctor name"
          defaultValue={searchParams.get("search") || ""}
          onChange={(e) => updateParam("search", e.target.value)}
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* ================= COUNTRY ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaGlobeAsia className="text-teal-500" /> Country
        </label>
        <select
          value={searchParams.get("country") || ""}
          onChange={(e) => updateParam("country", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c._id} value={c.slug}>
              {c.country_name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= SPECIALTY ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaUserMd className="text-teal-500" /> Specialty
        </label>
        <select
          value={searchParams.get("category") || ""}
          onChange={(e) => updateParam("category", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">All Specialties</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.slug}>
              {cat.category_name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= HOSPITAL ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaHospital className="text-teal-500" /> Hospital
        </label>
        <select
          value={searchParams.get("hospital") || ""}
          onChange={(e) => updateParam("hospital", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">All Hospitals</option>
          {hospitals.map((h) => (
            <option key={h._id} value={h.slug}>
              {h.name}
            </option>
          ))}
        </select>
      </div>

      {/* ================= RATING (STATIC) ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaStar className="text-teal-500" /> Minimum Rating
        </label>
        <select
          value={searchParams.get("rating") || ""}
          onChange={(e) => updateParam("rating", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+</option>
          <option value="4">4+</option>
          <option value="3.5">3.5+</option>
        </select>
      </div>

      {/* ================= EXPERIENCE (STATIC) ================= */}
      <div className="mb-5">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaGraduationCap className="text-teal-500" /> Minimum Experience
        </label>
        <select
          value={searchParams.get("experience") || ""}
          onChange={(e) => updateParam("experience", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Any</option>
          <option value="5">5+ years</option>
          <option value="10">10+ years</option>
          <option value="15">15+ years</option>
        </select>
      </div>

      {/* ================= FEE (STATIC) ================= */}
      <div className="mb-6">
        <label className="flex items-center gap-2 font-medium mb-2">
          <FaMoneyBill className="text-teal-500" /> Max Consultation Fee
        </label>
        <select
          value={searchParams.get("priceRange") || ""}
          onChange={(e) => updateParam("priceRange", e.target.value)}
          className="w-full border rounded-lg p-2"
        >
          <option value="">Any Fee</option>
          <option value="500">Under ₹500</option>
          <option value="1000">Under ₹1000</option>
          <option value="2000">Under ₹2000</option>
        </select>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="text-sm text-gray-600 mb-4">
        Showing {doctorsCount} doctors
      </div>

      <button
        onClick={() => setSearchParams({})}
        className="w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300 transition"
      >
        Reset Filters
      </button>
    </div>
  );
}
