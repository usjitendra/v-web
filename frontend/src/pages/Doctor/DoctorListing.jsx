import React, { useState, useMemo } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  Briefcase,
  Building2,
  CheckCircle,
  MessageCircle,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  X,
} from "lucide-react";
import { useGetAllDoctorsQuery } from "@/rtk/slices/commanApiSlice";
import { useCreateBookingMutation } from "@/rtk/slices/bookingApiSlice";

export default function DoctorListingPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const country = searchParams.get("country");
    const category = searchParams.get("category");
    const city = searchParams.get("city");
    const treatment = searchParams.get("treatment");
    const hospital = searchParams.get("hospital");
    const priceRange = searchParams.get("priceRange");
    const rating = searchParams.get("rating");
    const experience = searchParams.get("experience");
    const availability = searchParams.get("availability");

    const {
        data,
        isLoading,
        isError,
    } = useGetAllDoctorsQuery(
        {
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
        },
        {
            skip: false, // Always fetch doctors, apply filters on frontend if needed
        }
    );

    const doctors = data?.data?.data || [];

    // Sorting state
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sorted doctors
    const sortedDoctors = useMemo(() => {
        if (!doctors.length) return doctors;

        return [...doctors].sort((a, b) => {
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
    }, [doctors, sortBy, sortOrder]);

    const clearFilters = () => {
        navigate('/doctors');
    };

    const [formData, setFormData] = useState({
        patientName: "",
        country: "India",
        city: "",
        phone: "",
        age: "",
        problem: "",
    });

    const [showMore, setShowMore] = useState(false);

    // Appointment booking state
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

    const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
    const [createContactBooking, { isLoading: isContactBookingLoading }] = useCreateBookingMutation();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (
            !formData.patientName ||
            !formData.city ||
            !formData.phone ||
            !formData.age ||
            !formData.problem
        ) {
            alert("Please fill all fields");
            return;
        }

        try {
            const bookingData = {
                name: formData.patientName,
                email: formData.email || `${formData.patientName.toLowerCase().replace(/\s+/g, '')}@example.com`, // Generate email if not provided
                phone: formData.phone,
                message: `City: ${formData.city}\nAge: ${formData.age}\nProblem: ${formData.problem}`,
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
    const openAppointmentModal = (doctor) => {
        setSelectedDoctor(doctor);
        setShowAppointmentModal(true);
        setAppointmentForm({
            patientName: "",
            phone: "",
            email: "",
            date: "",
            time: "",
            message: "",
        });
    };

    const closeAppointmentModal = () => {
        setShowAppointmentModal(false);
        setSelectedDoctor(null);
    };

    const handleAppointmentFormChange = (e) => {
        const { name, value } = e.target;
        setAppointmentForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();

        if (!appointmentForm.patientName || !appointmentForm.phone || !appointmentForm.email || !appointmentForm.date || !appointmentForm.time) {
            alert("Please fill all required fields");
            return;
        }

        try {
            const bookingData = {
                name: appointmentForm.patientName,
                email: appointmentForm.email,
                phone: appointmentForm.phone,
                doctor: selectedDoctor._id,
                hospital: selectedDoctor.hospital?._id || selectedDoctor.hospitalId,
                date: appointmentForm.date,
                time: appointmentForm.time,
                message: appointmentForm.message,
                type: 'appointment'
            };

            const result = await createBooking(bookingData).unwrap();

            alert("Appointment booked successfully! We will contact you soon.");
            closeAppointmentModal();
        } catch (error) {
            console.error('Booking error:', error);
            alert("Failed to book appointment. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ================= LEFT SECTION ================= */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* ===== Page Header ===== */}
                        <div className="text-center lg:text-left mb-8">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                Find Your Perfect Doctor
                            </h1>
                            <p className="text-lg text-gray-600">
                                Connect with top-rated medical professionals worldwide
                            </p>
                        </div>

                        {/* ===== SORTING AND FILTERS ===== */}
                        {!isLoading && sortedDoctors.length > 0 && (
                            <div className="mb-8">
                                <div className="bg-white rounded-xl shadow-lg p-4">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Filter className="w-5 h-5" />
                                            <span className="font-medium">
                                                {sortedDoctors.length} doctor{sortedDoctors.length !== 1 ? 's' : ''} found
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
                                        {(country || city || category || treatment || hospital || priceRange || rating || experience || availability) && (
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
                                        {treatment && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Treatment: {treatment}
                                            </span>
                                        )}
                                        {hospital && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Hospital: {hospital}
                                            </span>
                                        )}
                                        {priceRange && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Fee: {priceRange}
                                            </span>
                                        )}
                                        {rating && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Rating: {rating}
                                            </span>
                                        )}
                                        {experience && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Experience: {experience}
                                            </span>
                                        )}
                                        {availability && (
                                            <span className="inline-flex items-center px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                Availability: {availability}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== Spinner ===== */}
                        {isLoading && (
                            <div className="flex justify-center items-center py-20">
                                <div className="relative">
                                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-main border-t-transparent"></div>
                                    <div className="absolute inset-0 h-12 w-12 animate-ping rounded-full border-2 border-main opacity-20"></div>
                                </div>
                            </div>
                        )}

                        {/* ===== Error ===== */}
                        {isError && (
                            <div className="text-center bg-red-50 border border-red-200 rounded-xl p-8 mx-auto max-w-md">
                                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                                <h3 className="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong</h3>
                                <p className="text-red-600">Failed to load doctors. Please try again later.</p>
                            </div>
                        )}

                        {/* ===== Empty ===== */}
                        {!isLoading && sortedDoctors.length === 0 && (
                            <div className="text-center bg-white rounded-xl shadow-lg p-12 mx-auto max-w-md">
                                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria.</p>
                            </div>
                        )}

                        {/* ===== Doctors List ===== */}
                        {!isLoading &&
                            sortedDoctors.map((doctor, index) => (
                                <div
                                    key={doctor._id}
                                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="p-6 lg:p-8">
                                        <div className="flex flex-col lg:flex-row gap-6">

                                            {/* Image */}
                                            <div className="flex-shrink-0 mx-auto lg:mx-0">
                                                <div className="relative">
                                                    <div className="w-36 h-36 lg:w-44 lg:h-44 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                                                        <img
                                                            src={doctor?.image?.publicURL}
                                                            alt={doctor.name}
                                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-2 -right-2 bg-main rounded-full p-2 shadow-lg">
                                                        <CheckCircle className="w-5 h-5 text-white" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 text-center lg:text-left">
                                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-3">
                                                    <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                                                        {doctor.name}
                                                    </h2>
                                                </div>

                                                {/* Specialization */}
                                                <div className="mb-4">
                                                    <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-main/10 to-accent/10 text-main rounded-full text-sm font-semibold shadow-sm">
                                                        {doctor.categoryData?.name}
                                                    </span>
                                                </div>

                                                {/* Location */}
                                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                                                    <MapPin className="w-5 h-5 text-main" />
                                                    <span className="text-gray-700 font-medium">
                                                        {doctor.location?.city}, {doctor.location?.country}
                                                    </span>
                                                </div>

                                                {/* Rating */}
                                                <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map((i) => (
                                                            <Star
                                                                key={i}
                                                                className="w-5 h-5 fill-orange-400 text-orange-400"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-gray-800 font-bold text-lg">4.9</span>
                                                        <span className="text-gray-600">(271 Ratings)</span>
                                                    </div>
                                                </div>

                                                {/* Experience */}
                                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                                    </div>
                                                    <span className="text-gray-700 font-medium">
                                                        {doctor.experience}+ years of experience
                                                    </span>
                                                </div>

                                                {/* Designation */}
                                                <div className="mb-3">
                                                    <div className="flex items-center justify-center lg:justify-start gap-2">
                                                        <span className="text-gray-600 font-medium">Designation:</span>
                                                        <span className="text-gray-800 font-semibold">Senior Consultant</span>
                                                    </div>
                                                </div>

                                                {/* Hospital */}
                                                <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                                                    <div className="p-2 bg-green-50 rounded-lg">
                                                        <Building2 className="w-5 h-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <span className="text-gray-600 font-medium">Works At: </span>
                                                        <span className="text-green-700 font-semibold">
                                                            Leading Multispeciality Hospital
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center lg:justify-start">
                                                    <Link
                                                        to={`/doctor/${doctor?.slug}`}
                                                        className="inline-flex items-center gap-2 text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 group"
                                                    >
                                                        Read More
                                                        <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                                                    </Link>
                                                </div>
                                            </div>

                                            {/* Buttons */}
                                            <div className="hidden lg:flex flex-col gap-4 flex-shrink-0">
                                                <button
                                                    onClick={() => openAppointmentModal(doctor)}
                                                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                                                >
                                                    <Calendar className="w-5 h-5" />
                                                    Book Appointment
                                                </button>
                                                <button className="bg-gradient-to-r from-main to-primary hover:from-primary hover:to-main text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                                                    <MessageCircle className="w-5 h-5" />
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
                                    Get FREE Evaluation
                                </h2>
                                <p className="text-teal-100 text-sm">
                                    Connect with our medical experts today
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="patientName"
                                        placeholder="Patient Name"
                                        value={formData.patientName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type="text"
                                        name="city"
                                        placeholder="Enter city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter Phone no."
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                                    />
                                </div>

                                <div className="relative">
                                    <textarea
                                        name="problem"
                                        placeholder="Describe problem"
                                        value={formData.problem}
                                        onChange={handleInputChange}
                                        rows="4"
                                        className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    Contact Us Now
                                </button>

                                {/* Trust indicators */}
                                <div className="text-center mt-6 pt-4 border-t border-white/20">
                                    <p className="text-teal-100 text-xs mb-2">Trusted by 50,000+ patients</p>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Appointment Booking Modal */}
            {showAppointmentModal && selectedDoctor && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Book Appointment</h3>
                                <button
                                    onClick={closeAppointmentModal}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Doctor Info */}
                            <div className="bg-gray-50 rounded-xl p-4 mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-main rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">
                                            {selectedDoctor.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{selectedDoctor.name}</h4>
                                        <p className="text-sm text-gray-600">{selectedDoctor.categoryData?.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>{selectedDoctor.location?.city}, {selectedDoctor.location?.country}</span>
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Date *
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={appointmentForm.date}
                                            onChange={handleAppointmentFormChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Preferred Time *
                                        </label>
                                        <select
                                            name="time"
                                            value={appointmentForm.time}
                                            onChange={handleAppointmentFormChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Time</option>
                                            <option value="09:00">9:00 AM</option>
                                            <option value="10:00">10:00 AM</option>
                                            <option value="11:00">11:00 AM</option>
                                            <option value="14:00">2:00 PM</option>
                                            <option value="15:00">3:00 PM</option>
                                            <option value="16:00">4:00 PM</option>
                                            <option value="17:00">5:00 PM</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message (Optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={appointmentForm.message}
                                        onChange={handleAppointmentFormChange}
                                        rows="3"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-main focus:border-transparent resize-none"
                                        placeholder="Describe your symptoms or reason for visit"
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
                                        {isBookingLoading ? 'Booking...' : 'Book Appointment'}
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
