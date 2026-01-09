import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
    Star,
    MapPin,
    Briefcase,
    Building2,
    CheckCircle,
    MessageCircle,
} from "lucide-react";
import { useGetAllDoctorsQuery } from "@/rtk/slices/commanApiSlice";

export default function DoctorListingPage() {
    const [searchParams] = useSearchParams();

    const country = searchParams.get("country");
    const category = searchParams.get("category");

    const {
        data,
        isLoading,
        isError,
    } = useGetAllDoctorsQuery(
        {
            country,
            category,
            page: 1,
            limit: 10,
        },
        {
            skip: !country || !category,
        }
    );

    console.log("data is", data);


    const doctors = data?.data?.data || [];

    const [formData, setFormData] = useState({
        patientName: "",
        country: "India",
        city: "",
        phone: "",
        age: "",
        problem: "",
    });

    const [showMore, setShowMore] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
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
        alert("Form submitted! We will contact you soon.");
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
                        {!isLoading && doctors.length === 0 && (
                            <div className="text-center bg-white rounded-xl shadow-lg p-12 mx-auto max-w-md">
                                <div className="text-gray-400 text-6xl mb-4">👨‍⚕️</div>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No doctors found</h3>
                                <p className="text-gray-600">Try adjusting your search criteria.</p>
                            </div>
                        )}

                        {/* ===== Doctors List ===== */}
                        {!isLoading &&
                            doctors.map((doctor, index) => (
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
                                                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
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
        </div>
    );
}
