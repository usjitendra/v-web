import React from 'react';
import { Star, Users, ArrowRight, Phone, Hospital, Stethoscope, Heart } from 'lucide-react';
import bgimage from '../../assets/background.png';

const HeroSection = () => {
  const services = [
    {
      icon: Hospital,
      title: 'Find Best Hospitals',
      description: 'Access to world-class hospitals across the globe',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Stethoscope,
      title: 'Expert Doctors',
      description: 'Connect with top specialists for your treatment',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Heart,
      title: 'Personalized Care',
      description: 'End-to-end medical travel assistance',
      color: 'from-red-500 to-red-600'
    }
  ];

  const handleGetStarted = () => {
    alert('Redirecting to consultation form...');
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+911234567890';
  };

  return (
    <section className="relative w-full overflow-hidden bg-gray-50">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgimage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 opacity-10"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-3xl">
          
          {/* Main Heading */}
          <div className="space-y-4 mb-8 lg:mb-10">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
              Medical Treatment With Unmatched Personal Care
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-700 font-medium">
              World's Most Trusted Medical Travel Assistance Platform
            </p>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl">
              We help patients find the best hospitals and doctors worldwide, providing complete support for your medical journey.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10 lg:mb-12">
            <button
              onClick={handleGetStarted}
              className="group flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold px-8 py-4 rounded-lg text-base lg:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Get FREE Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={handleCallNow}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-bold px-8 py-4 rounded-lg text-base lg:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl border-2 border-gray-200"
            >
              <Phone className="w-5 h-5" />
              Call Now
            </button>
          </div>

          {/* Services Cards */}
          <div className="grid sm:grid-cols-3 gap-4 lg:gap-5 mb-8 lg:mb-10">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white/95 backdrop-blur-sm rounded-xl p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.color} flex items-center justify-center mb-3 shadow-md`}>
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Patient Avatars */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border-2 border-white bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg"
                  >
                    <Users className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                ))}
              </div>
              <div>
                <p className="text-gray-900 font-bold text-sm lg:text-base">
                  1,00,000+ Patients
                </p>
                <p className="text-gray-600 text-xs lg:text-sm">
                  Assisted Since 2016
                </p>
              </div>
            </div>

            {/* Google Rating */}
            <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-100">
              <div className="w-10 h-10 lg:w-11 lg:h-11 bg-white rounded-full flex items-center justify-center shadow-md ring-2 ring-gray-100">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">G</span>
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <span className="text-xl lg:text-2xl font-bold text-gray-900">4.7</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-gray-600 font-medium">Google Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;