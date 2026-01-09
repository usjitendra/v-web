import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, MessageCircle, MapPin, CheckCircle, Star, Menu, X, Award, Briefcase, GraduationCap, Stethoscope, Clock, Phone, Mail } from 'lucide-react';
import BreadCrumbs from '@/components/Breadcums';
import { useGetDoctorsDetailQuery } from '@/rtk/slices/commanApiSlice';

const DoctorDetailPage = () => {
  const { slug } = useParams();
  const { data: response, isLoading, error } = useGetDoctorsDetailQuery({ slug });
  const doctor = response?.data;

  const [selectedTab, setSelectedTab] = useState('education');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Keyboard navigation for gallery
  const handleKeyDown = (e) => {
    if (doctor?.gallery?.length > 0) {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) =>
          prev === 0 ? doctor.gallery.length - 1 : prev - 1
        );
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) =>
          prev === doctor.gallery.length - 1 ? 0 : prev + 1
        );
      }
    }
  };

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [doctor?.gallery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lightSky to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 border-4 border-main border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-20 h-20 border-2 border-main opacity-20 rounded-full animate-ping"></div>
          </div>
          <h3 className="text-2xl font-bold text-darktext mb-2">Loading Doctor Profile</h3>
          <p className="text-lighttext">Please wait while we fetch the details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-lightSky to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-darktext mb-2">Unable to Load Profile</h3>
          <p className="text-lighttext mb-6">We couldn't load the doctor details. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-main hover:bg-primary text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Doctors', href: '/doctors' },
    { label: doctor?.name }
  ];

  return (
    <>
      <style>
        {`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="min-h-screen bg-gradient-to-br from-lightSky to-white">
      <BreadCrumbs headText={`Dr. ${doctor?.name}`} items={breadcrumbItems} />

      {/* Header Section */}
      <div className="bg-white shadow-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Doctor Profile */}
            <div className="flex flex-col sm:flex-row gap-8 flex-1">
              <div className="relative">
                <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 flex-shrink-0 shadow-xl border-4 border-white">
                  <img
                    src={doctor?.image?.publicURL || "/api/placeholder/192/192"}
                    alt={doctor?.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {doctor?.is_active && (
                  <div className="absolute -bottom-3 -right-3 bg-gradient-to-r from-main to-primary text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg animate-pulse">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                      Available
                    </div>
                  </div>
                )}
                <div className="absolute -top-2 -left-2 bg-accent text-darktext rounded-full p-3 shadow-lg">
                  <Stethoscope className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="text-4xl lg:text-5xl font-bold text-darktext mb-3">Dr. {doctor?.name}</h1>

                {doctor?.categoryId?.category_name && (
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-main/10 to-accent/10 text-main px-6 py-3 rounded-2xl text-lg font-bold mb-6 shadow-sm border border-main/20">
                    <Stethoscope className="w-5 h-5" />
                    {doctor.categoryId.category_name}
                  </div>
                )}

                {doctor?.subCategoryId && doctor.subCategoryId.length > 0 && (
                  <div className="flex flex-wrap gap-3 mb-6">
                    {doctor.subCategoryId.map((subCat) => (
                      <span
                        key={subCat._id}
                        className="inline-flex items-center bg-white text-darktext px-4 py-2 rounded-xl text-sm font-semibold shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                      >
                        {subCat.subcategory_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {doctor?.workAt && (
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="p-2 bg-main/10 rounded-lg">
                        <Briefcase className="w-5 h-5 text-main" />
                      </div>
                      <div>
                        <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Works At</p>
                        <p className="text-darktext font-semibold">{doctor.workAt}</p>
                      </div>
                    </div>
                  )}
                  {doctor?.experience && (
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Clock className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Experience</p>
                        <p className="text-darktext font-semibold">{doctor.experience} years</p>
                      </div>
                    </div>
                  )}
                  {doctor?.location && (
                    <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Location</p>
                        <p className="text-darktext font-semibold">{doctor.location.city}, {doctor.location.state}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-darktext font-bold">4.9</span>
                        <span className="text-lighttext text-sm">(128 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 w-full lg:w-80">
              <button className="bg-gradient-to-r from-main to-primary hover:from-primary hover:to-main text-white px-8 py-4 rounded-2xl text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3">
                <Calendar className="w-6 h-6" />
                Book Appointment
              </button>

              <button className="bg-white hover:bg-gray-50 text-darktext px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-main text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                <Clock className="w-6 h-6 text-main" />
                View Schedule
              </button>

              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-lg font-bold text-darktext mb-4 text-center">Quick Contact</h3>
                <div className="grid grid-cols-1 gap-3">
                  {doctor?.phone && (
                    <a
                      href={`tel:${doctor.phone}`}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <Phone className="w-5 h-5" />
                      Call Now
                    </a>
                  )}
                  {doctor?.phone && (
                    <a
                      href={`https://wa.me/${doctor.phone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md"
                    >
                      <MessageCircle className="w-5 h-5" />
                      WhatsApp Chat
                    </a>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                  <p className="text-xs text-lighttext">Available 24/7 for consultations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-full bg-white border-2 border-gray-100 rounded-2xl p-6 flex items-center justify-between mb-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <span className="font-bold text-darktext text-lg">Quick Navigation</span>
              {showMobileMenu ? <X className="w-6 h-6 text-main" /> : <Menu className="w-6 h-6 text-main" />}
            </button>

            {/* Navigation */}
            <div className={`bg-white rounded-2xl border-2 border-gray-100 shadow-xl sticky top-8 overflow-hidden ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
              <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-main/5 to-accent/5">
                <h3 className="font-bold text-darktext text-lg flex items-center gap-2">
                  <div className="w-8 h-8 bg-main rounded-lg flex items-center justify-center">
                    <Menu className="w-4 h-4 text-white" />
                  </div>
                  Quick Navigation
                </h3>
              </div>
              <nav className="p-3">
                {[
                  { label: 'About', id: 'about', icon: '👨‍⚕️' },
                  { label: 'Education', id: 'education', icon: '🎓' },
                  { label: 'Experience', id: 'experience', icon: '💼' },
                  { label: 'Specializations', id: 'specializations', icon: '⚕️' },
                  { label: 'Location', id: 'location', icon: '📍' },
                  { label: 'Gallery', id: 'gallery', icon: '🖼️' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block px-4 py-3 text-sm text-darktext hover:bg-main/10 hover:text-main rounded-xl transition-all duration-300 font-medium flex items-center gap-3 group"
                  >
                    <span className="text-lg group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border-2 border-gray-100 mt-6 p-6 hidden lg:block shadow-xl">
              <h3 className="font-bold text-darktext mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                Contact Details
              </h3>
              <div className="space-y-4">
                {doctor?.phone && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Phone className="w-5 h-5 text-main mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Phone</p>
                      <span className="text-darktext font-semibold">{doctor.phone}</span>
                    </div>
                  </div>
                )}
                {doctor?.email && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-lighttext font-medium uppercase tracking-wide">Email</p>
                      <span className="text-darktext font-semibold break-all">{doctor.email}</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-lighttext text-center">Response time: Within 24 hours</p>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-8">
            {/* About */}
            {doctor?.about && (
              <div id="about" className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                  <h2 className="text-3xl font-bold text-darktext">About Dr. {doctor.name}</h2>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <p className="text-darktext leading-relaxed text-lg">{doctor.about}</p>
                </div>
              </div>
            )}

            {/* Education & Honours */}
            {((doctor?.educationAndTraining && doctor.educationAndTraining.length > 0) ||
              (doctor?.honoursAndAwards && doctor.honoursAndAwards.length > 0)) && (
              <div id="education" className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden shadow-xl">
                <div className="flex bg-gradient-to-r from-main/5 to-accent/5">
                  {doctor?.educationAndTraining && doctor.educationAndTraining.length > 0 && (
                    <button
                      onClick={() => setSelectedTab('education')}
                      className={`flex-1 px-8 py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedTab === 'education'
                          ? 'bg-main text-white shadow-lg transform scale-105'
                          : 'text-darktext hover:bg-white/50 hover:text-main'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                      Education & Training
                    </button>
                  )}
                  {doctor?.honoursAndAwards && doctor.honoursAndAwards.length > 0 && (
                    <button
                      onClick={() => setSelectedTab('honours')}
                      className={`flex-1 px-8 py-4 text-sm font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                        selectedTab === 'honours'
                          ? 'bg-accent text-darktext shadow-lg transform scale-105'
                          : 'text-darktext hover:bg-white/50 hover:text-accent'
                      }`}
                    >
                      <Award className="w-5 h-5" />
                      Honours & Awards
                    </button>
                  )}
                </div>

                <div className="p-8">
                  {selectedTab === 'education' && doctor?.educationAndTraining && (
                    <div className="space-y-6">
                      {doctor.educationAndTraining.map((edu, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:shadow-md transition-shadow duration-300">
                          <div className="w-14 h-14 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <GraduationCap className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-darktext text-lg">{edu.degree}</p>
                            <p className="text-main font-semibold mt-1">{edu.institute}</p>
                            <p className="text-lighttext font-medium mt-2 inline-flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              {edu.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTab === 'honours' && doctor?.honoursAndAwards && (
                    <div className="space-y-6">
                      {doctor.honoursAndAwards.map((award, index) => (
                        <div key={index} className="flex gap-6 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100 hover:shadow-md transition-shadow duration-300">
                          <div className="w-14 h-14 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Award className="w-7 h-7 text-darktext" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-darktext text-lg">{award.title}</p>
                            <p className="text-lighttext font-medium mt-2 inline-flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {award.year}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Work Experience */}
            {doctor?.workExperience && (
              <div id="experience" className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Briefcase className="w-6 h-6 text-darktext" />
                  </div>
                  <h2 className="text-3xl font-bold text-darktext">Work Experience</h2>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-xl border border-gray-100">
                  <p className="text-darktext leading-relaxed text-lg">{doctor.workExperience}</p>
                </div>
              </div>
            )}

            {/* Specializations & Procedures */}
            {((doctor?.medicalProblems && doctor.medicalProblems.length > 0) ||
              (doctor?.medicalProcedures && doctor.medicalProcedures.length > 0)) && (
              <div id="specializations" className="grid md:grid-cols-2 gap-8">
                {/* Medical Problems */}
                {doctor?.medicalProblems && doctor.medicalProblems.length > 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center shadow-lg">
                        <Stethoscope className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-darktext">Specializations</h3>
                    </div>
                    <div className="space-y-4">
                      {doctor.medicalProblems.map((problem, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-main/5 to-primary/5 rounded-xl border border-main/20 hover:shadow-md transition-all duration-300">
                          <CheckCircle className="w-6 h-6 text-main flex-shrink-0" />
                          <span className="text-darktext font-medium">{problem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Procedures */}
                {doctor?.medicalProcedures && doctor.medicalProcedures.length > 0 && (
                  <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">⚕️</span>
                      </div>
                      <h3 className="text-2xl font-bold text-darktext">Procedures</h3>
                    </div>
                    <div className="space-y-4">
                      {doctor.medicalProcedures.map((procedure, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-accent/5 to-yellow-50 rounded-xl border border-accent/20 hover:shadow-md transition-all duration-300">
                          <CheckCircle className="w-6 h-6 text-accent flex-shrink-0" />
                          <span className="text-darktext font-medium">{procedure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {doctor?.location && (
              <div id="location" className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-darktext">Clinic Location</h2>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                  {doctor.workAt && (
                    <div className="mb-4">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Hospital/Clinic</p>
                      <p className="font-bold text-darktext text-lg">{doctor.workAt}</p>
                    </div>
                  )}
                  {doctor.location.address && (
                    <div className="mb-4">
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Address</p>
                      <p className="text-darktext font-medium">{doctor.location.address}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Location</p>
                    <p className="text-darktext font-medium">
                      {doctor.location.city}
                      {doctor.location.state && `, ${doctor.location.state}`}
                      {doctor.location.zipCode && ` - ${doctor.location.zipCode}`}
                    </p>
                  </div>
                  {doctor.location.country && (
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wide mb-1">Country</p>
                      <p className="text-darktext font-medium">{doctor.location.country}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* YouTube Video */}
            {doctor?.youtubeVideo?.url && (
              <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-2xl">▶️</span>
                  </div>
                  <h2 className="text-3xl font-bold text-darktext">Related Video</h2>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl aspect-video flex items-center justify-center border-2 border-red-100 hover:border-red-200 transition-colors duration-300">
                  <a
                    href={doctor.youtubeVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3"
                  >
                    <span className="text-2xl">▶️</span>
                    {doctor.youtubeVideo.title || 'Watch Video'}
                  </a>
                </div>
              </div>
            )}

            {/* Gallery */}
            {doctor?.gallery && doctor.gallery.length > 0 && (
              <div id="gallery" className="bg-white rounded-2xl border-2 border-gray-100 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-8 bg-gradient-to-r from-main/5 to-accent/5 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🖼️</span>
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-darktext">Professional Gallery</h2>
                      <p className="text-lighttext mt-1">Explore our medical facilities and equipment</p>
                    </div>
                  </div>
                </div>

                {/* Main Image Display */}
                <div className="p-8">
                  <div className="relative mb-6">
                    <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                      <img
                        src={doctor.gallery[selectedImageIndex]?.publicURL}
                        alt={`Gallery Image ${selectedImageIndex + 1}`}
                        className="w-full h-full object-cover transition-all duration-700 ease-out transform hover:scale-105"
                      />
                      {/* Image Counter */}
                      <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {selectedImageIndex + 1} / {doctor.gallery.length}
                      </div>
                      {/* Navigation Arrows */}
                      <button
                        onClick={() => setSelectedImageIndex((prev) =>
                          prev === 0 ? doctor.gallery.length - 1 : prev - 1
                        )}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-darktext p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) =>
                          prev === doctor.gallery.length - 1 ? 0 : prev + 1
                        )}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-darktext p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail Strip */}
                  <div className="relative">
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                      {doctor.gallery.map((img, index) => (
                        <button
                          key={img._id}
                          onClick={() => setSelectedImageIndex(index)}
                          className={`flex-shrink-0 relative rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                            selectedImageIndex === index
                              ? 'border-main shadow-xl scale-105'
                              : 'border-gray-200 shadow-md hover:shadow-lg hover:scale-102'
                          }`}
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <img
                            src={img.publicURL}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-24 h-24 md:w-28 md:h-28 object-cover transition-transform duration-300 hover:scale-110"
                          />
                          {/* Active Indicator */}
                          {selectedImageIndex === index && (
                            <div className="absolute inset-0 bg-main/20 flex items-center justify-center">
                              <div className="w-8 h-8 bg-main rounded-full flex items-center justify-center">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          )}
                          {/* Image Number */}
                          <div className={`absolute bottom-1 right-1 text-xs font-bold px-2 py-1 rounded-full ${
                            selectedImageIndex === index
                              ? 'bg-main text-white'
                              : 'bg-black/60 text-white'
                          }`}>
                            {index + 1}
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Scroll Indicators */}
                    <div className="flex justify-center mt-4 gap-2">
                      {Array.from({ length: Math.ceil(doctor.gallery.length / 4) }, (_, i) => (
                        <div
                          key={i}
                          className={`h-2 rounded-full transition-all duration-300 ${
                            Math.floor(selectedImageIndex / 4) === i
                              ? 'w-8 bg-main'
                              : 'w-2 bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="mt-6 text-center">
                    <p className="text-lighttext text-sm">
                      Click on thumbnails to view different images • Use arrow buttons for navigation
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default DoctorDetailPage;