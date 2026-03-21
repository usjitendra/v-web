import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Filter,
  SortAsc,
  SortDesc,
  X,
  SlidersHorizontal,
  UserRound,
} from "lucide-react";
import { useGetAllDoctorsQuery } from "@/rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "@/rtk/slices/bookingApiSlice";
import DoctorFilterSidebar from "./DoctorFilterSidebar";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorListingPage() {
  const [searchParams] = useSearchParams();

  /* ================= URL PARAMS ================= */
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const treatment = searchParams.get("treatment");
  const hospital = searchParams.get("hospital");
  const priceRange = searchParams.get("priceRange");
  const rating = searchParams.get("rating");
  const experience = searchParams.get("experience");
  const availability = searchParams.get("availability");

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [country, category, city, treatment, hospital, priceRange, rating, experience, availability]);

  /* ================= MOBILE FILTER TOGGLE ================= */
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* ================= API ================= */
  const { data, isLoading, isError } = useGetAllDoctorsQuery({
    country,
    category,
    city,
    treatment,
    hospital,
    priceRange,
    rating,
    experience,
    availability,
    page,
    limit,
  });

  const doctors = data?.data?.data || [];
  const pagination = data?.data?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.total || doctors.length;

  /* ================= SORTING ================= */
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedDoctors = useMemo(() => {
    return [...doctors].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "rating":
          aVal = a.rating || 0;
          bVal = b.rating || 0;
          break;
        case "experience":
          aVal = a.experience || 0;
          bVal = b.experience || 0;
          break;
        case "location":
          aVal = a.location?.city || "";
          bVal = b.location?.city || "";
          break;
        default:
          aVal = a.name || "";
          bVal = b.name || "";
      }
      return sortOrder === "asc"
        ? aVal > bVal ? 1 : -1
        : aVal < bVal ? 1 : -1;
    });
  }, [doctors, sortBy, sortOrder]);

  /* ================= APPOINTMENT MODAL ================= */
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
    setAppointmentForm({ patientName: "", phone: "", email: "", date: "", time: "", message: "" });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  const handleFormChange = (e) => {
    setAppointmentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBooking({
        ...appointmentForm,
        doctor: selectedDoctor._id,
        hospital: selectedDoctor.hospital?._id,
        type: "appointment",
      }).unwrap();
      alert("Appointment booked successfully!");
      closeModal();
    } catch {
      alert("Failed to book appointment. Please try again.");
    }
  };

  /* ================= HELPERS ================= */
  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 px-3 sm:px-4">

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4 max-w-7xl mx-auto">
        <button
          onClick={() => setShowMobileFilter(!showMobileFilter)}
          className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-teal-600" />
            {showMobileFilter ? "Hide Filters" : "Show Filters"}
          </span>
          <X className={`w-4 h-4 transition-transform ${showMobileFilter ? "rotate-0" : "rotate-45"}`} />
        </button>

        {showMobileFilter && (
          <div className="mt-3">
            <DoctorFilterSidebar doctorsCount={sortedDoctors.length} />
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

        {/* Sidebar — desktop only */}
        <div className="hidden lg:block">
          <DoctorFilterSidebar doctorsCount={sortedDoctors.length} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-5">

          {/* Page heading */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Find Your Perfect Doctor
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Connect with top-rated medical professionals worldwide
            </p>
          </div>

          {/* Sort bar */}
          {!isLoading && sortedDoctors.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Filter className="w-4 h-4 text-teal-600" />
                <span>
                  {totalItems > 0
                    ? `${totalItems} doctor${totalItems !== 1 ? "s" : ""} found`
                    : `${sortedDoctors.length} doctor${sortedDoctors.length !== 1 ? "s" : ""} found`}
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs font-medium text-gray-500">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="location">Location</option>
                </select>

                <button
                  onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                  className="border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition flex items-center gap-1.5 text-sm font-medium"
                >
                  {sortOrder === "asc" ? (
                    <><SortAsc className="w-4 h-4" /> A–Z</>
                  ) : (
                    <><SortDesc className="w-4 h-4" /> Z–A</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-center py-20">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-teal-600 border-t-transparent" />
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
              <div className="text-5xl mb-3">⚠️</div>
              <h3 className="text-lg font-semibold text-red-700 mb-1">Unable to Load Doctors</h3>
              <p className="text-sm text-red-600">Please check your connection and try again.</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && sortedDoctors.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
              <UserRound className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-1">No Doctors Found</h3>
              <p className="text-sm text-gray-500">Try adjusting your filters to find more options.</p>
            </div>
          )}

          {/* Doctors Grid */}
          {!isLoading && sortedDoctors.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {sortedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doc={doctor}
                  onBook={() => openModal(doctor)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4 pb-2 flex-wrap">
              <button
                onClick={() => goToPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) acc.push("...");
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, idx) =>
                  p === "..." ? (
                    <span key={`e-${idx}`} className="px-2 text-gray-400 select-none">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        page === p
                          ? "bg-teal-600 text-white shadow"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

              <button
                onClick={() => goToPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= APPOINTMENT MODAL ================= */}
      {showModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              {/* Modal header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Doctor info */}
              <div className="flex items-center gap-3 bg-teal-50 rounded-xl p-4 mb-5">
                <div className="w-12 h-12 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <UserRound className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Dr. {selectedDoctor.name}</p>
                  <p className="text-sm text-teal-700">{selectedDoctor.categoryData?.name || "Specialist"}</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Patient Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="patientName"
                    value={appointmentForm.patientName}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={appointmentForm.phone}
                    onChange={handleFormChange}
                    placeholder="Enter your phone"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={appointmentForm.email}
                    onChange={handleFormChange}
                    placeholder="Enter your email"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={appointmentForm.date}
                      onChange={handleFormChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Time Slot <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="time"
                      value={appointmentForm.time}
                      onChange={handleFormChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>02:00 PM</option>
                      <option>03:00 PM</option>
                      <option>04:00 PM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Additional Notes
                  </label>
                  <textarea
                    name="message"
                    value={appointmentForm.message}
                    onChange={handleFormChange}
                    rows={3}
                    placeholder="Any special requirements or medical history"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="flex-1 px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 disabled:opacity-50 transition"
                  >
                    {isBookingLoading ? "Booking..." : "Confirm Booking"}
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
