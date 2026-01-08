import React, { useState } from 'react';
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading doctor details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-2">Error loading doctor details</p>
          <p className="text-gray-500">Please try again later</p>
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
    <div className="min-h-screen bg-gray-50">
      <BreadCrumbs headText={`Dr. ${doctor?.name}`} items={breadcrumbItems} />

      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Doctor Profile */}
            <div className="flex flex-col sm:flex-row gap-6 flex-1">
              <div className="relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border">
                  <img
                    src={doctor?.image?.publicURL || "/api/placeholder/160/160"}
                    alt={doctor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {doctor?.is_active && (
                  <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-xs font-medium">
                    Available
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dr. {doctor?.name}</h1>
                
                {doctor?.categoryId?.category_name && (
                  <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md text-sm font-medium mb-4">
                    <Stethoscope className="w-4 h-4" />
                    {doctor.categoryId.category_name}
                  </div>
                )}

                {doctor?.subCategoryId && doctor.subCategoryId.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {doctor.subCategoryId.map((subCat) => (
                      <span 
                        key={subCat._id}
                        className="inline-flex items-center bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium"
                      >
                        {subCat.subcategory_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="space-y-2 mb-4">
                  {doctor?.workAt && (
                    <p className="text-gray-700 flex items-center gap-2 text-sm">
                      <Briefcase className="w-4 h-4 text-gray-400" />
                      {doctor.workAt}
                    </p>
                  )}
                  {doctor?.experience && (
                    <p className="text-gray-700 flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-400" />
                      {doctor.experience} years of experience
                    </p>
                  )}
                  {doctor?.location && (
                    <p className="text-gray-700 flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      {doctor.location.city}, {doctor.location.state}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.9 (128 reviews)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-64">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg text-sm font-medium transition-colors">
                Book Appointment
              </button>
              <button className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors">
                <Calendar className="w-4 h-4" />
                View Schedule
              </button>
              <div className="grid grid-cols-2 gap-3">
                {doctor?.phone && (
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </a>
                )}
                {doctor?.phone && (
                  <a
                    href={`https://wa.me/${doctor.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Chat
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-full bg-white border rounded-lg p-4 flex items-center justify-between mb-4"
            >
              <span className="font-semibold text-gray-900">Quick Navigation</span>
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Navigation */}
            <div className={`bg-white rounded-lg border sticky top-8 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Quick Navigation</h3>
              </div>
              <nav className="p-2">
                {[
                  { label: 'About', id: 'about' },
                  { label: 'Education', id: 'education' },
                  { label: 'Experience', id: 'experience' },
                  { label: 'Specializations', id: 'specializations' },
                  { label: 'Location', id: 'location' },
                  { label: 'Gallery', id: 'gallery' }
                ].map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-md transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg border mt-4 p-4 hidden lg:block">
              <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
              <div className="space-y-3">
                {doctor?.phone && (
                  <div className="flex items-start gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{doctor.phone}</span>
                  </div>
                )}
                {doctor?.email && (
                  <div className="flex items-start gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 break-all">{doctor.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 space-y-6">
            {/* About */}
            {doctor?.about && (
              <div id="about" className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About Dr. {doctor.name}</h2>
                <p className="text-gray-700 leading-relaxed">{doctor.about}</p>
              </div>
            )}

            {/* Education & Honours */}
            {((doctor?.educationAndTraining && doctor.educationAndTraining.length > 0) || 
              (doctor?.honoursAndAwards && doctor.honoursAndAwards.length > 0)) && (
              <div id="education" className="bg-white rounded-lg border overflow-hidden">
                <div className="flex border-b">
                  {doctor?.educationAndTraining && doctor.educationAndTraining.length > 0 && (
                    <button
                      onClick={() => setSelectedTab('education')}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                        selectedTab === 'education'
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 inline mr-2" />
                      Education & Training
                    </button>
                  )}
                  {doctor?.honoursAndAwards && doctor.honoursAndAwards.length > 0 && (
                    <button
                      onClick={() => setSelectedTab('honours')}
                      className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                        selectedTab === 'honours'
                          ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      <Award className="w-4 h-4 inline mr-2" />
                      Honours & Awards
                    </button>
                  )}
                </div>

                <div className="p-6">
                  {selectedTab === 'education' && doctor?.educationAndTraining && (
                    <div className="space-y-4">
                      {doctor.educationAndTraining.map((edu, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            <p className="text-sm text-gray-600 mt-1">{edu.institute}</p>
                            <p className="text-xs text-gray-500 mt-1">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedTab === 'honours' && doctor?.honoursAndAwards && (
                    <div className="space-y-4">
                      {doctor.honoursAndAwards.map((award, index) => (
                        <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                          <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Award className="w-5 h-5 text-amber-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{award.title}</p>
                            <p className="text-xs text-gray-500 mt-1">{award.year}</p>
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
              <div id="experience" className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Work Experience</h2>
                </div>
                <p className="text-gray-700 leading-relaxed">{doctor.workExperience}</p>
              </div>
            )}

            {/* Specializations & Procedures */}
            {((doctor?.medicalProblems && doctor.medicalProblems.length > 0) || 
              (doctor?.medicalProcedures && doctor.medicalProcedures.length > 0)) && (
              <div id="specializations" className="grid md:grid-cols-2 gap-6">
                {/* Medical Problems */}
                {doctor?.medicalProblems && doctor.medicalProblems.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Specializations</h3>
                    <div className="space-y-2">
                      {doctor.medicalProblems.map((problem, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span className="text-gray-700">{problem}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Medical Procedures */}
                {doctor?.medicalProcedures && doctor.medicalProcedures.length > 0 && (
                  <div className="bg-white rounded-lg border p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Procedures</h3>
                    <div className="space-y-2">
                      {doctor.medicalProcedures.map((procedure, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">{procedure}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Location */}
            {doctor?.location && (
              <div id="location" className="bg-white rounded-lg border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Clinic Location</h2>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {doctor.workAt && <p className="font-medium text-gray-900 mb-2">{doctor.workAt}</p>}
                  {doctor.location.address && <p className="text-sm text-gray-700">{doctor.location.address}</p>}
                  <p className="text-sm text-gray-700">
                    {doctor.location.city}
                    {doctor.location.state && `, ${doctor.location.state}`}
                    {doctor.location.zipCode && ` - ${doctor.location.zipCode}`}
                  </p>
                  {doctor.location.country && <p className="text-sm text-gray-700">{doctor.location.country}</p>}
                </div>
              </div>
            )}

            {/* YouTube Video */}
            {doctor?.youtubeVideo?.url && (
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Related Video</h2>
                <div className="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                  <a 
                    href={doctor.youtubeVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                  >
                    ▶ {doctor.youtubeVideo.title || 'Watch Video'}
                  </a>
                </div>
              </div>
            )}

            {/* Gallery */}
            {doctor?.gallery && doctor.gallery.length > 0 && (
              <div id="gallery" className="bg-white rounded-lg border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Gallery</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {doctor.gallery.map((img) => (
                    <div key={img._id} className="rounded-lg overflow-hidden border">
                      <img 
                        src={img.publicURL} 
                        alt="Doctor Gallery" 
                        className="w-full h-40 object-cover hover:opacity-90 transition-opacity" 
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;