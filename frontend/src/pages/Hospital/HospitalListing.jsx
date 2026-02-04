import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  SortAsc,
  SortDesc,
  X,
  MapPin,
  Building2,
} from "lucide-react";
import { useGetAllHospitalsQuery } from "../../rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "../../rtk/slices/bookingApiSlice";
import HospitalFilterSidebar from "./HospitalFilterSidebar";
import HospitalCard from "./HospitalCard";

export default function HospitalListingPage() {
  const [searchParams] = useSearchParams();

  /* ================= URL PARAMS ================= */
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const priceRange = searchParams.get("priceRange");
  const rating = searchParams.get("rating");
  const facilities = searchParams.get("facilities");
  const search = searchParams.get("search");

  /* ================= API ================= */
  const { data, isLoading, isError } = useGetAllHospitalsQuery({
    country,
    category,
    city,
    priceRange,
    rating,
    facilities,
    search,
    page: 1,
    limit: 10,
  });

  const hospitals = data?.data?.data || [];

  /* ================= SORTING ================= */
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedHospitals = useMemo(() => {
    return [...hospitals].sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case "rating":
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case "beds":
          aVal = a.numberOfBeds || 0;
          bVal = b.numberOfBeds || 0;
          break;
        case "location":
          aVal = a.address?.city || "";
          bVal = b.address?.city || "";
          break;
        default:
          aVal = a.name || "";
          bVal = b.name || "";
      }

      return sortOrder === "asc"
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });
  }, [hospitals, sortBy, sortOrder]);

  /* ================= APPOINTMENT MODAL ================= */
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    message: "",
    treatment: "",
  });

  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const openAppointmentModal = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentModal(true);
    setAppointmentForm({
      patientName: "",
      phone: "",
      email: "",
      date: "",
      message: "",
      treatment: "",
    });
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedHospital(null);
  };

  const handleAppointmentChange = (e) => {
    setAppointmentForm({
      ...appointmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentForm.patientName || !appointmentForm.phone || !appointmentForm.email || !appointmentForm.treatment) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        name: appointmentForm.patientName,
        email: appointmentForm.email,
        phone: appointmentForm.phone,
        hospital: selectedHospital._id,
        message: `Treatment: ${appointmentForm.treatment}\n\nAdditional Notes: ${appointmentForm.message}`,
        type: "query",
      };

      await createBooking(payload).unwrap();
      alert("Appointment request submitted successfully!");
      closeAppointmentModal();
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit appointment. Please try again.");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ================= SIDEBAR ================= */}
        <HospitalFilterSidebar hospitalsCount={sortedHospitals.length} />

        {/* ================= MAIN CONTENT ================= */}
        <div className="lg:col-span-3 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Perfect Hospital
            </h1>
            <p className="text-gray-600">
              Discover world-class healthcare facilities with expert care
            </p>
          </div>

          {/* Sorting */}
          {!isLoading && sortedHospitals.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-main" />
                <span className="font-medium text-gray-700">
                  {sortedHospitals.length} hospital{sortedHospitals.length !== 1 ? "s" : ""} found
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-main focus:border-transparent text-sm"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="beds">Number of Beds</option>
                  <option value="location">Location</option>
                </select>

                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition flex items-center gap-2"
                >
                  {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                  <span className="text-sm font-medium">{sortOrder === "asc" ? "A-Z" : "Z-A"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-main border-t-transparent" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Hospitals</h3>
              <p className="text-red-600">Please check your connection and try again.</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && sortedHospitals.length === 0 && (
            <div className="bg-white rounded-xl shadow p-10 text-center">
              <div className="text-gray-400 text-6xl mb-4">🏥</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hospitals Found</h3>
              <p className="text-gray-600">Try adjusting your filters to find more options.</p>
            </div>
          )}

          {/* Hospitals Grid */}
          {!isLoading && sortedHospitals.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedHospitals.map((hospital) => (
                <HospitalCard
                  key={hospital._id}
                  hospital={hospital}
                  onBook={openAppointmentModal}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= APPOINTMENT MODAL ================= */}
      {showAppointmentModal && selectedHospital && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Book Hospital Consultation</h3>
                <button
                  onClick={closeAppointmentModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hospital Info */}
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{selectedHospital.name}</h4>
                    <p className="text-sm text-gray-600">{selectedHospital.categoryData?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedHospital.address?.city}, {selectedHospital.address?.state || selectedHospital.countryData?.name}
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="patientName"
                    value={appointmentForm.patientName}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentForm.phone}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your phone"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={appointmentForm.email}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treatment Required *</label>
                  <input
                    type="text"
                    name="treatment"
                    value={appointmentForm.treatment}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="e.g., Cardiology, Surgery, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentForm.date}
                    onChange={handleAppointmentChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea
                    name="message"
                    value={appointmentForm.message}
                    onChange={handleAppointmentChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent resize-none"
                    placeholder="Any special requirements or medical history"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAppointmentModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="flex-1 px-4 py-3 bg-main text-white rounded-lg hover:bg-primary transition disabled:opacity-50 font-medium"
                  >
                    {isBookingLoading ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}