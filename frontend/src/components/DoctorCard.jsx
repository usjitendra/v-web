import { motion } from "framer-motion";
import { FaHospital, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CountryFlag } from "@/helper/countryFlags";

export default function DoctorCard({ doc }) {
  const doctorName = doc?.name || "Doctor";
  const specialty = doc?.categoryData?.name;
  const imageUrl = doc?.image?.publicURL || "/doctor-placeholder.jpg";
  const city = doc?.location?.city;
  const country = doc?.location?.country;
  const experience = doc?.experience;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={doctorName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Experience Badge */}
        {experience !== undefined && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-800">
            {experience}+ yrs experience
          </div>
        )}

        {/* Specialty */}
        {specialty && (
          <div className="absolute bottom-3 left-0 w-full px-3">
            <span className="text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur text-teal-700 border border-white">
              {specialty}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-darktext mb-2">
          Dr. {doctorName}
        </h3>

        {/* Location */}
        {(city || country) && (
          <div className="flex items-center gap-2 text-sm text-lighttext mb-4">
            <FaMapMarkerAlt className="text-teal-600 flex-shrink-0" />
            <span className="flex items-center gap-1.5 line-clamp-1">
              {country && (
                <CountryFlag name={country} width={16} className="shadow-sm flex-shrink-0" />
              )}
              {city}
              {country && `, ${country}`}
            </span>
          </div>
        )}

        {/* Category description fallback */}
        <p className="text-sm text-gray-600 mb-5 flex-1">
          Specialized in {specialty || "medical care"} with patient-focused treatment.
        </p>

        {/* Actions */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          <Link
            to={`/doctor/${doc?.slug}`}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            View Details
          </Link>

          <Link
            to={`/book/${doc?.hospital?._id || ''}/${doc?._id || ''}`}
            className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition font-medium shadow-md"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
