import { useState } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaCalendarCheck,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaSpinner,
  FaStar,
  FaStethoscope
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetDoctorsDetailQuery } from "@/rtk/slices/commanApiSlice";

const DoctorDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDoctorsDetailQuery({ slug });
  const doctor = data?.data;

  const [activeTab, setActiveTab] = useState("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-teal-600" />
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (error || !doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/doctors")}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg"
        >
          Back to Doctors
        </button>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex justify-between items-center px-4">
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center text-gray-600 hover:text-teal-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Doctors
          </button>

          <Link
            to={`/doctors/${doctor.slug}/book`}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg flex items-center"
          >
            <FaCalendarCheck className="mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* Doctor Banner */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={doctor.image?.publicURL}
              alt={doctor.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold">{doctor.name}</h1>

              <div className="flex gap-4 mt-3 flex-wrap">
                <span className="flex items-center">
                  <FaStethoscope className="mr-2" />
                  {doctor.categoryId?.category_name}
                </span>

                <span className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" />
                  4.9 (120 reviews)
                </span>

                <span className="flex items-center">
                  <FaAward className="mr-2" />
                  {doctor.experience} Years Experience
                </span>
              </div>

              {/* Subcategories */}
              {doctor.subCategoryId?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {doctor.subCategoryId.map(sub => (
                    <span
                      key={sub._id}
                      className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {sub.subcategory_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm">
          <div className="flex gap-8 border-b overflow-x-auto">
            {["overview", "education", "experience", "gallery", "contact"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 ${
                  activeTab === tab
                    ? "border-b-2 border-teal-600 text-teal-600"
                    : "text-gray-500"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* ================= OVERVIEW ================= */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-2xl font-bold mb-4">About Doctor</h2>
              <p className="text-gray-600">{doctor.about}</p>

              {doctor.medicalProblems?.length > 0 && (
                <>
                  <h3 className="text-xl font-bold mt-6 mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {doctor.medicalProblems.map((p, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p className="text-gray-700">
                {doctor.location.address}
              </p>
              <p className="text-gray-600 mt-2">
                {doctor.location.city}, {doctor.location.state}
              </p>
              <p className="text-gray-600">
                {doctor.location.country} - {doctor.location.zipCode}
              </p>
            </div>
          </div>
        )}

        {/* ================= EDUCATION ================= */}
        {activeTab === "education" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-6">Education & Training</h2>
            {doctor.educationAndTraining.map(edu => (
              <div
                key={edu._id}
                className="p-4 bg-gray-50 rounded-lg mb-4"
              >
                <p className="font-semibold">{edu.degree}</p>
                <p className="text-gray-600">
                  {edu.institute} ({edu.year})
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ================= EXPERIENCE ================= */}
        {activeTab === "experience" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
            <p className="text-gray-600">{doctor.workExperience}</p>
          </div>
        )}

        {/* ================= GALLERY ================= */}
        {activeTab === "gallery" && doctor.gallery?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>

            <div className="mb-6">
              <img
                src={doctor.gallery[galleryIndex].publicURL}
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {doctor.gallery.map((img, index) => (
                <img
                  key={img._id}
                  src={img.publicURL}
                  onClick={() => setGalleryIndex(index)}
                  className={`w-24 h-24 object-cover rounded-lg cursor-pointer ${
                    galleryIndex === index
                      ? "ring-4 ring-teal-600"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ================= CONTACT ================= */}
        {activeTab === "contact" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-4">Contact</h2>

            {doctor.phone && (
              <p className="flex items-center mb-3">
                <FaPhone className="mr-3 text-teal-600" />
                {doctor.phone}
              </p>
            )}

            {doctor.email && (
              <p className="flex items-center mb-3">
                <FaEnvelope className="mr-3 text-teal-600" />
                {doctor.email}
              </p>
            )}

            {doctor.youtubeVideo?.url && (
              <a
                href={doctor.youtubeVideo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-teal-600"
              >
                <FaGlobe className="mr-2" />
                Watch Video
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
