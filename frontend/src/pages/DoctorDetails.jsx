import { useEffect, useState } from "react";
import url_prefix from "../data/variable";

import {
    FaArrowLeft,
    FaAward,
    FaCalendarCheck,
    FaEnvelope,
    FaFilter,
    FaGlobe,
    FaPhone,
    FaSpinner,
    FaStar,
    FaStethoscope
} from "react-icons/fa";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useLanguage } from '../hooks/useLanguage';

const DoctorDetails = () => {
    const [language] = useLanguage();
    const [headings, setHeadings] = useState({
        'title': 'Not Available For Selected Language',
        'sub': '',
        'desc': ''
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [doctorTreatments, setDoctorTreatments] = useState([]);
    const [filteredDoctorTreatments, setFilteredDoctorTreatments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [treatmentFilters, setTreatmentFilters] = useState({
        name: "",
        category: "",
        minPrice: "",
        maxPrice: ""
    });

    useEffect(() => {
        if (!language) {
            console.log('Language not yet available, skipping fetch');
            return;
        }
        const fetchDoctorData = async () => {
            try {
                setLoading(true);

                // Fetch doctor data
                const doctorResponse = await fetch(`${url_prefix}/api/doctors/${id}`);
                if (!doctorResponse.ok) {
                    throw new Error("Failed to fetch doctor data");
                }
                const doctorResult = await doctorResponse.json();

                if (!doctorResult.success) {
                    throw new Error("Invalid doctor data received");
                }
                if (doctorResult.success) {
                    let dataToSet;
                    if (Array.isArray(doctorResult.data)) {
                        dataToSet = doctorResult.data.filter(
                            item => item.language?.toLowerCase() === language?.toLowerCase()
                        );
                    } else {
                        dataToSet =
                            doctorResult.data.language?.toLowerCase() === language?.toLowerCase()
                                ? [doctorResult.data]
                                : [];
                    }

                    if (dataToSet.length > 0) {
                        console.log('Setting aboutData:', dataToSet);
                        setDoctor(dataToSet[0]);

                        setHeadings({
                            title: dataToSet[0].htitle,
                            sub: dataToSet[0].hsubtitle,
                            desc: dataToSet[0].hdesc
                        })
                    }
                }

                // Fetch doctor treatments
                const treatmentsResponse = await fetch(`${url_prefix}/api/doctor-treatment/by-doctor/${id}`);
                if (treatmentsResponse.ok) {
                    const treatmentsResult = await treatmentsResponse.json();
                    if (treatmentsResult.success) {
                        let dataToSet;
                        if (Array.isArray(treatmentsResult.data)) {
                            dataToSet = treatmentsResult.data.filter(
                                item => item.language?.toLowerCase() === language?.toLowerCase()
                            );
                        } else {
                            dataToSet =
                                treatmentsResult.data.language?.toLowerCase() === language?.toLowerCase()
                                    ? [treatmentsResult.data]
                                    : [];
                        }

                        if (dataToSet.length > 0) {
                            console.log('Setting aboutData:', dataToSet);
                            setDoctorTreatments(dataToSet);
                            setFilteredDoctorTreatments(dataToSet);
                            setError(null);
                            setHeadings({
                                title: dataToSet[0].htitle,
                                sub: dataToSet[0].hsubtitle,
                                desc: dataToSet[0].hdesc
                            })
                        }
                    }
                }

                setError(null);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [id, language]);

    // Filter doctor treatments based on filters
    useEffect(() => {
        let filtered = doctorTreatments;

        if (treatmentFilters.name) {
            filtered = filtered.filter(dt =>
                dt.treatment && dt.treatment.title.toLowerCase().includes(treatmentFilters.name.toLowerCase())
            );
        }

        if (treatmentFilters.category) {
            filtered = filtered.filter(dt =>
                dt.treatment && dt.treatment.category.toLowerCase().includes(treatmentFilters.category.toLowerCase())
            );
        }

        if (treatmentFilters.minPrice) {
            filtered = filtered.filter(dt => dt.fee >= parseInt(treatmentFilters.minPrice));
        }

        if (treatmentFilters.maxPrice) {
            filtered = filtered.filter(dt => dt.fee <= parseInt(treatmentFilters.maxPrice));
        }

        setFilteredDoctorTreatments(filtered);
    }, [treatmentFilters, doctorTreatments]);

    // Extract unique values for filters
    const treatmentCategories = [...new Set(doctorTreatments
        .map(dt => dt.treatment?.category)
        .filter(Boolean)
    )];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <FaSpinner className="animate-spin text-4xl text-teal-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading doctor details...</p>
                </div>
            </div>
        );
    }

    if (error || !doctor) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">👨‍⚕️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Doctor not found!</h2>
                    <p className="text-gray-600 mb-6">{error || "The doctor you're looking for doesn't exist."}</p>
                    <button
                        onClick={() => navigate("/doctors")}
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        Back to Doctors
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Navigation */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <button
                            onClick={() => navigate("/doctors")}
                            className="flex items-center text-gray-600 hover:text-teal-600 transition-colors"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to Doctors
                        </button>
                        <div className="flex items-center space-x-4">
                            <Link
                                to={`/doctors/${doctor._id}/book`}
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
                {/* Doctor Header */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                    <div className="relative">
                        <img
                            src={doctor.image}
                            alt={`${doctor.firstName} ${doctor.lastName}`}
                            className="w-full h-80 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <h1 className="text-4xl font-bold mb-2">{`${doctor.firstName} ${doctor.lastName}`}</h1>
                            <div className="flex items-center space-x-4 flex-wrap">
                                <div className="flex items-center">
                                    <FaStethoscope className="mr-2" />
                                    <span>{doctor.specialty}</span>
                                </div>
                                <div className="flex items-center">
                                    <FaStar className="mr-2 text-yellow-400" />
                                    <span>{doctor.rating} ({doctor.totalRatings} reviews)</span>
                                </div>
                                <div className="flex items-center">
                                    <FaAward className="mr-2" />
                                    <span>{doctor.experience} Years Experience</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
                    <div className="flex space-x-8 border-b overflow-x-auto">
                        {["overview", "treatments", "qualifications", "contact"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`pb-4 px-2 font-medium transition-colors ${activeTab === tab
                                    ? "text-teal-600 border-b-2 border-teal-600"
                                    : "text-gray-500 hover:text-gray-700"
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}

                {activeTab === "treatments" && (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filter Sidebar */}
                        <div className="lg:col-span-1 bg-white rounded-2xl shadow-md p-6 border border-gray-100  top-6 h-fit">
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

                            {/* Price Filter */}
                            <div className="mb-4">
                                <label className="block text-gray-700 font-medium mb-2">
                                    Consultation Fee (₹)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        value={treatmentFilters.minPrice}
                                        onChange={(e) => setTreatmentFilters({ ...treatmentFilters, minPrice: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="border rounded-lg p-2 text-gray-700 focus:ring-2 focus:ring-teal-400 focus:outline-none"
                                        value={treatmentFilters.maxPrice}
                                        onChange={(e) => setTreatmentFilters({ ...treatmentFilters, maxPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Results Count */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-sm text-gray-600">
                                    Showing {filteredDoctorTreatments.length} of {doctorTreatments.length} treatments
                                </p>
                            </div>

                            {/* Reset Filters Button */}
                            <button
                                onClick={() => setTreatmentFilters({
                                    name: "",
                                    category: "",
                                    minPrice: "",
                                    maxPrice: ""
                                })}
                                className="w-full bg-gray-200 text-gray-800 font-semibold py-2 rounded-lg hover:bg-gray-300 transition"
                            >
                                Reset Filters
                            </button>
                        </div>

                        {/* Treatments List */}
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-2xl shadow-md p-6 mb-8 border border-gray-100">
                                <h2 className="text-3xl font-bold text-gray-800 mb-2">Treatments Offered by Dr. {doctor.firstName} {doctor.lastName}</h2>
                                <p className="text-gray-600">
                                    Specializing in {doctorTreatments.length} treatments with expertise in {doctor.specialty}.
                                </p>
                            </div>

                            <div className="grid gap-6">
                                {filteredDoctorTreatments.length > 0 ? (
                                    filteredDoctorTreatments.map((doctorTreatment) => (
                                        <div key={doctorTreatment._id} className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
                                            <div className="flex flex-col md:flex-row gap-6">
                                                {/* Treatment Icon/Image */}
                                                <div className="flex-shrink-0">
                                                    <div className="w-20 h-20 bg-teal-100 rounded-lg flex items-center justify-center">
                                                        {/* <span className="text-3xl">
                                                            {doctorTreatment?.icon || "⚕️"}
                                                        </span> */}
                                                        {console.log(doctorTreatment.treatment?.icon)}
                                                        <img src={doctorTreatment.treatment?.icon} alt="⚕️" />
                                                    </div>
                                                </div>

                                                {/* Treatment Info */}
                                                <div className="flex-grow">
                                                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                                                        {doctorTreatment.treatment?.title || "Treatment"}
                                                    </h3>

                                                    <div className="flex items-center text-teal-600 font-semibold mb-2">
                                                        <FaStethoscope className="mr-2" />
                                                        <span>{doctorTreatment.treatment?.category || "Medical"}</span>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <span className="text-sm text-gray-500">Consultation Fee</span>
                                                            <div className="text-xl font-bold text-teal-600">
                                                                {doctorTreatment.fee || "On Call"}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-500">Experience</span>
                                                            <div className="font-semibold text-gray-700">
                                                                {doctorTreatment.experienceWithProcedure || doctor.experience} years
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-500">Success Rate</span>
                                                            <div className="font-semibold text-green-600">
                                                                {doctorTreatment.successRate || "N/A"}%
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-500">Cases Performed</span>
                                                            <div className="font-semibold text-gray-700">
                                                                {doctorTreatment.casesPerformed || "N/A"}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {doctorTreatment.specialTechniques && doctorTreatment.specialTechniques.length > 0 && (
                                                        <div className="mb-4">
                                                            <span className="text-sm text-gray-500">Special Techniques:</span>
                                                            <div className="flex flex-wrap gap-2 mt-1">
                                                                {doctorTreatment.specialTechniques.map((technique, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                                                        {technique}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    <div className="flex space-x-4">
                                                        <Link
                                                            to={`/treatments/${doctorTreatment.treatment?._id}`}
                                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                                                        >
                                                            View Treatment Details
                                                        </Link>
                                                        <Link
                                                            to={`/doctors/${doctor._id}/book?treatment=${doctorTreatment.treatment?._id}`}
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
                                            Try adjusting your filters to find treatments offered by this doctor.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* About Section */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">About Doctor</h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {doctor.bio || `${doctor.firstName} ${doctor.lastName} is a skilled ${doctor.specialty} providing quality medical care.`}
                                </p>
                            </div>

                            {/* Specialties Section */}
                            {doctor.specialties && doctor.specialties.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Specialties</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {doctor.specialties.map((specialty, index) => (
                                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <FaStethoscope className="text-teal-600 mr-3 text-lg" />
                                                <span className="text-gray-700 font-medium">{specialty}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Qualifications</h2>
                                {doctor.qualifications && doctor.qualifications.length > 0 ? (
                                    <div className="space-y-3">
                                        {doctor.qualifications.map((qual, index) => (
                                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700">
                                                    {qual.degree} - {qual.institute} ({qual.year})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No qualifications information available.</p>
                                )}
                            </div>

                            {/* Availability Section */}
                            {doctor.availability && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Availability</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {Object.entries(doctor.availability).map(([day, slots], index) => (
                                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700 font-medium">{day}: </span>
                                                <span className="text-gray-600 ml-2">
                                                    {slots.map((slot) => `${slot.start} - ${slot.end}`).join(", ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Awards Section */}
                            {doctor.awards && doctor.awards.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Awards</h2>
                                    <div className="space-y-3">
                                        {doctor.awards.map((award, index) => (
                                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <FaAward className="text-teal-600 mr-3 text-lg" />
                                                <span className="text-gray-700">
                                                    {award.name} ({award.year}, {award.presentedBy})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Memberships Section */}
                            {doctor.memberships && doctor.memberships.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Memberships</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.memberships.map((membership, index) => (
                                            <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                                {membership}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Publications Section */}
                            {doctor.publications && doctor.publications.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Publications</h2>
                                    <div className="space-y-3">
                                        {doctor.publications.map((pub, index) => (
                                            <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                                <span className="text-gray-700">
                                                    <a
                                                        href={pub.link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-teal-600 hover:underline"
                                                    >
                                                        {pub.title}
                                                    </a>{" "}
                                                    ({pub.journal}, {pub.year})
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>



                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Quick Info Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Information</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaStethoscope className="text-teal-600 mr-3 w-5" />
                                        <span className="text-gray-700">{doctor.specialty}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaStar className="text-teal-600 mr-3 w-5" />
                                        <span className="text-gray-700">{doctor.rating} ({doctor.totalRatings} reviews)</span>
                                    </div>
                                    <div className="flex items-center">
                                        <FaAward className="text-teal-600 mr-3 w-5" />
                                        <span className="text-gray-700">{doctor.experience} Years Experience</span>
                                    </div>
                                    {doctor.consultationFee && (
                                        <div className="flex items-center">
                                            <FaCalendarCheck className="text-teal-600 mr-3 w-5" />
                                            <span className="text-gray-700">Consultation Fee: ₹{doctor.consultationFee}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h3>
                                <div className="space-y-3">
                                    {doctor.phone && (
                                        <div className="flex items-center">
                                            <FaPhone className="text-teal-600 mr-3 w-5" />
                                            <a href={`tel:${doctor.phone}`} className="text-gray-700 hover:text-teal-600">
                                                {doctor.phone}
                                            </a>
                                        </div>
                                    )}
                                    {doctor.email && (
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-teal-600 mr-3 w-5" />
                                            <a href={`mailto:${doctor.email}`} className="text-gray-700 hover:text-teal-600">
                                                {doctor.email}
                                            </a>
                                        </div>
                                    )}
                                    {doctor.website && (
                                        <div className="flex items-center">
                                            <FaGlobe className="text-teal-600 mr-3 w-5" />
                                            <a
                                                href={doctor.website}
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

                            {/* Languages Card */}
                            {doctor.languages && doctor.languages.length > 0 && (
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-xl font-bold text-gray-800 mb-4">Languages Spoken</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {doctor.languages.map((language, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                                                {language}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* CTA Card */}
                            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white">
                                <h3 className="text-xl font-bold mb-3">Ready to Book?</h3>
                                <p className="mb-4 opacity-90">Schedule your appointment with {`${doctor.firstName} ${doctor.lastName}`}.</p>
                                <Link
                                    to={`/doctors/${doctor._id}/book`}
                                    className="w-full bg-white text-teal-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    <FaCalendarCheck className="mr-2" />
                                    Book Appointment
                                </Link>
                            </div>



                        </div>
                    </div>
                )}

                {activeTab === "qualifications" && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Qualifications</h2>
                        {doctor.qualifications && doctor.qualifications.length > 0 ? (
                            <div className="space-y-3">
                                {doctor.qualifications.map((qual, index) => (
                                    <div key={index} className="flex items-center p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">
                                            {qual.degree} - {qual.institute} ({qual.year})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">No qualifications information available.</p>
                        )}
                    </div>
                )}

                {activeTab === "contact" && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact & Availability</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Information */}
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
                                <div className="space-y-3">
                                    {doctor.phone && (
                                        <div className="flex items-center">
                                            <FaPhone className="text-teal-600 mr-3 w-5" />
                                            <span className="text-gray-700">{doctor.phone}</span>
                                        </div>
                                    )}
                                    {doctor.email && (
                                        <div className="flex items-center">
                                            <FaEnvelope className="text-teal-600 mr-3 w-5" />
                                            <span className="text-gray-700">{doctor.email}</span>
                                        </div>
                                    )}
                                    {doctor.website && (
                                        <div className="flex items-center">
                                            <FaGlobe className="text-teal-600 mr-3 w-5" />
                                            <span className="text-gray-700">{doctor.website}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Availability */}
                            {doctor.availability && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Availability</h3>
                                    <div className="space-y-3">
                                        {Object.entries(doctor.availability).map(([day, slots], index) => (
                                            <div key={index} className="flex items-center">
                                                <span className="text-gray-700 font-medium">{day}: </span>
                                                <span className="text-gray-600 ml-2">
                                                    {slots.map((slot) => `${slot.start} - ${slot.end}`).join(", ")}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorDetails;
