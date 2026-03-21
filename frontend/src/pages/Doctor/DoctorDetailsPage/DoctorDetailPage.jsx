import { useState } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaCalendarCheck,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaSpinner,
  FaStar,
  FaStethoscope,
  FaGraduationCap,
  FaBriefcase,
  FaImages,
  FaAddressCard,
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetDoctorsDetailQuery } from "@/rtk/slices/commanApiSlice";
import { CountryFlag } from "@/helper/countryFlags";

const TABS = [
  { id: "overview",   label: "Overview",   icon: <FaStethoscope /> },
  { id: "education",  label: "Education",  icon: <FaGraduationCap /> },
  { id: "experience", label: "Experience", icon: <FaBriefcase /> },
  { id: "gallery",    label: "Gallery",    icon: <FaImages /> },
  { id: "contact",    label: "Contact",    icon: <FaAddressCard /> },
];

const DoctorDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetDoctorsDetailQuery({ slug });
  const doctor = data?.data;

  const [activeTab, setActiveTab]     = useState("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <FaSpinner className="animate-spin text-4xl text-teal-600" />
          <p className="text-gray-500 text-sm">Loading doctor profile…</p>
        </div>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4">
        <div className="text-5xl">👨‍⚕️</div>
        <h2 className="text-xl font-semibold text-gray-700">Doctor not found</h2>
        <p className="text-sm text-gray-500">We couldn't load the doctor profile. Please try again.</p>
        <button
          onClick={() => navigate("/doctors")}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 transition"
        >
          ← Back to Doctors
        </button>
      </div>
    );
  }

  const bookUrl = `/book/${doctor.hospital?._id || ""}/${doctor._id || ""}`;

  /* ── Page ── */
  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════
          TOP NAV BAR
      ══════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-teal-600 transition font-medium"
          >
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:inline">Back to Doctors</span>
            <span className="sm:hidden">Back</span>
          </button>

          <Link
            to={bookUrl}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition shadow-sm"
          >
            <FaCalendarCheck />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8">

        {/* ══════════════════════════════════════
            HERO / PROFILE CARD
        ══════════════════════════════════════ */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-6">
          {/* Teal banner strip */}
          <div className="h-28 sm:h-36 bg-gradient-to-r from-teal-700 to-teal-500 relative">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 50%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Profile content */}
          <div className="px-5 sm:px-8 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-14 sm:-mt-16">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <img
                  src={doctor.image?.publicURL || "/doctor-placeholder.jpg"}
                  alt={doctor.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-4 border-white shadow-lg"
                />
              </div>

              {/* Name & meta */}
              <div className="flex-1 min-w-0 sm:pb-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
                      Dr. {doctor.name}
                    </h1>
                    {doctor.categoryId?.category_name && (
                      <p className="text-teal-600 font-medium text-sm sm:text-base mt-0.5">
                        {doctor.categoryId.category_name}
                      </p>
                    )}
                  </div>

                  {/* Book button — visible on sm+ inline, hidden on mobile (top bar has it) */}
                  <Link
                    to={bookUrl}
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition shadow-sm self-start"
                  >
                    <FaCalendarCheck />
                    Book Appointment
                  </Link>
                </div>

                {/* Stats row */}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-3 text-sm text-gray-600">
                  <span className="flex items-center gap-1.5">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold text-gray-800">4.9</span>
                    <span className="text-gray-400">(120 reviews)</span>
                  </span>

                  {doctor.experience && (
                    <span className="flex items-center gap-1.5">
                      <FaAward className="text-teal-500" />
                      {doctor.experience}+ yrs experience
                    </span>
                  )}

                  {(doctor.location?.city || doctor.location?.country) && (
                    <span className="flex items-center gap-1.5">
                      <FaMapMarkerAlt className="text-teal-500" />
                      {doctor.location.country && (
                        <CountryFlag name={doctor.location.country} width={16} className="shadow-sm" />
                      )}
                      {[doctor.location.city, doctor.location.country].filter(Boolean).join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Subspecialty chips */}
            {doctor.subCategoryId?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {doctor.subCategoryId.map((sub) => (
                  <span
                    key={sub._id}
                    className="px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full text-xs font-medium"
                  >
                    {sub.subcategory_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════════
            TWO-COLUMN LAYOUT
        ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left: Tabbed content ── */}
          <div className="lg:col-span-2 space-y-0">

            {/* Tab bar */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="flex overflow-x-auto border-b border-gray-100 scrollbar-none">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-5 py-3.5 text-sm font-medium transition-colors border-b-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "border-teal-600 text-teal-600 bg-teal-50/50"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="text-xs">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="p-5 sm:p-6">

                {/* ── OVERVIEW ── */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    {/* About */}
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 mb-3">About Dr. {doctor.name}</h2>
                      <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        {doctor.about || "No bio available."}
                      </p>
                    </div>

                    {/* Specializations */}
                    {doctor.medicalProblems?.length > 0 && (
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-3">
                          Conditions Treated
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.medicalProblems.map((p, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-teal-50 text-teal-700 border border-teal-100 rounded-lg text-xs font-medium"
                            >
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Quick stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      {[
                        { label: "Experience",   value: doctor.experience ? `${doctor.experience}+ yrs` : "—" },
                        { label: "Rating",        value: "4.9 / 5" },
                        { label: "Patients",      value: "500+" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="bg-gray-50 rounded-xl px-4 py-3 text-center border border-gray-100"
                        >
                          <p className="text-lg font-bold text-teal-600">{stat.value}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── EDUCATION ── */}
                {activeTab === "education" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Education & Training</h2>
                    {doctor.educationAndTraining?.length > 0 ? (
                      <div className="relative pl-5 space-y-0">
                        {/* Timeline line */}
                        <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-teal-100" />

                        {doctor.educationAndTraining.map((edu, i) => (
                          <div key={edu._id || i} className="relative pb-6 last:pb-0">
                            {/* Dot */}
                            <div className="absolute -left-3.5 top-1 w-3 h-3 rounded-full bg-teal-500 border-2 border-white shadow" />

                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 hover:border-teal-200 transition">
                              <p className="font-semibold text-gray-900 text-sm">{edu.degree}</p>
                              <p className="text-teal-600 text-sm mt-0.5">{edu.institute}</p>
                              {edu.year && (
                                <span className="inline-block mt-2 px-2.5 py-0.5 bg-teal-100 text-teal-700 rounded text-xs font-medium">
                                  {edu.year}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No education details available.</p>
                    )}
                  </div>
                )}

                {/* ── EXPERIENCE ── */}
                {activeTab === "experience" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Work Experience</h2>
                    {doctor.workExperience ? (
                      <div className="bg-teal-50 border border-teal-100 rounded-xl p-5">
                        <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                          {doctor.workExperience}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm">No experience details available.</p>
                    )}
                  </div>
                )}

                {/* ── GALLERY ── */}
                {activeTab === "gallery" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Gallery</h2>
                    {doctor.gallery?.length > 0 ? (
                      <>
                        {/* Main image */}
                        <div className="rounded-xl overflow-hidden mb-4 bg-gray-100">
                          <img
                            src={doctor.gallery[galleryIndex].publicURL}
                            alt={`Gallery ${galleryIndex + 1}`}
                            className="w-full h-56 sm:h-72 md:h-96 object-cover"
                          />
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-2.5 overflow-x-auto pb-1">
                          {doctor.gallery.map((img, i) => (
                            <button
                              key={img._id || i}
                              onClick={() => setGalleryIndex(i)}
                              className={`flex-shrink-0 rounded-lg overflow-hidden transition ${
                                galleryIndex === i
                                  ? "ring-2 ring-teal-600 ring-offset-1"
                                  : "ring-1 ring-gray-200 hover:ring-teal-300"
                              }`}
                            >
                              <img
                                src={img.publicURL}
                                alt={`Thumb ${i + 1}`}
                                className="w-16 h-16 sm:w-20 sm:h-20 object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-400 text-sm">No gallery images available.</p>
                    )}
                  </div>
                )}

                {/* ── CONTACT ── */}
                {activeTab === "contact" && (
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-5">Contact Information</h2>
                    <div className="space-y-3">
                      {doctor.phone && (
                        <a
                          href={`tel:${doctor.phone}`}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition group"
                        >
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                            <FaPhone className="text-teal-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Phone</p>
                            <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700">
                              {doctor.phone}
                            </p>
                          </div>
                        </a>
                      )}

                      {doctor.email && (
                        <a
                          href={`mailto:${doctor.email}`}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition group"
                        >
                          <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
                            <FaEnvelope className="text-teal-600 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="text-sm font-medium text-gray-800 group-hover:text-teal-700">
                              {doctor.email}
                            </p>
                          </div>
                        </a>
                      )}

                      {doctor.youtubeVideo?.url && (
                        <a
                          href={doctor.youtubeVideo.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-teal-200 hover:bg-teal-50 transition group"
                        >
                          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <FaGlobe className="text-red-500 text-sm" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Video Introduction</p>
                            <p className="text-sm font-medium text-teal-600 group-hover:underline">
                              Watch on YouTube →
                            </p>
                          </div>
                        </a>
                      )}

                      {!doctor.phone && !doctor.email && !doctor.youtubeVideo?.url && (
                        <p className="text-gray-400 text-sm">No contact information available.</p>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* ── Right: Sticky sidebar ── */}
          <div className="space-y-4">

            {/* Book Consultation Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden lg:sticky lg:top-20">
              <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-5 py-4">
                <h3 className="text-white font-semibold text-base">Book a Consultation</h3>
                <p className="text-teal-100 text-xs mt-0.5">Get expert medical advice</p>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <FaStar className="text-yellow-400 flex-shrink-0" />
                  <span>Rated 4.9 by 120+ patients</span>
                </div>
                {doctor.experience && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaAward className="text-teal-500 flex-shrink-0" />
                    <span>{doctor.experience}+ years of experience</span>
                  </div>
                )}
                {doctor.location?.city && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <FaMapMarkerAlt className="text-teal-500 flex-shrink-0" />
                    <span>
                      {doctor.location.city}
                      {doctor.location.country ? `, ${doctor.location.country}` : ""}
                    </span>
                  </div>
                )}

                <Link
                  to={bookUrl}
                  className="mt-2 flex items-center justify-center gap-2 w-full py-3 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition shadow-sm"
                >
                  <FaCalendarCheck />
                  Book Appointment
                </Link>
              </div>
            </div>

            {/* Location Card */}
            {doctor.location && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <FaMapMarkerAlt className="text-teal-500" />
                  Location
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {doctor.location.address && (
                    <p className="text-gray-700">{doctor.location.address}</p>
                  )}
                  {(doctor.location.city || doctor.location.state) && (
                    <p>
                      {[doctor.location.city, doctor.location.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                  {doctor.location.country && (
                    <p className="flex items-center gap-1.5">
                      <CountryFlag name={doctor.location.country} width={16} className="shadow-sm" />
                      {doctor.location.country}
                      {doctor.location.zipCode ? ` — ${doctor.location.zipCode}` : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Hospital Card */}
            {doctor.hospital && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Associated Hospital</h3>
                <Link
                  to={`/hospital/${doctor.hospital.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0 border border-teal-100">
                    <FaStethoscope className="text-teal-500 text-sm" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 group-hover:text-teal-600 transition truncate">
                      {doctor.hospital.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">View hospital →</p>
                  </div>
                </Link>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
