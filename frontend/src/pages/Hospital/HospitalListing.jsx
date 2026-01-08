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
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ================= LEFT LIST ================= */}
          <div className="lg:col-span-2">

            {/* Loading */}
            {isLoading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="text-center text-red-500 font-semibold py-10">
                Failed to load hospitals.
              </div>
            )}

            {/* Empty */}
            {!isLoading && hospitals.length === 0 && (
              <div className="text-center text-gray-600 py-10">
                No hospitals found.
              </div>
            )}

            {/* Hospital Cards */}
            {!isLoading &&
              hospitals.map((hospital) => (
                <div
                  key={hospital._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden mb-6"
                >
                  <div className="p-4 sm:p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">

                      {/* Image */}
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={hospital?.image?.publicURL}
                            alt={hospital.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">
                            {hospital.name}
                          </h2>
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        </div>

                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                          {hospital.categoryData?.name}
                        </span>

                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {hospital.location?.city}, {hospital.location?.country}
                          </span>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              className="w-5 h-5 fill-orange-400 text-orange-400"
                            />
                          ))}
                          <span className="text-gray-700 font-semibold">
                            4.8 (210 Reviews)
                          </span>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-1 mb-2">
                          <Briefcase className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-600">
                            {hospital.experience || "20"}+ years experience
                          </span>
                        </div>

                        <div className="flex items-center justify-center sm:justify-start gap-1">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-green-600 font-medium">
                            Multispeciality Hospital
                          </span>
                        </div>

                        <Link
                          to={`/hospital/${hospital.slug}`}
                          className="inline-block mt-4 text-red-500 font-semibold"
                        >
                          Read More
                        </Link>
                      </div>

                      {/* Buttons */}
                      <div className="hidden lg:flex flex-col gap-3">
                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
                          Book Appointment
                        </button>
                        <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Whatsapp Us
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* ================= RIGHT FORM ================= */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg shadow-lg p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-white text-center mb-4">
                Get FREE Evaluation
              </h2>

              <div className="space-y-4">
                <input
                  name="patientName"
                  placeholder="Patient Name"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg"
                />
                <input
                  name="city"
                  placeholder="Enter City"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg"
                />
                <input
                  name="phone"
                  placeholder="Phone Number"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg"
                />
                <textarea
                  name="problem"
                  rows="4"
                  placeholder="Describe problem"
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg"
                />

                <button
                  onClick={handleSubmit}
                  className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-bold"
                >
                  Contact Us Now
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
