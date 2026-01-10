import React, { useState } from 'react';
import { Star, MapPin, Phone, Mail, Calendar, Award, Users, Building2, Stethoscope, ChevronDown, ChevronUp, Menu, X, MessageCircle } from 'lucide-react';
import BreadCrumbs from '@/components/Breadcums';
import SEOHead from '../../components/SEOHead';

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
    <div className="min-h-screen bg-gradient-to-br from-lightSky to-white">
      <SEOHead
        pageType="hospital-detail"
        pageIdentifier="shanya-scans-theranostics"
        customTitle="Shanya Scans & Theranostics - Advanced Medical Imaging & Healthcare Services"
        customDescription="Experience world-class medical imaging and healthcare services at Shanya Scans & Theranostics. Advanced diagnostic facilities with expert medical professionals."
      />

      <BreadCrumbs headText={"About Shanya Scans & Theranostics"} items={breadcrumbItems} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-main via-primary to-dark text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full -translate-y-48 translate-x-48"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-32 -translate-x-32"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center bg-accent text-darktext px-6 py-3 rounded-2xl text-lg font-bold shadow-lg">
                <Award className="w-5 h-5 mr-2" />
                Top Rated Hospital
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Medanta - The Medicity Hospital
              </h1>

              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                <MapPin className="w-6 h-6 text-accent" />
                <span className="text-xl font-semibold">Gurgaon, India</span>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {[1,2,3,4].map(i => <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />)}
                  <Star className="w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-xl font-bold">4.8 (69 Ratings)</span>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-accent" />
                  </div>
                  <span className="text-lg font-bold">95% Patients recommend this hospital</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
                <h3 className="text-2xl font-bold mb-6 text-center">Hospital Overview</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <Users className="w-10 h-10 mx-auto mb-3 text-accent" />
                    <p className="text-3xl font-bold mb-1">1600</p>
                    <p className="text-sm font-medium">Beds</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <Calendar className="w-10 h-10 mx-auto mb-3 text-accent" />
                    <p className="text-3xl font-bold mb-1">2009</p>
                    <p className="text-sm font-medium">Established</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <Stethoscope className="w-10 h-10 mx-auto mb-3 text-accent" />
                    <p className="text-2xl font-bold mb-1">Super</p>
                    <p className="text-sm font-medium">Specialty</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/10">
                    <Award className="w-10 h-10 mx-auto mb-3 text-accent" />
                    <p className="text-lg font-bold mb-1">JCI, NABH</p>
                    <p className="text-sm font-medium">Accredited</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left Column - Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section id="about" className="bg-white rounded-2xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-300 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-darktext">About Hospital</h2>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-white p-8 rounded-2xl border border-gray-100 mb-10">
                <p className="text-darktext leading-relaxed text-lg">
                  Established in 2009 by globally renowned cardiothoracic surgeon Dr. Naresh Trehan, Medanta – The Medicity, Gurgaon, is one of India's largest and most respected multi-super specialty hospitals.
                </p>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Award className="w-6 h-6 text-darktext" />
                </div>
                <h3 className="text-3xl font-bold text-darktext">Achievements & Milestones</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {achievements.map((achievement, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-6 bg-gradient-to-r from-main/5 to-accent/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-main/10">
                    <div className="flex-shrink-0 w-8 h-8 bg-main text-white rounded-2xl flex items-center justify-center font-bold shadow-lg">
                      ✓
                    </div>
                    <p className="text-darktext flex-1 leading-relaxed font-medium">{achievement}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* International Patient Services */}
            <section className="bg-gradient-to-br from-main/5 via-accent/5 to-primary/5 rounded-2xl shadow-2xl p-10 border border-main/10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-bold text-darktext">International Patient Services</h2>
                  <p className="text-lighttext mt-2">World-class care for global patients</p>
                </div>
              </div>

              <div className="bg-white/50 backdrop-blur-sm p-8 rounded-2xl border border-white/20 mb-8">
                <p className="text-darktext text-lg leading-relaxed">
                  Medanta welcomes over 20,000 international patients every year from more than 30 countries, offering personalised and seamless care.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {services.map((service, idx) => (
                  <div key={idx} className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-main/30">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-main to-primary text-white rounded-2xl flex items-center justify-center font-bold shadow-lg">
                        ✓
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-darktext mb-3">{service.title}</h4>
                        <p className="text-lighttext leading-relaxed">{service.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Departments */}
            <section id="departments" className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-accent to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-8 h-8 text-darktext" />
                </div>
                <h2 className="text-4xl font-bold text-darktext">Departments & Specialties</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((dept, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-main/30 transform hover:scale-102">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-main/20 to-accent/20 rounded-xl flex items-center justify-center text-2xl">
                        {dept.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-darktext text-sm leading-tight mb-2">{dept.name}</h4>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-main" />
                          <p className="text-sm text-lighttext font-semibold">{dept.count} Doctors</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Doctors */}
            <section id="doctors" className="bg-white rounded-2xl shadow-2xl p-10 border border-gray-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-r from-main to-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-darktext">Top Doctors</h2>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {doctors.map((doctor, idx) => (
                  <div key={idx} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-main/30">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 bg-gradient-to-br from-main to-primary rounded-2xl flex-shrink-0 shadow-lg"></div>
                        <div className="absolute -bottom-2 -right-2 bg-accent rounded-full p-2 shadow-lg">
                          <Award className="w-4 h-4 text-darktext" />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-darktext mb-2">{doctor.name}</h3>
                        <p className="text-main font-semibold mb-4 text-lg">{doctor.specialty}</p>

                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < Math.floor(doctor.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                          <span className="text-darktext font-bold text-lg">{doctor.rating}</span>
                          <span className="text-lighttext">({doctor.reviews} Reviews)</span>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <Briefcase className="w-5 h-5 text-accent" />
                          <p className="text-darktext font-semibold">{doctor.experience} years of experience</p>
                        </div>

                        <div className="flex gap-4">
                          <button className="flex-1 bg-gradient-to-r from-main to-primary text-white px-6 py-3 rounded-xl hover:from-primary hover:to-main transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Book Appointment
                          </button>
                          <button className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center">
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
            <div className="bg-gradient-to-br from-main via-primary to-dark rounded-2xl shadow-2xl p-8 sticky top-24 transform hover:scale-105 transition-transform duration-300">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">Contact Hospital</h3>
                <p className="text-teal-100 text-sm">Treatment plan and quote within 2 days</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Patient Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="relative">
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                  >
                    <option className="text-darktext">India</option>
                    <option className="text-darktext">USA</option>
                    <option className="text-darktext">UK</option>
                    <option className="text-darktext">Canada</option>
                    <option className="text-darktext">Australia</option>
                  </select>
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Select City"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <div className="relative flex-shrink-0">
                    <input
                      type="text"
                      value="+91"
                      className="w-20 px-4 py-4 bg-white/20 border border-white/30 rounded-xl text-white text-center font-bold"
                      readOnly
                    />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="tel"
                      placeholder="Your Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="Describe The Current Medical Problem"
                    value={formData.problem}
                    onChange={(e) => setFormData({...formData, problem: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300 resize-none"
                    required
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    placeholder="Example: 30 Yrs or 29-05-1985"
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="w-full px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/20 transition-all duration-300"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-600 hover:to-accent text-darktext py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  SUBMIT DETAILS
                </button>

                <p className="text-xs text-teal-100 text-center leading-relaxed">
                  By submitting the form I agree to the Terms of Use and Privacy Policy of Vaidam Health.
                </p>
              </form>

              {/* Emergency Contact & Actions */}
              <div className="mt-8 pt-8 border-t border-white/20">
                <div className="flex items-center justify-center gap-3 text-white mb-6 bg-white/10 rounded-xl p-4">
                  <Phone className="w-6 h-6 text-accent" />
                  <div>
                    <p className="text-sm text-teal-100">Emergency</p>
                    <p className="font-bold text-lg">+91-124-4141414</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="w-full bg-gradient-to-r from-accent to-yellow-600 hover:from-yellow-600 hover:to-accent text-darktext py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Book Appointment
                  </button>
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>

                {/* Trust indicators */}
                <div className="text-center mt-6 pt-4 border-t border-white/20">
                  <p className="text-teal-100 text-xs mb-2">24/7 Support Available</p>
                  <div className="flex justify-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
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