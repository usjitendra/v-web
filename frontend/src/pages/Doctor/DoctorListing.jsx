import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Briefcase,
  Building2,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  X,
  MessageCircle,
} from "lucide-react";
import { useGetAllDoctorsQuery } from "@/rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "@/rtk/slices/bookingApiSlice";
import DoctorFilterSidebar from "./DoctorFilterSidebar";
import DoctorCard from "@/components/DoctorCard";

export default function DoctorListingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

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
    page: 1,
    limit: 10,
  });

  const doctors = data?.data?.data || [];

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
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: "",
  });

  const [createBooking, { isLoading: isBookingLoading }] =
    useCreateBookingMutation();

  const openAppointmentModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowAppointmentModal(true);
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedDoctor(null);
  };

  const handleAppointmentChange = (e) => {
    setAppointmentForm({
      ...appointmentForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...appointmentForm,
      doctor: selectedDoctor._id,
      hospital: selectedDoctor.hospital?._id,
      type: "appointment",
    };

    await createBooking(payload);
    alert("Appointment booked successfully!");
    closeAppointmentModal();
  };

  /* ================= RENDER ================= */
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">

        {/* ================= SIDEBAR ================= */}
        <DoctorFilterSidebar doctorsCount={sortedDoctors.length} />

        {/* ================= MAIN CONTENT ================= */}
        <div className="lg:col-span-3 space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Find Your Perfect Doctor
            </h1>
            <p className="text-gray-600">
              Connect with top-rated medical professionals worldwide
            </p>
          </div>

          {/* Sorting */}
          {!isLoading && sortedDoctors.length > 0 && (
            <div className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                {sortedDoctors.length} doctors found
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border rounded px-3 py-2"
                >
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="experience">Experience</option>
                  <option value="location">Location</option>
                </select>

                <button
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="border rounded px-3 py-2"
                >
                  {sortOrder === "asc" ? <SortAsc /> : <SortDesc />}
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
            <div className="bg-red-50 p-6 rounded-xl text-center">
              Failed to load doctors.
            </div>
          )}

          {/* Empty */}
          {!isLoading && sortedDoctors.length === 0 && (
            <div className="bg-white p-10 rounded-xl text-center shadow">
              No doctors found.
            </div>
          )}

          {/* Doctors Grid */}
          {!isLoading && sortedDoctors.length > 0 && (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {sortedDoctors.map((doctor) => (
                <DoctorCard
                  key={doctor._id}
                  doc={doctor}
                  onBook={() => openAppointmentModal(doctor)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {showAppointmentModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Book Appointment</h3>
              <button onClick={closeAppointmentModal}>
                <X />
              </button>
            </div>

            <form onSubmit={handleAppointmentSubmit} className="space-y-3">
              <input
                name="patientName"
                placeholder="Patient Name"
                onChange={handleAppointmentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleAppointmentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                name="email"
                placeholder="Email"
                onChange={handleAppointmentChange}
                className="w-full border p-2 rounded"
                required
              />
              <input
                type="date"
                name="date"
                onChange={handleAppointmentChange}
                className="w-full border p-2 rounded"
                required
              />
              <select
                name="time"
                onChange={handleAppointmentChange}
                className="w-full border p-2 rounded"
                required
              >
                <option value="">Select Time</option>
                <option>09:00</option>
                <option>10:00</option>
                <option>11:00</option>
                <option>14:00</option>
                <option>15:00</option>
              </select>

              <button
                type="submit"
                disabled={isBookingLoading}
                className="w-full bg-main text-white py-2 rounded"
              >
                {isBookingLoading ? "Booking..." : "Book Appointment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
