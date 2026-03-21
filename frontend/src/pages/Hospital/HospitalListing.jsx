import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SortAsc, SortDesc, X, MapPin, Building2, SlidersHorizontal,
  UserRound, Phone, Mail, FileText, Calendar, Stethoscope,
  CheckCircle2, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useGetAllHospitalsQuery } from "../../rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "../../rtk/slices/bookingApiSlice";
import HospitalFilterSidebar from "./HospitalFilterSidebar";
import HospitalCard from "./HospitalCard";

export default function HospitalListingPage() {
  const [searchParams] = useSearchParams();

  /* ================= URL PARAMS ================= */
  const country   = searchParams.get("country");
  const category  = searchParams.get("category");
  const city      = searchParams.get("city");
  const priceRange= searchParams.get("priceRange");
  const rating    = searchParams.get("rating");
  const facilities= searchParams.get("facilities");
  const search    = searchParams.get("search");

  /* ================= PAGINATION ================= */
  const [page, setPage] = useState(1);
  const limit = 9;

  useEffect(() => {
    setPage(1);
  }, [country, category, city, priceRange, rating, facilities, search]);

  /* ================= MOBILE FILTER ================= */
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  /* ================= API ================= */
  const { data, isLoading, isError } = useGetAllHospitalsQuery({
    country, category, city, priceRange, rating, facilities, search, page, limit,
  });

  const hospitals  = data?.data?.data   || [];
  const totalItems = data?.data?.total  || hospitals.length;
  const totalPages = data?.data?.totalPages || Math.ceil(totalItems / limit) || 1;

  /* ================= SORTING ================= */
  const [sortBy, setSortBy]       = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const sortedHospitals = useMemo(() => {
    return [...hospitals].sort((a, b) => {
      let aVal, bVal;
      switch (sortBy) {
        case "rating":   aVal = a.rating || 0;          bVal = b.rating || 0;          break;
        case "beds":     aVal = a.numberOfBeds || 0;    bVal = b.numberOfBeds || 0;    break;
        case "location": aVal = a.address?.city || "";  bVal = b.address?.city || "";  break;
        default:         aVal = a.name || "";            bVal = b.name || "";
      }
      return sortOrder === "asc" ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1);
    });
  }, [hospitals, sortBy, sortOrder]);

  /* ================= MODAL ================= */
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedHospital, setSelectedHospital]         = useState(null);
  const [bookingSuccess, setBookingSuccess]             = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "", phone: "", email: "", date: "", message: "", treatment: "",
  });

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();

  const openAppointmentModal = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentModal(true);
    setBookingSuccess(false);
    setAppointmentForm({ patientName: "", phone: "", email: "", date: "", message: "", treatment: "" });
    document.body.style.overflow = "hidden";
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedHospital(null);
    setBookingSuccess(false);
    document.body.style.overflow = "";
  };

  const handleAppointmentChange = (e) =>
    setAppointmentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    if (!appointmentForm.patientName || !appointmentForm.phone || !appointmentForm.email || !appointmentForm.treatment) {
      alert("Please fill all required fields");
      return;
    }
    try {
      await createBooking({
        name: appointmentForm.patientName,
        email: appointmentForm.email,
        phone: appointmentForm.phone,
        hospital: selectedHospital._id,
        message: `Treatment: ${appointmentForm.treatment}\n\nAdditional Notes: ${appointmentForm.message}`,
        type: "query",
      }).unwrap();
      setBookingSuccess(true);
    } catch (error) {
      console.error("Booking error:", error);
      alert("Failed to submit appointment. Please try again.");
    }
  };

  /* ================= PAGINATION HELPER ================= */
  const goToPage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ─── Shared input classes ─── */
  const inputCls =
    "w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm " +
    "focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition placeholder:text-gray-400";
  const inputWithIconCls = "pl-9 " + inputCls;

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ─── HERO ─── */}
      <div className="relative bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white pt-24 pb-16 px-4 overflow-hidden">
        <div className="absolute -top-12 -right-12 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-white/5 rounded-full pointer-events-none" />
        <div className="absolute top-8 left-8 w-20 h-20 bg-teal-500/30 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <Building2 className="w-4 h-4 text-teal-100" />
            <span className="text-sm font-medium text-teal-50 tracking-wide">Healthcare Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 leading-tight tracking-tight">
            Find Your Perfect Hospital
          </h1>
          <p className="text-teal-100 max-w-xl text-base sm:text-lg leading-relaxed">
            Discover world-class healthcare facilities with expert care, advanced technology, and patient-centric services.
          </p>
        </div>
      </div>

      {/* ─── MAIN ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-5">
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="flex items-center justify-between w-full px-4 py-3 bg-white border border-teal-300 rounded-xl shadow-sm text-sm font-semibold text-teal-700 hover:bg-teal-50 transition-all"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4" />
              {showMobileFilter ? "Hide Filters" : "Show Filters"}
            </span>
            <X className={`w-4 h-4 transition-transform duration-300 ${showMobileFilter ? "rotate-0" : "rotate-45"}`} />
          </button>
          {showMobileFilter && (
            <div className="mt-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <HospitalFilterSidebar hospitalsCount={sortedHospitals.length} />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">

          {/* ─── SIDEBAR desktop ─── */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-5 py-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" /> Refine Results
                </h3>
              </div>
              <div className="p-5">
                <HospitalFilterSidebar hospitalsCount={sortedHospitals.length} />
              </div>
            </div>
          </aside>

          {/* ─── CONTENT ─── */}
          <div className="lg:col-span-3 space-y-5">

            {/* Results + Sort bar */}
            {!isLoading && sortedHospitals.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">Results</p>
                    <p className="text-lg font-bold text-gray-900 leading-tight">
                      {totalItems} Hospital{totalItems !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                  >
                    <option value="name">Sort: Name</option>
                    <option value="rating">Sort: Rating</option>
                    <option value="beds">Sort: Beds</option>
                    <option value="location">Sort: Location</option>
                  </select>
                  <button
                    onClick={() => setSortOrder((o) => (o === "asc" ? "desc" : "asc"))}
                    className="flex items-center gap-1.5 px-3 py-2 border border-gray-300 rounded-lg hover:border-teal-400 hover:bg-teal-50 transition text-gray-700 text-sm font-medium bg-white"
                  >
                    {sortOrder === "asc"
                      ? <SortAsc className="w-4 h-4 text-teal-600" />
                      : <SortDesc className="w-4 h-4 text-teal-600" />}
                    <span className="hidden sm:inline text-sm">{sortOrder === "asc" ? "A–Z" : "Z–A"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="flex flex-col justify-center items-center py-32 gap-4">
                <div className="relative w-14 h-14">
                  <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-teal-600 animate-spin" />
                </div>
                <p className="text-gray-400 text-sm font-medium">Finding hospitals for you…</p>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="bg-white border border-red-200 rounded-2xl p-12 text-center shadow-sm">
                <div className="text-5xl mb-3">⚠️</div>
                <h3 className="text-xl font-bold text-red-700 mb-2">Unable to Load Hospitals</h3>
                <p className="text-gray-400 mb-5 text-sm">Check your connection and try again.</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2.5 bg-red-600 text-white rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && sortedHospitals.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                <div className="text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Hospitals Found</h3>
                <p className="text-gray-400 mb-5 text-sm max-w-xs mx-auto">Try adjusting your filters or search terms.</p>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2.5 border-2 border-teal-600 text-teal-600 rounded-xl text-sm font-semibold hover:bg-teal-50 transition"
                >
                  Go Back
                </button>
              </div>
            )}

            {/* Grid */}
            {!isLoading && sortedHospitals.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {sortedHospitals.map((hospital) => (
                  <HospitalCard
                    key={hospital._id}
                    hospital={hospital}
                    onBook={openAppointmentModal}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 pt-2 flex-wrap">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
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
                      <span key={`e-${idx}`} className="px-2 text-gray-400 text-sm select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition ${
                          page === p
                            ? "bg-teal-600 text-white shadow shadow-teal-200"
                            : "border border-gray-300 text-gray-700 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-semibold text-gray-600 hover:border-teal-500 hover:text-teal-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════ APPOINTMENT MODAL ═══════════ */}
      {showAppointmentModal && selectedHospital && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={closeAppointmentModal} />

          {/* Panel */}
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[95vh] sm:max-h-[90vh] overflow-hidden modal-slide-up">

            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-5 pt-5 pb-5 flex-shrink-0">
              {/* Drag handle — mobile only */}
              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mb-4 sm:hidden" />
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">Book Consultation</h3>
                <button
                  onClick={closeAppointmentModal}
                  className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition text-white"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Hospital info strip */}
              <div className="mt-4 bg-white/10 rounded-xl px-3 py-3 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm leading-tight">{selectedHospital.name}</p>
                    <p className="text-teal-100 text-xs">{selectedHospital.categoryData?.name || "Healthcare Facility"}</p>
                  </div>
                </div>
                {(selectedHospital.address?.city || selectedHospital.countryData?.name) && (
                  <div className="flex items-center gap-1.5 text-teal-100 text-xs pl-1">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>
                      {[selectedHospital.address?.city, selectedHospital.address?.state || selectedHospital.countryData?.name]
                        .filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* ── Success ── */}
            {bookingSuccess ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-12">
                <div className="w-16 h-16 bg-teal-50 border-2 border-teal-200 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-teal-600" />
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h4>
                <p className="text-gray-500 text-sm mb-6 max-w-xs">
                  Your consultation request for{" "}
                  <span className="font-semibold text-gray-700">{selectedHospital.name}</span>{" "}
                  has been received. Our team will reach out shortly.
                </p>
                <button
                  onClick={closeAppointmentModal}
                  className="px-8 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition"
                >
                  Done
                </button>
              </div>
            ) : (
              /* ── Form ── */
              <div className="flex-1 overflow-y-auto overscroll-contain">
                <form onSubmit={handleAppointmentSubmit} className="p-5 space-y-4">

                  {/* Patient Name */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      <input
                        type="text" name="patientName"
                        value={appointmentForm.patientName}
                        onChange={handleAppointmentChange}
                        placeholder="Your full name"
                        className={inputWithIconCls}
                        required
                      />
                    </div>
                  </div>

                  {/* Phone + Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Phone <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="tel" name="phone"
                          value={appointmentForm.phone}
                          onChange={handleAppointmentChange}
                          placeholder="+91 00000 00000"
                          className={inputWithIconCls}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="email" name="email"
                          value={appointmentForm.email}
                          onChange={handleAppointmentChange}
                          placeholder="you@email.com"
                          className={inputWithIconCls}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Treatment + Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Treatment Required <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="text" name="treatment"
                          value={appointmentForm.treatment}
                          onChange={handleAppointmentChange}
                          placeholder="e.g., Cardiology"
                          className={inputWithIconCls}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                        Preferred Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        <input
                          type="date" name="date"
                          value={appointmentForm.date}
                          onChange={handleAppointmentChange}
                          min={new Date().toISOString().split("T")[0]}
                          className={inputWithIconCls}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                      Additional Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      <textarea
                        name="message"
                        value={appointmentForm.message}
                        onChange={handleAppointmentChange}
                        rows={3}
                        placeholder="Medical history, special requirements…"
                        className={`${inputWithIconCls} resize-none`}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-1 pb-2">
                    <button
                      type="button"
                      onClick={closeAppointmentModal}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isBookingLoading}
                      className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-xl text-sm font-bold hover:bg-teal-700 disabled:opacity-60 transition shadow-sm shadow-teal-200 active:scale-[0.98]"
                    >
                      {isBookingLoading ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                          Submitting…
                        </span>
                      ) : "Book Now"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        .modal-slide-up {
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
      `}</style>
    </div>
  );
}