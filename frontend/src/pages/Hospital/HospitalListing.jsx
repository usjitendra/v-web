import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Briefcase,
  Building2,
  CheckCircle,
  MessageCircle,
  Calendar,
  Stethoscope,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { useGetAllHospitalsQuery } from "@/rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "@/rtk/slices/bookingApiSlice";

export default function HospitalListingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const country = searchParams.get("country");
  const category = searchParams.get("category");
  const city = searchParams.get("city");
  const priceRange = searchParams.get("priceRange");
  const rating = searchParams.get("rating");
  const facilities = searchParams.get("facilities");

  const { data, isLoading, isError } = useGetAllHospitalsQuery(
    {
      country,
      category,
      city,
      priceRange,
      rating,
      facilities,
      page: 1,
      limit: 10,
    },
    {
      skip: false, // Always fetch hospitals, apply filters on frontend if needed
    }
  );

  const hospitals = data?.data?.data || [];

  // Sorting state
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sorted hospitals
  const sortedHospitals = useMemo(() => {
    if (!hospitals.length) return hospitals;

    return [...hospitals].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'rating':
          aValue = a.rating || 0;
          bValue = b.rating || 0;
          break;
        case 'experience':
          aValue = a.experience || 0;
          bValue = b.experience || 0;
          break;
        case 'location':
          aValue = a.location?.city?.toLowerCase() || '';
          bValue = b.location?.city?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [hospitals, sortBy, sortOrder]);

  const clearFilters = () => {
    navigate('/hospitals');
  };

  /* ================= FORM ================= */
  const [formData, setFormData] = useState({
    patientName: "",
    city: "",
    phone: "",
    problem: "",
  });

  // Appointment booking state
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [appointmentForm, setAppointmentForm] = useState({
    patientName: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    message: "",
    treatment: "",
  });

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const [createContactBooking, { isLoading: isContactBookingLoading }] = useCreateBookingMutation();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.patientName || !formData.city || !formData.phone || !formData.problem) {
      alert("Please fill all fields");
      return;
    }

    try {
      const bookingData = {
        name: formData.patientName,
        email: formData.email || `${formData.patientName.toLowerCase().replace(/\s+/g, '')}@example.com`, // Generate email if not provided
        phone: formData.phone,
        message: `City: ${formData.city}\nProblem: ${formData.problem}`,
        type: 'query'
      };

      const result = await createContactBooking(bookingData).unwrap();
      alert("Your inquiry has been submitted successfully! We will contact you soon.");
    } catch (error) {
      console.error('Contact booking error:', error);
      alert("Failed to submit your inquiry. Please try again.");
    }
  };

  // Appointment booking functions
  const openAppointmentModal = (hospital) => {
    setSelectedHospital(hospital);
    setShowAppointmentModal(true);
    setAppointmentForm({
      patientName: "",
      phone: "",
      email: "",
      date: "",
      time: "",
      message: "",
      treatment: "",
    });
  };

  const closeAppointmentModal = () => {
    setShowAppointmentModal(false);
    setSelectedHospital(null);
  };

  const handleAppointmentFormChange = (e) => {
    const { name, value } = e.target;
    setAppointmentForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();

    if (!appointmentForm.patientName || !appointmentForm.phone || !appointmentForm.email || !appointmentForm.treatment) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const bookingData = {
        name: appointmentForm.patientName,
        email: appointmentForm.email,
        phone: appointmentForm.phone,
        hospital: selectedHospital._id,
        message: `${appointmentForm.treatment}\n\nAdditional Notes: ${appointmentForm.message}`,
        type: 'query' // For hospital appointments, we'll use query type since hospitals don't have specific doctors
      };

      const result = await createBooking(bookingData).unwrap();

      alert("Appointment request submitted successfully! We will contact you soon.");
      closeAppointmentModal();
    } catch (error) {
      console.error('Booking error:', error);
      alert("Failed to submit appointment request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lightSky to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= PAGE HEADER ================= */}
          <div className="lg:col-span-3 mb-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold text-darktext mb-4">
                Find Your Perfect Hospital
              </h1>
              <p className="text-xl text-lighttext max-w-2xl mx-auto">
                Discover world-class healthcare facilities with advanced medical technology and expert care
              </p>
            </div>
          </div>

          {/* ================= SORTING AND FILTERS ================= */}
          {!isLoading && sortedHospitals.length > 0 && (
            <div className="lg:col-span-3 mb-6">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Filter className="w-5 h-5" />
                    <span className="font-medium">
                      {sortedHospitals.length} hospital{sortedHospitals.length !== 1 ? 's' : ''} found
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-600">Sort by:</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main focus:border-transparent"
                    >
                      <option value="name">Name</option>
                      <option value="rating">Rating</option>
                      <option value="experience">Experience</option>
                      <option value="location">Location</option>
                    </select>

                    <button
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      {sortOrder === 'asc' ? (
                        <SortAsc className="w-4 h-4" />
                      ) : (
                        <SortDesc className="w-4 h-4" />
                      )}
                      <span className="text-sm font-medium">
                        {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Active Filters Display */}
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                  {(country || city || category || priceRange || rating || facilities) && (
                    <button
                      onClick={clearFilters}
                      className="text-red-600 hover:text-red-700 font-medium text-sm underline"
                    >
                      Clear all filters
                    </button>
                  )}

                  {country && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      Country: {country}
                    </span>
                  )}
                  {city && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      City: {city}
                    </span>
                  )}
                  {category && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      Specialty: {category}
                    </span>
                  )}
                  {priceRange && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      Price: {priceRange}
                    </span>
                  )}
                  {rating && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      Rating: {rating}
                    </span>
                  )}
                  {facilities && (
                    <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                      Facilities: {facilities}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= LEFT LIST ================= */}
          <div className="lg:col-span-2">

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center items-center py-20">
                <div className="relative">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-main border-t-transparent"></div>
                  <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-2 border-main opacity-20"></div>
                </div>
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 mx-auto max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h3 className="text-xl font-semibold text-red-700 mb-2">Unable to Load Hospitals</h3>
                <p className="text-red-600">Please check your connection and try again.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && sortedHospitals.length === 0 && (
              <div className="text-center bg-white rounded-xl shadow-lg p-12 mx-auto max-w-md">
                <div className="text-gray-400 text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hospitals Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria to find more options.</p>
              </div>
            )}

            {/* Hospital Cards */}
            {!isLoading &&
              sortedHospitals.map((hospital, index) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 lg:p-8">
                    <div className="flex flex-col lg:flex-row gap-6">

                      {/* Image */}
                      <div className="flex-shrink-0 mx-auto lg:mx-0">
                        <div className="relative">
                          <div className="w-36 h-36 lg:w-48 lg:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-xl border-4 border-white">
                            <img
                              src={hospital?.image?.publicURL}
                              alt={hospital.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-main to-primary rounded-full p-3 shadow-lg">
                            <CheckCircle className="w-6 h-6 text-white" />
                          </div>
                          <div className="absolute -top-2 -left-2 bg-accent text-darktext rounded-full p-3 shadow-lg">
                            <Building2 className="w-6 h-6" />
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                          <h2 className="text-3xl lg:text-4xl font-bold text-darktext">
                            {hospital.name}
                          </h2>
                        </div>

                        {/* Category Badge */}
                        <div className="mb-6">
                          <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-main/10 to-accent/10 text-main rounded-2xl text-lg font-bold shadow-sm border border-main/20">
                            <Stethoscope className="w-5 h-5 mr-2" />
                            {hospital.categoryData?.name}
                          </span>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                          {/* Location */}
                          <div className="flex items-center justify-center lg:justify-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-blue-50 rounded-lg">
                              <MapPin className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Location</p>
                              <p className="text-darktext font-semibold">{hospital.location?.city}, {hospital.location?.country}</p>
                            </div>
                          </div>

                          {/* Rating */}
                          <div className="flex items-center justify-center lg:justify-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-yellow-50 rounded-lg">
                              <Star className="w-5 h-5 text-yellow-500" />
                            </div>
                            <div>
                              <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Rating</p>
                              <div className="flex items-center gap-2">
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  ))}
                                </div>
                                <span className="text-darktext font-bold">4.8</span>
                                <span className="text-lighttext text-sm">(210 Reviews)</span>
                              </div>
                            </div>
                          </div>

                          {/* Experience */}
                          <div className="flex items-center justify-center lg:justify-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-accent/10 rounded-lg">
                              <Briefcase className="w-5 h-5 text-accent" />
                            </div>
                            <div>
                              <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Experience</p>
                              <p className="text-darktext font-semibold">{hospital.experience || "20"}+ Years</p>
                            </div>
                          </div>

                          {/* Type */}
                          <div className="flex items-center justify-center lg:justify-start gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="p-2 bg-main/10 rounded-lg">
                              <Building2 className="w-5 h-5 text-main" />
                            </div>
                            <div>
                              <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Type</p>
                              <p className="text-main font-bold">Multispeciality</p>
                            </div>
                          </div>
                        </div>

                        {/* Read More Link */}
                        <div className="flex justify-center lg:justify-start">
                          <Link
                            to={`/hospital/${hospital.slug}`}
                            className="inline-flex items-center gap-2 text-main hover:text-primary font-bold transition-colors duration-200 group"
                          >
                            Learn More About This Hospital
                            <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                          </Link>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="hidden lg:flex flex-col gap-4 flex-shrink-0">
                        <button
                          onClick={() => openAppointmentModal(hospital)}
                          className="bg-gradient-to-r from-main to-primary hover:from-primary hover:to-main text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                        >
                          <Calendar className="w-6 h-6" />
                          Book Consultation
                        </button>
                        <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                          <MessageCircle className="w-6 h-6" />
                          WhatsApp Us
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-main via-primary to-dark rounded-2xl shadow-2xl p-8 sticky top-4 transform hover:scale-105 transition-transform duration-300">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                  Get FREE Hospital Evaluation
                </h2>
                <p className="text-teal-100 text-sm">
                  Connect with top hospitals worldwide
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    name="patientName"
                    placeholder="Patient Name"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <input
                    name="city"
                    placeholder="Enter City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  />
                </div>
                <div className="relative">
                  <textarea
                    name="problem"
                    rows="4"
                    placeholder="Describe your medical needs"
                    value={formData.problem}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-600 hover:to-accent text-darktext py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Free Consultation
                </button>

                {/* Trust indicators */}
                <div className="text-center mt-6 pt-4 border-t border-white/20">
                  <p className="text-teal-100 text-xs mb-2">Trusted by 25,000+ patients</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-teal-100 text-xs mt-2">Average response: 2 hours</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Appointment Booking Modal */}
      {showAppointmentModal && selectedHospital && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Book Hospital Consultation</h3>
                <button
                  onClick={closeAppointmentModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
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
                  <span>{selectedHospital.location?.city}, {selectedHospital.location?.country}</span>
                </div>
              </div>

              {/* Appointment Form */}
              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={appointmentForm.patientName}
                    onChange={handleAppointmentFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={appointmentForm.phone}
                    onChange={handleAppointmentFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={appointmentForm.email}
                    onChange={handleAppointmentFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Treatment/Service Required *
                  </label>
                  <input
                    type="text"
                    name="treatment"
                    value={appointmentForm.treatment}
                    onChange={handleAppointmentFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    placeholder="e.g., Cardiology consultation, Surgery, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date (Optional)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={appointmentForm.date}
                    onChange={handleAppointmentFormChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={appointmentForm.message}
                    onChange={handleAppointmentFormChange}
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent resize-none"
                    placeholder="Describe your medical needs or any special requirements"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAppointmentModal}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isBookingLoading}
                    className="flex-1 px-4 py-3 bg-main text-white rounded-lg hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isBookingLoading ? 'Submitting...' : 'Submit Request'}
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
