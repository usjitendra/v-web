import React, { useState } from 'react';
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, Building2, Stethoscope, ChevronDown, ChevronUp, Menu, X, MessageCircle } from 'lucide-react';
import BreadCrumbs from '@/components/Breadcums';

const HospitalDetailPage = () => {
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [expandedDepts, setExpandedDepts] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: 'India',
    city: '',
    phone: '',
    problem: '',
    age: ''
  });

  const departments = [
    { name: 'CARDIOLOGY AND CARDIAC SURGERY', count: 27, icon: '❤️' },
    { name: 'COSMETIC AND PLASTIC SURGERY', count: 5, icon: '✨' },
    { name: 'DENTAL TREATMENT', count: 5, icon: '🦷' },
    { name: 'DERMATOLOGY', count: 4, icon: '🔬' },
    { name: 'ENDOCRINOLOGY', count: 7, icon: '⚕️' },
    { name: 'ENT SURGERY', count: 3, icon: '👂' },
    { name: 'GASTROENTEROLOGY', count: 23, icon: '🫀' },
    { name: 'GENERAL SURGERY', count: 2, icon: '🏥' },
    { name: 'GYNECOLOGY', count: 5, icon: '👶' },
    { name: 'HEMATOLOGY', count: 2, icon: '🩸' },
    { name: 'HEPATOLOGY', count: 15, icon: '🫁' },
    { name: 'NEPHROLOGY', count: 13, icon: '💊' },
    { name: 'NEUROLOGY AND NEUROSURGERY', count: 25, icon: '🧠' },
    { name: 'OBESITY OR BARIATRIC SURGERY', count: 5, icon: '⚖️' },
    { name: 'ONCOLOGY AND ONCOSURGERY', count: 21, icon: '🎗️' },
    { name: 'OPTHALMOLOGY', count: 4, icon: '👁️' },
    { name: 'ORTHOPEDICS', count: 8, icon: '🦴' },
    { name: 'PEDIATRIC CARDIOLOGY', count: 3, icon: '👶❤️' },
    { name: 'PEDIATRICS AND PEDIATRIC SURGERY', count: 11, icon: '🧸' },
    { name: 'PULMONOLOGY', count: 4, icon: '🫁' },
    { name: 'RHEUMATOLOGY', count: 2, icon: '💉' },
    { name: 'ROUTINE HEALTH CHECK-UPS', count: 4, icon: '📋' },
    { name: 'SPINE SURGERY', count: 5, icon: '🦴' },
    { name: 'TRANSPLANT SURGERY', count: 10, icon: '🫀' },
    { name: 'UROLOGY TREATMENT', count: 11, icon: '🔬' },
    { name: 'VASCULAR SURGERY', count: 4, icon: '🩺' }
  ];

  const doctors = [
    {
      name: 'Dr. Rajiv Parakh',
      specialty: 'Vascular Surgeon',
      rating: 5.0,
      reviews: 38,
      experience: 42,
      image: '/api/placeholder/100/100'
    },
    {
      name: 'Dr. Naresh Trehan',
      specialty: 'Cardiac Surgeon',
      rating: 4.9,
      reviews: 655,
      experience: 56,
      image: '/api/placeholder/100/100'
    },
    {
      name: 'Dr. Anand Jaiswal',
      specialty: 'Cardiothoracic Surgeon',
      rating: 4.8,
      reviews: 124,
      experience: 38,
      image: '/api/placeholder/100/100'
    },
    {
      name: 'Dr. Anil Bhan',
      specialty: 'Cardiac Surgeon',
      rating: 4.9,
      reviews: 289,
      experience: 45,
      image: '/api/placeholder/100/100'
    }
  ];

  const achievements = [
    'Ranked in the Top Hospitals across nine categories in the Time Health Survey of 2022',
    'Best Multi-Specialty Hospital in India award at the Time Health Survey in 2021',
    'India Healthcare Award, 2020 for the Best Hospital for Medical Tourism',
    'VCCircle Healthcare Award, 2013 for Single-Specialty Healthcare Entity',
    'Pioneer in Robotic Surgeries in Cardiology, Urology, and Gynaecology',
    'Dr. A.S. Soin led India\'s First Successful Intestinal Transplant in 2013',
    'Over 15,000 cardiac surgeries and 2,500 joint replacements performed',
    '500+ Living Donor Liver Transplants, highest in India and 2nd globally',
    '30 Total Knee Replacements in a single day, making the World Record',
    'Asia\'s First Bloodless Bone Marrow Transplant',
    'Launched India\'s First Air Ambulance, named Flying Doctors India, in 2013'
  ];

  const services = [
    {
      title: 'Pre-arrival Consultation & Case Review',
      description: 'Online consultations, treatment plans, and cost estimates prior to travel'
    },
    {
      title: 'Visa & Travel Assistance',
      description: 'Official invitation letters and guidance for travel arrangements'
    },
    {
      title: 'Airport Pick-up/Drop-off',
      description: 'Complimentary transportation for all international patients'
    },
    {
      title: 'Multilingual Interpreters',
      description: 'Language support to assist in communicating with doctors and staff'
    },
    {
      title: 'Express Check-in & Dedicated Lounge',
      description: 'Fast-tracked services and personal care coordinators'
    },
    {
      title: 'Accommodation & Food Arrangements',
      description: 'Assistance with nearby hotels and customized meal plans'
    }
  ];

  const toggleDept = (dept) => {
    setExpandedDepts(prev => ({ ...prev, [dept]: !prev[dept] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Form submitted! In a real application, this would send the data to a server.');
  };


    const breadcrumbItems = [
    { label: 'Home', href: '/' },
    // { label: 'About ASTITVA CLINIC ' },
    { label: 'About Us' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />
      {/* Hero Section */}
      {/* <section className="relative bg-gradient-to-r from-blue-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-sm font-semibold">
                ⭐ Top Rated Hospital
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Medanta - The Medicity Hospital
              </h1>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg">Gurgaon, India</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[1,2,3,4].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  <Star className="w-5 h-5 text-yellow-400" />
                </div>
                <span className="text-lg font-semibold">3.8 (69 Ratings)</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 inline-block">
                <div className="flex items-center space-x-2">
                  <Award className="w-6 h-6 text-green-400" />
                  <span className="font-semibold">95% Patients recommend this hospital</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">1600</p>
                    <p className="text-sm">Beds</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">2009</p>
                    <p className="text-sm">Established</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Stethoscope className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">Super</p>
                    <p className="text-sm">Specialty</p>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-2xl font-bold">JCI, NABH</p>
                    <p className="text-sm">Accredited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section id="about" className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                <Building2 className="w-8 h-8 mr-3 text-blue-600" />
                About Hospital
              </h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                Established in 2009 by globally renowned cardiothoracic surgeon Dr. Naresh Trehan, Medanta – The Medicity, Gurgaon, is one of India's largest and most respected multi-super specialty hospitals.
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Achievements & Milestones</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      ✓
                    </div>
                    <p className="text-sm text-gray-700 flex-1">{achievement}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* International Patient Services */}
            <section className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">International Patient Services</h2>
              <p className="text-gray-700 mb-6">
                Medanta welcomes over 20,000 international patients every year from more than 30 countries, offering personalised and seamless care.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                        ✓
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 mb-2">{service.title}</h4>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Departments */}
            <section id="departments" className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Departments & Specialties</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {departments.map((dept, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{dept.icon}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{dept.name}</h4>
                          <p className="text-xs text-gray-500">{dept.count} Doctors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Doctors */}
            <section id="doctors" className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Top Doctors</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {doctors.map((doctor, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:border-blue-500 hover:shadow-lg transition">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{doctor.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">{doctor.rating} ({doctor.reviews} Reviews)</span>
                        </div>
                        <p className="text-sm text-gray-700 font-medium">{doctor.experience} years of experience</p>
                        <div className="flex gap-2 mt-4">
                          <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm font-semibold">
                            Book Appointment
                          </button>
                          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition">
                            <MessageCircle className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column - Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-2xl p-8 sticky top-24">
              <h3 className="text-2xl font-bold text-white mb-2">Contact Hospital</h3>
              <p className="text-blue-100 mb-6 text-sm">Treatment plan and quote within 2 days</p>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  placeholder="Patient Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({...formData, country: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none"
                >
                  <option>India</option>
                  <option>USA</option>
                  <option>UK</option>
                  <option>Canada</option>
                  <option>Australia</option>
                </select>
                
                <input
                  type="text"
                  placeholder="Select City"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value="+91"
                    className="w-20 px-4 py-3 rounded-lg border-0 bg-gray-100"
                    readOnly
                  />
                  <input
                    type="tel"
                    placeholder="Your Phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                  />
                </div>
                
                <textarea
                  placeholder="Describe The Current Medical Problem"
                  value={formData.problem}
                  onChange={(e) => setFormData({...formData, problem: e.target.value})}
                  rows="4"
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none resize-none"
                  required
                ></textarea>
                
                <input
                  type="text"
                  placeholder="Example: 30 Yrs or 29-05-1985"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />
                
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  SUBMIT DETAILS
                </button>
                
                <p className="text-xs text-blue-100 text-center">
                  By submitting the form I agree to the Terms of Use and Privacy Policy of Vaidam Health.
                </p>
              </form>

              <div className="mt-8 pt-8 border-t border-blue-400">
                <div className="flex items-center justify-center space-x-2 text-white mb-4">
                  <Phone className="w-5 h-5" />
                  <span className="font-semibold">Emergency: +91-124-4141414</span>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
                    Book Appointment
                  </button>
                  <button className="flex-1 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default HospitalDetailPage;