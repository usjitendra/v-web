import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Star,
  MapPin,
  Briefcase,
  Building2,
  CheckCircle,
  MessageCircle,
  Calendar,
  Stethoscope,
} from "lucide-react";
import { useGetAllHospitalsQuery } from "@/rtk/slices/commanApiSlice";

export default function HospitalListingPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const category = searchParams.get("category");

  const { data, isLoading, isError } = useGetAllHospitalsQuery(
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

  const hospitals = data?.data?.data || [];

  /* ================= FORM ================= */
  const [formData, setFormData] = useState({
    patientName: "",
    city: "",
    phone: "",
    problem: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.patientName || !formData.city || !formData.phone || !formData.problem) {
      alert("Please fill all fields");
      return;
    }
    alert("Form submitted! We will contact you soon.");
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
            {!isLoading && hospitals.length === 0 && (
              <div className="text-center bg-white rounded-xl shadow-lg p-12 mx-auto max-w-md">
                <div className="text-gray-400 text-6xl mb-4">🏥</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Hospitals Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria to find more options.</p>
              </div>
            )}

            {/* Hospital Cards */}
            {!isLoading &&
              hospitals.map((hospital, index) => (
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
                        <button className="bg-gradient-to-r from-main to-primary hover:from-primary hover:to-main text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
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
    </div>
  );
}
