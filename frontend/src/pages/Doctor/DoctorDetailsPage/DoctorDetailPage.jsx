import React, { useState } from 'react';
import { Calendar, MessageCircle, MapPin, CheckCircle, Star, ChevronDown, Menu, X } from 'lucide-react';
import BreadCrumbs from '@/components/Breadcums';

const DoctorDetailPage = () => {
  const [selectedTab, setSelectedTab] = useState('work');
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const schedule = [
    { day: 'Monday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 04:00 PM' },
    { day: 'Tuesday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 06:00 PM' },
    { day: 'Wednesday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 04:00 PM' },
    { day: 'Thursday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 04:00 PM' },
    { day: 'Friday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 04:00 PM' },
    { day: 'Saturday', morning: '10:00 AM - 11:00 AM', evening: '02:00 PM - 04:00 PM' }
  ];

  const workExperience = [
    { role: 'Director', institution: 'Fortis Escorts Heart Institute, New Delhi', checked: true },
    { role: 'Consultant', institution: 'Fortis Escorts Heart Institute, New Delhi', checked: true },
    { role: 'Director', institution: 'Max Super Speciality Hospital, Saket, New Delhi', checked: true },
    { role: 'Consultant', institution: 'Max Super Speciality Hospital, Saket, New Delhi', checked: true }
  ];

  const sidebarItems = [
    'About Doctor',
    'Skilled At',
    'Work Experience',
    'Education & Training',
    'Location',
    'Reviews',
    'Submit Form',
    'More Doctors',
    'FAQs'
  ];


  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'About ASTITVA CLINIC ' },
    { label: 'About Us' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Doctor Image and Basic Info */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 flex-1">
              <div className="w-32 h-32 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src="/api/placeholder/128/128"
                  alt="Dr. Y K Mishraa"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dr. Y K Mishraa</h1>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>

                <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                  Cardiac Surgeon
                </span>

                <p className="text-gray-700 font-medium mb-2">Chairman</p>
                <p className="text-gray-600 text-sm mb-3">MBBS, MD, Fellowship, Fellowship</p>

                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                  <span className="text-sm text-gray-600">4.9 (271 Ratings)</span>
                </div>

                <p className="text-sm text-gray-600 mb-2">44 years of overall experience</p>
                <p className="text-sm text-gray-600 mb-2">Surgeries Performed: 19000+</p>
                <p className="text-sm text-gray-600">Works at <span className="font-medium">Manipal Hospitals Dwarka, Delhi</span></p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 w-full lg:w-64">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                Book Appointment
              </button>
              <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 font-medium transition-colors">
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* green Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden w-full bg-white p-4 rounded-lg shadow-sm flex items-center justify-between mb-4"
            >
              <span className="font-medium">Navigation</span>
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div className={`bg-white rounded-lg shadow-sm p-4 ${showMobileMenu ? 'block' : 'hidden lg:block'}`}>
              <nav className="space-y-2">
                {sidebarItems.map((item, index) => (
                  <a
                    key={index}
                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
          </div>

          {/* green Content Area */}
          <div className="flex-1 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About Dr. Y K Mishraa</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Dr. Y.K. Mishra is a distinguished Cardiac Surgeon, recognised as a pioneer in minimally invasive cardiac surgery in India, with over four decades of experience improving heart health. He has successfully performed over 19,000 open-heart and robotic surgeries and is a leading expert in minimally invasive techniques, complex cardiac repairs, and valve replacements.
              </p>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                + Read More
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* OPD Schedule */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">OPD Schedule Of Dr. Y K Mishraa</h2>
                  <span className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Consultation Fees Rs. 1100 /-
                  </span>
                </div>
                <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors w-full sm:w-auto">
                  Book Appointment
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  {schedule.map((item, index) => (
                    <div key={index} className="border-l-4 border-green-400 pl-4">
                      <p className="font-semibold text-gray-900 mb-2">{item.day}</p>
                      <div className="space-y-1">
                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                          {item.morning}
                        </span>
                        <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded text-sm ml-2">
                          {item.evening}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center bg-blue-50 rounded-lg p-8">
                  <div className="text-center">
                    <Calendar className="w-24 h-24 text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-700 font-medium">Appointment Booking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Problems */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Problems</h2>
              <p className="text-gray-600 mb-4">For which Dr. Y K Mishraa can be consulted</p>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Cardiovascular Conditions</span>
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Medical Procedures */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Medical Procedures</h2>
              <p className="text-gray-600 mb-4">Performed by Dr. Y K Mishraa</p>
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <span className="font-medium text-gray-900">Cardiac Surgeries</span>
                <ChevronDown className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Location */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-48 h-48 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src="/api/placeholder/400/300"
                    alt="Manipal Hospital"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Manipal Hospitals Dwarka, Delhi</h3>
                      <p className="text-gray-600">New Delhi, India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex gap-2 mb-6 overflow-x-auto">
                <button
                  onClick={() => setSelectedTab('education')}
                  className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedTab === 'education'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Education & Training
                </button>
                <button
                  onClick={() => setSelectedTab('honours')}
                  className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedTab === 'honours'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Honours & Awards
                </button>
                <button
                  onClick={() => setSelectedTab('work')}
                  className={`px-6 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${selectedTab === 'work'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  Work Experience
                </button>
              </div>

              {selectedTab === 'work' && (
                <div className="space-y-3">
                  {workExperience.map((exp, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">
                        <span className="font-medium">{exp.role}</span>, {exp.institution}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Related Video */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Video</h2>
              <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-0 h-0 border-l-8 border-l-white border-t-6 border-t-transparent border-b-6 border-b-transparent ml-1"></div>
                  </div>
                  <p className="text-white text-sm">Heart diseases and treatments - Best Explained</p>
                  <p className="text-gray-400 text-xs mt-2">by Dr. Yugal K. Mishra of FEHI, New Delhi</p>
                </div>
              </div>
            </div>

            {/* News Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">News Related to Dr. Y K Mishraa</h2>
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <h3 className="font-semibold text-gray-900 mb-2">
                  India's First Scar-Less Surgery Performed Successfully by Fortis Escorts Heart Institute
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  The boy suffered from a hole in the wall that separates the upper two chambers of the heart
                </p>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                  Read More
                </button>
              </div>
            </div>

            {/* Patient Review */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patient's Review</h2>
              <div className="bg-white rounded-lg p-4">
                <p className="text-gray-700 italic">"Unmet AI"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;