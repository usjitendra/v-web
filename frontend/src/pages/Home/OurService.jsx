import React from 'react';
import { FileText, MessageCircle, CreditCard, DollarSign, Users, Building, Clipboard, UserCheck, Truck } from 'lucide-react';

const ServiceCard = ({ icon: Icon, title, description, bgColor }) => (
  <div className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-start gap-4">
      <div className={`${bgColor} p-3 rounded-full flex-shrink-0`}>
        <Icon className="w-6 h-6 text-black" />
      </div>
      <div className="flex-1">
        <h3 className="text-gray-800 font-semibold text-base md:text-lg mb-2">
          {title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const ServicesSection = () => {
  const services = [
    {
      icon: FileText,
      title: "Medical Opinion and Cost Estimations",
      description: "Expert opinions and cost estimates.",
      bgColor: "bg-green-300"
    },
    {
      icon: MessageCircle,
      title: "Pre-Travel Consultations",
      description: "Understand your procedure before traveling.",
      bgColor: "bg-green-300"
    },
    {
      icon: CreditCard,
      title: "Visa Assistance",
      description: "Complete medical visa assistance.",
      bgColor: "bg-green-300"
    },
    {
      icon: DollarSign,
      title: "Money Exchange",
      description: "Convenient currency exchange services in your city.",
      bgColor: "bg-green-300"
    },
    {
      icon: Users,
      title: "Interpreters and Translators",
      description: "Fluent professionals to break language barriers at every step.",
      bgColor: "bg-green-300"
    },
    {
      icon: Truck,
      title: "Transportation Assistance",
      description: "Complimentary airport transfers.",
      bgColor: "bg-green-300"
    },
    {
      icon: Building,
      title: "Accommodation Options",
      description: "Near the hospital and matching your budget and needs.",
      bgColor: "bg-green-300"
    },
    {
      icon: Clipboard,
      title: "Admission, Appointment, Pharma Care",
      description: "Full coordination of medical logistics.",
      bgColor: "bg-green-300"
    },
    {
      icon: UserCheck,
      title: "Private Duty Nursing",
      description: "Arrangements of private nursing care as needed.",
      bgColor: "bg-green-300"
    }
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-main mb-4">
            Our Services Cover Every Need
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-3xl mx-auto px-4">
            You will be assisted by a dedicated case manager from our team. List of services you can expect from us, for FREE!
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              bgColor={service.bgColor}
            />
          ))}
        </div>

        {/* Chat Button */}
        <div className="flex justify-center mb-6">
          <button className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300 flex items-center gap-2 shadow-md">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat
          </button>
        </div>

        {/* Footer Text */}
        <div className="text-center">
          <p className="text-gray-700 text-sm sm:text-base">
            Our services are <span className="font-bold text-gray-900">FREE</span> and by using our services your hospital bill does not increase!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServicesSection;