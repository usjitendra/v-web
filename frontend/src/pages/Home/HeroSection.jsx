import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  Users,
  ArrowRight,
  Phone,
  Hospital,
  Stethoscope,
  Heart,
  Shield,
  Award,
  Globe,
  CheckCircle,
  Sparkles,
  Zap,
  Clock,
  UserCheck
} from 'lucide-react';

const HeroSection = () => {
  const handleGetStarted = () => {
    // Navigate to contact form or open modal
    window.location.href = '/contact';
  };

  const handleCallNow = () => {
    window.location.href = 'tel:+919354799090';
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-lightSky via-white to-main/5 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-main/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-main/20 rounded-lg rotate-45 animate-bounce"></div>
        <div className="absolute bottom-32 left-20 w-12 h-12 bg-main/15 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 right-32 w-8 h-8 bg-main/25 rounded-lg rotate-12 animate-pulse"></div>

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(14, 133, 127, 0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-main/20 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-main" />
              <span className="text-sm font-medium text-darktext">Trusted by 100,000+ Patients Worldwide</span>
            </div>

            {/* Main Headline */}
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-darktext leading-tight">
                Your Health Journey
                <span className="block text-main">Starts Here</span>
              </h1>

              <p className="text-xl lg:text-2xl text-lighttext leading-relaxed max-w-2xl">
                Experience world-class medical care with our expert guidance.
                Connect with top hospitals and specialists worldwide for your treatment needs.
              </p>
            </div>

            {/* Key Benefits */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-darktext">
                <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                <span className="font-medium">Free Consultation</span>
              </div>
              <div className="flex items-center gap-2 text-darktext">
                <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-darktext">
                <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                <span className="font-medium">Global Network</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/contact"
                className="group bg-main hover:bg-main/90 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-3"
              >
                <Zap className="w-6 h-6" />
                Get Free Consultation
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={handleCallNow}
                className="bg-white hover:bg-gray-50 text-darktext px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl border-2 border-main/20 flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6 text-main" />
                Call Now: +91 93547 99090
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-main mb-1">1000+</div>
                <div className="text-sm text-lighttext font-medium">Expert Doctors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-main mb-1">150+</div>
                <div className="text-sm text-lighttext font-medium">Partner Hospitals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-main mb-1">25+</div>
                <div className="text-sm text-lighttext font-medium">Countries</div>
              </div>
            </div>
          </div>

          {/* Right Content - Interactive CTA Card */}
          <div className="relative">
            {/* Floating badges */}
            <div className="absolute -top-4 -left-4 bg-white rounded-full shadow-lg px-4 py-2 z-10 animate-bounce">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-main" />
                <span className="text-sm font-medium text-darktext">JCI Accredited</span>
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 bg-main text-white rounded-full shadow-lg px-4 py-2 z-10 animate-pulse">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">100% Safe</span>
              </div>
            </div>

            {/* Main CTA Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 border border-main/10 transform hover:scale-105 transition-all duration-500">
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-main to-main/80 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <Heart className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-darktext rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    ✓
                  </div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-darktext mb-3">
                    Start Your Healing Journey Today
                  </h3>
                  <p className="text-lighttext text-lg leading-relaxed">
                    Get personalized medical assistance from our expert team.
                    Your health and comfort are our top priorities.
                  </p>
                </div>

                {/* Benefits List */}
                <div className="space-y-3 text-left bg-lightSky rounded-2xl p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-darktext font-medium">Free initial consultation</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-darktext font-medium">Treatment cost estimates</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-darktext font-medium">Travel & accommodation support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-darktext font-medium">Post-treatment follow-up</span>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3 text-red-800">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <div className="font-semibold">Emergency Support</div>
                      <div className="text-sm">Available 24/7 for urgent medical needs</div>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-darktext">4.9/5 Rating</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-main" />
                    <span className="text-sm font-medium text-darktext">Verified Experts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-main" />
                    <span className="text-sm font-medium text-darktext">Global Reach</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full h-auto">
          <path
            fill="#0E857F"
            fillOpacity="0.05"
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;