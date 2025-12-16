import { motion } from "framer-motion";
import { FaHospital, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function DoctorCard({ doc }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 200, damping: 18 }}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image with specialties overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={doc.image}
          alt={doc.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-full text-sm font-medium flex items-center gap-1.5">
          <FaStar className="text-yellow-400" />
          {doc.rating}
        </div>

        {/* Specialties on image */}
        <div className="absolute bottom-3 left-0 w-full px-3">
          <div className="flex flex-wrap gap-2">
            {doc.specialties.slice(0, 3).map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur text-teal-700 border border-white"
              >
                {s}
              </span>
            ))}
            {doc.specialties.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-full bg-white/90 backdrop-blur text-gray-700 border border-white">
                +{doc.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content below image */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-darktext mb-2">Dr. {doc.firstName} {doc.lastName}</h3>
        <div className="mt-1 flex items-center gap-2 text-sm text-lighttext mb-4">
          <FaHospital className="text-teal-600" />
          <span>{doc.hospital.name}</span>
        </div>

        <div className="mt-1 flex items-center gap-2 text-sm text-lighttext mb-4">
          <FaMapMarkerAlt className="text-teal-600" />
          <span>{doc.hospital.city},{doc.hospital.country}</span>
        </div>

        {/* Doctor blurb/description */}
        <p className="text-sm text-gray-600 mb-5 flex-1">
          {doc.blurb}
        </p>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
          {/* View Details Button */}
          <Link
            to={`/doctors/${doc._id}`}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
          >
            View Details
          </Link>

          {/* Book Now Button */}
          <Link
            to={`/doctors/${doc._id}/book`}
            className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors duration-200 font-medium shadow-md hover:shadow-lg"
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
}