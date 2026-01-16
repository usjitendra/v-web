import React from "react";
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export default function Contact() {
  return (
    <div className="min-h-screen bg-lightSky">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-main/5 to-main/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-darktext mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-lighttext max-w-2xl mx-auto">
            Have questions about our services? Need help finding the right healthcare provider?
            We're here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-darktext mb-6">Contact Information</h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-main" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-darktext mb-1">Phone</h3>
                      <p className="text-lighttext">+91 123 456 7890</p>
                      <p className="text-lighttext">+91 987 654 3210</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-main" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-darktext mb-1">Email</h3>
                      <p className="text-lighttext">info@medtravel.com</p>
                      <p className="text-lighttext">support@medtravel.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-main" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-darktext mb-1">Address</h3>
                      <p className="text-lighttext">123 Medical Plaza</p>
                      <p className="text-lighttext">New Delhi, India 110001</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-main/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-main" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-darktext mb-1">Business Hours</h3>
                      <p className="text-lighttext">Mon - Fri: 9:00 AM - 6:00 PM</p>
                      <p className="text-lighttext">Sat: 9:00 AM - 2:00 PM</p>
                      <p className="text-lighttext">Sun: Emergency Only</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-darktext mb-4">Why Choose Us?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-sm text-lighttext">24/7 Customer Support</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-sm text-lighttext">Verified Healthcare Providers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-sm text-lighttext">Transparent Pricing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-main flex-shrink-0" />
                    <span className="text-sm text-lighttext">End-to-End Assistance</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
