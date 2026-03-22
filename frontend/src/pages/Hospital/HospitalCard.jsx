import React from "react";
import { Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Building2,
  Calendar,
  MessageCircle,
  CheckCircle,
  Stethoscope,
  Bed,
} from "lucide-react";
import { CountryFlag } from "@/helper/countryFlags";

export default function HospitalCard({ hospital, onBook }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-main/10 to-primary/10 overflow-hidden">
        <img
          src={hospital?.photo?.publicURL || "/placeholder-hospital.jpg"}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Verified Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg">
          <CheckCircle className="w-5 h-5 text-green-500" />
        </div>

        {/* Category Badge */}
        {hospital.categoryData?.name && (
          <div className="absolute bottom-3 left-3">
            <span className="inline-flex items-center px-3 py-1.5 bg-white/95 backdrop-blur-sm text-main rounded-full text-xs font-semibold shadow-md">
              <Stethoscope className="w-3.5 h-3.5 mr-1.5" />
              {hospital.categoryData.name}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-main transition-colors">
            {hospital.name}
          </h3>

          {/* Type Badge */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-accent" />
            <span className="font-medium">{hospital.hospitalType || "Hospital"}</span>
            {hospital.numberOfBeds && (
              <>
                <span className="text-gray-300">•</span>
                <Bed className="w-4 h-4 text-gray-500" />
                <span>{hospital.numberOfBeds} Beds</span>
              </>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
          <span className="line-clamp-1 flex items-center gap-1.5">
            {hospital.countryData?.name && (
              <CountryFlag
                name={hospital.countryData.name}
                slug={hospital.countryData.slug}
                width={18}
                className="shadow-sm"
              />
            )}
            {hospital.address?.city && hospital.address?.state
              ? `${hospital.address.city}, ${hospital.address.state}`
              : hospital.countryData?.name || "Location not specified"}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-semibold text-gray-900">
            {hospital.rating || "4.8"}
          </span>
          <span className="text-sm text-gray-500">(150+ reviews)</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => onBook(hospital)}
            className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Consultation
          </button>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/hospital/${hospital.slug}`}
              // to={`/hospitals/detail`}
              className="text-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors text-sm"
            >
              View Details
            </Link>
            {/* <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 text-sm">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button> */}
            <a
              href="https://wa.me/919354799090"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-1.5 text-sm"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}