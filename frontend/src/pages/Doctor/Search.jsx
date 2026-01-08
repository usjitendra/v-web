import React, { useState } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DoctorSearch() {
  const navigate = useNavigate();

  const [country, setCountry] = useState("India");
  const [city, setCity] = useState("");
  const [specialty, setSpecialty] = useState("cardiology");
  const [treatment, setTreatment] = useState("");
  const [hospital, setHospital] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (country) params.append("country", country.toLowerCase());
    if (city) params.append("city", city.toLowerCase());
    if (specialty) params.append("category", specialty.toLowerCase());
    if (treatment) params.append("treatment", treatment.toLowerCase());
    if (hospital) params.append("hospital", hospital.toLowerCase());

    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Best Cardiac Surgeons in India
          </h1>
        </div>

        {/* Search Box */}
        <div className="bg-main rounded-xl p-5 shadow-lg">
          <div className="bg-white rounded-lg p-4 flex flex-col lg:flex-row gap-3">

            {/* Country */}
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="flex-1 px-3 py-2.5 font-medium"
              placeholder="Country"
            />

            {/* City */}
            <div className="flex-1 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="flex-1 py-2.5 font-medium bg-transparent"
              >
                <option value="">All Cities</option>
                <option value="delhi">Delhi</option>
                <option value="mumbai">Mumbai</option>
              </select>
            </div>

            {/* Specialty */}
            <select
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="flex-1 py-2.5 font-medium bg-transparent"
            >
              <option value="cardiology">Cardiology</option>
              <option value="neurology">Neurology</option>
            </select>

            {/* Hospital */}
            <div className="flex-1 relative">
              <select
                value={hospital}
                onChange={(e) => setHospital(e.target.value)}
                className="w-full py-2.5 font-medium bg-transparent"
              >
                <option value="">All Hospitals</option>
                <option value="apollo">Apollo</option>
                <option value="fortis">Fortis</option>
              </select>
              <ChevronDown className="absolute right-2 top-3 w-5 h-5" />
            </div>

            {/* Search */}
            <button
              onClick={handleSearch}
              className="px-8 py-2.5 bg-red-600 text-white font-semibold rounded-md"
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
