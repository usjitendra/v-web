import { useState } from "react";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaGlobe,
  FaPhone,
  FaSpinner,
  FaStar,
  FaStethoscope,
  FaHospital,
  FaBed,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaEnvelope,
  FaAward,
  FaUsers,
  FaShieldAlt,
} from "react-icons/fa";
import {
  MdLocationOn,
  MdOutlineLocalHospital,
  MdOutlinePhotoLibrary,
  MdContactPhone,
  MdDashboard,
  MdBusiness,
} from "react-icons/md";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useGetHospitalDetailQuery } from "@/rtk/slices/commanApiSlice";
import { CountryFlag } from "@/helper/countryFlags";

/* ─── Tab config ─── */
const TABS = [
  { key: "overview",        label: "Overview",        Icon: MdDashboard },
  { key: "infrastructure",  label: "Infrastructure",  Icon: MdBusiness },
  { key: "gallery",         label: "Gallery",         Icon: MdOutlinePhotoLibrary },
  { key: "contact",         label: "Contact",         Icon: MdContactPhone },
];

const HospitalDetails = () => {
  const { slug }   = useParams();
  const navigate   = useNavigate();

  const { data, isLoading, error } = useGetHospitalDetailQuery({ slug });
  const hospital = data?.data;

  const [activeTab,    setActiveTab]    = useState("overview");
  const [galleryIndex, setGalleryIndex] = useState(0);

  /* ── Loading ── */
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-teal-100" />
          <div className="absolute inset-0 rounded-full border-4 border-t-teal-600 animate-spin" />
        </div>
        <p className="text-gray-500 text-sm font-medium">Loading hospital details…</p>
      </div>
    );
  }

  /* ── Error ── */
  if (error || !hospital) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
        <div className="text-5xl">🏥</div>
        <p className="text-gray-600 font-medium">Hospital not found.</p>
        <button
          onClick={() => navigate("/hospitals")}
          className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold hover:bg-teal-700 transition"
        >
          Back to Hospitals
        </button>
      </div>
    );
  }

  const gallery = hospital.gallery || [];

  const prevImg = () => setGalleryIndex((i) => (i - 1 + gallery.length) % gallery.length);
  const nextImg = () => setGalleryIndex((i) => (i + 1) % gallery.length);

  /* ─── Quick stats ─── */
  const stats = [
    { icon: FaBed,        label: "Beds",       value: hospital.numberOfBeds || "—" },
    { icon: FaStar,       label: "Rating",     value: "4.8 / 5" },
    { icon: FaUsers,      label: "Doctors",    value: hospital.doctorCount  || "50+" },
    { icon: FaAward,      label: "Est. Year",  value: hospital.established  || "2000" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ══════════════════════════════════════
          STICKY TOP NAV
      ══════════════════════════════════════ */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => navigate("/hospitals")}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 text-sm font-semibold transition"
          >
            <FaArrowLeft className="text-xs" />
            <span className="hidden sm:inline">Back to Hospitals</span>
            <span className="sm:hidden">Back</span>
          </button>

          <p className="hidden md:block text-sm font-semibold text-gray-800 truncate max-w-xs">
            {hospital.name}
          </p>

          <Link
            to={`/book/${hospital._id}`}
            className="flex items-center gap-2 px-4 sm:px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition shadow-sm shadow-teal-200 active:scale-[0.98]"
          >
            <FaCalendarCheck />
            <span>Book Appointment</span>
          </Link>
        </div>
      </div>

      {/* ══════════════════════════════════════
          HERO BANNER
      ══════════════════════════════════════ */}
      <div className="relative w-full h-[340px] sm:h-[420px] lg:h-[500px] overflow-hidden">
        {/* Image */}
        <img
          src={hospital.photo?.publicURL}
          alt={hospital.name}
          className="w-full h-full object-cover"
        />
        {/* Gradient overlay — bottom-heavy for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-gray-900/10" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-10">
          <div className="max-w-7xl mx-auto">

            {/* Hospital type badge */}
            <div className="inline-flex items-center gap-1.5 bg-teal-500/90 backdrop-blur-sm text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3">
              <MdOutlineLocalHospital className="text-sm" />
              {hospital.hospitalType || "Multi-Specialty"}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight mb-3">
              {hospital.name}
            </h1>

            {/* Location + rating row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/90">
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="text-teal-300 flex-shrink-0" />
                <span>
                  {hospital.address?.city && `${hospital.address.city}, `}
                  {hospital.address?.state && `${hospital.address.state}`}
                </span>
              </span>

              <span className="flex items-center gap-1.5">
                <FaStar className="text-yellow-400 flex-shrink-0" />
                <span className="font-semibold">4.8</span>
                <span className="text-white/60 text-xs">(320 reviews)</span>
              </span>

              <span className="flex items-center gap-1.5">
                <FaBed className="text-teal-300 flex-shrink-0" />
                {hospital.numberOfBeds} Beds
              </span>
            </div>

            {/* Category pills */}
            {hospital.categoryIds?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {hospital.categoryIds.map((cat) => (
                  <span
                    key={cat._id}
                    className="bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-medium px-3 py-1 rounded-full"
                  >
                    {cat.category_name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          QUICK STATS BAR
      ══════════════════════════════════════ */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-gray-100">
            {stats.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-4 sm:py-5">
                <div className="w-9 h-9 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="text-teal-600 text-base" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold leading-tight">{label}</p>
                  <p className="text-sm sm:text-base font-bold text-gray-800 leading-tight">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          TABS
      ══════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto scrollbar-none">
            {TABS.map(({ key, label, Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-2 px-5 sm:px-7 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-all ${
                  activeTab === key
                    ? "border-teal-600 text-teal-700 bg-teal-50/60"
                    : "border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`}
              >
                <Icon className={`text-base ${activeTab === key ? "text-teal-600" : "text-gray-400"}`} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════
            TAB: OVERVIEW
        ══════════════════════════════════════ */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 pb-12">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">

              {/* About */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <FaHospital className="text-teal-600" />
                  <h2 className="text-base font-bold text-gray-900">About {hospital.name}</h2>
                </div>
                <div className="p-6">
                  <div
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                      prose-headings:text-gray-800 prose-a:text-teal-600"
                    dangerouslySetInnerHTML={{ __html: hospital.hospitalIntro }}
                  />
                </div>
              </div>

              {/* Team & Speciality */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <FaStethoscope className="text-teal-600" />
                  <h2 className="text-base font-bold text-gray-900">Team & Speciality</h2>
                </div>
                <div className="p-6">
                  <div
                    className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                      prose-headings:text-gray-800 prose-a:text-teal-600"
                    dangerouslySetInnerHTML={{ __html: hospital.teamAndSpeciality }}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Location card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <MdLocationOn className="text-teal-600 text-lg" />
                  <h3 className="text-sm font-bold text-gray-900">Location</h3>
                </div>
                <div className="p-5 space-y-2.5 text-sm text-gray-600">
                  {hospital.address?.line1 && (
                    <p className="font-medium text-gray-800">{hospital.address.line1}</p>
                  )}
                  <p className="flex items-center gap-2">
                    {(hospital.countryData?.name || hospital.address?.country) && (
                      <CountryFlag
                        name={hospital.countryData?.name || hospital.address?.country}
                        slug={hospital.countryData?.slug}
                        width={18}
                        className="shadow-sm rounded-sm"
                      />
                    )}
                    {[hospital.address?.city, hospital.address?.state].filter(Boolean).join(", ")}
                  </p>
                  {hospital.address?.pincode && (
                    <p className="text-gray-500">Pincode: {hospital.address.pincode}</p>
                  )}
                </div>
              </div>

              {/* Accreditations / Trust signals */}
              <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <FaShieldAlt />
                  <h3 className="text-sm font-bold">Why Choose Us?</h3>
                </div>
                <ul className="space-y-2 text-sm text-teal-50">
                  {[
                    "NABH Accredited Hospital",
                    "24/7 Emergency Services",
                    "ISO 9001:2015 Certified",
                    "Cashless Insurance Available",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 w-4 h-4 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 text-center">
                <p className="text-sm text-gray-600 mb-3">Ready to book your visit?</p>
                <Link
                  to={`/book/${hospital._id}/book`}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold transition"
                >
                  <FaCalendarCheck />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: INFRASTRUCTURE
        ══════════════════════════════════════ */}
        {activeTab === "infrastructure" && (
          <div className="mt-6 pb-12">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <MdBusiness className="text-teal-600 text-lg" />
                <h2 className="text-base font-bold text-gray-900">Infrastructure & Facilities</h2>
              </div>
              <div className="p-6 sm:p-8">
                <div
                  className="text-gray-600 text-sm leading-relaxed prose prose-sm max-w-none
                    prose-headings:text-gray-800 prose-a:text-teal-600
                    prose-li:marker:text-teal-500"
                  dangerouslySetInnerHTML={{ __html: hospital.infrastructure }}
                />
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: GALLERY
        ══════════════════════════════════════ */}
        {activeTab === "gallery" && (
          <div className="mt-6 pb-12">
            {gallery.length > 0 ? (
              <div className="space-y-5">

                {/* Main viewer */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="relative group">
                    <img
                      src={gallery[galleryIndex].publicURL}
                      alt={`Gallery ${galleryIndex + 1}`}
                      className="w-full h-[280px] sm:h-[420px] lg:h-[520px] object-cover"
                    />

                    {/* Prev / Next arrows */}
                    {gallery.length > 1 && (
                      <>
                        <button
                          onClick={prevImg}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                          aria-label="Previous"
                        >
                          <FaChevronLeft className="text-sm" />
                        </button>
                        <button
                          onClick={nextImg}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition opacity-0 group-hover:opacity-100"
                          aria-label="Next"
                        >
                          <FaChevronRight className="text-sm" />
                        </button>
                      </>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {galleryIndex + 1} / {gallery.length}
                    </div>
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {gallery.map((img, index) => (
                    <button
                      key={img._id}
                      onClick={() => setGalleryIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition ${
                        galleryIndex === index
                          ? "border-teal-600 shadow-md shadow-teal-200"
                          : "border-transparent hover:border-teal-300"
                      }`}
                    >
                      <img src={img.publicURL} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center shadow-sm">
                <MdOutlinePhotoLibrary className="text-5xl text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No gallery images available.</p>
              </div>
            )}
          </div>
        )}

        {/* ══════════════════════════════════════
            TAB: CONTACT
        ══════════════════════════════════════ */}
        {activeTab === "contact" && (
          <div className="mt-6 pb-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Phone */}
              {hospital.phone && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPhone className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Phone</p>
                    <a
                      href={`tel:${hospital.phone}`}
                      className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition"
                    >
                      {hospital.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* Email placeholder */}
              {hospital.email && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaEnvelope className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                    <a
                      href={`mailto:${hospital.email}`}
                      className="text-sm font-semibold text-gray-800 hover:text-teal-600 transition break-all"
                    >
                      {hospital.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Website / Video */}
              {hospital.website && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaGlobe className="text-teal-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Website</p>
                    <a
                      href={hospital.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-teal-600 hover:underline"
                    >
                      Visit Website
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MdLocationOn className="text-teal-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Address</p>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {[hospital.address?.line1, hospital.address?.city, hospital.address?.state, hospital.address?.pincode]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </div>

            {/* YouTube video embed */}
            {hospital.youtubeVideos?.length > 0 && (
              <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <FaPlay className="text-teal-600 text-sm" />
                  <h3 className="text-sm font-bold text-gray-900">Hospital Video Tour</h3>
                </div>
                <div className="p-5">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <iframe
                      src={hospital.youtubeVideos[0].replace("watch?v=", "embed/")}
                      title="Hospital Video"
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="mt-6 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-white font-bold text-lg">Ready to get care?</p>
                <p className="text-teal-100 text-sm mt-1">Book your appointment today — our team is ready to help.</p>
              </div>
              <Link
                to={`/hospitals/${hospital.slug}/book`}
                className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-white text-teal-700 hover:bg-teal-50 rounded-xl text-sm font-bold transition shadow-sm active:scale-[0.98]"
              >
                <FaCalendarCheck />
                Book Now
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* ── Scrollbar hide utility ── */}
      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default HospitalDetails;