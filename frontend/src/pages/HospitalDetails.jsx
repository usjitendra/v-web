import { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaAward,
  FaBed,
  FaCalendarCheck,
  FaEnvelope,
  FaFilter,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaPlane,
  FaStar,
  FaStethoscope,
  FaTrain
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import url_prefix from "../data/variable";
import { useLanguage } from '../hooks/useLanguage';


const HospitalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [language] = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [doctors, setDoctors] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [doctorFilters, setDoctorFilters] = useState({
    firstName: "",
    specialty: "",
    minExperience: "",
    maxExperience: "",
    minRating: "",
    maxRating: "",
  });
  const [treatmentFilters, setTreatmentFilters] = useState({
    name: "",
    category: "",
    minPrice: "",
    maxPrice: "",
    minDuration: "",
    maxDuration: "",
  });

  // Get unique specialties from doctors
  const doctorSpecialties = useMemo(() => {
    return [...new Set(doctors.map(doctor => doctor.specialty))].filter(Boolean);
  }, [doctors]);

  // Get unique categories from treatments
  const treatmentCategories = useMemo(() => {
    return [...new Set(treatments.map(treatment => treatment?.category))].filter(Boolean);
  }, [treatments]);

  // Filter doctors based on filters
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Name filter
      if (doctorFilters.firstName &&
        !`${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(doctorFilters.firstName.toLowerCase())) {
        return false;
      }

      // Specialty filter
      if (doctorFilters.specialty && doctor.specialty !== doctorFilters.specialty) {
        return false;
      }

      // Experience filter
      const experience = doctor.experience || 0;
      if (doctorFilters.minExperience && experience < parseInt(doctorFilters.minExperience)) {
        return false;
      }
      if (doctorFilters.maxExperience && experience > parseInt(doctorFilters.maxExperience)) {
        return false;
      }

      // Rating filter
      const rating = doctor.rating || 0;
      if (doctorFilters.minRating && rating < parseFloat(doctorFilters.minRating)) {
        return false;
      }
      if (doctorFilters.maxRating && rating > parseFloat(doctorFilters.maxRating)) {
        return false;
      }

      return true;
    });
  }, [doctors, doctorFilters]);

  // Filter treatments based on filters
  const filteredTreatments = useMemo(() => {
    console.log(treatments)
    return treatments.filter(treatment => {


      // Name filter
      if (treatmentFilters.name &&
        !treatment.name.toLowerCase().includes(treatmentFilters.name.toLowerCase())) {
        return false;
      }

      // Category filter
      if (treatmentFilters.category && treatment.category !== treatmentFilters.category) {
        return false;
      }

      // Price filter
      const price = treatment?.price || 0;
      if (treatmentFilters.minPrice && price < parseInt(treatmentFilters.minPrice)) {
        return false;
      }
      if (treatmentFilters.maxPrice && price > parseInt(treatmentFilters.maxPrice)) {
        return false;
      }

      // Duration filter
      const duration = treatment?.duration || 0;
      if (treatmentFilters.minDuration && duration < parseInt(treatmentFilters.minDuration)) {
        return false;
      }
      if (treatmentFilters.maxDuration && duration > parseInt(treatmentFilters.maxDuration)) {
        return false;
      }

      return true;
    });
  }, [treatments, treatmentFilters]);

  useEffect(() => {
    if (!language) {
      return;
    }
    const fetchHospitalData = async () => {
      try {
        setLoading(true);

        // Fetch hospital basic info
        const hospitalResponse = await fetch(`${url_prefix}/api/hospitals/${id}`);
        if (!hospitalResponse.ok) {
          throw new Error('Failed to fetch hospital data');
        }
        const hospitalResult = await hospitalResponse.json();

        if (!hospitalResult.success) {
          throw new Error('Invalid hospital data received');
        }

        setHospital(hospitalResult.data);

        // Fetch hospital details
        const detailsResponse = await fetch(`${url_prefix}/api/hospitals/${id}/details`);
        if (detailsResponse.ok) {
          const detailsResult = await detailsResponse.json();


          if (detailsResult.success) {
            setDetails(detailsResult.data);
          }
        }

        // Fetch Doctor details
        const doctorResponse = await fetch(`${url_prefix}/api/doctors/hospital/${id}`);
        if (doctorResponse.ok) {
          const doctorResult = await doctorResponse.json();
          if (doctorResult.success) {
            setDoctors(doctorResult.data);
          }
        }

        // Fetch Treatment details
        const treatmentResponse = await fetch(`${url_prefix}/api/hospital-treatment/by-hospital/${id}`);
        if (treatmentResponse.ok) {
          let dataToSet;
          const treatmentResult = await treatmentResponse.json();
          if (Array.isArray(treatmentResult.data)) {
            // const cleanData = treatments.filter(item => item !== null);
            // console.log('result', treatmentResult.data)
            // console.log('clean', cleanData)

            dataToSet = treatmentResult.data
              // .filter(item => item && item.language)
              .filter(
                item => item.language?.toLowerCase() === language?.toLowerCase()
              );
          } else {
            dataToSet =
              treatmentResult.data.language?.toLowerCase() === language?.toLowerCase()
                ? [treatmentResult.data]
                : [];
          }

          if (dataToSet.length > 0) {
            console.log('Setting aboutData:', dataToSet);
            setTreatments(dataToSet);
            // setError(null);

          }
          // if (treatmentResult.success) {
          //   setTreatments(treatmentResult.data);
          //   console.log(treatments)
          // }
        }

        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [id, language]);

  // Loading and error states remain the same...

  // Doctor Card Component
  const DoctorCard = ({ doctor }) => (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        <img
          src={doctor.image}
          alt={`${doctor.firstName} ${doctor.lastName}`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800">
            {doctor.firstName} {doctor.lastName}
          </h3>
          <p className="text-teal-600 text-sm font-medium">{doctor.specialty}</p>
          <div className="flex items-center mt-1">
            <FaStar className="text-yellow-400 text-sm mr-1" />
            <span className="text-sm text-gray-600">{doctor.rating}</span>
            <span className="text-sm text-gray-500 ml-2">({doctor.experience} yrs exp)</span>
          </div>
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">{doctor.bio}</p>
          <Link
            to={`/doctors/${doctor._id}`}
            className="text-teal-600 text-sm font-medium mt-2 inline-block hover:text-teal-700"
          >
            View Profile →
          </Link>
        </div>
      </div>
    </div>
  );
  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">🏥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Hospital not found!</h2>
          <p className="text-gray-600 mb-6">{error || "The hospital you're looking for doesn't exist."}</p>
          <button
            onClick={() => navigate('/hospitals')}
            className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            Back to Hospitals
          </button>
        </div>
      </div>
    );
  }

  // console.log(details);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate('/hospitals')}
              className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Back to Hospitals
            </button>
            <div className="flex items-center space-x-4">
              <Link
                to={`/hospitals/${hospital._id}/book`}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center"
              >
                <FaCalendarCheck className="mr-2" />
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hospital Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative">
            <img
              src={hospital.image}
              alt={hospital.name}
              className="w-full h-80 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{hospital.name}</h1>
              <div className="flex items-center space-x-4 flex-wrap">
                <div className="flex items-center">
                  <FaMapMarkerAlt className="mr-2" />
                  <span>{hospital.city}, {hospital.country}</span>
                </div>
                <div className="flex items-center">
                  <FaStar className="mr-2 text-yellow-400" />
                  <span>{hospital.rating}</span>
                </div>
                <div className="flex items-center">
                  <FaBed className="mr-2" />
                  <span>{hospital.beds} Beds</span>
                </div>
                {details?.established && (
                  <div className="flex items-center">
                    <FaAward className="mr-2" />
                    <span>Est. {details.established}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <div className="flex space-x-8 border-b overflow-x-auto">
            {['overview', 'doctors', 'treatments', 'facilities', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                // onClick={() => navigate('#tab')}
                className={`pb-4 px-2 font-medium transition-colors ${activeTab === tab
                  ? 'text-teal-600 border-b-2 border-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Section */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About Hospital</h2>
                <p className="text-gray-600 leading-relaxed">
                  {details?.description || hospital.blurb || `${hospital.name} is a leading healthcare facility providing quality medical services.`}
                </p>
              </div>

              {/* Specialties Section */}
              {hospital.specialties && hospital.specialties.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Specialties</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {hospital.specialties.map((specialty, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <FaStethoscope className="text-teal-600 mr-3 text-lg" />
                        <span className="text-gray-700 font-medium">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctor's Section */}

              {/* <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Meet our Doctors</h2>
                {doctors.length > 0 ? (
                  <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide">
                    {doctors.map((doctor, index) => (
                      <div className="flex-none w-64 md:w-80 lg:w-96" key={index}>
                        <DoctorCard doc={doctor} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No facilities information available.</p>
                )}
              </div> */}


              {/* Accreditation Section */}
              {hospital.accreditation && hospital.accreditation.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Accreditations</h2>
                  <div className="flex flex-wrap gap-2">
                    {hospital.accreditation.map((acc, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Idhr se maine add kra hai */}

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Facilities & Amenities</h2>
                {details?.facilities && details.facilities.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {details.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">{facility}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No facilities information available.</p>
                )}
              </div>

              {/* <DoctorSection doctors={doctors} /> */}



              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Contact Information */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                    <div className="space-y-3">
                      {hospital.phone && (
                        <div className="flex items-center">
                          <FaPhone className="text-teal-600 mr-3 w-5" />
                          <span className="text-gray-700">{hospital.phone}</span>
                        </div>
                      )}
                      {details?.email && (
                        <div className="flex items-center">
                          <FaEnvelope className="text-teal-600 mr-3 w-5" />
                          <span className="text-gray-700">{details.email}</span>
                        </div>
                      )}
                      {details?.website && (
                        <div className="flex items-center">
                          <FaGlobe className="text-teal-600 mr-3 w-5" />
                          <span className="text-gray-700">{details.website}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  {details?.address && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Address</h3>
                      <div className="flex items-start">
                        <FaMapMarkerAlt className="text-teal-600 mr-3 mt-1 w-5 flex-shrink-0" />
                        <p className="text-gray-600">{details.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <FaBed className="text-teal-600 mr-3 w-5" />
                    <span className="text-gray-700">{hospital.beds} Beds</span>
                  </div>
                  {details?.established && (
                    <div className="flex items-center">
                      <FaAward className="text-teal-600 mr-3 w-5" />
                      <span className="text-gray-700">Est. {details.established}</span>
                    </div>
                  )}
                  {hospital.accreditation && hospital.accreditation.length > 0 && (
                    <div className="flex items-center">
                      <FaAward className="text-teal-600 mr-3 w-5" />
                      <span className="text-gray-700">{hospital.accreditation.join(', ')}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <FaStethoscope className="text-teal-600 mr-3 w-5" />
                    <span className="text-gray-700">Multi Specialty</span>
                  </div>
                </div>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  {hospital.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-teal-600 mr-3 w-5" />
                      <a href={`tel:${hospital.phone}`} className="text-gray-700 hover:text-teal-600">
                        {hospital.phone}
                      </a>
                    </div>
                  )}
                  {details?.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-teal-600 mr-3 w-5" />
                      <a href={`mailto:${details.email}`} className="text-gray-700 hover:text-teal-600">
                        {details.email}
                      </a>
                    </div>
                  )}
                  {details?.website && (
                    <div className="flex items-center">
                      <FaGlobe className="text-teal-600 mr-3 w-5" />
                      <a
                        href={details.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-700 hover:text-teal-600"
                      >
                        Visit Website
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Card */}
              {details?.address && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Location</h3>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-teal-600 mr-3 mt-1 w-5 flex-shrink-0" />
                    <p className="text-gray-600">{details.address}</p>
                  </div>

                  {/* Transportation */}
                  {details.transportation && (
                    <div className="mt-4 space-y-2">
                      {details.transportation.airport && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaPlane className="mr-2" />
                          <span>Airport: {details.transportation.airport.distance} ({details.transportation.airport.time})</span>
                        </div>
                      )}
                      {details.transportation.railway && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaTrain className="mr-2" />
                          <span>Railway: {details.transportation.railway.distance} ({details.transportation.railway.time})</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">Ready to Book?</h3>
                <p className="mb-4 opacity-90">Schedule your appointment with our expert medical team.</p>
                <Link
                  to={`/hospitals/${hospital._id}/book`}
                  className="w-full bg-white text-teal-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  <FaCalendarCheck className="mr-2" />
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'facilities' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Facilities & Amenities</h2>
            {details?.facilities && details.facilities.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {details.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">{facility}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No facilities information available.</p>
            )}
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                <div className="space-y-3">
                  {hospital.phone && (
                    <div className="flex items-center">
                      <FaPhone className="text-teal-600 mr-3 w-5" />
                      <span className="text-gray-700">{hospital.phone}</span>
                    </div>
                  )}
                  {details?.email && (
                    <div className="flex items-center">
                      <FaEnvelope className="text-teal-600 mr-3 w-5" />
                      <span className="text-gray-700">{details.email}</span>
                    </div>
                  )}
                  {details?.website && (
                    <div className="flex items-center">
                      <FaGlobe className="text-teal-600 mr-3 w-5" />
                      <span className="text-gray-700">{details.website}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              {details?.address && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Address</h3>
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-teal-600 mr-3 mt-1 w-5 flex-shrink-0" />
                    <p className="text-gray-600">{details.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}



        {activeTab === "treatments" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <FaFilter className="text-teal-600 text-lg" />
                <h2 className="text-xl font-semibold text-gray-800">Filter Treatments</h2>
              </div>

              {/* Treatment Name Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Treatment Name
                </label>
                <input
                  type="text"
                  placeholder="Search treatments..."
                  className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={treatmentFilters.name}
                  onChange={(e) => setTreatmentFilters({ ...treatmentFilters, name: e.target.value })}
                />
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Category
                </label>
                <select
                  className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={treatmentFilters.category}
                  onChange={(e) => setTreatmentFilters({ ...treatmentFilters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {treatmentCategories.map((category, i) => (
                    <option key={i} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Complexity Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Complexity
                </label>
                <select
                  className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={treatmentFilters.complexity}
                  onChange={(e) => setTreatmentFilters({ ...treatmentFilters, complexity: e.target.value })}
                >
                  <option value="">All Complexities</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Duration Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Duration (minutes)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={treatmentFilters.minDuration}
                    onChange={(e) => setTreatmentFilters({ ...treatmentFilters, minDuration: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={treatmentFilters.maxDuration}
                    onChange={(e) => setTreatmentFilters({ ...treatmentFilters, maxDuration: e.target.value })}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Showing {filteredTreatments.length} of {treatments.length} treatments
                </p>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => setTreatmentFilters({
                  name: "",
                  category: "",
                  complexity: "",
                  minDuration: "",
                  maxDuration: ""
                })}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>

            {/* Treatments List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Treatments Offered</h2>
                <p className="text-gray-600">
                  {treatments.length} specialized treatments available at {hospital?.name}
                </p>
              </div>

              <div className="grid gap-6">
                {filteredTreatments.length > 0 ? (
                  filteredTreatments.map((treatment) => (
                    <div key={treatment?._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Treatment Icon/Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-teal-100 rounded-lg flex items-center justify-center">
                            {treatment?.icon ? (
                              <img
                                src={treatment?.icon}
                                alt={treatment?.title}
                                className="w-12 h-12 object-contain"
                              />
                            ) : (
                              <span className="text-3xl">⚕️</span>
                            )}
                          </div>
                        </div>

                        {/* Treatment Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {treatment?.title}
                          </h3>

                          <div className="flex items-center text-teal-600 font-semibold mb-3">
                            <FaStethoscope className="mr-2" />
                            <span>{treatment?.category}</span>
                          </div>

                          <p className="text-gray-600 mb-4">
                            {treatment?.description}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-gray-500">Duration</span>
                              <div className="font-semibold text-gray-700">
                                {treatment?.typicalDuration} minutes
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Complexity</span>
                              <div className={`font-semibold ${treatment?.typicalComplexity === 'High' ? 'text-red-600' :
                                treatment?.typicalComplexity === 'Medium' ? 'text-yellow-600' :
                                  'text-green-600'
                                }`}>
                                {treatment?.typicalComplexity}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-gray-500">Category</span>
                              <div className="font-semibold text-gray-700">
                                {treatment?.category}
                              </div>
                            </div>
                          </div>

                          <div className="flex space-x-4">
                            <Link
                              to={`/treatments/${treatment?._id}`}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                              View Details
                            </Link>
                            <Link
                              to={`/hospitals/${hospital?._id}/book?treatment=${treatment?._id}`}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                            >
                              Book This Treatment
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">⚕️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No treatments found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to find treatments offered by this hospital.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {activeTab === 'doctors' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filter Sidebar */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100 sticky top-6 h-fit">
              <div className="flex items-center gap-2 mb-6">
                <FaFilter className="text-teal-600 text-lg" />
                <h2 className="text-xl font-semibold text-gray-800">Filter Doctors</h2>
              </div>

              {/* Doctor Name Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  placeholder="Search doctors..."
                  className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={doctorFilters.firstName}
                  onChange={(e) => setDoctorFilters({ ...doctorFilters, firstName: e.target.value })}
                />
              </div>

              {/* Specialty Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Specialty
                </label>
                <select
                  className="w-full border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  value={doctorFilters.specialty}
                  onChange={(e) => setDoctorFilters({ ...doctorFilters, specialty: e.target.value })}
                >
                  <option value="">All Specialties</option>
                  {doctorSpecialties.map((specialty, i) => (
                    <option key={i} value={specialty}>
                      {specialty}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Experience (years)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={doctorFilters.minExperience}
                    onChange={(e) => setDoctorFilters({ ...doctorFilters, minExperience: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={doctorFilters.maxExperience}
                    onChange={(e) => setDoctorFilters({ ...doctorFilters, maxExperience: e.target.value })}
                  />
                </div>
              </div>

              {/* Rating Filter */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Rating
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    max="5"
                    step="0.1"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={doctorFilters.minRating}
                    onChange={(e) => setDoctorFilters({ ...doctorFilters, minRating: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    max="5"
                    step="0.1"
                    className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                    value={doctorFilters.maxRating}
                    onChange={(e) => setDoctorFilters({ ...doctorFilters, maxRating: e.target.value })}
                  />
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Showing {filteredDoctors.length} of {doctors.length} doctors
                </p>
              </div>

              {/* Reset Filters Button */}
              <button
                onClick={() => setDoctorFilters({
                  firstName: "",
                  specialty: "",
                  minExperience: "",
                  maxExperience: "",
                  minRating: "",
                  maxRating: "",
                })}
                className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Reset Filters
              </button>
            </div>

            {/* Doctors List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Medical Team</h2>
                <p className="text-gray-600">
                  {doctors.length} doctors available at {hospital?.name}
                </p>
              </div>

              <div className="grid gap-6">
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <div key={doctor._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Doctor Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={doctor.image}
                            alt={`${doctor.firstName} ${doctor.lastName}`}
                            className="w-32 h-32 object-cover rounded-full"
                          />
                        </div>

                        {/* Doctor Info */}
                        <div className="flex-grow">
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            {doctor.firstName} {doctor.lastName}
                          </h3>

                          <div className="flex items-center text-gray-600 mb-2">
                            <FaStar className="text-yellow-400 mr-1" />
                            <span className="text-gray-700 font-semibold">
                              {doctor.rating || "N/A"}
                            </span>
                            <span className="text-gray-500 ml-2">({doctor.experience} yrs exp.)</span>
                          </div>

                          <div className="text-teal-600 font-semibold mb-3">
                            {doctor.specialty}
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Qualifications</h4>
                              <p className="text-sm text-gray-600">
                                {doctor.qualifications?.map(q => q.degree).join(', ')}
                              </p>
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Languages</h4>
                              <p className="text-sm text-gray-600">
                                {doctor.languages?.join(', ')}
                              </p>
                            </div>
                          </div>

                          {doctor.bio && (
                            <div className="mb-4">
                              <p className="text-gray-600 text-sm">{doctor.bio}</p>
                            </div>
                          )}

                          <div className="flex space-x-4">
                            <Link
                              to={`/doctors/${doctor._id}`}
                              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                            >
                              View Profile
                            </Link>
                            <Link
                              to={`/doctors/${doctor._id}/book`}
                              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                            >
                              Book Appointment
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👨‍⚕️</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No doctors found</h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to find doctors.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HospitalDetails;