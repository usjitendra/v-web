import { useState } from "react";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaEnvelope,
  FaGlobe,
  FaPhone,
  FaSpinner,
  FaStar,
  FaStethoscope,
  FaHospital
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetHospitalDetailQuery } from "@/rtk/slices/commanApiSlice";

const HospitalDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetHospitalDetailQuery({ slug });
  const hospital = data?.data;

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
  if (error || !hospital) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          onClick={() => navigate("/hospitals")}
          className="px-6 py-3 bg-teal-600 text-white rounded-lg"
        >
          Back to Hospitals
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ================= HEADER ================= */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex justify-between items-center px-4">
          <button
            onClick={() => navigate("/hospitals")}
            className="flex items-center text-gray-600 hover:text-teal-600"
          >
            <FaArrowLeft className="mr-2" />
            Back to Hospitals
          </button>

          <Link
            to={`/hospitals/${hospital.slug}/book`}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg flex items-center"
          >
            <FaCalendarCheck className="mr-2" />
            Book Appointment
          </Link>
        </div>
      </div>

      {/* ================= BANNER ================= */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={hospital.photo?.publicURL}
              alt={hospital.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold">{hospital.name}</h1>

              <div className="flex gap-4 mt-3 flex-wrap">
                <span className="flex items-center">
                  <FaHospital className="mr-2" />
                  {hospital.hospitalType}
                </span>

                <span className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" />
                  4.8 Rating
                </span>

                <span className="flex items-center">
                  <FaStethoscope className="mr-2" />
                  {hospital.numberOfBeds} Beds
                </span>
              </div>

              {/* Categories */}
              {hospital.categoryIds?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {hospital.categoryIds.map(cat => (
                    <span
                      key={cat._id}
                      className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm"
                    >
                      {cat.category_name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= TABS ================= */}
        <div className="bg-white rounded-2xl p-6 mt-8 shadow-sm">
          <div className="flex gap-8 border-b overflow-x-auto">
            {["overview", "infrastructure", "gallery", "contact"].map(tab => (
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
              <h2 className="text-2xl font-bold mb-4">About Hospital</h2>
              <div
                className="text-gray-600 prose"
                dangerouslySetInnerHTML={{ __html: hospital.hospitalIntro }}
              />

              <h3 className="text-xl font-bold mt-6 mb-3">
                Team & Speciality
              </h3>
              <div
                className="text-gray-600 prose"
                dangerouslySetInnerHTML={{ __html: hospital.teamAndSpeciality }}
              />
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold mb-4">Location</h3>
              <p className="text-gray-700">{hospital.address.line1}</p>
              <p className="text-gray-600 mt-2">
                {hospital.address.city}, {hospital.address.state}
              </p>
              <p className="text-gray-600">
                Pincode: {hospital.address.pincode}
              </p>
            </div>
          </div>
        )}

        {/* ================= INFRASTRUCTURE ================= */}
        {activeTab === "infrastructure" && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-4">Infrastructure</h2>
            <div
              className="text-gray-600 prose"
              dangerouslySetInnerHTML={{ __html: hospital.infrastructure }}
            />
          </div>
        )}

        {/* ================= GALLERY ================= */}
        {activeTab === "gallery" && hospital.gallery?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm mt-8">
            <h2 className="text-2xl font-bold mb-4">Gallery</h2>

            <div className="mb-6">
              <img
                src={hospital.gallery[galleryIndex].publicURL}
                className="w-full h-[400px] object-cover rounded-xl"
              />
            </div>

            <div className="flex gap-4 overflow-x-auto">
              {hospital.gallery.map((img, index) => (
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

            {hospital.phone && (
              <p className="flex items-center mb-3">
                <FaPhone className="mr-3 text-teal-600" />
                {hospital.phone}
              </p>
            )}

            {hospital.youtubeVideos?.length > 0 && (
              <a
                href={hospital.youtubeVideos[0]}
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

export default HospitalDetails;
